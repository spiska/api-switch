// Global store
// contains loaded (faked) data

import Vue from 'vue'
import Vuex from 'vuex'
import ProjectModel from '../models/projectModel'

// init vuex
Vue.use(Vuex)

// fake init data
const projectsData = [
    new ProjectModel('bproject', 'B Project', false, true, 'API Blueprint', 'A Team'),
    new ProjectModel('cproject', 'C Project', true, false, 'Swagger'),
    new ProjectModel('aproject', 'A Project', false, false, 'Swagger', 'B Team'),
    new ProjectModel('eproject', 'E Project', true, true, 'Swagger', 'A Team'),
    new ProjectModel('fproject', 'F Project', true, true, 'API Blueprint', 'B Team'),
    new ProjectModel('dproject', 'D Project', true, true, 'API Blueprint', 'B Team'),
    new ProjectModel('hproject', 'H Project', false, true, 'API Blueprint', 'A Team'),
    new ProjectModel('iproject', 'I Project', true, false, 'Swagger'),
    new ProjectModel('gproject', 'G Project', false, false, 'Swagger', 'B Team')
];

// init state
const state = {
    currentUser: 'Philip J. Fry',
    projects: projectsData,
    projectGroups: null,
    orderBy: ProjectModel.ORDER_BY_DEFAULT.value,
    groupBy: ProjectModel.GROUP_BY_DEFAULT.value
}

// gets project by entered ID
function getProjectById(id) {
    if (state && state.projects) {
        let result = state.projects.filter(x => x.id === id);
        if (result) {
            return result[0];
        }
    }
}

// order state.projects by entered property name
function orderProjectsBy(by) {
    state.projects = ProjectModel.orderBy(state.projects, by);
}

// group state.projects by entered property name
function groupProjectsBy(by) {
    state.projectGroups = ProjectModel.groupBy(state.projects, by);
};

// calls order/group on init
orderProjectsBy(state.orderBy);
groupProjectsBy(state.groupBy);

// store mutations
const mutations = {
    // CRUD operations of store projects
    // add entered project
    ADD_PROJECT(state, project) {
        state.projects.push(project);
        orderProjectsBy(state.orderBy);
        groupProjectsBy(state.groupBy);
    },

    // edit entered project
    EDIT_PROJECT(state, project) {
        let item = getProjectById(project.id)
        if (item) {
            item.fillFromObject(project);
        }
        orderProjectsBy(state.orderBy);
        groupProjectsBy(state.groupBy);
    },

    // delete project by id
    DELETE_PROJECT(state, id) {
        if (state.projects.length <= 1) {
            return;
        }

        let item = getProjectById(id);
        if (item) {
            var index = state.projects.indexOf(item);
            if (index > -1) {
                state.projects.splice(index, 1);
            }
        }
        orderProjectsBy(state.orderBy);
        groupProjectsBy(state.groupBy);
    },


    // order projects by entered property (alphabetically)
    ORDER_BY(state, by) {
        state.orderBy = by;
        orderProjectsBy(state.orderBy);
        groupProjectsBy(state.groupBy);
    },

    // group projects by entered property
    GROUP_BY(state, by) {
        state.groupBy = by;
        groupProjectsBy(state.groupBy);
    }
}

// store actions
const actions = {
    addProject({ commit }, project) {
        commit('ADD_PROJECT', project)
    },
    editProject({ commit }, project) {
        commit('EDIT_PROJECT', project)
    },
    deleteProject({ commit }, id) {
        commit('DELETE_PROJECT', id)
    },
    orderProjectsBy({ commit }, by) {
        commit('ORDER_BY', by);
    },
    groupProjectsBy({ commit }, by) {
        commit('GROUP_BY', by);
    }
}

// store getters
const getters = {
    currentUser: () => state.currentUser,
    projects: () => state.projects,
    projectGroups: () => state.projectGroups,
    orderBy: () => state.orderBy,
    groupBy: () => state.groupBy
}

// export store object
export default new Vuex.Store({
    state,
    mutations,
    actions,
    getters
})