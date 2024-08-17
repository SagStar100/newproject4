import { NextResponse } from "next/server";
import OpenAI from "openai";

// Define the system prompt used for generating flashcards
const systemPrompt = `
You are a flashcard creator. Your task is to generate concise and effective flashcards based on the given topic or content. Follow these guidelines:

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of the flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to make the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparisons, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers.
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. Only generate 10 flashcards.

Remember, the goal is to facilitate effective learning and retention of information through these flashcards.

Return in the following JSON format
{
  "flashcards": [
    {
      "front": str,
      "back": str
    }
  ]
}
`;

export async function POST(req) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  try {
    // Parse the request body as text
    const data = await req.text();
    console.log("Received request data:", data); // Debug logging

    // Create a completion using OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: data }
      ],
      model: 'gpt-4',
    });

    console.log("Completion result:", completion); // Debug logging

    // Extract and parse the flashcards from the response
    const messageContent = completion.choices[0].message.content;
    console.log("Message content:", messageContent);

    // Ensure the response is in the expected JSON format
    const flashcards = JSON.parse(messageContent);

    if (!Array.isArray(flashcards.flashcards)) {
      throw new Error("Invalid flashcard format.");
    }

    console.log("Parsed flashcards:", flashcards); // Debugging log

    // Return the flashcards in JSON format
    return NextResponse.json(flashcards);
  } catch (error) {
    console.error("Error generating flashcards:", error); // Debug logging
    // Return a JSON response with an error message
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
