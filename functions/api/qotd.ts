import OpenAI from "openai";

interface Env {
  OPENAI_API_KEY: string;
}

const questionBank = [
  // from Chloe Yip
  "What is the most embarrassing thing you've done recently?",

  // from Jaryd Diamond
  "If you could have an unlimited amount of anything, what would it be?",
  "What is the largest animal you could take in hand-to-hand combat?",
  "What is your favourite dinosaur?",
  "What is the weirdest/most unique item you carry in your backpack at any given time?",
  "What talent do you have that you're not currently using?",
  "What is the strangest thing you are really good at?",
  "If you had to listen to one musician for the rest of your life, who would it be?",
  "Would you rather: only listen to music you've already heard (from this point onwards) or listen to music you've never heard before?",
  "If you could live anywhere for 24 hours, where would it be?",
  "If you could be the main character in any movie, who would you be?",
  "What is your go-to karaoke song?",
  "If you could magically be an expert at any instrument, which would it be?",
  "You've been transported to the middle ages. What would your job be?",
  "What was the last thing you did for the first time?",
  "What is your guilty pleasure food?",
  "What is an obscure movie or show people should know about?",
  "If you were going to Antarctica and could only bring 3 items, what would they be?",
  "If you had unlimited money for a year, what would you do with it?",
  "What is your favourite smell and why?",
  "What is a sauce you couldn't live without?",
  "If you had a time machine, would you go backwards or forward in time?",
  "What is your favourite concert you've been to, or, which concert do you want to go to?",
  "If you were an inanimate object, what would you be and why?",
  "If you could be a mythical creature, what would you be?",
  "What would you title your biography?",
  "If seasons never changed, which one would you like to live in eternally?",
  "What do you know isn't real, but want it to exist?",
  "You are trapped in a cage with a lion and can turn into any animal. What would you become?",
  "What is something that's difficult for you but easy for most other people?",
  "You encounter an ancient deity who has been alive since the beginning of time itself. You may ask her one question - what is it?",
  "If you were a superhero, what would your costume be?",
  "What is the dumbest purchase you've ever made?",
  "How long do you think you could survive in a forest with no tools?",
  "A stranger is inhabiting your body for a day. What are some tips you'd give them?",
  "If you were a ghost, what location would you haunt?",
  "What is a product you wish you could buy but can't anymore, and why?",
  "If you had to invent a brand-new holiday based on something you love, what would it be?",
  "You get an unlimited budget to add one absurd feature to your house, what is it?",
  "If you could be any age for a week, what age would you be?",
  "Given the choice of anyone in the world, whom would you want as a dinner guest?",
  "Would you like to be famous? In what way?",
  'What would constitute a "perfect" day for you?',
  "For what in your life do you feel most grateful?",
  "If you could wake up tomorrow having gained any one quality or ability, what would it be?",
  "If a crystal ball could tell you the truth about yourself, your life, the future or anything else, what would you want to know?",
  "Is there something that you've dreamed of doing for a long time? Why haven't you done it?",
  "What is the greatest accomplishment of your life?",

  // from the original notion question bank (mostly from Rae)
  "What is something you're terrible at, but wish you could do well?",
  "In another life, who would you have been and what would you have been doing?",
  "What is a random ordinary-seeming thing that you find fascinating?",
  "What is something that took you way too long to learn?",
  "What would you ask your future self 5 years from now?",
  "What activity do you think is cool but don't do yourself?",
  "What is something you taught yourself?",
  "What was your favourite thing about the place you grew up?",
  "What is a topic you're curious to explore but haven't gotten around to yet?",
  "If your younger self were given $50, what would they spend it on?",
  "If you could explore any city in the world for a day, which one would it be?",
  "What is a unique item you carry in your backpack?",
  "What is something new you've tried recently?",
  "What is the best gift you've ever received?",
  "What is something more difficult than you thought it would be?",
  "What is something that's made you laugh recently?",
  "If you were a cyborg, what augmentation would you have?",
  "What job would you have if it was paid well?",
  "What is something you could write an essay about?",
  "What is a hobby that you're bad at, but still enjoy anyway?",

  // from Claude
  "If you had to teach a class on something, what would it be?",
  "What's the most you've ever committed to a bit?",
  "What's the worst advice you've ever followed?",
  "What did you want to be when you grew up, and how far did you get?",
  "If you could permanently delete one social norm, what would it be?",
  "What's a completely useless fact you know and love anyway?",
  "What's something about modern life you think future generations will find bizarre?",

  // from ChatGPT
  "If you could invent a new flavor of ice cream, what would it be?",
  "What's the most spontaneous thing you've ever done?",
  "If you could teleport to any event in history, which one would it be?",
  "What's a quirky talent you wish you had?",
  "If you could turn any activity into an Olympic sport, what would you have a chance at winning a medal in?",
  "If you could bring back any fashion trend, which one would you choose?",
  "What’s your go-to comfort movie or TV show that never fails to make you smile?",
  "If you could relive one day of your life, which would it be and why?",
  "What's the most interesting conversation you've overheard?",
];

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const searchParams = new URL(context.request.url).searchParams;
  const currentDate = searchParams.get("date");
  if (!currentDate) {
    return new Response("Missing date", { status: 400 });
  }

  // Pick 10 random questions from the bank
  shuffleArray(questionBank);
  const pickedFromBank = questionBank.slice(0, 10);

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
            text: `Generate 10 ice-breaker questions similar in style to the examples below but not taken from them. Today's date is ${currentDate}.\n\nExamples:\n${questionBank.join("\n")}`,
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
          required: ["similar"],
          properties: {
            similar: {
              type: "array",
              items: {
                type: "string",
                description:
                  "A question similar in style to the examples but not taken from them.",
              },
              description: "10 questions similar to but not from the examples.",
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

  const aiQuestions = JSON.parse(response.output_text);

  return new Response(
    JSON.stringify({
      questionBank: pickedFromBank,
      similar: aiQuestions.similar,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
