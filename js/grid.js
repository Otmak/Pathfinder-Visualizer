// By Otuma.
class Grid{
    constructor(ctx, width, height, rows, columns, cellSize){
        this.width = width;
        this.height = height;
        this.rows = rows;
        this.columns = columns;
        this.ctx = ctx;
        this.cellSize = cellSize;
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
                arrayOfRows.push(new Node(i, j, this.cellSize));
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
        let i = Math.floor(x/this.cellSize);
        let j = Math.floor(y/this.cellSize);
        let context = this.ctx;
        let node = this.nodes[i][j];
        context.fillStyle = color;

        if( node.goal || node.start){
            let goalColor = this.getNode(x,y).color ? this.nodes[i][j].color : color;
            node.color = goalColor
            context.fillStyle = goalColor;
            context.fillRect(x+1, y+1, this.cellSize-2, this.cellSize-2);
            return;
        }
        node.color = color;
        context.clearRect(x+1, y+1, this.cellSize-2, this.cellSize-2);
        context.fillRect(x+1, y+1, this.cellSize-2, this.cellSize-2);
    }


    clearNode(x,y){
        let i = Math.floor(x/this.cellSize);
        let j = Math.floor(y/this.cellSize);
        let context = this.ctx;
        context.clearRect(x+1, y+1, this.cellSize-2, this.cellSize-2)
    }


    getNode(x, y){
        let i = Math.floor(x/this.cellSize);
        let j = Math.floor(y/this.cellSize);
        let context = this.ctx;
        try{
            let node = this.nodes[i][j];
            return node;
        } catch (e){
            return false;
        }
    }


    animatePaint(x, y, color){

        let cellSize = this.cellSize;
        let i = x * 0.5;
        let j = y  * 0.5;
        let context = this.ctx;

        let dx = 0;
        let dy = 0;

        context.fillStyle = color;

        function animate(){
            context.clearRect(x+1, y+1, cellSize-2, cellSize-2);
            context.fillRect(x+1, y+1, dx, dy);

            i-=1;
            j-=1;
            dx+=2;
            dy+=2;

            if(i <= 0) return;
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    };


    clearAllNodes(){
        let startNode = this.getNode(0,0);
        let isOkayToRun =false;
        let frontier  = new Queue()
        frontier.enqueue(startNode);
        let explored = {}

        while(!frontier.isEmpty()){
            let currentNode = frontier.dequeue()
            if(currentNode.start || currentNode.goal || !currentNode.isTraversable ) continue;
            this.clearNode(currentNode.x, currentNode.y);
            if(currentNode.weighted){
                this.paintNode(currentNode.x,currentNode.y, "#61aa55");
            }
            const successors = currentNode.getNeighbours()
            for(let i = 0; i < successors.length; i++){
                let [x,y] = successors[i];
                let getNeighbourLocation = String([x,y]);
                let neighbour = this.getNode(x,y);
                if(explored[getNeighbourLocation] ){
                    continue;
                }
                if(neighbour ){
                    frontier.enqueue(neighbour)
                    explored[getNeighbourLocation] = getNeighbourLocation;
                };
            };
        };
    return isOkayToRun;
    };
};


class Node{
    constructor(x, y, cellSize){
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
        this.goal;
        this.color;
        this.isTraversable = true;
        this.weight = 1;
        this.parent;
    }


    getNeighbours(){
        let up =[this.x, this.y - this.cellSize];
        let right = [this.x + this.cellSize, this.y];
        let down = [this.x, this.y + this.cellSize];
        let left = [this.x - this.cellSize, this.y];

        return [up, right, down, left];
    }
}

