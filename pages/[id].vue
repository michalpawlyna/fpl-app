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
    <div class="stats stats-vertical bg-base-200 shadow-lg rounded-lg w-full max-w-xl">
      <div class="stat">
        <div class="stat-title text-md font-bold">Previous 10 gameweeks</div>
        <div class="chart-container">
          <canvas id="gameweekPointsChart" class="rounded-lg"></canvas>
        </div>
      </div>
    </div>
    <div class="stats stats-vertical bg-base-200 shadow-lg rounded-lg w-full max-w-xs">
  <div class="stat">
    <div class="stat-title text-md font-bold">Next 5 Fixtures</div>
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
      teamLogo: ""
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
      const last10Gameweeks = this.gameweekPoints.slice(-10);
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: last10Gameweeks.map(point => `GW ${point.gameweek}`),
          datasets: [{
            label: 'Points',
            data: last10Gameweeks.map(point => point.points),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
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
    }
  },
};
</script>