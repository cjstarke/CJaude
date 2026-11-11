import ast
import json
import operator
import random
import urllib.parse
import urllib.request
from datetime import datetime

TOOLS = [
    {
        "name": "get_current_time",
        "description": "Get the current local date and time. Use this whenever the user asks about the time, date, or day of the week.",
        "input_schema": {"type": "object", "properties": {}},
    },
    {
        "name": "calculator",
        "description": "Evaluate a basic arithmetic expression. Supports + - * / // % ** and parentheses. Use this for any math instead of calculating in your head.",
        "input_schema": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "The math expression, e.g. '17 * 23 + 4'",
                }
            },
            "required": ["expression"],
        },
    },
    {
        "name": "roll_dice",
        "description": "Roll one or more dice and get each roll plus the total. Use this whenever the user wants to roll dice, e.g. '3d6' means count=3 and sides=6.",
        "input_schema": {
            "type": "object",
            "properties": {
                "sides": {
                    "type": "integer",
                    "description": "Sides on each die, from 2 to 1000. Defaults to 6.",
                },
                "count": {
                    "type": "integer",
                    "description": "How many dice to roll, from 1 to 100. Defaults to 1.",
                },
            },
        },
    },
    {
        "name": "magic_8_ball",
        "description": "Shake a Magic 8 Ball and get its answer to a yes/no question. Use this whenever the user asks the 8 ball something.",
        "input_schema": {
            "type": "object",
            "properties": {
                "question": {
                    "type": "string",
                    "description": "The yes/no question to ask",
                }
            },
            "required": ["question"],
        },
    },
    {
        "name": "pick_random",
        "description": "Pick one option at random from a list. Use this whenever the user wants a random choice or asks you to decide between things.",
        "input_schema": {
            "type": "object",
            "properties": {
                "options": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "The options to choose from, e.g. ['pizza', 'tacos']",
                }
            },
            "required": ["options"],
        },
    },
    {
        "name": "get_weather",
        "description": "Get the current temperature, conditions, and wind for a city. Use this whenever the user asks about the weather.",
        "input_schema": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "The city name, e.g. 'Tokyo'",
                }
            },
            "required": ["city"],
        },
    },
]


def get_current_time() -> str:
    return datetime.now().strftime("%A, %B %d, %Y %I:%M %p")


MAX_POWER_BITS = 10_000


def _safe_pow(base, exponent):
    # Check the size BEFORE computing, so 9**9**9 can't freeze the server
    if isinstance(base, int) and isinstance(exponent, int) and abs(base) > 1:
        if base.bit_length() * exponent > MAX_POWER_BITS:
            raise ValueError("That power is too large to calculate")
    return operator.pow(base, exponent)


# Only these operations are allowed, so it can't run arbitrary code
_OPERATORS = {
    ast.Add: operator.add,
    ast.Sub: operator.sub,
    ast.Mult: operator.mul,
    ast.Div: operator.truediv,
    ast.FloorDiv: operator.floordiv,
    ast.Mod: operator.mod,
    ast.Pow: _safe_pow,
    ast.USub: operator.neg,
    ast.UAdd: operator.pos,
}


def _evaluate(node):
    if isinstance(node, ast.Constant) and isinstance(node.value, (int, float)):
        return node.value
    if isinstance(node, ast.BinOp) and type(node.op) in _OPERATORS:
        return _OPERATORS[type(node.op)](_evaluate(node.left), _evaluate(node.right))
    if isinstance(node, ast.UnaryOp) and type(node.op) in _OPERATORS:
        return _OPERATORS[type(node.op)](_evaluate(node.operand))
    raise ValueError("Only numbers and + - * / // % ** are allowed")


def calculator(expression: str) -> str:
    tree = ast.parse(expression, mode="eval")
    return str(_evaluate(tree.body))


def roll_dice(sides: int = 6, count: int = 1) -> str:
    if not 2 <= sides <= 1000:
        raise ValueError("sides must be between 2 and 1000")
    if not 1 <= count <= 100:
        raise ValueError("count must be between 1 and 100")
    rolls = [random.randint(1, sides) for _ in range(count)]
    return f"Rolls: {rolls}, total: {sum(rolls)}"


