<template>
  <Navbar />
  <div class="min-h-screen bg-base-100 m-10 flex flex-col items-center">
    <div class="max-w-md mx-auto p-6 bg-base-200 rounded-lg shadow-md">
      <h1 class="text-2xl font-bold text-center mb-5">User Profile</h1>
      <form class="space-y-4" @submit.prevent="updateProfile">

        <div class="flex flex-col items-center">
          <div class="relative mb-5 group">
            <div class="avatar placeholder">
              <div class="bg-neutral text-neutral-content w-32 h-32 rounded-full flex items-center justify-center cursor-pointer" @click="triggerFileInput">
                <span></span>
              </div>
            </div>
            <img
              v-if="avatarPreview"
              :src="avatarPreview"
              alt="Profile Photo"
              class="w-32 h-32 rounded-full object-cover cursor-pointer absolute inset-0"
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
              @change="handleFileChange"
              class="hidden"
              ref="fileInput"
            />
          </div>
          <div v-if="previousAvatars.length" class="mt-4">
            <h3 class="text-center text-lg font-semibold mb-2">Choose from previous avatars</h3>
            <div class="grid grid-cols-3 gap-4 justify-center">
              <img
                v-for="avatar in previousAvatars"
                :key="avatar"
                :src="avatar"
                @click="selectAvatar(avatar)"
                class="w-16 h-16 rounded-full object-cover cursor-pointer border-2"
                :class="{'border-primary': avatar === avatarPreview}"
              />
            </div>
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
const previousAvatars = ref([]);
let newAvatarFile = null;

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
  } else {
    avatarPreview.value = 'https://daisyui.com/tailwind-css-component-profile-1@56w.png';
  }
}

loading.value = false;

// Fetch previous avatars
onMounted(async () => {
  if (user.value) {
    const { data: files } = await supabase.storage
      .from('avatars')
      .list(user.value.id);

    if (files) {
      previousAvatars.value = files.map(file => {
        const { data: publicUrl } = supabase.storage
          .from('avatars')
          .getPublicUrl(`${user.value.id}/${file.name}`);
        return publicUrl.publicUrl;
      });
    }
  }
});

async function uploadAvatar() {
  if (!newAvatarFile) return;

  const filePath = `${user.value.id}/${newAvatarFile.name}`;
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(filePath, newAvatarFile, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) throw uploadError;

  avatar_url.value = filePath;

  const { data: publicUrl } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  avatarPreview.value = publicUrl.publicUrl;
  previousAvatars.value.push(publicUrl.publicUrl);
}

async function updateProfile() {
  try {
    loading.value = true;

    if (newAvatarFile) {
      await uploadAvatar();
    }

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

    // Refresh the page after updating the profile
    window.location.reload();
  } catch (error) {
    alert(error.message);
  } finally {
    loading.value = false;
  }
}

function triggerFileInput() {
  fileInput.value.click();
}

function selectAvatar(avatar) {
  avatarPreview.value = avatar;
  avatar_url.value = `${user.value.id}/${avatar.split('/').pop()}`;
}

function handleFileChange(event) {
  newAvatarFile = event.target.files[0];
  if (newAvatarFile) {
    avatarPreview.value = URL.createObjectURL(newAvatarFile);
  }
}
</script>