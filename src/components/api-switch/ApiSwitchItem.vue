<template>
    <div v-on:click="onSelect(project)" ref="item">
        <div class="apiSwitchItem" v-bind:class="{ selected: isSelected(), preselected: preselected}">
            <div v-if="!searchString" class="apiSwitchItemName">
                <h3>{{project.name}}</h3>
            </div>
            <div v-if="searchString" class="apiSwitchItemName">
                <h3>{{firstPart}}
                    <span class="apiSwitchItemUnderlined">{{underlined}}</span>{{lastPart}}</h3>
            </div>
            <div class="apiSwitchItemDescription">
                <span v-if="project.team">{{project.team}}</span>
                <span v-if="!project.team">Yours</span>
    
                <api-switch-item-attributes v-bind:project="project"></api-switch-item-attributes>
            </div>
        </div>
    </div>
</template>

<script>
import ApiSwitchItemAttributes from './ApiSwitchItemAttributes'

// API Switch Item
export default {
    name: 'api-switch-item',
    props: [
        'project',      // this project
        'onSelect',     // onSelect method
        'searchString', // search string
        'onPreselect'   // onPreselect method
    ],
    components: { ApiSwitchItemAttributes },
    computed: {
        // if search string is not empty =>
        // shows matched part as underlined
        // this splits name to 3 parts
        firstPart() {
            return this.project.name.substring(0, this.project.name.toLowerCase().indexOf(this.searchString.toLowerCase()));
        },
        underlined() {
            let start = this.project.name.toLowerCase().indexOf(this.searchString.toLowerCase());
            let end = start + this.searchString.length;

            return this.project.name.substring(start, end);
        },
        lastPart() {
            let start = this.project.name.toLowerCase().indexOf(this.searchString.toLowerCase()) + this.searchString.length;

            return this.project.name.substring(start);
        },

        // indicate if project is preselected
        preselected() {
            return this.project.preselected;
        }
    },
    methods: {
        // indicte if project is selected
        isSelected: function () {
            if (this.$route.params && this.$route.params.id) {
                let id = this.$route.params.id;
                return id === this.project.id;
            }

            return false;
        }
    },
    watch: {
        preselected: function (val) {
            if (val) {
                // if this project is preselected => sends position to scrollPanel
                this.onPreselect(this.$refs.item.offsetTop - 233); // 233 => scrollPanel height - item height
            }
        }
    }
}
</script>

<style lang="scss">
@import '../../style/global';

.apiSwitchItem {
    background-color: #4e5364;
    padding-left: 50px;
    padding-top: 12px;
    padding-right: 50px;
    padding-bottom: 12px;
    border-top: 1px solid;
    border-color: #575e70;

    &:hover {
        background: $highlighted_item_color;
    }

    &.preselected {
        background: $highlighted_item_color;
    }
}

.apiSwitchItemName {
    h3 {
        margin: 0px;
        line-height: 20px;
        font-size: 1pc;
        color: $font_color;
        font-weight: 700;
        height: auto;
        font-family: Proxima Nova, Helvetica, Arial, sans-serif;
        width: 100%;
        white-space: nowrap;
        text-overflow: ellipsis;
        word-wrap: break-word;
        overflow-x: hidden;
    }
}

.apiSwitchItemDescription {
    span {
        color: $description_font_color;
        font-size: 14px;
        line-height: 18px;
        font-style: normal;
        font-weight: 400;
    }
}

.apiSwitchItemProjectAttribute {
    margin-left: 5px;
}

.apiSwitchItemUnderlined {
    text-decoration: underline;
    text-decoration-line: underline;
    text-decoration-style: initial;
}
</style>