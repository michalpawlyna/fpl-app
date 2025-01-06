<template>
  <div class="navbar bg-base-200 px-10">
    <div class="flex-1">
      <a @click="goToIndex" class="btn btn-ghost text-xl">FPL Ranking</a>
    </div>
    <div class="flex-none gap-2">
      <template v-if="user == null">
        <button @click="goToLogin" class="btn btn-active btn-primary btn-sm">Sign In</button>
      </template>
      <template v-else>
        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full">
              <template v-if="avatarUrl">
                <img
                  :src="avatarUrl"
                  alt="User Avatar"
                  class="w-10 h-10 rounded-full object-cover"
                />
              </template>
              <template v-else>
                <span class="loading loading-ring loading-lg"></span>
              </template>
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
    };
  },
};
</script>
