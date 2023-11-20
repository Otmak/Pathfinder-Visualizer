//
const textOfCoodinate = document.getElementById('text');
const canvas = document.getElementById("canvas");
const getButtons = document.getElementById("algo-selection-button");
const canvasHeight = 900;
const canvasWidth = 900;
canvas.height = canvasHeight;
canvas.width = canvasWidth;
const ctx = canvas.getContext("2d");
let startNode;
let selectedAlgorithm;
const nth = 30;

const g = new Grid(ctx, 900, 900, 30, 30)
g.draw(0,0)



getButtons.addEventListener('click',(e)=>{
	if(e.target.nodeName === 'INPUT'){
		selectedAlgorithm = e.target.value;
	}
});


canvas.addEventListener('click', (e)=>{
	let x = roundToNearestNTH(e.x);
	let y = roundToNearestNTH(e.y);
	if(e.shiftKey){
		let node = g.getNode(x, y);
		node.goal = true;
		return g.paintNode(x, y, '#d1572e')
	}
});


canvas.addEventListener('mousemove', (e)=>{
	textOfCoodinate.innerText = `x:${e.x}  y:${e.y}`;
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
	let frontier  = new Stack()
	frontier.push(node);
	let explored = {}
	let c;

	function runDFS(){
		if(!frontier.isEmpty()){
			let currentNode = frontier.pop()
			g.paintNode(currentNode.x, currentNode.y, '#1aafc2')// 837695 1aadc0
			if(currentNode.goal){
				return currentNode;
			}
			const successors = currentNode.getNeighbours()
			for(let i = 0; i < successors.length; i++){
				let [x,y] = successors[i];
				c = String([x,y]);
				let neighbour = g.getNode(x,y);
				if(explored[c]){
					continue;
				}
				if(neighbour){
					g.paintNode(neighbour.x, neighbour.y, '#9f95ad')
					frontier.push(neighbour)
					explored[String([x,y])] = String([x,y]);
				}
			}
			setTimeout(runDFS, 80)
		}
	}
	runDFS()
};


function bfs(node){
	let frontier  = new Queue()
	frontier.enqueue(node);
	let explored = {}
	let c;

	function runBFS(){
		if(!frontier.isEmpty()){
			let currentNode = frontier.dequeue()
			g.paintNode(currentNode.x, currentNode.y, '#1aadc0')
			if(currentNode.goal){
				return currentNode;
			}
			const successors = currentNode.getNeighbours()
			for(let i = 0; i < successors.length; i++){
				let [x,y] = successors[i];
				c = String([x,y]);
				let neighbour = g.getNode(x,y);
				if(explored[c]){
					continue;
				}
				if(neighbour){
					g.paintNode(neighbour.x, neighbour.y, '#9f95ad')
					frontier.enqueue(neighbour)
					explored[String([x,y])] = String([x,y]);
				}
			}
			setTimeout(runBFS, 80)
		}
	}
	runBFS()
}



function startDFS(){
	// const object = {
	// 	a:dfs(startNode),
	// 	b:bfs(startNode)
	// };
	// dfs(startNode)
	bfs(startNode)

}

