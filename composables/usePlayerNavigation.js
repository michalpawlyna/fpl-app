import { useRouter } from 'vue-router';

export default function usePlayerNavigation() {
  const router = useRouter();

  const goToPlayerPage = async (playerId) => {
    try {
      const response = await fetch(`/api/player-details?id=${playerId}`);
      const playerData = await response.json();

      if (playerData) {
        sessionStorage.setItem("selectedPlayerName", `${playerData.first_name} ${playerData.second_name}`);
        sessionStorage.setItem("selectedPlayerCode", playerData.code);
        sessionStorage.setItem("selectedPlayerTeam", playerData.team_name);
        sessionStorage.setItem("selectedPlayerTeamLogo", playerData.team_logo);
        sessionStorage.setItem("selectedPlayerPrice", playerData.price);
        sessionStorage.setItem("selectedPlayerPosition", playerData.position);
        sessionStorage.setItem("selectedPlayerTotalPoints", playerData.total_points);
        sessionStorage.setItem("selectedPlayerGoalsScored", playerData.goals_scored);
        sessionStorage.setItem("selectedPlayerAssists", playerData.assists);
        sessionStorage.setItem("selectedPlayerCleanSheets", playerData.clean_sheets);
        sessionStorage.setItem("selectedPlayerMinutesPlayed", playerData.minutes);
        sessionStorage.setItem("selectedPlayerForm", playerData.form);
        sessionStorage.setItem("selectedPlayerSelectedByPercent", playerData.selected_by_percent);
        sessionStorage.setItem("selectedPlayerTransfersInEvent", playerData.transfers_in_event);
        sessionStorage.setItem("selectedPlayerTransfersOutEvent", playerData.transfers_out_event);
        sessionStorage.setItem("selectedPlayerYellowCards", playerData.yellow_cards);
        sessionStorage.setItem("selectedPlayerRedCards", playerData.red_cards);
        sessionStorage.setItem("selectedPlayerBonusPoints", playerData.bonus);
        sessionStorage.setItem("selectedPlayerInjuryStatus", playerData.status);
        sessionStorage.setItem("selectedPlayerGameweekPoints", JSON.stringify(playerData.gameweek_points));
        sessionStorage.setItem("selectedPlayerNextFixtures", JSON.stringify(playerData.next_fixtures));

        let clickedPlayers = JSON.parse(localStorage.getItem("clickedPlayers")) || [];
        clickedPlayers = clickedPlayers.filter(player => player.id !== playerData.id);
        clickedPlayers.unshift(playerData);
        if (clickedPlayers.length > 10) {
          clickedPlayers.pop();
        }
        localStorage.setItem("clickedPlayers", JSON.stringify(clickedPlayers));

        router.push(`/${playerId}`);
      }
    } catch (error) {
      console.error("Error fetching player details:", error);
    }
  };

  return {
    goToPlayerPage,
  };
}
