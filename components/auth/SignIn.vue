<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next';

const password = ref('password');
const isLoading = ref(false);
import { useProfileStore } from '@/stores/useStore';
import { ref } from 'vue';

const profileStore = useProfileStore();
const email = ref('');

const login = () => {
  if (email.value === 'mirna@gmail.com') {
    profileStore.updateProfile('Mirna Milad', email.value);
    navigateTo('/');
  } else {
    alert('Invalid email');
  }
};
function onSubmit(event: Event) {
  event.preventDefault();
  if (!email.value || !password.value) return;

  isLoading.value = true;

  setTimeout(() => {
    if (email.value === 'mirna@gmail.com' && password.value === 'password')
      navigateTo('/');

    isLoading.value = false;
  }, 3000);
}
</script>

<template>
  <form class="grid gap-4" @submit="onSubmit">
    <div class="grid gap-2">
      <Label for="email"> Email </Label>
      <Input
        id="email"
        v-model="email"
        type="email"
        placeholder="name@example.com"
        :disabled="isLoading"
        auto-capitalize="none"
        auto-complete="email"
        auto-correct="off"
      />
    </div>
    <div class="grid gap-2">
      <div class="flex items-center">
        <Label for="password"> Password </Label>
        <NuxtLink
          to="/forgot-password"
          class="ml-auto inline-block text-sm underline"
        >
          Forgot your password?
        </NuxtLink>
      </div>
      <Input id="password" v-model="password" type="password" />
    </div>
    <Button @click="login" type="submit" class="w-full" :disabled="isLoading">
      <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      Login
    </Button>
    <Button @click="login" variant="outline" class="w-full">
      Login with Google
    </Button>
  </form>
  <div class="mt-4 text-center text-sm text-muted-foreground">
    Don't have an account?
    <NuxtLink to="/register" class="underline"> Sign up </NuxtLink>
  </div>
</template>

<style scoped></style>
