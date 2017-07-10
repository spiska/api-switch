<template>
  <div id="apiSwitchHeader" v-click-outside="hideMenu">
    <div v-on:click="toggleMenu" class="apiSwitchToggleLine" v-bind:class="{ expanded: visible}">
      <div v-if="currentProject">
        <div class="apiSwitchName">
          <h3>{{currentProject.name}}</h3>
        </div>
        <div class="apiSwitchDescription">
          <span v-if="currentProject.team">{{currentProject.team}}</span>
          <span v-if="!currentProject.team">{{currentUser}}</span>
          <api-switch-item-attributes v-bind:project="currentProject"></api-switch-item-attributes>
        </div>
  
        <span class="apiSwitchArrow" v-bind:class="{ up: visible, down: !visible}"></span>
      </div>
    </div>
  
    <transition name="fade">
      <div id="apiSwitchList" v-show="visible">
        <div class="apiSwitchListAddNew" v-on:click="createProject">
          <span class="apiSwitchCreateApiIcon"></span>
          <span class="apiSwitchCreateApiText">Create New API Project</span>
        </div>
  
        <div class="apiSwitchListSearch">
          <input class="apiSwitchListSearchInput" v-model="searchString" v-on:input="onSearchChanged" placeholder="Find an API Project…" autofocus>
        </div>
  
        <div class="apiSwitchListOptions">
          <span class="apiSwitchListSelectLabel">Order by</span>
          <select onfocus="this.blur();" class="apiSwitchListSelect" v-model="orderBy" v-on:change="orderProjectsBy($event.target.value)">
            <option v-for="orderByOption in orderByOptions" v-bind:key="orderByOption.value" v-bind:value="orderByOption.value">{{orderByOption.text}}</option>
          </select>
  
          <span class="apiSwitchListSelectLabel">Group by</span>
          <select onfocus="this.blur();" class="apiSwitchListSelect" v-model="groupBy" v-on:change="groupProjectsBy($event.target.value)">
            <option v-for="groupByOption in groupByOptions" v-bind:key="groupByOption.value" v-bind:value="groupByOption.value">{{groupByOption.text}}</option>
          </select>
        </div>
  
        <div class="apiSwitchListScrollbar" id="scrollBar" ref="scrollBar">
          <div class="apiSwitchListGroups">
            <api-switch-group v-for="(value, key) in projectGroups" v-bind:key="key" v-bind:api-group-value="key" v-bind:api-group-items="filteredProjects(value)" v-bind:api-group-by="groupBy" v-bind:on-select="onProjectSelect" v-bind:search-string="searchString" v-bind:on-preselect="scrollTo"></api-switch-group>
          </div>
        </div>
  
      </div>
    </transition>
  
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ProjectModel from '../../models/projectModel'
import ApiSwitchGroup from './ApiSwitchGroup'
import ApiSwitchItemAttributes from './ApiSwitchItemAttributes'

// local data
let data = {
  // list visibility indicator
  visible: false,
  // search string for projects filtering
  searchString: null,
  // project preselected by arrow navigation
  preselectedProject: null
};

// create id string from entered value (lowerCase w/o spaces)
function toIdString(value) {
  if (value) {
    return value.toLowerCase().split(' ').join('');
  }
  return '';
}

// gets ID unique for entered items (adds index)
function getUniqueId(items, name) {
  let id = toIdString(name);

  let index = 0;
  let uniqueId = id;
  while (items.some(x => x.id === uniqueId)) {
    uniqueId = id + (++index);
  }

  return uniqueId;
}

