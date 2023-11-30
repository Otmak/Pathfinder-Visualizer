//By Otuma.
const textOfCoodinate = document.getElementById('text');
const canvas = document.getElementById("canvas");
const getButtons = document.getElementById("algorithms");
const gridSizeSelected = document.getElementById("grid-selected");
const ctx = canvas.getContext("2d");

const canvasHeight = 960; // 960 = 80,60,40,30,20
const canvasWidth = 960;
canvas.height = canvasHeight;
canvas.width = canvasWidth;
let startNode;
let selectedAlgorithm;
let gridSize;
let n = 30;
let nth = canvasWidth/n;
const cellSize = (x, h)=> h/x;
let isMousedown = false;
let algorithmHasran = false;
let isOkayToRun = true;
let setOfMouseDownNodes = {}
let GRID;
let theGoal;
let movingStart = false;
let movingGoal = false;


function clearAndStartGrid(){

    ctx.clearRect(0,0, canvas.width, canvas.height);
    GRID = new Grid(ctx, canvasHeight, canvasWidth, n, n, cellSize(n,canvasHeight));
    GRID.draw(0,0);
    isOkayToRun = false;
    algorithmHasran = false;
}
clearAndStartGrid();


function clearCells(){
    return GRID.clearAllNodes();
};


gridSizeSelected.addEventListener('change',(e)=>{
    n = Number(e.target.value);
    const cell = cellSize(n,canvasHeight);
    clearAndStartGrid();

    setTheGoal(canvasWidth-cell, canvasWidth-cell);
    setStartingPoint(cell,cell);
})


getButtons.addEventListener('click',(e)=>{
    if(e.target.nodeName === 'INPUT'){
        selectedAlgorithm = e.target.value;
    };
});


canvas.addEventListener('click', (e)=>{
    isOkayToRun =true;
    const {x, y, node} = getXYandNodeOnEvent(e);
    if(e.shiftKey){
        return setTheGoal(x,y);
    };
    if(e.altKey){
        return setStartingPoint(x,y)
    };
    if(!node.goal){
        wallOrWeightOrClear(node)
    };
});


function wallOrWeightOrClear(node){

    // if(node.weight > 1 && !node.wall || node.start ){
    //     node.weight = 1;
    //     node.start = false;
    //     g.clearNode(node.x, node.y)
    //     return;
    // }
if(node.weight > 1 && !node.wall  ){
        node.weight = 1;
        node.start = false;
        node.weighted = false;
        GRID.clearNode(node.x, node.y)
        return;
    };

    if(!node.isTraversable ){
        let addWeight = node.weight + Math.random() * 10;
        node.isTraversable = true;
        node.weight = addWeight;
        node.weighted = true;
        GRID.paintNode(node.x, node.y, '#61aa55')
        return ;
    };

    if(node.weight==1 ){
        node.isTraversable = false;
        GRID.paintNode(node.x, node.y, '#584846')
        return;
    };
};


canvas.addEventListener('mousedown',(e)=>{
    const {x, y, node} = getXYandNodeOnEvent(e);
    isMousedown = true;

      if(node.start){
        movingStart = true;
        node.start = false;
        GRID.clearNode(x,y)
        // canvas.style.cursor = 'grabbing';
    };
    if (node.goal){
        movingGoal = true;
        node.goal = false;
        GRID.clearNode(x,y)
    }
});


canvas.addEventListener('mousemove', (e)=>{
    textOfCoodinate.innerText = `x:${e.x}  y:${e.y}`;
    const {x, y, node} = getXYandNodeOnEvent(e);
    if(isMousedown&& !movingGoal && !movingStart ){
        node.isTraversable = false;
        GRID.paintNode(x, y, '#665351');
        // wallOrWeightOrClear(node);
    };

    if (node.start || node.goal){
        canvas.style.cursor = 'grab';
    }else{
        canvas.style.cursor = 'pointer';
    };

    if(movingStart){
        canvas.style.cursor = 'grabbing';
        setStartingPoint(x,y)
        node.color = '';
        node.start = false;
        GRID.paintNode(x, y, 'purple')
        setTimeout(()=>{
            GRID.clearNode(x,y)
        }, 2);
    };

    if(movingGoal){
        canvas.style.cursor = 'grabbing';
        setTheGoal(x,y);
        node.color = '';
        node.goal = false;
        GRID.paintNode(x, y, 'red')
        setTimeout(()=>{
            GRID.clearNode(x,y)
        }, 2);
    };
});


