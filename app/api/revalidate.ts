// pages/api/revalidate.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { secret } = req.query;

  if (secret !== process.env.NEXT_PRIVATE_REVALIDATE_SECRET) {
    return res.status(401).json({ message: "Nieprawidłowy sekret" });
  }

  try {
    await res.revalidate("/browse");
    return res.json({ revalidated: true });
  } catch (error) {
    return res.status(500).json({ message: "Błąd rewalidacji" });
  }
}