// API Switch component
// shows list of API project
// for more info check README.md
export default {
  name: 'api-switch',
  components: { ApiSwitchGroup, ApiSwitchItemAttributes },
  data: function () {
    return data;
  },

  // register keyup event => for key navigation
  created: function () {
    window.addEventListener('keydown', this.keyListener);
  },

  // unregister keyup event
  destroyed: function () {
    window.removeEventListener('keydown', this.keyListener);
  },

  computed: {
    // maps store getters
    ...mapGetters({
      // collection of projects
      projects: 'projects',
      // grouped collection of projects
      projectGroups: 'projectGroups',
      // current user name
      currentUser: 'currentUser',

      // current orderBy property name
      orderBy: 'orderBy',
      // current groupBy property name
      groupBy: 'groupBy'

    }),
    // available orderBy options
    orderByOptions: () => ProjectModel.orderByOptions,
    // available groupBy options
    groupByOptions: () => ProjectModel.groupByOptions,

    // current project (based on route params)
    currentProject(state) {
      if (this.$route.params && this.$route.params.id) {
        let id = this.$route.params.id;
        let result = this.projects.filter(x => x.id === id);
        if (result && result[0]) {
          return result[0];
        }
      }

      return this.projects[0];
    },

    // flat version of grouped projects => used for arrow navigation enumeration
    currentProjectsFlat() {
      let flat = [];
      for (let group in this.projectGroups) {
        flat = flat.concat(this.filteredProjects(this.projectGroups[group]));
      }
      return flat;
    },
  },

  methods: {
    // maps store actions
    ...mapActions([
      'addProject',
      'orderProjectsBy',
      'groupProjectsBy'
    ]),

    // projects filtered by searchString
    filteredProjects: function (projects) {
      if (data.searchString) {
        return projects.filter(x => x.name.toLowerCase().indexOf(data.searchString.toLowerCase()) !== -1);
      } else {
        return projects;
      }
    },

    // create new project
    createProject: function () {
      this.addProject(ProjectModel.create(getUniqueId(this.projects, ProjectModel.NEW_PROJECT_NAME)));
    },

    // togle projects list menu
    toggleMenu: function () {
      if (data.visible) {
        this.hideMenu()
      } else {
        this.showMenu();
      }
    },

    // shows projects list menu
    showMenu: function () {
      if (!data.visible) {
        this.clearPreselected();
        data.visible = true;
      }
    },

    // hide projects list menu
    hideMenu: function () {
      if (data.visible) {
        data.visible = false;
      }
    },

    // onSearchString changed method
    onSearchChanged: function () {
      this.setFirstAsPreselected();
    },

    // onProjectSelect method
    onProjectSelect: function (project) {
      this.hideMenu();
      // navigate url to selected project
      this.$router.push({ name: 'detail', params: { id: project.id } })
    },

    // scrolls scrollPanel to entered value
    scrollTo: function (value) {
      this.$refs.scrollBar.scrollTop = value;
    },

    // move preselected item to next item
    movePreselectedNext: function () {
      let flat = this.currentProjectsFlat;

      if (flat && flat.length) {
        for (let i = 0; i < flat.length; i++) {
          if (flat[i].preselected) {
            if (i + 1 < flat.length) {
              this.setPreselected(flat[i + 1]);
            } else {
              this.setPreselected(flat[0]);
            }

            return;
          }
        }

        this.setFirstAsPreselected();
      }
    },

    // move preselected item to previous item
    movePreselectedPrev: function () {
      let flat = this.currentProjectsFlat;

      if (flat && flat.length) {
        for (let i = 0; i < flat.length; i++) {
          if (flat[i].preselected) {
            if (i - 1 >= 0) {
              this.setPreselected(flat[i - 1]);
            } else {
              this.setPreselected(flat[flat.length - 1]);
            }

            return;
          }
        }

        this.setFirstAsPreselected();
      }
    },

    // set entered project as preselected
    setPreselected: function (project) {
      if (data.preselectedProject) {
        data.preselectedProject.preselected = false;
        data.preselectedProject = null;
      }

      if (project) {
        project.preselected = true;
        data.preselectedProject = project;
      }
    },

    // set first project as preselected
    setFirstAsPreselected: function () {
      this.setPreselected(this.currentProjectsFlat[0]);
    },

    // clear preselected item
    clearPreselected: function () {
      if (data.preselectedProject) {
        data.preselectedProject.preselected = false;
        data.preselectedProject = null;
      }
    },

    // key listener method => for key navigation
    keyListener: function (event) {
      if (!this.visible || !event) {
        return;
      }

      if (event.keyCode === 40) { // DOWN => next project
        this.movePreselectedNext();
      } else if (event.keyCode === 38) { // UP => previous project
        this.movePreselectedPrev();
      } else if (event.keyCode === 13) { // ENTER => open project detail
        let project = this.currentProjectsFlat.filter(x => x.preselected)[0];
        if (project) {
          this.onProjectSelect(project);
        }
      }
    }
  },

  directives: {
    // detect 'outside of directive' click (hide menu)
    'click-outside': {
      bind: function (el, binding, vNode) {

        // Define Handler and cache it on the element
        const bubble = binding.modifiers.bubble
        const handler = (e) => {
          if (bubble || (!el.contains(e.target) && el !== e.target)) {
            binding.value(e);
          }
        }
        el.__vueClickOutside__ = handler

        // add Event Listeners
        document.addEventListener('click', handler)
      },

      unbind: function (el, binding) {
        // Remove Event Listeners
        document.removeEventListener('click', el.__vueClickOutside__)
        el.__vueClickOutside__ = null
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../style/global';

.fade-enter-active,
.fade-leave-active {
  transition: opacity .1s
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}

#apiSwitchHeader {
  user-select: none;
  color: $font_color;
}

#apiSwitchList {
  position: absolute;
  top: 5pc;
  left: 80px;
  z-index: 1000;
  width: 500px;

  background: #3a3f4f;
}

#apiSwitchHeader::before {
  display: block;
  content: '';
  position: absolute;
  top: 20px;
  width: 1px;
  bottom: 20px;
  background-color: $header_separator_color;
}

#apiSwitchHeader::after {
  content: '';
  position: absolute;
  top: 20px;
  width: 1px;
  bottom: 20px;
  background-color: $header_separator_color;
}

