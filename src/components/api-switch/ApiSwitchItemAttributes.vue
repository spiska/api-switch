<template>
    <span>
        <span> • </span>
        <span>{{project.id}}</span>
        <span> • </span>
        <span>{{project.type}}</span>
        <span>
            <i v-if="!project.isPublic" class="fa fa-lock apiSwitchItemProjectAttribute" aria-hidden="true"></i>
            <i v-if="project.isConnected" class="fa fa-github apiSwitchItemProjectAttribute" aria-hidden="true"></i>
        </span>
    </span>
</template>

<script>
// API Switch item attributes
export default {
    name: 'api-switch-item-attributes',
    props: ['project']
}
</script>

<style lang="scss">
.apiSwitchItemProjectAttribute {
    margin-left: 5px;
}
</style>