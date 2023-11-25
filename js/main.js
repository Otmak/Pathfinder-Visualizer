//By Otuma.
const textOfCoodinate = document.getElementById('text');
const canvas = document.getElementById("canvas");
const getButtons = document.getElementById("algorithms");
// const canvasBody = document.getElementById("canvas-div");
// const algoButtons = document.getElementById("algo-selection-button");
// const wMax = window.innerWidth;
// const wBSub = (wMax *10)/100;
// let wSub = (wMax * 80)/100 ;
// canvasBody.style.width = `${wSub}px`;
// algoButtons.style.width = `${wBSub}px`

const canvasHeight = 900;
const canvasWidth = 900;
canvas.height = canvasHeight;
canvas.width = canvasWidth;
const ctx = canvas.getContext("2d");
let startNode;
let selectedAlgorithm;
const nth = 30;
let isMousedown = false;
let algorithmHasran = false;
let isOkayToRun = true;
// 665351
let setOfMouseDownNodes = {}
let g;
let theGoal;

function clearAndStartGrid(){
	ctx.clearRect(0,0, canvas.width, canvas.height);
	g = new Grid(ctx, canvasHeight, canvasWidth, nth, nth);
	g.draw(0,0);
	isOkayToRun = false;
	algorithmHasran = false;
}
clearAndStartGrid();

function clearCells(){
	g.clearAllNodes();
}


getButtons.addEventListener('click',(e)=>{
	if(e.target.nodeName === 'INPUT'){
		selectedAlgorithm = e.target.value;
	}
});


canvas.addEventListener('click', (e)=>{
	isOkayToRun =true;
	let x = roundToNearestNTH(e.x);
	let y = roundToNearestNTH(e.y);
	let node = g.getNode(x, y);
	if(e.shiftKey){
		node.goal = true;
		theGoal = g.getNode(x,y);
		return g.paintNode(x, y, 'red');
	}
	if(e.altKey){
		return startingPoint(x,y)
	}
	if(!node.goal){
		wallOrWeightOrClear(node)
	}

});


function wallOrWeightOrClear(node){

	if(node.weight > 1 && !node.wall || node.start ){
		node.weight = 1;
		node.start = false;
		g.clearNode(node.x, node.y)
		return;
	}

	if(!node.isTraversable ){
		let addWeight = node.weight + Math.random() * 5;
		node.isTraversable = true;
		node.weight = addWeight;
		g.paintNode(node.x, node.y, '#61aa55')
		return ;
	}

	if(node.weight==1 ){
		node.isTraversable = false;
		g.paintNode(node.x, node.y, '#584846')
		return;
	}
};


canvas.addEventListener('mousemove', (e)=>{
	textOfCoodinate.innerText = `x:${e.x}  y:${e.y}`;
	let x = roundToNearestNTH(e.x);
	let y = roundToNearestNTH(e.y);
	let node = g.getNode(x, y);
	if(isMousedown&& !node.goal ){
		node.isTraversable = false;
		g.paintNode(x, y, '#665351');
		// wallOrWeightOrClear(node);
	}

});


canvas.addEventListener('mousedown',(e)=>{
	let x = roundToNearestNTH(e.x);
	let y = roundToNearestNTH(e.y);
	isMousedown = true;
})


canvas.addEventListener('mouseup', (e)=>{
		isMousedown = false;
});


// // Round to the lowest nth.
function roundToNearestNTH(num){
	return num < Math.round(num /nth)*nth ? Math.round(num /nth)*nth -nth  : Math.round(num /nth)*nth;
}


function startingPoint(x,y){
	startNode = g.getNode(x,y);
	startNode.start =true
	g.paintNode(x, y, 'purple')
}
startingPoint(420,300);


