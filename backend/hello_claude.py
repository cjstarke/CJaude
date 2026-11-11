from dotenv import load_dotenv
import anthropic

load_dotenv()

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=1000,
    messages=[{"role": "user", "content": "Say hello in one short sentence."}],
)

print(response.content[0].text)
