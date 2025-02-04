<template>
  <Navbar />
  <div class="h-auto min-h-screen bg-base-100 mx-10 my-10 flex flex-wrap items-start gap-4 justify-center">
    <PlayerCardBig
      :playerName="playerName"
      :playerCode="playerCode"
      :playerTeam="playerTeam"
      :playerPrice="playerPrice"
      :teamLogo="teamLogo"
    />
    <div class="stats stats-vertical bg-base-200 rounded-xl w-lg">
      <div class="stat">
        <ul class="divide-y divide-base-200">
          <li 
            v-for="fixture in nextFixtures" 
            :key="fixture.event" 
            class="flex items-center py-3 px-4 hover:bg-base-300 rounded-lg transition">
            <img 
              :src="fixture.opponentLogo" 
              alt="Opponent logo" 
              class="w-8 h-8 mr-3" />
            <div class="flex flex-col">
              <span class="font-semibold">GW {{ fixture.event }}</span>
              <span class="text-sm text-base-content">{{ fixture.opponent }}
                <span 
                  :class="fixture.is_home ? 'badge badge-success ml-2' : 'badge badge-warning ml-2'">
                  {{ fixture.is_home ? 'Home' : 'Away' }}
                </span>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <div class="stats stats-vertical bg-base-200 rounded-xl max-w-xl">
      <div class="stat">
        <select v-model="selectedGameweeks" @change="updateChart" class="select select-bordered w-full max-w-sm mb-3">
          <option value="5">Last 5</option>
          <option value="10">Last 10</option>
          <option value="20">Last 20</option>
          <option value="all">All</option>
        </select>
        <div class="chart-container">
          <canvas id="gameweekPointsChart" class="rounded-lg"></canvas>
        </div>
      </div>
    </div>
    <div class="stats stats-vertical bg-base-200 rounded-xl w-full max-w-xs">
      <div class="stat">
        <div class="stat-title text-md font-bold">Player Information</div>
        <table class="table w-full">
          <tbody>
            <tr>
              <td class="font-bold">Position</td>
              <td>{{ playerPosition }}</td>
            </tr>
            <tr>
              <td class="font-bold">Total Points</td>
              <td>{{ playerTotalPoints }}</td>
            </tr>
            <tr>
              <td class="font-bold">Goals Scored</td>
              <td>{{ playerGoalsScored }}</td>
            </tr>
            <tr>
              <td class="font-bold">Assists</td>
              <td>{{ playerAssists }}</td>
            </tr>
            <tr>
              <td class="font-bold">Clean Sheets</td>
              <td>{{ playerCleanSheets }}</td>
            </tr>
            <tr>
              <td class="font-bold">Minutes Played</td>
              <td>{{ playerMinutesPlayed }}</td>
            </tr>
            <tr>
              <td class="font-bold">Form</td>
              <td>{{ playerForm }}</td>
            </tr>
            <tr>
              <td class="font-bold">Selected By</td>
              <td>{{ playerSelectedByPercent }}%</td>
            </tr>
            <tr>
              <td class="font-bold">Transfers In</td>
              <td>{{ playerTransfersInEvent }}</td>
            </tr>
            <tr>
              <td class="font-bold">Transfers Out</td>
              <td>{{ playerTransfersOutEvent }}</td>
            </tr>
            <tr>
              <td class="font-bold">Yellow Cards</td>
              <td>{{ playerYellowCards }}</td>
            </tr>
            <tr>
              <td class="font-bold">Red Cards</td>
              <td>{{ playerRedCards }}</td>
            </tr>
            <tr>
              <td class="font-bold">Bonus Points</td>
              <td>{{ playerBonusPoints }}</td>
            </tr>
            <tr>
              <td class="font-bold">Injury Status</td>
              <td>{{ playerInjuryStatus }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
  <FooterComp />
</template>

<script>
import PlayerCardBig from '@/components/PlayerCardBig.vue';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  components: {
    PlayerCardBig,
  },
  data() {
    return {
      playerName: "",
      playerCode: "",
      playerTeam: "",
      playerPrice: "",
      playerPosition: "",
      playerTotalPoints: "",
      playerGoalsScored: "",
      playerAssists: "",
      playerCleanSheets: "",
      playerMinutesPlayed: "",
      playerForm: "",
      playerSelectedByPercent: "",
      playerTransfersInEvent: "",
      playerTransfersOutEvent: "",
      playerYellowCards: "",
      playerRedCards: "",
      playerBonusPoints: "",
      playerInjuryStatus: "",
      user: null,
      gameweekPoints: [],
      nextFixtures: [],
      teamLogo: "",
      selectedGameweeks: "10",
      chartInstance: null,
    };
  },
  mounted() {
    this.playerName = sessionStorage.getItem("selectedPlayerName") || "Unknown Player";
    this.playerCode = sessionStorage.getItem("selectedPlayerCode") || "";
    this.playerTeam = sessionStorage.getItem("selectedPlayerTeam") || "Unknown Team";
    this.playerPrice = sessionStorage.getItem("selectedPlayerPrice") || "";
    this.playerPosition = sessionStorage.getItem("selectedPlayerPosition") || "Unknown Position";
    this.playerTotalPoints = sessionStorage.getItem("selectedPlayerTotalPoints") || "";
    this.playerGoalsScored = sessionStorage.getItem("selectedPlayerGoalsScored") || "";
    this.playerAssists = sessionStorage.getItem("selectedPlayerAssists") || "";
    this.playerCleanSheets = sessionStorage.getItem("selectedPlayerCleanSheets") || "";
    this.playerMinutesPlayed = sessionStorage.getItem("selectedPlayerMinutesPlayed") || "";
    this.playerForm = sessionStorage.getItem("selectedPlayerForm") || "";
    this.playerSelectedByPercent = sessionStorage.getItem("selectedPlayerSelectedByPercent") || "";
    this.playerTransfersInEvent = sessionStorage.getItem("selectedPlayerTransfersInEvent") || "";
    this.playerTransfersOutEvent = sessionStorage.getItem("selectedPlayerTransfersOutEvent") || "";
    this.playerYellowCards = sessionStorage.getItem("selectedPlayerYellowCards") || "";
    this.playerRedCards = sessionStorage.getItem("selectedPlayerRedCards") || "";
    this.playerBonusPoints = sessionStorage.getItem("selectedPlayerBonusPoints") || "";
    this.playerInjuryStatus = sessionStorage.getItem("selectedPlayerInjuryStatus") || "";
    this.user = useSupabaseUser().value;
    this.gameweekPoints = JSON.parse(sessionStorage.getItem("selectedPlayerGameweekPoints")) || [];
    this.nextFixtures = JSON.parse(sessionStorage.getItem("selectedPlayerNextFixtures")) || [];
    this.teamLogo = sessionStorage.getItem("selectedPlayerTeamLogo") || "";
    this.renderChart();
  },
  methods: {
    getPlayerImage(playerCode) {
      return playerCode ? `https://resources.premierleague.com/premierleague/photos/players/110x140/p${playerCode}.png` : '';
    },
    renderChart() {
      const ctx = document.getElementById('gameweekPointsChart').getContext('2d');
      let gameweeksToShow;
      if (this.selectedGameweeks === "all") {
        gameweeksToShow = this.gameweekPoints;
      } else {
        gameweeksToShow = this.gameweekPoints.slice(-this.selectedGameweeks);
      }
      this.chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: gameweeksToShow.map(point => `GW ${point.gameweek}`),
          datasets: [{
            label: 'Gameweek points',
            data: gameweeksToShow.map(point => point.points),
            backgroundColor: 'rgba(59, 130, 246, 0.2)', // DaisyUI primary color with transparency
            borderColor: 'rgba(59, 130, 246, 1)', // DaisyUI primary color
            borderWidth: 1.5,
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    },
    updateChart() {
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      this.renderChart();
    }
  },
};
</script>