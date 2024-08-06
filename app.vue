<script setup lang="ts">
import { Sonner } from '@/components/ui/sonner';

const colorMode = useColorMode();

const color = computed(() =>
  colorMode.value === 'dark' ? '#09090b' : '#ffffff'
);

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [{ rel: 'icon', href: '/favicon.ico' }],
  htmlAttrs: {
    lang: 'en',
  },
});

const title = 'Paysky Task';
const description =
  "Paysky Task is a task for Paysky company, it's a simple task to test my skills in Vue.js and Nuxt.js";

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <NuxtLayout vaul-drawer-wrapper>
    <NuxtPage />
  </NuxtLayout>

  <Toaster />
  <Sonner class="pointer-events-auto" />
</template>
