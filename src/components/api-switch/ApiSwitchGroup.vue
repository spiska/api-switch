<template>
    <div class="apiSwitchGroup">
    
        <div v-if="apiGroupBy === 'all'">
        </div>
        <div v-else-if="apiGroupBy === 'isPublic'" class="apiSwitchGroupLabel">
            <span v-if="apiGroupValue==='true'">Public</span>
            <span v-else>Private</span>
        </div>
        <div v-else-if="apiGroupBy === 'isConnected'" class="apiSwitchGroupLabel">
            <span v-if="apiGroupValue==='true'">Connected</span>
            <span v-else>Not connected</span>
        </div>
        <div v-else-if="apiGroupBy === 'type'" class="apiSwitchGroupLabel">
            <span>{{apiGroupValue}}</span>
        </div>
        <div v-else-if="apiGroupBy === 'team'" class="apiSwitchGroupLabel">
            <span v-if="apiGroupValue==='undefined'">Yours</span>
            <span v-else>{{apiGroupValue}}</span>
        </div>
    
        <div v-else class="apiSwitchGroupLabel">
            <span>{{apiGroupValue}}</span>
        </div>
    
        <div>
            <div v-if="apiGroupItems.length">
                <api-switch-item v-for="project in apiGroupItems" v-bind:key="project.id" v-bind:project="project" v-bind:on-select="onSelect" v-bind:search-string="searchString" v-bind:on-preselect="onPreselect"></api-switch-item>
            </div>
            <div class="apiSwitchSearchNoResult" v-if="!apiGroupItems.length">
                <span>No result for "{{searchString}}".</span>
            </div>
        </div>
    </div>
</template>

<script>
import ApiSwitchItem from './ApiSwitchItem'
import ProjectModel from '../../models/projectModel'

// API Switch group component
// contains list of grouped API projects
export default {
    name: 'api-switch-group',
    components: { ApiSwitchItem },
    props: [
        'apiGroupItems',    // items of this group
        'apiGroupValue',    // value of grouped property
        'apiGroupBy',       // grouped by proprty
        'searchString',     // search string
        'onSelect',         // onSelect method
        'onPreselect'       // onPreselect method
    ]
}
</script>

<style lang="scss">
@import '../../style/global';

.apiSwitchGroupLabel {
    padding: 5px 20px;
    background-color: #49b7ff;
}

.apiSwitchSearchNoResult {
    height: 67px;
    background-color: #4e5364;
    padding-left: 50px;

    span {
        padding-top: 24px;
        color: $description_font_color;
        display: inline-block;
    }
}
</style>