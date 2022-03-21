import type { NextApiRequest, NextApiResponse } from "next";
import { getAccountData } from "../../../utils/getAccountData";
import { getLiveMatch } from "../../../utils/getLiveMatch";
import { mapChampions } from "../../../utils/mapChampions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<
    | {
        account: Account;
        match: LiveMatch;
        champions: Champion[];
      }
    | string
  >
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

  const match = await getLiveMatch(account.id, query.region as Region);

  if (match.status?.status_code === 404)
    res.status(404).send("Match not found");

  const champions = await mapChampions(match.participants);

  res.status(200).json({ account, match, champions });
}