canvas.addEventListener('mouseup', (e)=>{
    const {x,y,node} = getXYandNodeOnEvent(e);
    isMousedown = false;
    if(movingStart){

        GRID.paintNode(x, y, 'purple');
        node.start = true;
        setStartingPoint(x,y);
        movingStart =false;
    };
    if(movingGoal){
        GRID.paintNode(x, y, 'red');
        node.goal = true;
        setTheGoal(x,y);
        movingGoal =false;
    };
});


function getXYandNodeOnEvent(event){
    let x = roundToNearestNTH(event.x); // DRY
    let y = roundToNearestNTH(event.y);
    let node = GRID.getNode(x,y);
    return{
        x:x,
        y:y,
        node:node
    };
};


// Round to the lowest nth.
function roundToNearestNTH(num){
    const NTH = cellSize(n,canvasHeight);
    return num < Math.round(num /NTH)*NTH ? Math.round(num /NTH)*NTH -NTH  : Math.round(num /NTH)*NTH;
}


function setStartingPoint(x,y){
    startNode = GRID.getNode(x,y);
    startNode.start =true;
    GRID.paintNode(x, y, 'purple');
};
setStartingPoint(nth,nth);


function setTheGoal(x,y){
    theGoal = GRID.getNode(x,y);
    theGoal.goal =true;
    GRID.paintNode(x, y, 'red');
};
setTheGoal(canvasWidth-nth, canvasWidth-nth);


// Depth first Search algorithm.
function dfs(node){
    algorithmHasran = true;
    let frontier  = new Stack()
    frontier.push(node);
    let explored = {}

    function runDFS(){
        if(!frontier.isEmpty() && isOkayToRun){
            let currentNode = frontier.pop();
            GRID.paintNode(currentNode.x, currentNode.y, '#1aafc2')// 837695 1aadc0
            if(currentNode.goal){
                return getPath(currentNode);;
            };
            const successors = currentNode.getNeighbours()
            for(let i = 0; i < successors.length; i++){
                let [x,y] = successors[i];
                let getNeighbourLocation = String([x,y]);
                let neighbour = GRID.getNode(x,y);
                if(explored[getNeighbourLocation]){
                    continue ;
                };
                if(neighbour && neighbour.isTraversable){
                    neighbour.parent = currentNode
                    GRID.paintNode(neighbour.x, neighbour.y, '#9f95ad')
                    frontier.push(neighbour)
                    explored[getNeighbourLocation] = getNeighbourLocation;
                };
            };
            setTimeout(runDFS, 10)
        };
    };
    runDFS();
};


// Breadth first Search algorithm.
function bfs(node){
    algorithmHasran = true;
    let frontier  = new Queue()
    frontier.enqueue(node);
    let explored = {}

    function runBFS(){
        if(!frontier.isEmpty() && isOkayToRun){
            let currentNode = frontier.dequeue()
            GRID.paintNode(currentNode.x, currentNode.y, '#1aadc0');
            if(currentNode.goal){
                return getPath(currentNode);
            };
            const successors = currentNode.getNeighbours();
            for(let i = 0; i < successors.length; i++){
                let [x,y] = successors[i];
                let getNeighbourLocation = String([x,y]);
                let neighbour = GRID.getNode(x,y);
                if(explored[getNeighbourLocation]){
                    continue;
                };
                if(neighbour && neighbour.isTraversable){
                    neighbour.parent = currentNode
                    GRID.paintNode(neighbour.x, neighbour.y, '#9f95ad')
                    frontier.enqueue(neighbour)
                    explored[getNeighbourLocation] = getNeighbourLocation;
                };
            };
            setTimeout(runBFS, 8)
        };
    };
    runBFS();
};


// Dijkstra algorithm.
function dijkstra(node){
    algorithmHasran = true;
    let frontier  = new PriorityQueue();
    frontier.enqueue(node, node.weight);
    let costSoFar = {}

    function runDijkstra(){
        if(!frontier.isEmpty() && isOkayToRun){
            let currentWeightedNode = frontier.dequeue();
            let currentNode = currentWeightedNode.value;
            let currentWeight = currentWeightedNode.priority
            GRID.paintNode(currentNode.x, currentNode.y, '#1aadc0')
            if(currentNode.goal){
                return getPath(currentNode);
            };

            const successors = currentNode.getNeighbours();
            for(let i = 0; i < successors.length; i++){
                let [x,y] = successors[i];
                let getNeighbourLocation = String([x,y]);
                let neighbour = GRID.getNode(x,y);
                let newCost = neighbour ? currentWeight + neighbour.weight : 0;

                if( (neighbour && neighbour.isTraversable) && (!costSoFar[getNeighbourLocation] || newCost < neighbour.weight) ){
                    neighbour.parent = currentNode
                    GRID.paintNode(neighbour.x, neighbour.y, '#9f95ad')

                    frontier.enqueue(neighbour, newCost)
                    costSoFar[getNeighbourLocation] = newCost;
                };
            };
            setTimeout(runDijkstra, 8)
        };
    };
    runDijkstra();
};


