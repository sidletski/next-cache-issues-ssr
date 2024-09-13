import { data, User } from "@/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User | undefined>
) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  const userId = Number(req.query.id);

  if (req.method === "GET") {
    return res.status(200).json(await data.getUserById(userId));
  }

  if (req.method === "PUT") {
    const { name, email } = req.body;
    return res.status(200).json(
      await data.updateUser(userId, {
        name,
        email,
      })
    );
  }
}
