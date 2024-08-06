<script setup lang="ts">
const breadcrumbLinks = ref([
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Settings',
    href: '#',
  },
  {
    title: 'Settings',
    href: '/settings2',
  },
]);
</script>

<template>
  <div class="flex flex-col gap-4">
    <BaseBreadcrumbCustom :links="breadcrumbLinks" />
    <div>settings 2</div>
  </div>
</template>

<style scoped></style>
