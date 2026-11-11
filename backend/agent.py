from dotenv import load_dotenv
import anthropic

from tools import TOOLS, execute_tool

load_dotenv()
client = anthropic.Anthropic()

MODEL = "claude-opus-5-5"
MAX_STEPS = 10

SYSTEM_PROMPT = (
    "You are a friendly, helpful assistant. "
    "Use the calculator tool for any math and the get_current_time tool "
    "for anything about the current date or time. "
    "Use roll_dice for dice, magic_8_ball for 8 ball questions, pick_random "
    "for random choices, and get_weather for the weather. Never make up "
    "the results of these tools. Keep answers short."
)


def run_agent(messages: list) -> tuple[str, list[str]]:
    tools_used = []

    for step in range(MAX_STEPS):
        response = client.messages.create(
            model=MODEL,
            max_tokens=16000,
            system=SYSTEM_PROMPT,
            tools=TOOLS,
            messages=messages,
        )

        messages.append({
            "role": "assistant",
            "content": [block.model_dump(mode="json", exclude_none=True) for block in response.content],
        })

        if response.stop_reason != "tool_use":
            break

        tool_results = []
        for block in response.content:
            if block.type == "tool_use":
                print(f"   🔧 {block.name}({block.input})")
                result = execute_tool(block.name, block.input)
                tools_used.append(block.name)
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": block.id,
                    "content": result,
                })

        messages.append({"role": "user", "content": tool_results})
    else:
        reply = "Sorry, I hit my step limit before finishing."
        messages.append({"role": "assistant", "content": reply})
        return reply, tools_used

    # Handle the less common ways a reply can end. These replies can be empty or
    # half-finished, which Claude can't accept back, so history keeps plain text instead.
    if response.stop_reason == "refusal":
        reply = "Sorry, I can't help with that request."
        messages[-1] = {"role": "assistant", "content": reply}
        return reply, tools_used
    if response.stop_reason == "max_tokens":
        reply = "(My answer was cut off because it got too long.)"
        messages[-1] = {"role": "assistant", "content": reply}
        return reply, tools_used

    text = "".join(block.text for block in response.content if block.type == "text")
    return text, tools_used
