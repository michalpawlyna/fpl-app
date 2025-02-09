<template>
  <Navbar />
  <div class="min-h-screen bg-base-100">
    <HeadingText />
    <PlayerSearch />
  </div>
  <FooterComp />
</template>

<script>
import HeadingText from '@/components/HeadingText.vue';
import PlayerSearch from '@/components/PlayerSearch.vue';

export default {
  components: {
    HeadingText,
    PlayerSearch,
  },
};
</script>
