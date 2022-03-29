function getTeamChampions(
  team: LiveMatch["participants"],
  champions: Champion[]
) {
  const players = team.map((part) => part.championId);
  return champions
    .filter((champ) => players.includes(Number(champ.key)))
    .map((champ) => ({ id: champ.id, key: champ.key, name: champ.name }));
}

/**
 * find champion data based on champions currently on the game
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

  const blueChampions = getTeamChampions(blueTeam, champions);
  const redChampions = getTeamChampions(redTeam, champions);

  return {
    allyChampions: summonerOnBlueTeam ? blueChampions : redChampions,
    enemyChampions: summonerOnBlueTeam ? redChampions : blueChampions,
  };
}
