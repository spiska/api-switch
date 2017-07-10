<template>
  <div id="appHeader">
    <a class="appHeaderLogo"></a>
    <api-switch></api-switch>
  </div>
</template>

<script>
import ApiSwitch from './api-switch/ApiSwitch'

// header panel component
export default {
  name: 'app-header',
  components: { ApiSwitch }
}
</script>
  
<style lang="scss">
.appHeaderLogo {
  height: 80px;
  width: 80px;
}

#appHeader {
  background: #4c5264;

  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 5pc;
  z-index: 1000;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: stretch;
  font-size: 1pc;
  text-shadow: none;
}
</style>
