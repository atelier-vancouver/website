import OpenAI from "openai";

interface Env {
  OPENAI_API_KEY: string;
}

const questionBank = [
  "What does it take to make a community feel like home?",
  "What's something you're terrible at, but wish you could do well?",
  "What tends to get you into a flow state?",
  "In another life, who would you have been and what would you have been doing?",
  "What is a random ordinary-seeming thing that you find fascinating?",
  "What's 1 person who inspires you and why?",
  "What's something that took you a long time to learn?",
  "What fuels your creativity?",
  "What’s something that took you way too long to learn?",
  "What would you ask your future self 5 years from now?",
  "What activity do you think is cool but don’t do yourself?",
  "What’s something that feels nostalgic to you?",
  "What would your ideal workspace look like?",
  "What’s something you taught yourself?",
  "What would you like to see more of in 2024?",
  "What was your favourite thing about the place you grew up?",
  "What’s a topic you’re curious to explore but haven’t gotten around to yet?",
  "If your younger self were given $50, what would they spend it on?",
  "If you could explore any city in the world for a day, which one would it be?",
  "What cool advice have you recently received?",
  "What’s something making you happy right now?",
  "What’s your favourite song right now?",
  "What’s on your bucket list?",
  "Who was the best teacher you’ve ever had, and why?",
  "What is your favourite part of spring?",
  "What is your most treasured memory?",
  "What activity makes you lose track of time?",
  "What’s a unique item you carry in your backpack?",
  "What’s something new you’ve tried recently?",
  "What would you title your memoir?",
  "What is one thing you do to practice self-care?",
  "What is a question you get excited to answer?",
  "What question do you like being asked?",
  "What's the best gift you've ever received?",
  "What’s a nice gift you’ve received?",
  "Who have you complimented recently, and what was it for?",
  "What’s one thing you like about yourself?",
  "What do you enjoy about creating?",
  "When do you feel like your best self?",
  "What is something more difficult than you thought it would be?",
  "What is a recent time you felt at play?",
  "What's a nugget of wisdom that's stuck with you?",
  "What is something that's made you laugh recently?",
  "What is your favourite sense and why?",
  "If you could be any animal, what animal would you be?",
  "If you were a cyborg, what augmentation would you have?",
  "What superpower would you have?",
  "What is something that was hard to earn (a skill, title, opportunity, trait)?",
  "What's your favourite thing about yourself today?",
  "What job would you have if it was paid well?",
  "What's an organizational system you use?",
  "What's your favourite book?",
  "What's a habit you'd like to pick up?",
  "What's your favourite game (analog, video, etc.)?",
  "What makes you shine?",
  "What's something you've overcome this year?",
  "If you could travel anywhere, what would it be?",
  "What's something you could write an essay about?",
  "What's a hobby that you're bad at, but still enjoy anyway?",
  "How would you describe your hero's journey in a sentence?",
  "If you were a character in a story, what would the author do next plot-wise?",
  "What kinds of environments make you happiest?",
];

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const searchParams = new URL(context.request.url).searchParams;
  const userLocation = searchParams.get("location");
  const currentDate = searchParams.get("date");
  if (!userLocation || !currentDate) {
    return new Response("Missing location or date", { status: 400 });
  }

  const openai = new OpenAI({
    apiKey: context.env.OPENAI_API_KEY,
  });

  // Shuffle the question bank to ensure variety
  shuffleArray(questionBank);

  const response = await openai.responses.create({
    model: "gpt-4o",
    input: [
      {
        role: "system",
        content: [
          {
            type: "input_text",
            text: `Make 10 ice-breaker question like these:\n${questionBank.join("\n")}\n The first 5 questions should be similar or taken from the examples. The last 5 questions should be related to the user's location and the current date.`,
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

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
