<template>
  <div class="card sm:card-side bg-base-200 w-fit">
    <figure>
      <img :src="getPlayerImage(playerCode)" alt="Player image" class="player-img px-3 py-3" />
    </figure>
    <div class="stats stats-vertical bg-primary text-white max-w-sm">
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
        <div class="stat-value flex items-center">
          <img :src="teamLogo" alt="Team logo" class="w-10 h-10 mr-2" />
          {{ playerTeam }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    playerName: String,
    playerCode: String,
    playerTeam: String,
    playerPrice: String,
    teamLogo: String,
  },
  methods: {
    getPlayerImage(playerCode) {
      return playerCode ? `https://resources.premierleague.com/premierleague/photos/players/110x140/p${playerCode}.png` : '';
    },
  },
};
</script>
