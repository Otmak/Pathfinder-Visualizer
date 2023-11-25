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
		let i = Math.floor(x/this.columns);
		let j = Math.floor(y/this.rows);
		let context = this.ctx;
		let node = this.nodes[i][j];
		context.fillStyle = color;
		if( node.goal || node.start){
			let goalColor = this.getNode(x,y).color ? this.nodes[i][j].color : color;
			node.color = goalColor
			context.fillStyle = goalColor;
			context.fillRect(x+1, y+1, this.columns-2, this.rows-2);
			return;
		}
		node.color = color;
		context.clearRect(x+1, y+1, this.columns-2, this.rows-2)
		context.fillRect(x+1, y+1, this.columns-2, this.rows-2);
	}


	clearNode(x,y){
		let i = x/this.columns;
		let j = y/this.rows;
		let context = this.ctx;
		// let node = this.nodes[i][j];
		context.clearRect(x+1, y+1, this.columns-2, this.rows-2)
	}


	getNode(x, y){
		let i = x/this.columns;
		let j = y/this.rows;
		let context = this.ctx;
		try{
			let node = this.nodes[i][j];
			return node;
		} catch (e){
			return false;
		}
	}


	clearAllNodes(){
		let startNode = this.getNode(0,0);
		let frontier  = new Queue()
		frontier.enqueue(startNode);
		let explored = {}

		while(!frontier.isEmpty()){
			let currentNode = frontier.dequeue()
			this.clearNode(currentNode.x, currentNode.y)
			const successors = currentNode.getNeighbours()
			for(let i = 0; i < successors.length; i++){
				let [x,y] = successors[i];
				let getNeighbourLocation = String([x,y]);
				let neighbour = this.getNode(x,y);
				if(explored[getNeighbourLocation] ){
					continue;
				}
				if(neighbour ){
					this.clearNode(neighbour.x, neighbour.y)
					frontier.enqueue(neighbour)
					explored[getNeighbourLocation] = getNeighbourLocation;
				};
			};
		};
	};
};


class Node{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.goal;
		this.color;
		this.isTraversable = true;
		this.weight = 1;
		this.parent;
	}


	getNeighbours(){
		let up =[this.x, this.y - 30];
		let right = [this.x + 30, this.y];
		let down = [this.x, this.y + 30];
		let left = [this.x - 30, this.y];

		return [up, right, down, left];
	}
}

