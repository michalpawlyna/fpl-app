<template>
  <Navbar />
  <div class="h-screen bg-base-100 m-10 flex flex-col items-center">
    <div class="max-w-md mx-auto p-6 bg-base-200 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center mb-5">User Profile</h1>
      <form class="space-y-4" @submit.prevent="updateProfile">

        <div class="flex flex-col items-center">
          <div class="relative mb-5 group">
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              alt="Profile Photo"
              class="w-32 h-32 rounded-full object-cover cursor-pointer"
              @click="triggerFileInput"
            />
          <div 
            class="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
            @click="triggerFileInput"
          >
          <span class="text-white text-sm font-semibold">Change Avatar</span>
          </div>
          <input
            id="avatar"
            type="file"
            accept="image/*"
            @change="uploadAvatar"
            class="hidden"
            ref="fileInput"
          />
        </div>
      </div>

        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            type="text"
            :value="email"
            disabled
            class="input input-bordered w-full max-w-xs"
          />
        </div>
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            id="username"
            type="text"
            v-model="username"
            class="input input-bordered w-full max-w-xs"
          />
        </div>
        <div>
          <label for="full_name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            id="full_name"
            type="text"
            v-model="full_name"
            class="input input-bordered w-full max-w-xs"
          />
        </div>
        <div>
          <button
            type="submit"
            :disabled="loading"
            class="btn btn-active btn-primary btn-wide mx-auto block mt-5"
          >
            <span v-if="loading" class="loading loading-spinner"></span>
            <span v-else>Update</span>
          </button>
        </div>
      </form>
    </div>
  </div>
  <FooterComp />
</template>

<script setup>
definePageMeta({
  middleware: ['auth'],
});

const supabase = useSupabaseClient();

const loading = ref(true);
const username = ref('');
const full_name = ref('');
const avatar_url = ref('');
const email = ref('');
const avatarPreview = ref('');
const fileInput = ref(null);

loading.value = true;
const user = useSupabaseUser();

const { data } = await supabase
  .from('profiles')
  .select(`username, full_name, avatar_url, email`)
  .eq('id', user.value.id)
  .single();

if (data) {
  username.value = data.username;
  full_name.value = data.full_name;
  avatar_url.value = data.avatar_url;
  email.value = data.email;

  if (avatar_url.value) {
    // Generate a public URL for the avatar
    const { data: publicUrl } = supabase.storage
      .from('avatars')
      .getPublicUrl(avatar_url.value);

    avatarPreview.value = publicUrl.publicUrl;
  }
}

loading.value = false;

async function uploadAvatar(event) {
  try {
    loading.value = true;
    const file = event.target.files[0];

    if (!file) throw new Error('No file selected.');

    const filePath = `${user.value.id}/${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) throw uploadError;

    avatar_url.value = filePath;

    const { data: publicUrl } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    avatarPreview.value = publicUrl.publicUrl;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

async function updateProfile() {
  try {
    loading.value = true;

    const updates = {
      id: user.value.id,
      username: username.value,
      full_name: full_name.value,
      avatar_url: avatar_url.value,
      updated_at: new Date(),
    };

    const { error } = await supabase.from('profiles').upsert(updates, {
      returning: 'minimal', // Don't return the value after inserting
    });
    if (error) throw error;
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

function triggerFileInput() {
  fileInput.value.click();
}
</script>