<template>
  <div id="app">
    <app-header></app-header>
    <app-content></app-content>
  </div>
</template>

<script>
import AppHeader from './components/AppHeader'
import AppContent from './components/AppContent'

// main component
export default {
  name: 'app',
  components: { AppHeader, AppContent }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
}
</style>
