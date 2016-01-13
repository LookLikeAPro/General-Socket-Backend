class Map {
	constructor() {
		this.length = 100;
		this.width = 100;
		this.filledCount = 0;
		this.unfilledCount = this.length*this.width;
		this.grid = [];
		for (var x=0; x<this.length; x++) {
			this.grid[x] = [];
			for (var y=0; y<this.width; y++) {
				this.grid[x][y] = 0;
			}
		}
	}
	assign(x, y, value) {
		if (value === 0 && this.grid[x][y] !== 0) {
			this.filledCount--;
			this.unfilledCount++;
		}
		else if (value === 1 && this.grid[x][y] !== 1) {
			this.filledCount++;
			this.unfilledCount--;
		}
		this.grid[x][y] = value;
	}
	isInMap(x, y) {
		return !(x < 0 || x > this.length - 1 || y < 0 || y > this.width - 1);
	}
	isFree(x, y) {
		if (!this.isInMap(x, y)) {
			return false;
		}
		return (this.grid[x][y] === 0);
	}
	getNeighbours(x, y) {
		var neighbours = [];
		if (this.isInMap(x+1, y)) {
			neighbours.push([x+1, y]);
		}
		if (this.isInMap(x-1, y)) {
			neighbours.push([x-1, y]);
		}
		if (this.isInMap(x, y+1)) {
			neighbours.push([x, y+1]);
		}
		if (this.isInMap(x, y-1)) {
			neighbours.push([x, y-1]);
		}
		return neighbours;
	}
	drunkWalk(x, y, count) {
		this.assign(x, y, 1);
		var lastX = x;
		var lastY = y;
		for (var i=0; i<count-1; i++) {
			var neighbours = this.getNeighbours(lastX, lastY);
			if (neighbours.length === 0) {
				return false;
			}
			var randDirection = Math.floor(Math.random()*neighbours.length);
			this.assign(neighbours[randDirection][0], neighbours[randDirection][1], 1);
			lastX = neighbours[randDirection][0];
			lastY = neighbours[randDirection][1];
		}
	}
	print() {
		for (var x=0; x<100; x++) {
			var line = "";
			for (var y=0; y<100; y++) {
				line = line + ""+ this.grid[x][y];
			}
			console.log(line);
		}
	}
}

var map = new Map();
var randX = Math.floor(Math.random()* 100);
var randY = Math.floor(Math.random()* 100);
map.drunkWalk(randX, randY, 1000);
map.print();