.apiSwitchName,
.apiSwitchDescription {
  margin-left: 30px;
}

.apiSwitchName {
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

  padding-top: 22px;
}

.apiSwitchDescription {

  span {
    color: $description_font_color;
    font-size: 14px;
    line-height: 18px;
    font-style: normal;
    font-weight: 400;
  }
}

.apiSwitchToggleLine {
  cursor: pointer;

  float: left;
  height: 5pc;
  position: relative;
  top: 0;
  left: 0;
  width: 320px;
  padding-top: 0px;
  padding-left: 20px;
  padding-right: 54px;

  &:hover {
    background: $highlighted_item_color;
  }

  &.expanded {
    background: $highlighted_item_color;
  }
}

.apiSwitchArrow {
  width: 14px;
  height: 14px;
  position: absolute;
  top: 33px;
  right: 30px;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMCIgaGVpZ2h0PSI1IiB2aWV3Qm94PSIwIj48cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZmlsbD0iIzk1OWNhZCIgZD0iTTUgNWMuMTkgMCAuMzctLjA4LjQ5LS4yaC4wMWw0LjI5LTMuNTdoLS4wMUEuNzEzLjcxMyAwIDEgMCA4Ljc5LjJMNSAzLjI5IDEuMjEuMkEuNzEzLjcxMyAwIDAgMCAwIC43MWMwIC4yLjA5LjM4LjIyLjUxdi4wMUw0LjUxIDQuOGNOYU4uMTIgTmFOLjIgTmFOLjJ6Ii8+PC9zdmc+);
  background-size: 10px 5px;
  background-position: center;
  background-repeat: no-repeat;
  -webkit-transition: all .2s ease-in-out;
  transition: all .2s ease-in-out;

  &.up {
    transform: rotate(180deg);
  }
}

.apiSwitchListAddNew {
  height: 50px;
  padding: 0px 20px;
  background-color: #49cc90;


  &:hover {
    background-color: #31ad74;
  }
}

.apiSwitchCreateApiIcon {
  float: left;
  width: 18px;
  height: 18px;
  margin-top: 1pc;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCI+PHBhdGggZD0iTTE1LjMgMEg0LjdDMi4xIDAgMCAyLjEgMCA0Ljd2MTAuNkMwIDE3LjkgMi4xIDIwIDQuNyAyMGgxMC42YzIuNiAwIDQuNy0yLjEgNC43LTQuN1Y0LjdDMjAgMi4xIDE3LjkgMCAxNS4zIDB6bS0xLjggMTEuOGgtMS43djEuN2MwIDEtLjggMS44LTEuOCAxLjhzLTEuOC0uOC0xLjgtMS44di0xLjdINi41Yy0xIDAtMS44LS44LTEuOC0xLjhzLjgtMS44IDEuOC0xLjhoMS43VjYuNWMwLTEgLjgtMS44IDEuOC0xLjhzMS44LjggMS44IDEuOHYxLjdoMS43YzEgMCAxLjguOCAxLjggMS44cy0uOCAxLjgtMS44IDEuOHoiIGZpbGw9IiNGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIvPjwvc3ZnPg==);
  background-size: 18px 18px;
  background-repeat: no-repeat;
  background-position: center;
}

