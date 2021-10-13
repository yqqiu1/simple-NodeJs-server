'use strict';
var http = require('http');
var port = process.env.PORT || 8080;
var fs = require("fs");

http.createServer(function (req, res) {

    fs.readFile(__dirname + "/" + "categories.json", 'utf8', function (err, data) {

        if (err) {
            throw err;
        }

        var nodes = JSON.parse(data);
        var tree = constructTree(nodes)

        res.writeHead(200, { 'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
        res.end(JSON.stringify(tree));

    });
}).listen(port, () => {
    console.log("Server started at port: " + port);
});

function constructTree(nodes) {

    // The root node wasn't defined in categories.json, so I hard coded it
    // var rootNode = null;
    var rootNode = {
        categoryId: "root",
        name: "Root Category",
        parent: null
    }

    // record every nodes to a parent:[children] map
    var mapTable = {};
    nodes.forEach(function (node) {
        // if (node[parent] = null) { rootNode = node; }
        if (node["parent"] in mapTable) {
            mapTable[node["parent"]].push(node);
        } else {
            mapTable[node["parent"]] = [node];
        }
    });

    // construct the tree through iteration
    return singleIteration(rootNode);

    function singleIteration(node) {
        var childrenNodes = [];

        if (node["categoryId"] in mapTable) { //if have any child node

            // construct every children branch
            mapTable[node["categoryId"]].forEach(function(childNode) {
                childrenNodes.push(singleIteration(childNode));
            })
        }

        // and record them to the children field
        node["children"] = childrenNodes;
        return node;
    }

}