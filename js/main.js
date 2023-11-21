//
const textOfCoodinate = document.getElementById('text');
const canvas = document.getElementById("canvas");
const getButtons = document.getElementById("algorithms");
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

function clearAndStartGrid(){
	ctx.clearRect(0,0, canvas.width, canvas.height);
	g = new Grid(ctx, 900, 900, 30, 30)
	g.draw(0,0)
	isOkayToRun = false;
	algorithmHasran = false;
}
clearAndStartGrid();


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
		return g.paintNode(x, y, 'red')
	}
	if(e.altKey){
		startingPoint(x,y)
	}
	if(!node.goal){
		node.isTraversable = false;
		g.paintNode(x, y, '#584846');
	}

});


canvas.addEventListener('mousemove', (e)=>{
	textOfCoodinate.innerText = `x:${e.x}  y:${e.y}`;
	let x = roundToNearestNTH(e.x);
	let y = roundToNearestNTH(e.y);
	let node = g.getNode(x, y);
	if(isMousedown&& !node.goal ){
		node.isTraversable = false;
		g.paintNode(x, y, '#665351');
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


function dfs(node){
	algorithmHasran = true;
	let frontier  = new Stack()
	frontier.push(node);
	let explored = {}
	let c;

	function runDFS(){
		if(!frontier.isEmpty() && isOkayToRun){
			let currentNode = frontier.pop()
			g.paintNode(currentNode.x, currentNode.y, '#1aafc2')// 837695 1aadc0
			if(currentNode.goal){
				return getPath(currentNode);;
			}
			const successors = currentNode.getNeighbours()
			for(let i = 0; i < successors.length; i++){
				let [x,y] = successors[i];
				c = String([x,y]);
				let neighbour = g.getNode(x,y);
				if(explored[c]){
					continue ;
				}
				if(neighbour && neighbour.isTraversable){
					neighbour.parent = currentNode
					g.paintNode(neighbour.x, neighbour.y, '#9f95ad')
					frontier.push(neighbour)
					explored[String([x,y])] = String([x,y]);
				}
			}
			setTimeout(runDFS, 60)
		}
	}
	runDFS();
};


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
			}
			const successors = currentNode.getNeighbours()
			for(let i = 0; i < successors.length; i++){
				let [x,y] = successors[i];
				c = String([x,y]);
				let neighbour = g.getNode(x,y);
				if(explored[c]){
					continue;
				}
				if(neighbour && neighbour.isTraversable){
					neighbour.parent = currentNode
					g.paintNode(neighbour.x, neighbour.y, '#9f95ad')
					frontier.enqueue(neighbour)
					explored[String([x,y])] = String([x,y]);
				}
			}
			setTimeout(runBFS, 60)
		}
	}
	runBFS();
};


function astart(){};


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
	};
};

