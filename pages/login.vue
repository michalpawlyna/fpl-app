<template>
  <div class="max-w-md mx-auto my-20 p-5 rounded-lg shadow-lg bg-base-200">
    <h2 class="text-center text-2xl font-bold mb-5">Login</h2>
    <form @submit.prevent="signIn">

      <div class="mb-4">
        <label class="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input v-model="email" id="email" type="email" class="grow" placeholder="Email" />
        </label>
      </div>

      <div class="mb-4">
        <label class="input input-bordered flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="h-4 w-4 opacity-70">
            <path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" />
          </svg>
          <input v-model="password" id="password" type="password" class="grow" placeholder="Password" />
        </label>
      </div>

      <button type="submit" class="btn btn-active btn-primary btn-wide mx-auto block">Log In</button>
    </form>

    <p v-if="errorMsg" class="text-red-500 text-center mt-4">{{ errorMsg }}</p>

    <p class="text-center mt-10">Don't have an account? <a @click="goToRegister" class="link link-primary">Create one!</a></p>
  </div>
</template>

<script setup>
const client = useSupabaseClient();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMsg = ref(null);

async function signIn() {
  errorMsg.value = null;
  if (!email.value || !password.value) {
    errorMsg.value = "Email and password are required.";
    return;
  }
  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });
    if (error) throw error;
    router.push('/');
  } catch (error) {
    errorMsg.value = error.message;
  }
}

const goToRegister = () => {
      navigateTo('/register');
    };
</script>


