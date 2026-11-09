from fastapi import FastAPI
from pydantic import BaseModel

from agent import run_agent

app = FastAPI()


# The shape of the data the browser sends us...
class ChatMessage(BaseModel):
    role: str                  # "user" or "assistant"
    content: str | list[dict]  # plain text, or blocks like tool calls and results


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


# ...and the shape of what we send back
class ChatResponse(BaseModel):
    reply: str
    tools_used: list[str]
    messages: list[ChatMessage]  # the full history, so Claude remembers its tool calls


@app.post("/api/chat")
def chat(request: ChatRequest) -> ChatResponse:
    # Convert to plain dictionaries, the format run_agent / Claude expect
    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    reply, tools_used = run_agent(messages)
    return ChatResponse(reply=reply, tools_used=tools_used, messages=messages)
