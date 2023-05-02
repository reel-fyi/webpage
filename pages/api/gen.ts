import type { NextApiRequest, NextApiResponse } from "next";
import Cors from 'cors';
import e from "cors";

// Initializing the cors middleware
const cors = Cors({
  methods: ['POST'],
  origin: '*',
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
      const message = `Hi ${conn.name},\n\n${user.name} has requested to connect with you. They like this experience you have: ${conn.info}`;
      res.status(200).json({ message });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