.apiSwitchCreateApiText {
  float: left;
  font-weight: 700;
  color: #fff;
  font-size: 1pc;
  line-height: 54px;
  font-family: Proxima Nova, Helvetica, Arial, sans-serif;
  text-decoration: none;
  margin-left: 9pt;
}

.apiSwitchListSearch {
  padding: 10px 0px;
}

.apiSwitchListSearchInput {
  outline: 0;
  border: 0;
  background-color: transparent;
  color: #adb3be;
  font-size: 1pc;
  width: 100%;
  height: 28px;
  border-radius: 0;
  box-shadow: none;
  background-image: url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNCAxNCI+PHBhdGggZmlsbD0iIzU5NjE3OSIgZD0iTTEzLjY2IDExLjgzNWwtLjAzLS4wMjdhMTMxLjQ5MiAxMzEuNDkyIDAgMCAxLTMuMTA3LTIuNzc2LjkwMS45MDEgMCAwIDEtLjMxOS0xLjA3Ny44ODYuODg2IDAgMCAxIC4wNzktLjE1M0E1LjQxOCA1LjQxOCAwIDAgMCA1LjQ1LjAwNGwtLjAzNS4wMDFhNS40MTkgNS40MTkgMCAwIDAtNS40MiA1LjM4IDUuNDE3IDUuNDE3IDAgMCAwIDUuMzg3IDUuNDQ5bC4wMzUuMDAxYTUuMzggNS4zOCAwIDAgMCAyLjM5OS0uNTZjLjAxOS0uMDExLjAzOC0uMDIuMDU5LS4wM2EuODkzLjg5MyAwIDAgMSAuMzM5LS4wODFsLjAzOS0uMDAxYS45MDQuOTA0IDAgMCAxIC43MDkuMzM5Yy41MDQuNTEgMS41NTQgMS41OTcgMi44ODcgMy4xMTNsLjAzMi4wMzVjLjQ2OS40OSAxLjI4MS40NDEgMS43NjMtLjA0Ny40ODItLjQ4OS40NzctMS4zMzMuMDE2LTEuNzY4ek04LjI2MSA4LjI4M2E0LjAyNiA0LjAyNiAwIDAgMS0yLjg0NSAxLjE3MWgtLjAyN2E0LjA0IDQuMDQgMCAwIDEtNC4wMTItNC4wNTkgNC4wNDYgNC4wNDYgMCAwIDEgNC4wMzgtNC4wMDhoLjAyN2E0LjAxMSA0LjAxMSAwIDAgMSAyLjg0NyAxLjIgNC4wMSA0LjAxIDAgMCAxIDEuMTY1IDIuODYgNC4wMDIgNC4wMDIgMCAwIDEtMS4xOTMgMi44MzZ6Ii8+PC9zdmc+);
  background-size: 14px 14px;
  background-repeat: no-repeat;
  background-position: 20px center;
  text-indent: 50px;
  padding: 0;
  line-height: 2pc;
}

.apiSwitchListSelect {
  display: block;
  min-width: 100px;
  height: 18px;
  background-color: transparent;
  border: 0px;
  color: $description_font_color;
  font-size: 14px;
  font-weight: 400;
  outline: none;
  display: inline-block;
  margin-right: 20px;
}

.apiSwitchListSelectLabel {
  font-size: 14px;
  font-weight: 400;
  margin-left: 20px;
}

.apiSwitchListScrollbar {
  margin-top: 5px;
  max-height: 300px;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    background-color: #3a3f4f;
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: #68717f;
    border: 0px none;
    border-radius: 0px;
  }
}
</style>