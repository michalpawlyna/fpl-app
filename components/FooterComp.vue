<template>
    <footer class="footer footer-center bg-base-200 text-base-content p-4">
      <aside>
        <p>Copyright © {{ year }} - All right reserved by MP Industries Ltd</p>
      </aside>
    </footer>
  </template>
  
  <script>
  export default {
    setup() {
      // Get the current year
      const year = new Date().getFullYear();
  
      return {
        year,
      };
    },
  };
  </script>
  