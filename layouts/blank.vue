<script setup lang="ts">
const store = useNavbar();
const { isOpen } = storeToRefs(store);
const { isBgWhite } = storeToRefs(useAppConf());
const { theme, radius } = useCustomize();

useServerHead({
  bodyAttrs: {
    class: `theme-${theme.value}`,
    style: `--radius: ${radius.value}rem;`,
  },
});
// onBeforeMount(() => {
//   // make sure theme is on body and if it's not, add it
//   if (!document.body.classList.contains(`theme-${theme.value}`)) {
//     document.body.classList.add(`theme-${theme.value}`);
//   }
// });

const router = useRouter();

defineShortcuts({
  Meta_B: () => store.toggle(),
  'G-H': () => router.push('/'),
  'G-E': () => router.push('/email'),
});
</script>

<template>
  <div>
    <slot />
  </div>
</template>

<style scoped></style>
