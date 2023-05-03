import type { NextApiRequest, NextApiResponse } from "next";
import Cors from "cors";
import { Configuration, OpenAIApi } from "openai";

// Initializing the cors middleware
const cors = Cors({
  methods: ["POST"],
  origin: "*",
});

function runMiddleware(req: NextApiRequest, res: NextApiResponse, fn: any) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

// OpenAI initialization
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type Data = {
  message: string;
};

type Connection = {
  name: string;
  info: string;
};

type User = {
  id: string;
  name: string;
  bio: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Run the middleware
  await runMiddleware(req, res, cors);

  // only use POST method
  if (req.method === "POST") {
    const { user, conn }: { user: User; conn: Connection } = req.body;
    if (user.id.length > 0 && user.name.length > 0 && user.bio.length > 0) {
      console.log(
        `${user.id}: ${user.name} requested a connection message for ${conn.name} - ${conn.info}`
      );
      const prompt = `Write a LinkedIn connection request message according to the following requirements. Personalize it based on the sender and recipient info. Keep it short, concise and in plain English. Focus on the recipient's primary need of connecting with someone they want to learn more about in terms of a role and/or a specific company and include a clear call to action in a short phone/online call AKA a coffee chat or information interview.\nSender info: name, ${user.name}; experience, ${user.bio}\nRecipient info: name, ${conn.name}; profile information, ${conn.info}`;
      const genRes = await openai.createCompletion({
        model: "text-davinci-003",
        prompt,
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const message = genRes.data.choices[0].text?.trim() || "";
      // const message = `Hi ${conn.name},\n\n${user.name} has requested to connect with you. They like this experience you have: ${conn.info}`;
      res.status(200).json({ message });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
