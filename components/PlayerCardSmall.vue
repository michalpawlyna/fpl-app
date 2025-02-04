<template>
    <div class="card bg-base-200 w-36 flex flex-col items-center p-3 rounded-lg hover:bg-base-300 cursor-pointer" >
      <div class="relative w-16 h-20">
        <img 
          :src="getPlayerImage(player.code)" 
          alt="Player image" 
          class="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      <div class="text-center mt-3">
        <div class="font-bold text-md text-primary truncate w-full">
          {{ player.first_name }} {{ player.second_name }}
        </div>
        <div class="font-semibold text-sm text-secondary">
          {{ player.position }}
        </div>
        <div class="text-sm font-semibold mt-1">
          £{{ player.price }}m
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      player: Object,
    },
    methods: {
      getPlayerImage(playerCode) {
        return playerCode
          ? `https://resources.premierleague.com/premierleague/photos/players/110x140/p${playerCode}.png`
          : '';
      },
    },
  };
  </script>