// Depth first Search algorithm.
function dfs(node){
	algorithmHasran = true;
	let frontier  = new Stack()
	frontier.push(node);
	let explored = {}
	let c;

	function runDFS(){
		if(!frontier.isEmpty() && isOkayToRun){
			let currentNode = frontier.pop();
			g.paintNode(currentNode.x, currentNode.y, '#1aafc2')// 837695 1aadc0
			if(currentNode.goal){
				return getPath(currentNode);;
			};
			const successors = currentNode.getNeighbours()
			for(let i = 0; i < successors.length; i++){
				let [x,y] = successors[i];
				c = String([x,y]);
				let neighbour = g.getNode(x,y);
				if(explored[c]){
					continue ;
				};
				if(neighbour && neighbour.isTraversable){
					neighbour.parent = currentNode
					g.paintNode(neighbour.x, neighbour.y, '#9f95ad')
					frontier.push(neighbour)
					explored[String([x,y])] = String([x,y]);
				};
			};
			setTimeout(runDFS, 40)
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
	let c;

	function runBFS(){
		if(!frontier.isEmpty() && isOkayToRun){
			let currentNode = frontier.dequeue()
			g.paintNode(currentNode.x, currentNode.y, '#1aadc0')
			if(currentNode.goal){
				return getPath(currentNode);
			};
			const successors = currentNode.getNeighbours()
			for(let i = 0; i < successors.length; i++){
				let [x,y] = successors[i];
				c = String([x,y]);
				let neighbour = g.getNode(x,y);
				if(explored[c]){
					continue;
				};
				if(neighbour && neighbour.isTraversable){
					neighbour.parent = currentNode
					g.paintNode(neighbour.x, neighbour.y, '#9f95ad')
					frontier.enqueue(neighbour)
					explored[String([x,y])] = String([x,y]);
				};
			};
			setTimeout(runBFS, 40)
		};
	};
	runBFS();
};


// Dijkstra algorithm.
function dijkstra(node){
	algorithmHasran = true;
	let frontier  = new PriorityQueue()
	frontier.enqueue(node, node.weight);
	let costSoFar = {}

	function runDijkstra(){
		if(!frontier.isEmpty() && isOkayToRun){
			let currentWeightedNode = frontier.dequeue();
			let currentNode = currentWeightedNode.value;
			let currentWeight = currentWeightedNode.priority
			g.paintNode(currentNode.x, currentNode.y, '#1aadc0')
			if(currentNode.goal){
				return getPath(currentNode);
			};

			const successors = currentNode.getNeighbours()
			for(let i = 0; i < successors.length; i++){
				let [x,y] = successors[i];
				let getLocation = String([x,y]);
				let neighbour = g.getNode(x,y);
				let newCost = neighbour ? currentWeight + neighbour.weight : 0;

				if( (neighbour && neighbour.isTraversable) && (!costSoFar[getLocation] || newCost < neighbour.weight) ){
					neighbour.parent = currentNode
					g.paintNode(neighbour.x, neighbour.y, '#9f95ad')

					frontier.enqueue(neighbour, newCost)
					costSoFar[getLocation] = newCost;
				};
			};
			setTimeout(runDijkstra, 40)
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
	frontier.enqueue(node, node.weight);
	let costSoFar = {}

	function runAstart(){
		if(!frontier.isEmpty() && isOkayToRun){
			let currentWeightedNode = frontier.dequeue();
			let currentNode = currentWeightedNode.value;
			let currentWeight = currentWeightedNode.priority
			g.paintNode(currentNode.x, currentNode.y, '#1aadc0');
			if(currentNode.goal){
				return getPath(currentNode);
			};

			const successors = currentNode.getNeighbours();
			for(let i = 0; i < successors.length; i++){
				let [x,y] = successors[i];
				let getNeighbourLocation = String([x,y]);
				let neighbour = g.getNode(x,y);
				let newCost = neighbour ? currentWeight + neighbour.weight : 0;

				if( (neighbour && neighbour.isTraversable) && (!costSoFar[getNeighbourLocation] || newCost < costSoFar[getNeighbourLocation]) ){

					neighbour.parent = currentNode
					g.paintNode(neighbour.x, neighbour.y, '#9f95ad');
					let priority = newCost + heuristic(theGoal, neighbour);
					frontier.enqueue(neighbour, priority)
					costSoFar[getNeighbourLocation] = newCost;
				};
			};
			setTimeout(runAstart, 40);
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
			g.paintNode(currentNode.x, currentNode.y, '#1aadc0')
			if(currentNode.goal){
				return getPath(currentNode);
			}

			const successors = currentNode.getNeighbours()
			for(let i = 0; i < successors.length; i++){
				let [x,y] = successors[i];
				let getNeighbourLocation = String([x,y]);
				let neighbour = g.getNode(x,y);
				let newCost = neighbour ? currentWeight + neighbour.weight : 0;

				if(costSoFar[getNeighbourLocation]){
					continue;
				};
				if( (neighbour && neighbour.isTraversable) && !costSoFar[getNeighbourLocation]  ){
					neighbour.parent = currentNode
					g.paintNode(neighbour.x, neighbour.y, '#9f95ad');
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
		g.paintNode(currentNode.x, currentNode.y, '#abba45')
		setTimeout(()=>{
			getPath(currentNode)
		}, 50)
		return;
	};
};


// Run seleected algorithm
function startPathfindingAlgorithm(){ // not scalable.
	if(algorithmHasran){
		algorithmHasran = false;
		return clearAndStartGrid()
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
		if(selectedAlgorithm === 'astar'){
			return astar(startNode);
		};
		
	};
};

