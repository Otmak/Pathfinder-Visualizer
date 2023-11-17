// By Otuma.
class Grid{
	constructor(ctx, width, height, rows, columns){
		this.width = width;
		this.height = height;
		this.rows = rows;
		this.columns = columns;
		this.ctx = ctx;
		this.nodes = [];
	}

	draw(x, y){
		let context = this.ctx;
		let height = this.height;
		let width = this.width;
		context.beginPath();
		// generate array of nodes.
		for(let i = x; i < width; i += width/this.columns){
			let arrayOfRows = new Array();
			for(let j = y; j < height; j += height/this.rows){
				arrayOfRows.push(new Node(i, j));
			}
			this.nodes.push(arrayOfRows);
		}
		// Draw vertical lines.
		for(let vLine =x; vLine<=width; vLine+=width/this.columns){
			context.moveTo(vLine, x);
			context.lineTo(vLine, height);
		}
		// Draw horizontal lines.
		for(let hLine =y; hLine<= height; hLine+= height/this.rows){
			context.moveTo(y, hLine);
			context.lineTo(y+height, hLine);
		}
		ctx.strokeStyle = '#9f95ad';
		ctx.stroke();
	}


	paintNode(x, y, color){
		let i = x/this.columns;
		let j = y/this.rows;
		let context = this.ctx;
		let node = this.nodes[i][j];
		if(node.color && !node.goal){
			context.clearRect(x+1, y+1, this.columns-2, this.rows-2);
			node.color =undefined;
			node.goal =undefined;
			return;
		}
		node.color = color;
		context.fillStyle = color;
		context.fillRect(x+1, y+1, this.columns-2, this.rows-2);
	}


	getNode(x, y){
		return this.nodes[x][y];
	}
}

class Node{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.goal;
		this.color;
	}
}