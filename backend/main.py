from fastapi import FastAPI
from pydantic import BaseModel

from agent import run_agent

app = FastAPI()


class ChatMessage(BaseModel):
    role: str
    content: str | list[dict]


class ChatRequest(BaseModel):
    messages: list[ChatMessage]


class ChatResponse(BaseModel):
    reply: str
    tools_used: list[str]
    messages: list[ChatMessage]


@app.post("/api/chat")
def chat(request: ChatRequest) -> ChatResponse:
    messages = [{"role": m.role, "content": m.content} for m in request.messages]
    reply, tools_used = run_agent(messages)
    return ChatResponse(reply=reply, tools_used=tools_used, messages=messages)
