export default defineEventHandler(async (event) => {
  try {
    const apiUrl = "https://fantasy.premierleague.com/api/bootstrap-static/";
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    const teams = data.teams.reduce((acc, team) => {
      acc[team.id] = team.name;
      return acc;
    }, {});

    const getTopPlayersByPosition = (position) => {
      return data.elements
        .filter(player => player.element_type === position)
        .sort((a, b) => b.total_points - a.total_points)
        .slice(0, 20)
        .map((player) => ({
          id: player.id,
          first_name: player.first_name,
          second_name: player.second_name,
          code: player.code,
          team_name: teams[player.team],
          price: (player.now_cost / 10).toFixed(1),
          position: (player.element_type === 1 ? 'GK' : player.element_type === 2 ? 'DEF' : player.element_type === 3 ? 'MID' : 'FWD'),
          total_points: player.total_points,
          goals_scored: player.goals_scored,
          assists: player.assists,
          clean_sheets: player.clean_sheets,
          minutes: player.minutes,
          form: player.form,
          selected_by_percent: player.selected_by_percent,
          transfers_in_event: player.transfers_in_event,
          transfers_out_event: player.transfers_out_event,
          yellow_cards: player.yellow_cards,
          red_cards: player.red_cards,
          bonus: player.bonus,
          status: player.status,
        }));
    };

    const topPlayers = [
      ...getTopPlayersByPosition(1),
      ...getTopPlayersByPosition(2),
      ...getTopPlayersByPosition(3),
      ...getTopPlayersByPosition(4),
    ];

    return topPlayers;
  } catch (error) {
    console.error(error);
    return { error: 'Unable to fetch top players data' };
  }
});
