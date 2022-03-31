function getTeamChampions(
  team: LiveMatch["participants"],
  champions: Champion[],
  summonerName: string
) {
  const players = team.map((part) => part.championId);
  const summonerChampion = team.find(
    (part) => part.summonerName === summonerName
  )?.championId;
  return champions
    .filter((champ) => players.includes(Number(champ.key)))
    .map((champ) => ({
      id: champ.id,
      key: champ.key,
      name: champ.name,
      isMe: champ.key === String(summonerChampion),
    }));
}

/**
 * find champion data based on champions currently on the game
 * TODO: can be refactored to use less .map() but it's late
 */
export async function mapChampions(
  participants: LiveMatch["participants"],
  summonerName: string
) {
  const patchRes = await fetch(
    "https://ddragon.leagueoflegends.com/api/versions.json"
  );
  const patches = await patchRes.json();

  const championsRes = await fetch(
    `http://ddragon.leagueoflegends.com/cdn/${patches[0]}/data/en_US/champion.json`
  );
  const allChampions = await championsRes.json();
  const champions = Object.values(allChampions.data) as Champion[];

  const summonerOnBlueTeam =
    participants.find((part) => part.summonerName === summonerName)?.teamId ===
    100;

  const blueTeam = participants.filter((part) => part.teamId === 100);
  const redTeam = participants.filter((part) => part.teamId === 200);

  const blueChampions = getTeamChampions(blueTeam, champions, summonerName);
  const redChampions = getTeamChampions(redTeam, champions, summonerName);

  return {
    allyChampions: summonerOnBlueTeam ? blueChampions : redChampions,
    enemyChampions: summonerOnBlueTeam ? redChampions : blueChampions,
  };
}
