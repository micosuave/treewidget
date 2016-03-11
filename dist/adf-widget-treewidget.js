(function(window, undefined) {'use strict';


angular.module('adf.widget.treewidget', ['adf.provider'])
    .config(["dashboardProvider", function(dashboardProvider) {
        dashboardProvider
            .widget('treewidget', {
                title: 'Tree Builder',
                description: 'build a D3 Tree Visualization',
                templateUrl: '{widgetsPath}/treewidget/src/view.html',
                reload: true,
                frameless: false,
                styleClass: 'NOA',
                controller: 'TreeWidgetCtrl',
                edit: {
                    templateUrl: '{widgetsPath}/treewidget/src/edit.html',
                    reload: true,
                    controller: 'TreeWidgetConfigCtrl'

                }
            });
    }])
    .controller('TreeWidgetConfigCtrl', ['$scope', 'config', '$window', '$document', '$compile', '$parse', '$http', 'dashboard', '$sce',
        function($scope, config, $window, $document, $compile, $parse, $http, dashboard, $sce) {
            if (!config.url) {
                config.url = '/llp_core/data.json';
            } else {
                //var draft = PROJECTDRAFT(config.draftid);
                //$scope.draft = draft;
            }
            $scope.config = config;

            $scope.configured = function() {
                return $scope.config.content !== '';
            };

            $scope.notConfigured = function() {
                return $scope.config.content === '';
            };

            $scope.loadData = function(config) {
                var req = $http.get(config.url).then(function(resp) {
                    config.data = resp.data;
                });
            };
            if (config.url) {
                this.url = $sce.trustAsResourceUrl(config.url);
            }
        }
    ]).controller('TreeWidgetCtrl', ['$scope', 'config', '$window', '$document', '$compile', '$parse', '$http', 'dashboard', '$sce',
        function($scope, config, $window, $document, $compile, $parse, $http, dashboard, $sce) {
            if (!config.url) {
                config.url = '';
            } else {
                //var draft = PROJECTDRAFT(config.draftid);
                //$scope.draft = draft;
            }
            $scope.config = config;

            $scope.loadTemplate = function(config) {
                var req = $http.get(config.url).then(function(resp) {
                    config.data = resp.data;
                });
            };
            if (config.url) {
                this.url = $sce.trustAsResourceUrl(config.url);
            }
            if (config.data) {
                this.data = config.data;
            }

        }
    ]).factory('config', function() {
        return function() {
            var config = {
                url: '/llp_core/data.json',

                diameter: '500'
            };
            return config;
        }
    });

angular.module("adf.widget.treewidget").run(["$templateCache", function($templateCache) {$templateCache.put("{widgetsPath}/treewidget/src/edit.html","<form role=form><div class=form-group><label for=sample>Sample</label> <input type=url class=form-control id=sample ng-model=config.url placeholder=\"Enter sample\"> <input type=number class=form-control id=num ng-model=config.diameter></div></form>");
$templateCache.put("{widgetsPath}/treewidget/src/view.html","<div class=container-fluid><div><h1 class=text-center>Architecture Tree</h1><div ng-controller=filterCtrl><ng-include src=\"\'filter.html\'\"></ng-include></div><div ng-controller=chartCtrl><tree-chart-widget data=tree diameter=\"{{config.diameter || \'500\'}}\"></tree-chart-widget><d3pendingtree patent=7654321 pattern tree=tree></d3pendingtree></div><div ng-controller=panelCtrl><div id=panel><div ng-if=detail><ng-include src=\"\'panel-detail.html\'\"></ng-include></div><div ng-if=edit><ng-include src=\"\'panel-edit.html\'\"></ng-include></div></div></div><div ng-controller=undoCtrl><div ng-if=hasHistory() class=\"alert alert-success json-update-label bg-success\">Updated JSON <a ng-click=undo()>(undo)</a></div></div><div ng-controller=jsonDataCtrl><textarea id=json-data class=\"form-control card card-dark well\" style=margin-top:50%; ng-model=data ng-blur=updateData()></textarea></div></div></div><script src=/treewidget/src/d3.architectureTree.js></script><script src=/treewidget/src/app.js></script><script src=/treewidget/src/chart.js></script><script src=/treewidget/src/filter.js></script><script src=/treewidget/src/json-data.js></script><script src=/treewidget/src/panel.js></script><script src=/treewidget/src/undo.js></script><script src=/treewidget/src/tree-chart.js></script><script src=/treewidget/src/init-focus.js></script><script src=/treewidget/src/data.js></script><script src=/treewidget/src/bus.js></script><script src=/treewidget/src/data.json></script><script type=text/ng-template id=filter.html><div class=\"filters panel panel-default\"> <div class=\"panel-heading\">Search</div> <div class=\"panel-body\"> <form id=\"filter_form\"> <input name=\"name\" type=\"text\" class=\"form-control\" placeholder=\"Filter by name\" ng-model=\"$parent.nameFilter\" /> <div id=\"technos\"> <h5>Technos</h5> <a ng-repeat=\"techno in technos\" class=\"btn btn-default btn-xs\" ng-click=\"toggleTechnoFilter(techno)\" ng-class=\"{\'btn-primary\': isTechnoInFilter(techno) }\">{{ techno }}</a> </div> <div id=\"host\"> <h5>Host</h5> <a ng-repeat=\"host in hosts\" class=\"btn btn-default btn-xs\" ng-click=\"toggleHostFilter(host)\" ng-class=\"{\'btn-primary\': isHostInFilter(host) }\">{{ host }}</a> </div> </form> </div> </div></script><script type=text/ng-template id=panel-detail.html><div class=\"details panel panel-info\"> <div class=\"panel-heading\">{{ node.name }}</div> <div class=\"panel-body\"> <div class=\"url\" ng-if=\"node.url\"> <a href=\"{{ node.url }}\">{{ node.url }}</a> </div> <div class=\"comments panel panel-default\" ng-if=\"node.comments\"> <div class=\"panel-heading\">{{ node.comments }}</div> </div> <div class=\"properties\" ng-if=\"node.details.Dependencies\"> <h5>Depends on</h5> <ul> <li ng-repeat=\"dependency in node.details.Dependencies\"> {{ dependency }} </li> </ul> </div> <div class=\"properties\" ng-if=\"node.details.Dependents\"> <h5>Dependendents</h5> <ul> <li ng-repeat=\"dependent in node.details.Dependents\"> {{ dependent }} </li> </ul> </div> <div class=\"properties\" ng-if=\"node.details.Technos\"> <h5>Technos</h5> <ul> <li ng-repeat=\"techno in node.details.Technos\"> {{ techno }} </li> </ul> </div> <div class=\"properties\" ng-if=\"node.details.Host\"> <h5>Hosts</h5> <ul> <li ng-repeat=\"(hostName, servers) in node.host\"> {{ hostName }} <ul ng-if=\"servers\"> <li ng-repeat=\"server in servers\">{{ server }}</li> </ul> <span ng-if=\"detail.via\">({{ detail.via }})</span> </li> </ul> </div> </div> </div></script><script type=text/ng-template id=panel-edit.html><form name=\"editForm\" ng-submit=\"editNode(editForm, $event)\"> <div class=\"details panel panel-info\"> <div class=\"panel-heading\"> <input type=\"text\" ng-model=\"node.name\" class=\"form-control\" /> </div> <div class=\"panel-body\"> <div class=\"url\"> <h5>Url</h5> <input type=\"text\" ng-model=\"node.url\" class=\"form-control\" init-focus /> </div> <div class=\"comments\"> <h5>Comments</h5> <textarea ng-model=\"node.comments\" class=\"form-control\" init-focus></textarea> </div> <div class=\"properties edit\"> <h5>Depends on <span class=\"glyphicon glyphicon-plus\" ng-click=\"addDependency()\"></span></h5> <ul> <li ng-repeat=\"dependencies in node.dependsOn track by $index\"> <input type=\"text\" ng-model=\"node.dependsOn[$index]\" init-focus /> <span class=\"remove glyphicon glyphicon-remove\" ng-click=\"deleteDependency($index)\"></span> </li> </ul> <h5>Technos <span class=\"glyphicon glyphicon-plus\" ng-click=\"addTechno()\"></span></h5> <ul> <li ng-repeat=\"techno in node.technos track by $index\"> <input type=\"text\" ng-model=\"node.technos[$index]\" init-focus /> <span class=\"remove glyphicon glyphicon-remove\" ng-click=\"deleteTechno($index)\"></span> </li> </ul> <h5>Hosts <span class=\"glyphicon glyphicon-plus\" ng-click=\"addHostCategory()\"></span></h5> <ul> <li ng-repeat=\"(key, host) in node.host track by $index\"> <input type=\"text\" ng-model=\"hostKeys[key]\" init-focus /><span class=\"glyphicon glyphicon-plus\" ng-click=\"addHost(key)\"></span> <span class=\"remove glyphicon glyphicon-remove\" ng-click=\"deleteHostCategory(key)\"></span> <ul> <li ng-repeat=\"test in node.host[key] track by $index\"> <span class=\"remove glyphicon glyphicon-remove\" ng-click=\"deleteHost(key, $index)\"></span> <input type=\"text\" ng-model=\"node.host[key][$index]\" init-focus /> </li> </ul> </li> </ul> </div> </div> <div class=\"panel-footer\"> <button type=\"button\" ng-click=\"addNode()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-plus\"></span> Add</button> <button type=\"button\" ng-click=\"moveNode()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-share-alt\"></span> Move</button> <button type=\"button\" ng-click=\"deleteNode()\" class=\"btn btn-warning\"><span class=\"glyphicon glyphicon-trash\"></span> Delete</button> </div> <div class=\"panel-footer\"> <button type=\"submit\" class=\"btn btn-primary\"><span class=\"glyphicon glyphicon-ok\"></span> Save</button> <button type=\"button\" ng-click=\"leaveEdit()\" class=\"btn btn-default\"><span class=\"glyphicon glyphicon-remove\"></span> Cancel</button> </div> </div> </form></script>");}]);
angular.module('adf.widget.treewidget').controller('undoCtrl', ['$scope', 'bus', 'data', function($scope, bus, data) {

    var history = [];

    bus.on('updateData', function(data) {
        history.push(angular.copy(data));
    });

    $scope.hasHistory = function() {
        return history.length > 1;
    };

    $scope.undo = function() {
        history.pop(); // remove current state
        data.setJsonData(history.pop()); // restore previsous state
    };

}]);

angular.module('adf.widget.treewidget').directive('treeChartWidget', ['bus','d3Service', function(bus, d3Service) {
    

    return {
        restrict: 'E',
        replace: true,
        template: '<div id="graph"></div>',
        scope: {
            data: '='
        },
        link: function(scope, element) {
             d3Service.d3().then(function(d3) {
            var chart = d3.chart.architectureTree();

            scope.$watch("data", function(data) {
                if (typeof(data) === 'undefined') {
                    return;
                }

                chart.diameter(960)
                    .data(scope.data);

                d3.select(element[0])
                    .call(chart);
            });

            bus.on('nameFilterChange', function(nameFilter) {
                chart.nameFilter(nameFilter);
            });

            bus.on('technosFilterChange', function(technosFilter) {
                chart.technosFilter(technosFilter);
            });

            bus.on('hostsFilterChange', function(hostsFilter) {
                chart.hostsFilter(hostsFilter);
            });

            bus.on('select', function(name) {
                chart.select(name);
            });

            bus.on('unselect', function() {
                chart.unselect();
            });

        });
       }
    };
}]);

angular.module('adf.widget.treewidget').controller('panelCtrl', ['$scope', '$timeout', '$window', 'data', 'bus', function($scope, $timeout, $window, data, bus) {
    

    var container = angular.element(document.querySelector('#panel')),
        graph = document.querySelector('#graph');

    bus.on('updateData', function(data) {
        var clonedData = angular.copy(data);
        $scope.data = formatData(clonedData);
    });

    function formatData(data) {

        var addParent = function(node) {
            if (node.children) {
                node.children.forEach(function(childNode) {
                    childNode.parent = node;
                    addParent(childNode);
                });
            }
        };

        var addDependents = function(node) {
            if (node.dependsOn) {
                node.dependsOn.forEach(function(dependsOn) {
                    var dependency = getNodeByName(dependsOn, data);
                    if (!dependency) {
                        console.log('Dependency', dependsOn, 'not found for node', node);
                        return;
                    }
                    if (!dependency.dependents) {
                        dependency.dependents = [];
                    }
                    dependency.dependents.push(node.name);
                });
            }
            if (node.children) {
                node.children.map(addDependents);
            }
        };

        var addDetails = function(node) {
            addDetailsForNode(node);
            if (node.children) {
                node.children.map(addDetails);
            }
        };

        /**
         * Add details to a node, including inherited ones (shown between parentheses).
         *
         * Mutates the given node.
         *
         * Example added properties:
         * {
         *   details: {
         *     Dependencies: ["Foo", "Bar (Babar)"],
         *     Dependents: ["Baz", "Buzz"];
         *     Technos: ["Foo", "Bar (Babar)" }
         *     Host: ["OVH", "fo (Foo)"]
         *   }
         * }
         */
        var addDetailsForNode = function(node) {
            node.details = {};
            var dependsOn = getDetailCascade(node, 'dependsOn');
            if (dependsOn.length > 0) {
                node.details.Dependencies = dependsOn.map(getValueAndAncestor);
            }
            if (node.dependents) {
                node.details.Dependents = node.dependents;
            }
            var technos = getDetailCascade(node, 'technos');
            if (technos.length > 0) {
                node.details.Technos = technos.map(getValueAndAncestor);
            }
            if (node.host) {
                node.details.Host = [];
                for (var i in node.host) {
                    node.details.Host.push(i);
                }
            }

            return node;
        };

        var getDetailCascade = function(node, detailName, via) {
            var values = [];
            if (node[detailName]) {
                node[detailName].forEach(function(value) {
                    values.push({
                        value: value,
                        via: via
                    });
                });
            }
            if (node.parent) {
                values = values.concat(getDetailCascade(node.parent, detailName, node.parent.name));
            }
            return values;
        };

        var getValueAndAncestor = function(detail) {
            return detail.via ? detail.value + ' (' + detail.via + ')' : detail.value;
        };

        addParent(data);
        addDependents(data);
        addDetails(data);

        return data;
    }


    /**
     * Returns the node path
     * @param {Object} d
     * @returns {Array}
     */
    var getNodePath = function(node) {
        var path = [],
            current = node;

        do {
            path.push(current.name);
            current = current.parent;
        } while (typeof(current) !== 'undefined');

        return path.reverse();
    };

    var getNodeByName = function(name, data) {
        if (data.name === name) {
            return data;
        }
        if (!data.children) return null;
        for (var i = data.children.length - 1; i >= 0; i--) {
            var matchingNode = getNodeByName(name, data.children[i]);
            if (matchingNode) return matchingNode;
        }
    };

    // Events
    container
        .on('hoverNode', function(event) {
            $scope.node = getNodeByName(event.detail, $scope.data);
            $scope.detail = true;
            $scope.edit = false;
            $scope.$digest();
        })
        .on('selectNode', function(event) {
            $scope.enterEdit(event.detail);
            $scope.$digest();
        })
        .on('unSelectNode', function(event) {
            if ($scope.edit) {
                $scope.leaveEdit();
                $scope.$digest();
            }
        });

    $scope.enterEdit = function(name) {
        $scope.originalNode = getNodeByName(name, $scope.data);
        $scope.node = angular.copy($scope.originalNode);
        $scope.detail = false;
        $scope.edit = true;

        // have to keep the host keys in an array to manage edition
        $scope.hostKeys = {};
        angular.forEach($scope.node.host, function(value, key) {
            $scope.hostKeys[key] = key;
        });
    };

    $scope.leaveEdit = function() {
        $scope.node = angular.copy($scope.originalNode);
        $scope.detail = true;
        $scope.edit = false;
        bus.emit('unselect');
    };

    $scope.editNode = function(form, $event) {
        $event.preventDefault();

        angular.forEach($scope.hostKeys, function(value, key) {
            if (value !== key) {
                $scope.node.host[value] = angular.copy($scope.node.host[key]);
                delete $scope.node.host[key];
            }
        });

        data.updateNode($scope.originalNode.name, $scope.node);
        data.emitRefresh();

        $scope.node = getNodeByName($scope.node.name, $scope.data);
        $scope.detail = true;
        $scope.edit = false;
    };

    $scope.deleteNode = function() {
        if (!$window.confirm('Are you sure you want to delete that node?')) return;
        data.removeNode($scope.originalNode.name);
        data.emitRefresh();

        $scope.detail = false;
        $scope.edit = false;
    };

    $scope.moveNode = function() {
        var dest = $window.prompt('Please type the name of the parent node to move to');
        data.moveNode($scope.originalNode.name, dest);
        data.emitRefresh();

        $timeout(function() {
            bus.emit('select', $scope.originalNode.name);
        });
    };

    $scope.addNode = function() {
        data.addNode($scope.originalNode.name);
        data.emitRefresh();

        $timeout(function() {
            bus.emit('select', 'New node');
        });
    };

    $scope.addDependency = function() {
        if (typeof($scope.node.dependsOn) === 'undefined') {
            $scope.node.dependsOn = [];
        }
        $scope.node.dependsOn.push('');
    };

    $scope.deleteDependency = function(index) {
        $scope.node.dependsOn.splice(index, 1);
    };

    $scope.addTechno = function() {
        if (typeof($scope.node.technos) === 'undefined') {
            $scope.node.technos = [];
        }
        $scope.node.technos.push('');
    };

    $scope.deleteTechno = function(index) {
        $scope.node.technos.splice(index, 1);
    };

    $scope.addHost = function(key) {
        if (typeof($scope.node.host[key]) === 'undefined') {
            $scope.node.host[key] = [];
        }
        $scope.node.host[key].push('');
    };

    $scope.deleteHost = function(key, index) {
        $scope.node.host[key].splice(index, 1);
    };

    $scope.addHostCategory = function() {
        if (typeof($scope.node.host) === 'undefined') {
            $scope.node.host = {};
        }
        $scope.node.host[''] = [];
        $scope.hostKeys[''] = '';
    };

    $scope.deleteHostCategory = function(key) {
        delete $scope.hostKeys[key];
        delete $scope.node.host[key];
    };
}]);

angular.module('adf.widget.treewidget').controller('jsonDataCtrl', ['$scope', 'bus', 'data', function($scope, bus, data) {
    

    var previousData;

    bus.on('updateData', function(data) {
        previousData = data;
        $scope.data = JSON.stringify(data, undefined, 2);
    });

    $scope.updateData = function() {
        var newData = JSON.parse($scope.data);
        if (!angular.equals(newData, previousData)) {
            data.setJsonData(newData);
        }
    };

}]);

angular.module('adf.widget.treewidget').directive('initFocus', function() {
    var timer;

    return function(scope, elm, attr) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(function() {
            elm[0].focus();
        }, 0);
    };
});

angular.module('adf.widget.treewidget').controller('filterCtrl', ['$scope', 'bus', function($scope, bus) {
    

    bus.on('updateData', function(data) {
        $scope.technos = computeTechnos(data);
        $scope.hosts = computeHosts(data);
    });

    $scope.nameFilter = '';

    var technosFilter = [];
    var hostsFilter = [];

    $scope.$watch('nameFilter', function(name) {
        bus.emit('nameFilterChange', name);
    });

    $scope.toggleTechnoFilter = function(techno) {
        if ($scope.isTechnoInFilter(techno)) {
            technosFilter.splice(technosFilter.indexOf(techno), 1);
        } else {
            technosFilter.push(techno);
        }
        bus.emit('technosFilterChange', technosFilter);
    };

    $scope.isTechnoInFilter = function(techno) {
        return technosFilter.indexOf(techno) !== -1;
    };

    $scope.toggleHostFilter = function(host) {
        if ($scope.isHostInFilter(host)) {
            hostsFilter.splice(hostsFilter.indexOf(host), 1);
        } else {
            hostsFilter.push(host);
        }
        bus.emit('hostsFilterChange', hostsFilter);
    };

    $scope.isHostInFilter = function(host) {
        return hostsFilter.indexOf(host) !== -1;
    };

    function computeTechnos(rootNode) {
        var technos = [];

        function addNodeTechnos(node) {
            if (node.technos) {
                node.technos.forEach(function(techno) {
                    technos[techno] = true;
                });
            }
            if (node.children) {
                node.children.forEach(function(childNode) {
                    addNodeTechnos(childNode);
                });
            }
        }

        addNodeTechnos(rootNode);

        return Object.keys(technos).sort();
    }

    function computeHosts(rootNode) {
        var hosts = {};

        function addNodeHosts(node) {
            if (node.host) {
                for (var i in node.host) {
                    hosts[i] = true;
                }
            }
            if (node.children) {
                node.children.forEach(function(childNode) {
                    addNodeHosts(childNode);
                });
            }
        }

        addNodeHosts(rootNode);

        return Object.keys(hosts).sort();
    }

}]);

angular.module('adf.widget.treewidget').service('data', ['$http', '$q', 'bus', 'config', function($http, $q, bus, config) {
    

    var jsonData;

    /**
     * Get the tree object from json file
     * @returns {Promise}
     */
    var fetchJsonData = function() {
        if (typeof(jsonData) !== 'undefined') {
            return $q.when(jsonData);
        } else if (!config.url) {
            return $http.get('/llp_core/data.json').success(function(data) {
                setJsonData(data);
                return data;
            })
        } else {
            return $http.get(config.url).success(function(data) {
                setJsonData(data);
                return data;
            });
        }
    };

    var emitRefresh = function() {
        bus.emit('updateData', jsonData);
    };

    /**
     * Get the tree object
     */
    var getJsonData = function() {
        return jsonData;
    };

    /**
     * Set the tree object
     */
    var setJsonData = function(data) {
        jsonData = data;
        emitRefresh();
    };

    var getNodeByName = function(name, data) {
        data = data || jsonData;
        if (data.name === name) {
            return data;
        }
        if (!data.children) return null;
        for (var i = data.children.length - 1; i >= 0; i--) {
            var matchingNode = getNodeByName(name, data.children[i]);
            if (matchingNode) return matchingNode;
        }
    };

    var getParentNodeByName = function(name, data) {
        data = data || jsonData;
        if (!data.children) return null;
        for (var i = data.children.length - 1; i >= 0; i--) {
            if (data.children[i].name === name) return data;
            var matchingNode = getParentNodeByName(name, data.children[i]);
            if (matchingNode) return matchingNode;
        }
    };

    /**
     * Update a node using another node data
     *
     * @param {Array}  path e.g. ['foo', 'bar', 'baz']
     * @param {Object} updatedNode New node data to use
     * @param {Object} cursor
     */
    var updateNode = function(name, updatedNode) {
        var node = getNodeByName(name);
        updateDependencies(node.name, updatedNode.name);
        for (var i in updatedNode) {
            if (updatedNode.hasOwnProperty(i) && i !== 'children' && i !== 'parent' && i !== 'details') {
                node[i] = updatedNode[i];
            }
        }
    };

    /**
     * Updates a name in the tree dependencies
     * @param {String} name
     * @param {String} newName
     * @param {Object} cursor
     */
    var updateDependencies = function(name, newName, cursor) {
        cursor = cursor || jsonData;

        updateNodeDependency(name, newName, cursor);

        if (typeof(cursor.children) !== 'undefined' && cursor.children.length) {
            cursor.children.forEach(function(child) {
                updateDependencies(name, newName, child);
            });
        }
    };

    /**
     * Function destined to be used in array.map()
     */
    var removeDependencies = function(name) {
        updateDependencies(name);
    };

    /**
     * Update or remove one element in a node's dependencies
     *
     * @param {String} name
     * @param {String} newName
     * @param {Object} node
     */
    var updateNodeDependency = function(name, newName, node) {
        if (typeof(node.dependsOn) === 'undefined') {
            return;
        }
        var pos = node.dependsOn.indexOf(name);
        if (pos === -1) return;
        if (newName) {
            // rename dependency
            node.dependsOn[pos] = newName;
        } else {
            // remove dependency
            node.dependsOn.splice(pos, 1);
        }
    };

    /**
     * Adds a child node to the specified node name
     */
    var addNode = function(name, newNode) {
        newNode = newNode || {
            name: 'New node'
        };
        var node = getNodeByName(name);
        if (!node.children) {
            node.children = [];
        }
        node.children.push(newNode);
    };

    /**
     * Removes a node in the tree
     */
    var removeNode = function(name) {
        var parentNode = getParentNodeByName(name);
        if (!parentNode) return false;
        for (var i = 0, length = parentNode.children.length; i < length; i++) {
            var child = parentNode.children[i];
            if (child.name === name) {
                // we're in the final Node
                // remove the node (and children) from dependencies
                getBranchNames(child).map(removeDependencies);
                // remove the node
                return parentNode.children.splice(i, 1);
            }
        }
    };

    /**
     * Move anode under another parent
     */
    var moveNode = function(nodeName, newParentNodeName) {
        var removedNodes = removeNode(nodeName);
        if (!removedNodes || removedNodes.length === 0) return false;
        addNode(newParentNodeName, removedNodes[0]);
    };

    /**
     * Get an array of all the names in the branch
     * Including branch root name, and all descendents names
     */
    var getBranchNames = function(node) {
        var names = [node.name];
        if (node.children) {
            node.children.forEach(function(child) {
                names = names.concat(getBranchNames(child));
            });
        }
        return names;
    };

    return {
        fetchJsonData: fetchJsonData,
        getJsonData: getJsonData,
        setJsonData: setJsonData,
        emitRefresh: emitRefresh,
        getNodeByName: getNodeByName,
        updateNode: updateNode,
        addNode: addNode,
        removeNode: removeNode,
        moveNode: moveNode
    };
}]);



d3.chart = d3.chart || {};

d3.chart.architectureTree = function() {

    var svg, tree, treeData, diameter, activeNode;

    /**
     * Build the chart
     */
    function chart() {
        if (typeof(tree) === 'undefined') {
            tree = d3.layout.tree()
                .size([360, diameter / 2 - 120])
                .separation(function(a, b) {
                    return (a.parent == b.parent ? 1 : 2) / a.depth;
                });

            svg = d3.select("#graph").append("svg")
                .attr("width", diameter)
                .attr("height", diameter)
                .append("g")
                .attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");
        }

        var nodes = tree.nodes(treeData),
            links = tree.links(nodes);

        activeNode = null;

        svg.call(updateData, nodes, links);
    }

    /**
     * Update the chart data
     * @param {Object} container
     * @param {Array}  nodes
     */
    var updateData = function(container, nodes, links) {

        // Enrich data
        addDependents(nodes);
        nodes.map(function(node) {
            addIndex(node);
        });

        var diagonal = d3.svg.diagonal.radial()
            .projection(function(d) {
                return [d.y, d.x / 180 * Math.PI];
            });

        var linkSelection = svg.selectAll(".link").data(links, function(d) {
            return d.source.name + d.target.name + Math.random();
        });
        linkSelection.exit().remove();

        linkSelection.enter().append("path")
            .attr("class", "link")
            .attr("d", diagonal);

        var nodeSelection = container.selectAll(".node").data(nodes, function(d) {
            return d.name + Math.random(); // always update node
        });
        nodeSelection.exit().remove();

        var node = nodeSelection.enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "rotate(" + (d.x - 90) + ")translate(" + d.y + ")";
            })
            .on('mouseover', function(d) {
                if (activeNode !== null) {
                    return;
                }
                fade(0.1)(d);
                document.querySelector('#panel').dispatchEvent(
                    new CustomEvent("hoverNode", {
                        "detail": d.name
                    })
                );
            })
            .on('mouseout', function(d) {
                if (activeNode !== null) {
                    return;
                }
                fade(1)(d);
            })
            .on('click', function(d) {
                select(d.name);
            });

        node.append("circle")
            .attr("r", function(d) {
                return 4.5 * (d.size || 1);
            })
            .style('stroke', function(d) {
                return d3.scale.linear()
                    .domain([1, 0])
                    .range(["steelblue", "red"])(typeof d.satisfaction !== "undefined" ? d.satisfaction : 1);
            })
            .style('fill', function(d) {
                if (typeof d.satisfaction === "undefined") return '#fff';
                return d3.scale.linear()
                    .domain([1, 0])
                    .range(["white", "#f66"])(typeof d.satisfaction !== "undefined" ? d.satisfaction : 1);
            });

        node.append("text")
            .attr("dy", ".31em")
            .attr("text-anchor", function(d) {
                return d.x < 180 ? "start" : "end";
            })
            .attr("transform", function(d) {
                return d.x < 180 ? "translate(8)" : "rotate(180)translate(-8)";
            })
            .text(function(d) {
                return d.name;
            });
    };

    /**
     * Add the node dependents in the tree
     * @param {Array} nodes
     */
    var addDependents = function(nodes) {
        var dependents = [];
        nodes.forEach(function(node) {
            if (node.dependsOn) {
                node.dependsOn.forEach(function(dependsOn) {
                    if (!dependents[dependsOn]) {
                        dependents[dependsOn] = [];
                    }
                    dependents[dependsOn].push(node.name);
                });
            }
        });
        nodes.forEach(function(node, index) {
            if (dependents[node.name]) {
                nodes[index].dependents = dependents[node.name];
            }
        });
    };

    /**
     * Add indices to a node, including inherited ones.
     *
     * Mutates the given node (datum).
     *
     * Example added properties:
     * {
     *   index: {
     *     relatedNodes: ["Foo", "Bar", "Baz", "Buzz"],
     *     technos: ["Foo", "Bar"],
     *     host: ["OVH", "fo"] 
     *   }
     * }
     */
    var addIndex = function(node) {
        node.index = {
            relatedNodes: [],
            technos: [],
            hosts: []
        };
        var dependsOn = getDetailCascade(node, 'dependsOn');
        if (dependsOn.length > 0) {
            node.index.relatedNodes = node.index.relatedNodes.concat(dependsOn);
        }
        if (node.dependents) {
            node.index.relatedNodes = node.index.relatedNodes.concat(node.dependents);
        }
        var technos = getDetailCascade(node, 'technos');
        if (technos.length > 0) {
            node.index.technos = technos;
        }
        var hosts = getHostsCascade(node);
        if (hosts.length > 0) {
            node.index.hosts = hosts;
        }
    };

    var getDetailCascade = function(node, detailName) {
        var values = [];
        if (node[detailName]) {
            node[detailName].forEach(function(value) {
                values.push(value);
            });
        }
        if (node.parent) {
            values = values.concat(getDetailCascade(node.parent, detailName));
        }
        return values;
    };

    var getHostsCascade = function(node) {
        var values = [];
        if (node.host) {
            for (var i in node.host) {
                values.push(i);
            }
        }
        if (node.parent) {
            values = values.concat(getHostsCascade(node.parent));
        }
        return values;
    };

    var fade = function(opacity) {
        return function(node) {
            //if (!node.dependsOn || !(node.parent && node.parent.dependsOn)) return;
            svg.selectAll(".node")
                .filter(function(d) {
                    if (d.name === node.name) return false;
                    return node.index.relatedNodes.indexOf(d.name) === -1;
                })
                .transition()
                .style("opacity", opacity);
        };
    };

    var filters = {
        name: '',
        technos: [],
        hosts: []
    };

    var isFoundByFilter = function(d) {
        var i;
        if (!filters.name && !filters.technos.length && !filters.hosts.length) {
            // nothing selected
            return true;
        }
        if (filters.name) {
            if (d.name.toLowerCase().indexOf(filters.name) === -1) return false;
        }
        var technosCount = filters.technos.length;
        if (technosCount) {
            if (d.index.technos.length === 0) return false;
            for (i = 0; i < technosCount; i++) {
                if (d.index.technos.indexOf(filters.technos[i]) === -1) return false;
            }
        }
        var hostCount = filters.hosts.length;
        if (hostCount) {
            if (d.index.hosts.length === 0) return false;
            for (i = 0; i < hostCount; i++) {
                if (d.index.hosts.indexOf(filters.hosts[i]) === -1) return false;
            }
        }
        return true;
    };

    var refreshFilters = function() {
        d3.selectAll('.node').classed('notFound', function(d) {
            return !isFoundByFilter(d);
        });
    };

    var select = function(name) {
        if (activeNode && activeNode.name == name) {
            unselect();
            return;
        }
        unselect();
        svg.selectAll(".node")
            .filter(function(d) {
                if (d.name === name) return true;
            })
            .each(function(d) {
                document.querySelector('#panel').dispatchEvent(
                    new CustomEvent("selectNode", {
                        "detail": d.name
                    })
                );
                d3.select(this).attr("id", "node-active");
                activeNode = d;
                fade(0.1)(d);
            });
    };

    var unselect = function() {
        if (activeNode == null) return;
        fade(1)(activeNode);
        d3.select('#node-active').attr("id", null);
        activeNode = null;
        document.querySelector('#panel').dispatchEvent(
            new CustomEvent("unSelectNode")
        );
    };

    chart.select = select;
    chart.unselect = unselect;

    chart.data = function(value) {
        if (!arguments.length) return treeData;
        treeData = value;
        return chart;
    };

    chart.diameter = function(value) {
        if (!arguments.length) return diameter;
        diameter = value;
        return chart;
    };

    chart.nameFilter = function(nameFilter) {
        filters.name = nameFilter;
        refreshFilters();
    };

    chart.technosFilter = function(technosFilter) {
        filters.technos = technosFilter;
        refreshFilters();
    };

    chart.hostsFilter = function(hostsFilter) {
        filters.hosts = hostsFilter;
        refreshFilters();
    };

    return chart;
};

angular.module('adf.widget.treewidget').controller('chartCtrl', ['$scope', 'bus', function($scope, bus) {
    

    bus.on('updateData', function(data) {
        $scope.data = angular.copy(data);
    });
}]);

/*services/bus.js*/

angular.module('adf.widget.treewidget').service('bus', ['$http', '$q', function($http, $q) {
    

    // Simple message bus to event the overhead of angular emit / broadcast

    var subscribers = {};

    var on = function(eventName, callback) {
        if (!subscribers[eventName]) {
            subscribers[eventName] = [];
        }
        subscribers[eventName].push(callback);
    };

    var emit = function(eventName, body) {
        if (!subscribers[eventName]) {
            return false;
        }
        subscribers[eventName].forEach(function(callback) {
            callback(body);
        });
        return true;
    };

    return {
        on: on,
        emit: emit
    };
}]);

angular.module('adf.widget.treewidget')
    .run(['data', function(data) {
        data.fetchJsonData().then(function(response) {
            console.log('data loaded');
        }, console.error);
    }]);
})(window);