import { data, User } from "@/db";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<User[]>
) {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return res.status(200).json(await data.getUsers());
}
