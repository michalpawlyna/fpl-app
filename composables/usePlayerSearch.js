import { ref } from 'vue';

export default function usePlayerSearch() {
  const query = ref("");
  const players = ref([]);

  const onInput = async () => {
    if (query.value.length < 3) {
      players.value = [];
      return;
    }

    try {
      const response = await fetch(`/api/search-players?q=${encodeURIComponent(query.value)}`);
      players.value = await response.json();
    } catch (error) {
      console.error("Error fetching players:", error);
    }
  };

  const closeSearchResults = () => {
    players.value = [];
    query.value = "";
  };

  return {
    query,
    players,
    onInput,
    closeSearchResults,
  };
}
