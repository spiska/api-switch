<template>
  <div class="content">
    <router-view></router-view>
  </div>
</template>

<script>
// content component
// shows router view (AppDetail component)
export default {
  name: 'app-content'
}
</script>

<style lang="scss">
.content {
  padding: 50px;
}
</style>
