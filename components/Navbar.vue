<template>
  <div class="navbar bg-base-200 px-10">
    <div class="flex-1">
      <a @click="goToIndex" class="btn btn-ghost text-xl">FPL Stats</a>
    </div>
    <div class="flex-none gap-4">
      <label class="flex cursor-pointer gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path
            d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
        <input type="checkbox" @change="toggleTheme" class="toggle theme-controller" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </label>
      <template v-if="user == null">
        <button @click="goToLogin" class="btn btn-active btn-primary btn-sm">Sign In</button>
      </template>
      <template v-else>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full relative">
              <div class="avatar placeholder">
                <div class="bg-neutral text-neutral-content w-10 rounded-full flex items-center justify-center">
                  <span></span>
                </div>
              </div>
              <img
                v-if="avatarUrl"
                :src="avatarUrl"
                alt="User Avatar"
                class="w-10 h-10 rounded-full object-cover absolute inset-0"
              />
            </div>
          </div>
          <ul
            tabindex="0"
            class="menu menu-sm dropdown-content bg-base-200 rounded-box z-[1] mt-3 w-52 p-2 shadow">
            <li @click="goToProfile"><a>Profile</a></li>
            <li @click="logout"><a>Logout</a></li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  setup() {
    const user = useSupabaseUser();
    const client = useSupabaseClient();
    const router = useRouter();
    const avatarUrl = ref('');

    const goToProfile = () => {
      navigateTo('/profile');
    };

    const goToLogin = () => {
      navigateTo('/login');
    };

    const goToIndex = () => {
      navigateTo('/');
    };

    async function logout(){
      try {
        const { error } = await client.auth.signOut();
        if(error) throw error;
        router.push('/');      
      } catch (error) {
        console.log(error.message);
      }
    }

    const toggleTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    };

    onMounted(() => {
      const savedTheme = localStorage.getItem('theme') || 'light';
      document.documentElement.setAttribute('data-theme', savedTheme);
    });

    // Fetch user profile to get avatar URL
    onMounted(async () => {
      if (user.value) {
        const { data } = await client
          .from('profiles')
          .select('avatar_url')
          .eq('id', user.value.id)
          .single();

        if (data && data.avatar_url) {
          const { data: publicUrl } = client.storage
            .from('avatars')
            .getPublicUrl(data.avatar_url);
          avatarUrl.value = publicUrl.publicUrl;
        }
      }
    });

    return {
      user,
      avatarUrl,
      goToProfile,
      goToLogin,
      goToIndex,
      logout,
      toggleTheme,
    };
  },
};
</script>