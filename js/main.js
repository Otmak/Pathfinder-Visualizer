//By Otuma.
const textOfCoodinate = document.getElementById('text');
const canvas = document.getElementById("canvas");
const canvasHeight = 900;
const canvasWidth = 900;
canvas.height = canvasHeight;
canvas.width = canvasWidth;
const ctx = canvas.getContext("2d");
console.log(ctx);
const n = 30;

function draw(x,y){
	// draw vetical lines.
	let arrayOfColumns =[];
	let arrayOfRows = [];
	// Draw vertical lines
	for(let v =x; v <= canvasWidth; v+=canvasHeight/n){
		ctx.moveTo(v, y);
		ctx.lineTo(v, y + canvasHeight);
		// arrayOfColumns.push(v)
	}
	// Draw horizontal lines.
	for(let h =x; h <= canvasWidth; h+=canvasHeight/n){
		ctx.moveTo(x, h);
		ctx.lineTo(x +canvasWidth, h);
		// arrayOfRows.push(h)
	}
	ctx.strokeStyle = '#9f95ad';
	// 9f95ad
	ctx.stroke();
};

// On mouse click
canvas.addEventListener('click', (e)=>{
	paintCellUsingXYCoordinate(ctx, e.x, e.y, 'blue')

});


canvas.addEventListener('mousemove', (e)=>{
	textOfCoodinate.innerText = `x:${e.x}  y:${e.y}`;
});
draw(0,0);


// Paint cell using 2d array indexs
function paintCellUsingArrayIndex(i, j, color){
	context.fillStyle = color;
	context.fillRect(i*n, j*n, n-1, n-1);
};


// Paint cell using coodinates e.g from mouse click
function paintCellUsingXYCoordinate(context, x, y, color){
	context.fillStyle = color;
	context.fillRect(roundToNearest0(x), roundToNearest0(y), n-1, n-1);
};


// Round to the lowest nth.
function roundToNearest0(num){
	return num < Math.round(num /30)*30 ? Math.round(num /30)*30 -30  : Math.round(num /30)*30;
};



