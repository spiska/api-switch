// Model for project item
// contains project properties and some useful methods 
export default class ProjectModel {
    constructor(id, name, isPublic, isConnected, type, team) {
        // properties
        this.id = id;
        this.name = name;
        this.isPublic = isPublic;
        this.isConnected = isConnected;
        this.type = type;
        this.team = team;
        this.preselected = false;

        // gets new instance of this project object
        this.copy = function () {
            let result = new ProjectModel(this.id, this.name, this.isPublic,
                this.isConnected, this.type, this.team);
            return result;
        }

        // sets properties from another instance of project object
        this.fillFromObject = function (object) {
            this.id = object.id;
            this.name = object.name;
            this.isPublic = object.isPublic;
            this.isConnected = object.isConnected;
            this.type = object.type;
            this.team = object.team;
        }
    }

    // create new instance of project with entered ID
    static create(id) {
        let result = new ProjectModel(id, ProjectModel.NEW_PROJECT_NAME, false, false, 'api_blueprint', null);
        return result;
    }

    // order collection of projecs by entered property (alphabetically)
    static orderBy(items, by) {
        if (!items) {
            throw new Error('ProjectModel.orderBy() ERROR. Undefined - items');
        }

        if (!ProjectModel.orderByOptions.some(x => x.value === by)) {
            throw new Error('ProjectModel.orderBy() ERROR. Can not order by: ' + by);
        }

        let result = items.sort(function (a, b) {
            // compare property value + project name + id (+name+id => useles if selected property is equal)
            let aSortValue = a[by] + a.name + a.id;
            let bSortValue = b[by] + b.name + b.id;

            if (aSortValue < bSortValue) {
                return -1;
            }
            if (aSortValue > bSortValue) {
                return 1;
            }
            return 0;
        });

        return result;
    }

    // group collection of projects by entered property
    static groupBy(items, by) {
        if (!items) {
            throw new Error('ProjectModel.groupBy() ERROR. Undefined - items');
        }

        if (!ProjectModel.groupByOptions.some(x => x.value === by)) {
            throw new Error('ProjectModel.groupBy() ERROR. Can not group by: ' + by);
        }
        // if GROUP_BY_DEFAULT returns collection w/o grouping
        if (by === ProjectModel.GROUP_BY_DEFAULT.value) {
            return { [ProjectModel.GROUP_BY_DEFAULT.value]: items }
        } else {
            // makes object of grouped data
            // example: group by some boolean property (isPublic) =  {"true":[project1, project2..], "false":[project5, project6...]}
            let unsorted = items.reduce((result, item) => {
                (result[item[by]] = result[item[by]] || []).push(item);
                return result;
            }, {});

            // alphabetically ordered property name list
            // example: ["false","true"]
            let keys = Object.keys(unsorted).sort(function (a, b) {
                if (a < b) {
                    return -1;
                }
                if (a > b) {
                    return 1;
                }
                return 0;
            });

            // makes sorted (properties) copy of unsorted
            let result = {};
            keys.forEach(key => {
                result[key] = unsorted[key];
            });

            return result;
        }
    }

    // new project name -> used as default project name
    static NEW_PROJECT_NAME = 'New project';

    // OrderBy available options
    static orderByOptions = [
        { value: 'name', text: 'Name' },
        { value: 'type', text: 'Type' },
        { value: 'team', text: 'Team' }
    ];
    // default value for OrderBy
    static ORDER_BY_DEFAULT = ProjectModel.orderByOptions[0];

    // GroupBy available options
    static groupByOptions = [
        { value: 'all', text: 'All' },
        { value: 'isPublic', text: 'Public' },
        { value: 'isConnected', text: 'Connected to GitHub' },
        { value: 'type', text: 'Type' },
        { value: 'team', text: 'Team' }
    ]
    // GroupBy
    static GROUP_BY_DEFAULT = ProjectModel.groupByOptions[0];
}