_8_BALL_ANSWERS = [
    "It is certain.",
    "It is decidedly so.",
    "Without a doubt.",
    "Yes definitely.",
    "You may rely on it.",
    "As I see it, yes.",
    "Most likely.",
    "Outlook good.",
    "Yes.",
    "Signs point to yes.",
    "Reply hazy, try again.",
    "Ask again later.",
    "Better not tell you now.",
    "Cannot predict now.",
    "Concentrate and ask again.",
    "Don't count on it.",
    "My reply is no.",
    "My sources say no.",
    "Outlook not so good.",
    "Very doubtful.",
]


def magic_8_ball(question: str) -> str:
    return f"Question: {question}\nThe 8 ball says: {random.choice(_8_BALL_ANSWERS)}"


def pick_random(options: list[str]) -> str:
    if not options:
        raise ValueError("options must not be empty")
    return random.choice(options)


_WEATHER_CODES = {
    0: "clear sky",
    1: "mainly clear",
    2: "partly cloudy",
    3: "overcast",
    45: "fog",
    48: "freezing fog",
    51: "light drizzle",
    53: "drizzle",
    55: "heavy drizzle",
    56: "light freezing drizzle",
    57: "freezing drizzle",
    61: "light rain",
    63: "rain",
    65: "heavy rain",
    66: "light freezing rain",
    67: "freezing rain",
    71: "light snow",
    73: "snow",
    75: "heavy snow",
    77: "snow grains",
    80: "light rain showers",
    81: "rain showers",
    82: "violent rain showers",
    85: "light snow showers",
    86: "heavy snow showers",
    95: "thunderstorm",
    96: "thunderstorm with hail",
    99: "thunderstorm with heavy hail",
}


def _fetch_json(url: str, params: dict) -> dict:
    full_url = f"{url}?{urllib.parse.urlencode(params)}"
    with urllib.request.urlopen(full_url, timeout=10) as response:
        return json.load(response)


def get_weather(city: str) -> str:
    geocoded = _fetch_json(
        "https://geocoding-api.open-meteo.com/v1/search",
        {"name": city, "count": 1},
    )
    if not geocoded.get("results"):
        raise ValueError(f"I couldn't find a city called '{city}'")
    place = geocoded["results"][0]

    forecast = _fetch_json(
        "https://api.open-meteo.com/v1/forecast",
        {
            "latitude": place["latitude"],
            "longitude": place["longitude"],
            "current": "temperature_2m,weather_code,wind_speed_10m",
        },
    )
    current = forecast["current"]
    celsius = current["temperature_2m"]
    fahrenheit = celsius * 9 / 5 + 32
    conditions = _WEATHER_CODES.get(current["weather_code"], "unknown conditions")
    location = ", ".join(filter(None, [place["name"], place.get("country")]))
    return (
        f"{location}: {celsius:.0f}°C ({fahrenheit:.0f}°F), {conditions}, "
        f"wind {current['wind_speed_10m']:.0f} km/h"
    )


def execute_tool(name: str, tool_input: dict) -> str:
    try:
        if name == "get_current_time":
            return get_current_time()
        if name == "calculator":
            return calculator(tool_input["expression"])
        if name == "roll_dice":
            return roll_dice(tool_input.get("sides", 6), tool_input.get("count", 1))
        if name == "magic_8_ball":
            return magic_8_ball(tool_input["question"])
        if name == "pick_random":
            return pick_random(tool_input["options"])
        if name == "get_weather":
            return get_weather(tool_input["city"])
        return f"Error: unknown tool '{name}'"
    except Exception as e:
        return f"Error: {e}"


if __name__ == "__main__":
    print(execute_tool("get_current_time", {}))
    print(execute_tool("calculator", {"expression": "17 * 23 + 4"}))
    print(execute_tool("calculator", {"expression": "2 ** 10"}))
    print(execute_tool("calculator", {"expression": "__import__('os')"}))
    print(execute_tool("calculator", {"expression": "9 ** 9 ** 9"}))
    print(execute_tool("roll_dice", {}))
    print(execute_tool("roll_dice", {"sides": 20, "count": 3}))
    print(execute_tool("roll_dice", {"sides": 1}))
    print(execute_tool("magic_8_ball", {"question": "Will I learn React?"}))
    print(execute_tool("pick_random", {"options": ["pizza", "tacos"]}))
    print(execute_tool("pick_random", {"options": []}))
    print(execute_tool("get_weather", {"city": "Tokyo"}))
    print(execute_tool("get_weather", {"city": "Zzxqvplorb"}))
