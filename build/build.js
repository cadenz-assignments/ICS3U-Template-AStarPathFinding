var gridSize = 20;
var canvasSize = 300;
var cellSize = canvasSize / gridSize;
var grid = new Array();
var openSet = new Array();
var closedSet = new Array();
var path = new Array();
var startCell;
var endCell;
function setup() {
    console.log("Initializing");
    createCanvas(canvasSize, canvasSize);
    Helper.setupGrid();
    Helper.initPath(0, 0, gridSize - 1, gridSize - 1);
}
function draw() {
    background(0);
    grid.forEach(function (column) { return column.forEach(function (cell) { return cell.show(255); }); });
    openSet.forEach(function (cell) { return cell.show(color(0, 255, 0)); });
    closedSet.forEach(function (cell) { return cell.show(color(255, 0, 0)); });
    path.forEach(function (cell) { return cell.show(color(0, 0, 255)); });
    if (openSet.length > 0) {
        var winningIndex_1 = 0;
        openSet.forEach(function (cell) {
            if (cell.fCost < openSet[winningIndex_1].fCost) {
                winningIndex_1 = openSet.indexOf(cell);
            }
        });
        var winningCell_1 = openSet[winningIndex_1];
        path = [];
        Helper.retracePath(winningCell_1, path);
        if (winningCell_1 == endCell) {
            console.log("We have reached the end");
            path = [];
            Helper.retracePath(winningCell_1, path);
            path.push(endCell);
            openSet = [];
            closedSet = [];
            return;
        }
        openSet = openSet.filter(function (cell) { return cell != winningCell_1; });
        closedSet.push(winningCell_1);
        var neighbors = Helper.getNeighbors(winningCell_1);
        neighbors.forEach(function (neighbor) {
            if (closedSet.indexOf(neighbor) == -1) {
                var tempG = winningCell_1.gCost + Helper.heuristic(neighbor, winningCell_1);
                var newG = false;
                if (openSet.indexOf(neighbor) != -1) {
                    if (tempG < neighbor.gCost) {
                        neighbor.gCost = tempG;
                        newG = true;
                    }
                }
                else {
                    neighbor.gCost = tempG;
                    newG = true;
                    openSet.push(neighbor);
                }
                if (newG) {
                    neighbor.hCost = Helper.heuristic(neighbor, endCell);
                    neighbor.fCost = neighbor.gCost + neighbor.hCost;
                    neighbor.parent = winningCell_1;
                }
            }
        });
    }
}
var Helper;
(function (Helper) {
    function heuristic(cell1, cell2) {
        return dist(cell1.x, cell1.y, cell2.x, cell2.y);
    }
    Helper.heuristic = heuristic;
    function setupGrid() {
        for (var i = 0; i < gridSize; i++) {
            var column = new Array();
            for (var j = 0; j < gridSize; j++) {
                column.push(new Cell(i, j));
            }
            grid.push(column);
        }
    }
    Helper.setupGrid = setupGrid;
    function getNeighbors(cell) {
        var neighbors = new Array();
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) {
                    continue;
                }
                if (Math.abs(i) + Math.abs(j) > 1) {
                    continue;
                }
                var x = cell.x + i;
                var y = cell.y + j;
                if (!isValidPosition(x, y))
                    continue;
                neighbors.push(grid[x][y]);
            }
        }
        return neighbors;
    }
    Helper.getNeighbors = getNeighbors;
    function initPath(x1, y1, x2, y2) {
        if (!isValidPosition(x1, y1) || !isValidPosition(x2, y2)) {
            console.log("Position given is not valid");
            return;
        }
        startCell = grid[x1][y1];
        endCell = grid[y2][y2];
        openSet = [];
        closedSet = [];
        openSet.push(startCell);
    }
    Helper.initPath = initPath;
    function isValidPosition(x, y) {
        return x >= 0 && x < gridSize && y >= 0 && y < gridSize;
    }
    Helper.isValidPosition = isValidPosition;
    function retracePath(baseNode, parents) {
        if (baseNode.parent == null) {
            parents.push(baseNode);
            return;
        }
        parents.push(baseNode.parent);
        retracePath(baseNode.parent, parents);
    }
    Helper.retracePath = retracePath;
})(Helper || (Helper = {}));
var Cell = (function () {
    function Cell(x, y) {
        this.x = x;
        this.y = y;
        this.fCost = 0;
        this.gCost = 0;
        this.hCost = 0;
        this.parent = null;
    }
    Cell.prototype.show = function (color) {
        fill(color);
        rect(this.x * cellSize, this.y * cellSize, cellSize, cellSize);
    };
    return Cell;
}());
//# sourceMappingURL=build.js.map