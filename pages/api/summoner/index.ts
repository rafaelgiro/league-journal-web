import type { NextApiRequest, NextApiResponse } from "next";
import { getAccountData } from "../../../utils/getAccountData";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Account | string>
) {
  const { query } = req;

  if (!query.summonerName || !query.region)
    res.status(400).send("Missing query");

  const account = await getAccountData(
    query.summonerName as string,
    query.region as Region
  );

  if (account.status?.status_code === 404)
    res.status(404).send("Summoner not found");

  res.status(200).json(account);
}
