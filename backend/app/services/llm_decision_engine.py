import json
from groq import Groq
from app.config import settings

client = Groq(
    api_key=settings.groq_api_key
)


def analyze_order(data):

    prompt = f"""
You are an AI Operations Analyst.

Perform Root Cause Analysis.

Data:

{json.dumps(data, indent=2)}

Return ONLY JSON.

{{
    "root_causes":[
        "cause1",
        "cause2"
    ],
    "business_impact":"",
    "recommended_fix":[
        "fix1",
        "fix2"
    ],
    "priority":"LOW|MEDIUM|HIGH"
}}
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0
    )

    return response.choices[0].message.content
def generate_copilot_summary(prompt):

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content