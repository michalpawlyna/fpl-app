<template>
  <div class="stats stats-vertical bg-base-200 rounded-xl w-lg">
    <div class="stat">
      <ul class="divide-y divide-base-200">
        <li 
          v-for="fixture in fixtures" 
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
</template>

<script>
export default {
  props: {
    fixtures: {
      type: Array,
      required: true,
    },
  },
};
</script>
