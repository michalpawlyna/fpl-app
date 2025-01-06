<template>
  <div class="search-container flex justify-center items-center mt-10">
    <div class="search-box w-full max-w-2xl relative" ref="searchBox">
      <div class="search-input-wrapper flex items-center relative">
        <input
          type="text"
          v-model="query"
          @input="onInput"
          placeholder="Search players..."
          class="input input-bordered w-full h-14 bg-base-200"
        />
      </div>
      <ul v-if="players.length > 0" class="search-results list-none p-0 mt-2 rounded-box bg-base-200 max-h-72 overflow-y-auto shadow-lg absolute w-full z-10">
        <li
          v-for="player in players"
          :key="player.id"
          class="search-item flex items-center p-2 cursor-pointer hover:bg-base-300 last:border-b-0"
          @click="goToPlayerPage(player.id)"
        >
          <img
            :src="getPlayerImage(player.code)"
            alt="Player image"
            class="player-img w-10 h-10 mr-4 object-contain rounded-full"
          />
          <span>{{ player.first_name }} {{ player.second_name }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import usePlayerSearch from '@/composables/usePlayerSearch';
import usePlayerImage from '@/composables/usePlayerImage';
import usePlayerNavigation from '@/composables/usePlayerNavigation';

export default {
  setup() {
    const { query, players, onInput, closeSearchResults } = usePlayerSearch();
    const { getPlayerImage } = usePlayerImage();
    const { goToPlayerPage } = usePlayerNavigation();

    const handleClickOutside = (event) => {
      if (this.$refs.searchBox && !this.$refs.searchBox.contains(event.target)) {
        closeSearchResults();
      }
    };

    return {
      query,
      players,
      onInput,
      getPlayerImage,
      goToPlayerPage,
      handleClickOutside,
    };
  },
  mounted() {
    document.addEventListener("click", this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleClickOutside);
  },
};
</script>
