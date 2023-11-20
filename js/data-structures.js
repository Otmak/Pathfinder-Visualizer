// 

class Stack{
	constructor(){
		this.list = [];
	}

	push(item){
		return this.list.push(item);
	}

	pop(){
		return this.list.pop();
	}

	isEmpty(){
		if(this.list.length <= 0){
			return true;
		}
		return false;
	}
}


class Queue{
	constructor(){
		this.list = [];
	}

	enqueue(item){
		return this.list.push(item);;
	}

	dequeue(){
		return this.list.shift();
	}

	isEmpty(){
		if(this.list.length <= 0){
			return true;
		}
		return false;
	}
}


class PriorityQueue{}
