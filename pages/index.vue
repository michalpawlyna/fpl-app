<template>
  <Navbar />
  <div class="min-h-screen bg-base-100 m-10">
    <HeadingText />
    <PlayerSearch />
    <div v-if="clickedPlayers.length" class="mt-20">
      <div class="flex items-center mb-5">
        <h2 class="text-2xl font-bold">Recently Viewed Players</h2>
      </div>
      <div class="flex flex-wrap gap-4">
        <div
          v-for="player in clickedPlayers.slice(0, 10)"
          :key="player.id"
          class="mb-4"
          @click="goToPlayerPage(player.id)"
        >
          <PlayerCardSmall :player="player" />
        </div>
      </div>
      <div class="flex justify-center mt-4">
        <button @click="clearHistory" class="btn btn-sm btn-error">
          Clear History
        </button>
      </div>
    </div>
  </div>
  <FooterComp />
</template>

<script>
import PlayerCardSmall from '@/components/PlayerCardSmall.vue';
import usePlayerNavigation from '@/composables/usePlayerNavigation';

export default {
  components: {
    PlayerCardSmall,
  },
  data() {
    return {
      clickedPlayers: [],
    };
  },
  mounted() {
    this.clickedPlayers = JSON.parse(localStorage.getItem('clickedPlayers')) || [];
  },
  setup() {
    const { goToPlayerPage } = usePlayerNavigation();
    return {
      goToPlayerPage,
    };
  },
  methods: {
    clearHistory() {
      localStorage.removeItem('clickedPlayers');
      this.clickedPlayers = [];
    },
  },
};
</script>
