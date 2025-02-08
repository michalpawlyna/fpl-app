<template>
  <Navbar />
  <div class="min-h-screen bg-base-100 m-10">
    <div role="tablist" class="tabs tabs-boxed max-w-xl mx-auto mb-7">
      <a role="tab" class="tab" :class="{ 'tab-active': activeTab === 'GK' }" @click="setActiveTab('GK')">GK</a>
      <a role="tab" class="tab" :class="{ 'tab-active': activeTab === 'DEF' }" @click="setActiveTab('DEF')">DEF</a>
      <a role="tab" class="tab" :class="{ 'tab-active': activeTab === 'MID' }" @click="setActiveTab('MID')">MID</a>
      <a role="tab" class="tab" :class="{ 'tab-active': activeTab === 'FWD' }" @click="setActiveTab('FWD')">FWD</a>
    </div>
    <div class="overflow-x-auto">
      <table class="table">
        <!-- head -->
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Total Points</th>
            <th>Price</th>
            <th>Team Name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(player, index) in filteredPlayers" :key="player.id">
            <th>{{ index + 1 }}</th>
            <td>{{ player.first_name }}</td>
            <td>{{ player.second_name }}</td>
            <td>{{ player.total_points }}</td>
            <td>£{{ player.price }}m</td>
            <td>{{ player.team_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <FooterComp />
</template>

<script>
import usePlayerNavigation from '@/composables/usePlayerNavigation';

export default {
  data() {
    return {
      topPlayers: [],
      activeTab: 'DEF',
    };
  },
  computed: {
    filteredPlayers() {
      return this.topPlayers
        .filter(player => player.position === this.activeTab)
        .slice(0, 20);
    },
  },
  async mounted() {
    try {
      const response = await fetch('/api/top-players');
      this.topPlayers = await response.json();
    } catch (error) {
      console.error("Error fetching top players:", error);
    }
  },
  setup() {
    const { goToPlayerPage } = usePlayerNavigation();
    return {
      goToPlayerPage,
    };
  },
  methods: {
    setActiveTab(tab) {
      this.activeTab = tab;
    },
  },
};
</script>