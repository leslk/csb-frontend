<template>
  <router-view/>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const authStore = useAuthStore();

axios.interceptors.response.use(
  response => response,
  error => {
    if (router.currentRoute.value.name != "Login" && error.response.data.error.message === 'NO_TOKEN') {
      authStore.logout();
      router.push({ name: 'Login' });
    }
    return Promise.reject(error);
  }
);
</script>
