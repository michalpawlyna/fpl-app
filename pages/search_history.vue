<template>
  <Navbar />
  <div class="min-h-screen bg-base-100 m-10">
    <div v-if="clickedPlayers.length" class="">
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
        <button @click="showConfirmation = true" class="btn btn-sm btn-error">
          Clear History
        </button>
      </div>
    </div>
  </div>
  <FooterComp />

  <div v-if="showConfirmation" class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">Confirm Clear History</h3>
      <p class="py-4">Are you sure you want to clear your recently viewed players history?</p>
      <div class="modal-action">
        <button @click="clearHistory" class="btn btn-error">Yes</button>
        <button @click="showConfirmation = false" class="btn">No</button>
      </div>
    </div>
  </div>
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
      showConfirmation: false,
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
      this.showConfirmation = false;
    },
  },
};
</script>