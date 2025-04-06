import OpenAI from "openai";

interface Env {
  OPENAI_API_KEY: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const body = (await context.request.json()) as {
    location?: string;
    date?: string;
  };
  const userLocation = body.location;
  const currentDate = body.date;
  if (!userLocation || !currentDate) {
    return new Response("Missing location or date", { status: 400 });
  }

  const openai = new OpenAI({
    apiKey: context.env.OPENAI_API_KEY,
  });

  const response = await openai.responses.create({
    model: "gpt-4o",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: "Create topical and time-relevant ice-breaker questions based on the current date.\n\nYou will be given the user's location and the current date. Your task is to find recent holidays/events and generate several related ice-breaker questions. The questions should be designed to provoke thoughtful and revealing answers, suitable for a large group setting.\n\n# Output Format\n\n- Provide a list of 10 ice-breaker questions.\n- Include some questions not related to any holiday or events, generic ice-breaker questions.\n- Include some questions related to a holiday in the past or upcoming week not specific to the user's location.\n- Include some questions related to a holiday in the past or upcoming week at the user's location.\n- Ensure questions encourage short, concise, yet informative answers.\n- Select questions that are engaging and encourage personal, but concise responses.\n- Avoid questions likely to prompt political answers.\n- Avoid events specific to a location other than the user's location.\n- NEVER EVER mention overly niche or one-time events that may be unknown to the general public.",
          },
        ],
      },
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Location: ${userLocation}}\nDate: ${currentDate}`,
          },
        ],
      },
    ],
    text: {
      format: {
        type: "json_schema",
        name: "ice_breaker_questions",
        strict: true,
        schema: {
          type: "object",
          required: ["questions"],
          properties: {
            questions: {
              type: "array",
              items: {
                type: "string",
                description: "The ice-breaker question text.",
              },
              description: "A list of ice-breaker questions.",
            },
          },
          additionalProperties: false,
        },
      },
    },
    reasoning: {},
    tools: [],
    temperature: 1,
    max_output_tokens: 2048,
    top_p: 1,
  });

  return new Response(response.output_text, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
