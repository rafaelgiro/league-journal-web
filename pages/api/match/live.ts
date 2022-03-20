import type { NextApiRequest, NextApiResponse } from "next";
import { getAccountData } from "../../../utils/getAccountData";
import { getLiveMatch } from "../../../utils/getLiveMatch";
import { mapChampions } from "../../../utils/mapChampions";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    account: Account;
    match: LiveMatch;
    champions: Champion[];
  }>
) {
  const { query } = req;

  const account = await getAccountData(
    query.summonerName as string,
    query.region as Region
  );

  const match = await getLiveMatch(account.id, query.region as Region);

  const champions = await mapChampions(match.participants);

  res.status(200).json({ account, match, champions });
}
