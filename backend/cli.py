from agent import run_agent

print("Chat with your agent! Type 'quit' to exit.\n")

messages = []  # the conversation history; it grows as you chat

while True:
    user_input = input("You: ").strip()
    if user_input.lower() in ("quit", "exit"):
        break
    if not user_input:
        continue

    messages.append({"role": "user", "content": user_input})
    reply, tools_used = run_agent(messages)
    print(f"Agent: {reply}\n")
