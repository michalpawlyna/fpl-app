<template>
  <div class="max-w-md mx-auto my-20 p-5 rounded-lg shadow-lg bg-base-200">
    <h2 class="text-center text-2xl font-bold mb-5">Register</h2>
    <form @submit.prevent="signUp">
      <div class="mb-4">
        <label class="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input v-model="email" id="email" type="email" class="grow" placeholder="Email" aria-label="Email" />
        </label>
      </div>

      <div class="mb-4">
        <label class="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
            <path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" />
          </svg>
          <input v-model="password" id="password" type="password" class="grow" placeholder="Password" aria-label="Password" />
        </label>
      </div>

      <button type="submit" class="btn btn-active btn-primary btn-wide mx-auto block" :disabled="isLoading">
        {{ isLoading ? 'Registering...' : 'Register' }}
      </button>
    </form>

    <p v-if="errorMsg" class="text-red-500 text-center mt-4">{{ errorMsg }}</p>
    <p v-if="successMsg" class="text-green-500 text-center mt-4">{{ successMsg }}</p>

    <p class="text-center mt-10">Already a user? <a @click="goToLogin" class="link link-primary">Log In!</a></p>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const email = ref('');
const password = ref('');
const errorMsg = ref(null);
const successMsg = ref(null);
const isLoading = ref(false);

async function signUp() {
  isLoading.value = true;
  errorMsg.value = null;
  successMsg.value = null;

  try {
    if (password.value.length < 8) {
      errorMsg.value = 'Password must be at least 8 characters long.';
      isLoading.value = false;
      return;
    }

    const { data: user, error } = await client
      .from('profiles')
      .select('email')
      .eq('email', email.value)
      .single();

    if (user) {
      errorMsg.value = 'Email is already registered.';
      isLoading.value = false;
      return;
    }

    const { data: signUpData, error: signUpError } = await client.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (signUpError) throw signUpError;

    successMsg.value = 'Check your email for the confirmation link.';
    setTimeout(() => {
      navigateTo('/login');
    }, 3000);
  } catch (error) {
    errorMsg.value = error.message;
  } finally {
    isLoading.value = false;
  }
}

const goToLogin = () => {
  navigateTo('/login');
};
</script>