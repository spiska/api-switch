<template>
    <div v-if="projectDetail">
        <div>
            <span>Detail for id: {{projectDetail.id}}</span>
        </div>
        <div>
            <span>Name</span>
            <input v-model="projectDetail.name">
        </div>
        <div>
            <span>Is public</span>
            <input type="checkbox" v-model="projectDetail.isPublic">
        </div>
        <div>
            <span>Is connected with GitHub</span>
            <input type="checkbox" v-model="projectDetail.isConnected">
        </div>
        <div>
            <span>API Type</span>
            <select v-model="projectDetail.type">
                <option value="API Blueprint">API Blueprint</option>
                <option value="Swagger">Swagger</option>
            </select>
        </div>
    
        <div>
            <span>Team</span>
            <select v-model="projectDetail.team">
                <option value="undefined">Personal</option>
                <option value="A Team">A Team</option>
                <option value="B Team">B Team</option>
            </select>
        </div>
    
        <div>
            <button v-on:click="saveCurrentProject">Save</button>
            <button v-on:click="deleteCurrentProject">Delete</button>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import ProjectModel from '../models/projectModel'

// detail component
// provides basic CRUD operations of selected project
export default {
    name: 'app-detail',
    computed: {
        // gets id of current project (from route params)
        pojectId() {
            if (this.$route.params && this.$route.params.id) {
                return this.$route.params.id;
            }

            return null;
        },

        // maps store state
        ...mapState({
            // gets project detail (or null) => by current projectId
            projectDetail(state) {
                if (this.pojectId) {
                    let detail = state.projects.filter(x => x.id === this.pojectId)[0];
                    if (detail) {
                        return detail.copy();
                    }
                }

                return null;
            }
        })
    },
    methods: {
        // maps actions from store
        ...mapActions([
            'editProject',
            'deleteProject'
        ]),

        // save current project to store
        saveCurrentProject: function () {
            // can not bind undefined directly..
            if (this.projectDetail.team === 'undefined') {
                this.projectDetail.team = undefined;
            }
            this.editProject(this.projectDetail);
        },

        // remove current project from store
        deleteCurrentProject: function ($event) {
            this.deleteProject(this.projectDetail.id);
        }
    }
}
</script>

<style>

</style>
