export default defineEventHandler(async (event) => {
  const playerId = getQuery(event).id;

  if (!playerId) {
    return { error: 'Player ID is required' };
  }

  try {
    const apiUrl = "https://fantasy.premierleague.com/api/bootstrap-static/";
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.statusText}`);
    }

    const data = await response.json();

    // Create a map of team ID to team name and logo for easier lookup
    const teams = data.teams.reduce((acc, team) => {
      acc[team.id] = {
        name: team.name,
        logo: `https://resources.premierleague.com/premierleague/badges/t${team.code}.png`
      };
      return acc;
    }, {});

    // Find the player by ID and map to desired properties, including the team name
    const player = data.elements.find((player) => player.id === parseInt(playerId));

    if (!player) {
      return { error: 'Player not found' };
    }

    // Fetch detailed player data to get gameweek points
    const playerDetailUrl = `https://fantasy.premierleague.com/api/element-summary/${playerId}/`;
    const playerDetailResponse = await fetch(playerDetailUrl);
    const playerDetailData = await playerDetailResponse.json();

    const gameweekPoints = playerDetailData.history.map((game) => ({
      gameweek: game.round,
      points: game.total_points,
    }));

    // Fetch fixtures data
    const fixturesUrl = "https://fantasy.premierleague.com/api/fixtures/";
    const fixturesResponse = await fetch(fixturesUrl);
    const fixturesData = await fixturesResponse.json();

    // Filter next 5 upcoming fixtures for the player's team
    const nextFixtures = fixturesData
      .filter(fixture => (fixture.team_h === player.team || fixture.team_a === player.team) && fixture.event >= data.events.find(event => event.is_current).id)
      .slice(0, 5)
      .map(fixture => ({
        event: fixture.event,
        opponent: fixture.team_h === player.team ? teams[fixture.team_a].name : teams[fixture.team_h].name,
        opponentLogo: fixture.team_h === player.team ? teams[fixture.team_a].logo : teams[fixture.team_h].logo,
        is_home: fixture.team_h === player.team
      }));

    const playerDetails = {
      id: player.id,
      first_name: player.first_name,
      second_name: player.second_name,
      code: player.code,
      team_name: teams[player.team].name,  // Map team ID to team name
      team_logo: teams[player.team].logo,  // Map team ID to team logo
      price: (player.now_cost / 10).toFixed(1), // Convert price to a readable format
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
      gameweek_points: gameweekPoints,
      next_fixtures: nextFixtures
    };

    return playerDetails;
  } catch (error) {
    console.error(error);
    return { error: 'Unable to fetch player data' };
  }
});
