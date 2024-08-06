// middleware/auth.ts
import { useProfileStore } from '@/stores/useStore';

export default defineNuxtRouteMiddleware((to, from) => {
  const profileStore = useProfileStore();
  if (!profileStore.email || profileStore.email !== 'mirna@gmail.com') {
    return navigateTo('/login');
  }
});
