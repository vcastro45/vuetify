<template>
  <DefaultLayout>
    <v-container class="d-flex" :style="{ minHeight: '100%' }">
      <v-row align="center" justify="center">
        <v-col cols="auto">
          <h1 class="text-h3 text-primary">
            Whoops, 404
          </h1>

          <p>The page you were looking for does not exist</p>

          <p>
            <v-btn
              :to="rpath('/getting-started/installation/')"
              color="primary"
              variant="outlined"
            >
              Get me out of here!
            </v-btn>
          </p>

          <p>
            <app-link :href="'https://v2.vuetifyjs.com' + route.fullPath">Looking for Vuetify 2?</app-link>
          </p>
        </v-col>
      </v-row>
    </v-container>
  </DefaultLayout>
</template>

<script setup lang="ts">
  import { useRoute } from 'vue-router'
  import { rpath } from '@/util/routes'
  import { useHead } from '@unhead/vue'
  import DefaultLayout from '@/layouts/default.vue'

  const route = useRoute()
  useHead({
    title: 'Page not found',
  })
</script>