// Manhatan distance calc.
function heuristic(a,b){
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};


// A* algorithm
function astar(node){
    algorithmHasran = true;
    let frontier  = new PriorityQueue()
    frontier.enqueue(node, 0);
    let costSoFar = {}

    function runAstart(){
        if(!frontier.isEmpty() && isOkayToRun){
            let currentWeightedNode = frontier.dequeue();
            let currentNode = currentWeightedNode.value;
            let currentWeight = currentWeightedNode.priority
            GRID.paintNode(currentNode.x, currentNode.y, '#1aadc0');
            if(currentNode.goal){
                return getPath(currentNode);
            };

            const successors = currentNode.getNeighbours();
            for(let i = 0; i < successors.length; i++){
                let [x,y] = successors[i];
                let getNeighbourLocation = String([x,y]);
                let neighbour = GRID.getNode(x,y);
                let newCost = neighbour ? currentWeight + neighbour.weight : 1;

                if( (neighbour && neighbour.isTraversable) && (!costSoFar[getNeighbourLocation] || newCost < costSoFar[getNeighbourLocation]) ){

                    neighbour.parent = currentNode
                    GRID.paintNode(neighbour.x, neighbour.y, '#9f95ad');
                    let priority = newCost + heuristic(theGoal, neighbour);
                    frontier.enqueue(neighbour, priority)
                    costSoFar[getNeighbourLocation] = newCost;
                };
            };
            setTimeout(runAstart, 8);
        };
    };
    runAstart();
};


// Greedy best first Search algorithm.
function greedyBestFirstSearch(node){
    algorithmHasran = true;
    let frontier  = new PriorityQueue()
    frontier.enqueue(node, node.weight);
    let costSoFar = {}

    function runGBFS(){
        if(!frontier.isEmpty() && isOkayToRun){
            let currentWeightedNode = frontier.dequeue();
            let currentNode = currentWeightedNode.value;
            let currentWeight = currentWeightedNode.priority
            GRID.paintNode(currentNode.x, currentNode.y, '#1aadc0')
            if(currentNode.goal){
                return getPath(currentNode);
            }

            const successors = currentNode.getNeighbours()
            for(let i = 0; i < successors.length; i++){
                let [x,y] = successors[i];
                let getNeighbourLocation = String([x,y]);
                let neighbour = GRID.getNode(x,y);
                let newCost = neighbour ? currentWeight + neighbour.weight : 0;

                if(costSoFar[getNeighbourLocation]){
                    continue;
                };
                if( (neighbour && neighbour.isTraversable) && !costSoFar[getNeighbourLocation]  ){
                    neighbour.parent = currentNode
                    GRID.paintNode(neighbour.x, neighbour.y, '#9f95ad');
                    let priority = heuristic(theGoal, neighbour);
                    frontier.enqueue(neighbour, priority)
                    costSoFar[getNeighbourLocation] = newCost;
                };
            };
            setTimeout(runGBFS, 40)
        };
    };
    runGBFS();
};


// Paint the shortest path.
function getPath(node){
    let currentNode = node
    if(currentNode.start){
        return;
    };
    if(node.parent){
        currentNode = node.parent
        GRID.paintNode(currentNode.x, currentNode.y, '#abba45')
        setTimeout(()=>{
            getPath(currentNode)
        }, 5)
        return;
    };
};


// Run seleected algorithm
function startPathfindingAlgorithm(){ // not scalable.
    if(algorithmHasran){
        algorithmHasran = false;
        isOkayToRun = false;
        return clearCells();
    };
    if(selectedAlgorithm){
        isOkayToRun =true;
        if(selectedAlgorithm === 'bfs'){
            return bfs(startNode);
        };
        if(selectedAlgorithm === 'dfs'){
            return dfs(startNode);
        };
        if(selectedAlgorithm === 'dijkstra'){
            return dijkstra(startNode);
        };
        // if(selectedAlgorithm === 'gbfs'){
        //     return greedyBestFirstSearch(startNode);
        // };
        if(selectedAlgorithm === 'astar'){
            return astar(startNode);
        };
        
    };
};


// const canvasBody = document.getElementById("canvas-div");
// const algoButtons = document.getElementById("algo-selection-button");
// const wMax = window.innerWidth;
// const wBSub = (wMax *10)/100;
// let wSub = (wMax * 80)/100 ;
// canvasBody.style.width = `${wSub}px`;
// algoButtons.style.width = `${wBSub}px`

