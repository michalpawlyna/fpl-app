<template>
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
