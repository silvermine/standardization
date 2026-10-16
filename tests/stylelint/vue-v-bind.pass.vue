<template>
   <div class="card" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const textColor = ref('tomato');
</script>

<style lang="scss" scoped>
.card {
   color: v-bind(textColor);
}
</style>
