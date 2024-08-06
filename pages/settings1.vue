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
    href: '/settings1',
  },
]);
</script>

<template>
  <div class="flex flex-col gap-4">
    <BaseBreadcrumbCustom :links="breadcrumbLinks" />
    <div>settings 1</div>
    <div>it's a bouns in sidebar layout</div>
  </div>
</template>

<style scoped></style>
