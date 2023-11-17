//

const textOfCoodinate = document.getElementById('text');
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const g = new Grid(ctx, 900, 900, 30, 30)
g.draw(0,0)


canvas.addEventListener('click', (e)=>{
	let x = roundToNearestNTH(e.x);
	let y = roundToNearestNTH(e.y);
	if(e.shiftKey){
		let node = g.getNode(x/g.columns, y/g.rows);
		node.goal = true;
		return g.paintNode(x, y, 'blue')
	}
});

canvas.addEventListener('mousemove', (e)=>{
	textOfCoodinate.innerText = `x:${e.x}  y:${e.y}`;
});


// // Round to the lowest nth.
function roundToNearestNTH(num){
	return num < Math.round(num /nth)*nth ? Math.round(num /nth)*nth -nth  : Math.round(num /nth)*nth;
};


// Start animation of linear search on [0][j].
const nodes = g.nodes;
	let i =0;
	let j=0;
function startAlgorithm(){
	if(j < nodes.length){
		let check = nodes[i][j];
		console.log(i,j)
		if(check.goal){
			console.log('Found Goal');
			g.paintNode(i*g.rows, j*g.rows, 'red');
			return;
		}
		console.log('AFTER', i,j)
		g.paintNode(i*g.rows, j*g.rows, '#9f95ad');
		j++
		console.log('J MUST be ', j)
		setTimeout(startAlgorithm, 200)
	}
};

// // console.log(roundToNearest0(9));

