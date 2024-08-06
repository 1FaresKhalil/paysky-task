<template>
  <div>
    <h1>Account</h1>
    <p>Here you can manage your account settings.</p>
    <div class="profile-info">
      <h2>Profile Information</h2>
      <p><strong>Name:</strong> {{ profile.name }}</p>
      <p><strong>Email:</strong> {{ profile.email }}</p>
      <!-- Add more profile information as needed -->
    </div>
  </div>
</template>

<script setup>
import { useProfileStore } from '@/stores/useStore';
const profile = useProfileStore();
</script>

<style scoped>
.profile-info {
  margin-top: 20px;
}
.profile-info h2 {
  font-size: 1.5em;
  margin-bottom: 10px;
}
.profile-info p {
  margin: 5px 0;
}
</style>
