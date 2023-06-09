<script setup>
import Layout from "./Layout.vue";
import Navbar from "./Navbar.vue";
</script>

<template>
  <Layout>
    <template #nav-menu>
      <Navbar />
    </template>
    <router-view />
  </Layout>
</template>
