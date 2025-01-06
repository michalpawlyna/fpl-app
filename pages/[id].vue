<template>
  <Navbar />
  <div class="h-screen bg-base-100 mx-10 my-10 flex flex-wrap items-start gap-4 justify-center">
  <div>
  <button 
    class="btn btn-ghost bg-base-200 mb-4 flex items-center" 
    :disabled="!user" 
    @click="toggleFavourite"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 mr-2"
      :fill="isFavourite ? 'red' : 'none'"
      viewBox="0 0 24 24"
      :stroke="isFavourite ? 'red' : 'white'"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
    {{ isFavourite ? 'Added to favourites' : 'Add to Favourites' }}
  </button>

  <div class="card md:card-side bg-base-200 shadow-lg w-fit">
    <figure>
      <img :src="getPlayerImage(playerCode)" alt="Player image" class="player-img px-5 py-5" />
    </figure>
    <div class="stats stats-vertical shadow max-w-sm bg-primary text-white">
      <div class="stat">
        <div class="stat-title text-white">Player name</div>
        <div class="stat-value">{{ playerName }}</div>
      </div>
      <div class="stat">
        <div class="stat-title text-white">Price</div>
        <div class="stat-value">£{{ playerPrice }}m</div>
      </div>
      <div class="stat">
        <div class="stat-title text-white">Team</div>
        <div class="stat-value">{{ playerTeam }}</div>
      </div>
    </div>
    </div>
  </div>
  <div class="stats stats-vertical bg-base-200">
    <div class="stat">
      <div class="stat-title">Position</div>
      <div class="stat-value">{{ playerPosition }}</div>
    </div>
    <div class="stat">
      <div class="stat-title">Total points</div>
      <div class="stat-value">{{ playerTotalPoints }}</div>
    </div>
    <div class="stat">
      <div class="stat-title">Goals</div>
      <div class="stat-value">{{ playerGoalsScored}}</div>
    </div>
    <div class="stat">
      <div class="stat-title">Assists</div>
      <div class="stat-value">{{ playerAssists }}</div>
    </div>
  </div>
  <div class="stats stats-vertical bg-base-200">
    <div class="stat">
      <div class="stat-title">Clean sheets</div>
      <div class="stat-value">{{ playerCleanSheets }}</div>
    </div>
    <div class="stat">
      <div class="stat-title">Minutes played</div>
      <div class="stat-value">{{ playerMinutesPlayed }}</div>
    </div>
    <div class="stat">
      <div class="stat-title">Form</div>
      <div class="stat-value">{{ playerForm}}</div>
    </div>
    <div class="stat">
      <div class="stat-title">Selected by</div>
      <div class="stat-value">{{ playerSelectedByPercent }}%</div>
    </div>
  </div>
  <div class="stats stats-vertical bg-base-200">
    <div class="stat">
      <div class="stat-title">Transfers in</div>
      <div class="stat-value">{{ playerTransfersInEvent }}</div>
    </div>
    <div class="stat">
      <div class="stat-title">Transfers out</div>
      <div class="stat-value">{{ playerTransfersOutEvent }}</div>
    </div>
    <div class="stat">
      <div class="stat-title">Yellow cards</div>
      <div class="stat-value">{{ playerYellowCards}}</div>
    </div>
    <div class="stat">
      <div class="stat-title">Red cards</div>
      <div class="stat-value">{{ playerRedCards }}</div>
    </div>
  </div>
  <div class="stats stats-vertical bg-base-200">
    <div class="stat">
      <div class="stat-title">Total bonus points</div>
      <div class="stat-value">{{ playerBonusPoints }}</div>
    </div>
    <div class="stat">
      <div class="stat-title">Status</div>
      <div 
        class="stat-value" 
        :class="{ 'text-red-500': playerInjuryStatus === 'Injured' }">
        {{ playerInjuryStatus }}
      </div>
      </div>
  </div>
  
  
</div>

  <FooterComp />
</template>

<script>
export default {
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
      isFavourite: false,
      user: null,
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
    if (this.user) {
      const storedPlayers = JSON.parse(localStorage.getItem('favouritePlayers')) || [];
      this.isFavourite = storedPlayers.some(player => player.id === this.$route.params.id);
    }
  },
  methods: {
    getPlayerImage(playerCode) {
      return playerCode ? `https://resources.premierleague.com/premierleague/photos/players/110x140/p${playerCode}.png` : '';
    },
    toggleFavourite() {
      const storedPlayers = JSON.parse(localStorage.getItem('favouritePlayers')) || [];
      if (this.isFavourite) {
        const updatedPlayers = storedPlayers.filter(player => player.id !== this.$route.params.id);
        localStorage.setItem('favouritePlayers', JSON.stringify(updatedPlayers));
      } else {
        const newPlayer = {
          id: this.$route.params.id,
          name: this.playerName,
          team: this.playerTeam,
        };
        storedPlayers.push(newPlayer);
        localStorage.setItem('favouritePlayers', JSON.stringify(storedPlayers));
      }
      this.isFavourite = !this.isFavourite;
    },
  },
};
</script>
