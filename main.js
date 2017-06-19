class Cell {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.alive = false;
		this.nextStat = false;
		this.cellsAround = [];
	}

	update() {
		let aliveCellNum = 0;
		this.nextStat = false;
		this.cellsAround.forEach(function(v, i) {
			if(v.alive)aliveCellNum++;
		});
		if(this.alive && (aliveCellNum === 2 || aliveCellNum === 3))this.nextStat = true;
		if(!this.alive && aliveCellNum === 3)this.nextStat = true;
	}

	draw() {
		if(this.nextStat)revive(this.x, this.y);
		if(!this.nextStat)kill(this.x, this.y);
		this.alive = this.nextStat;
	}

	set() {
		this.alive = true;
		this.nextStat = true;
	}
}

const field = [];
for(let i = 0; i < 100; i++) {
	field.push([]);
	for(let j = 0; j < 100; j++) {
		field[i][j] = new Cell(j, i);
	}
}

let isCirculate = Boolean(getQuery().circulate === undefined || isNaN(getQuery().circulate) ? false : getQuery().circulate);

field.forEach(function(v, i) {
	v.forEach(function(w, j) {
		if(isCirculate) {
			if(i - 1 < 0 && j - 1 < 0) {
				w.cellsAround.push(field[field.length - 1][v.length - 1]);
			} else if(i - 1 < 0) {
				w.cellsAround.push(field[field.length - 1][j - 1]);
			} else if(j - 1 < 0) {
				w.cellsAround.push(field[i - 1][v.length - 1]);
			}
			if(i - 1 < 0)w.cellsAround.push(field[field.length - 1][j]);
			if(i - 1 < 0 && j + 1 >= v.length) {
				w.cellsAround.push(field[field.length - 1][0]);
			} else if(i - 1 < 0) {
				w.cellsAround.push(field[field.length - 1][j + 1]);
			} else if(j + 1 >= v.length) {
				w.cellsAround.push(field[i - 1][0]);
			}

			if(j - 1 < 0)w.cellsAround.push(field[i][v.length - 1]);
			if(j + 1 >= v.length)w.cellsAround.push(field[i][0]);

			if(i + 1 >= field.length && j - 1 < 0) {
				w.cellsAround.push(field[0][v.length - 1]);
			} else if(i + 1 >= field.length) {
				w.cellsAround.push(field[0][j - 1]);
			} else if(j - 1 < 0) {
				w.cellsAround.push(field[i + 1][v.length - 1]);
			}
			if(i + 1 >= field.length)w.cellsAround.push(field[0][j]);
			if(i + 1 >= field.length && j + 1 >= v.length) {
				w.cellsAround.push(field[0][0]);
			} else if(i + 1 >= field.length) {
				w.cellsAround.push(field[0][j + 1]);
			} else if(j + 1 >= v.length) {
				w.cellsAround.push(field[i + 1][0]);
			}
		}

		if(i - 1 >= 0) {
			if(j - 1 >= 0)w.cellsAround.push(field[i - 1][j - 1]);
			w.cellsAround.push(field[i - 1][j]);
			if(j + 1 < v.length)w.cellsAround.push(field[i - 1][j + 1]);
		}
		if(j - 1 >= 0)w.cellsAround.push(field[i][j - 1]);
		if(j + 1 < v.length)w.cellsAround.push(field[i][j + 1]);
		if(i + 1 < field.length) {
			if(j - 1 >= 0)w.cellsAround.push(field[i + 1][j - 1]);
			w.cellsAround.push(field[i + 1][j]);
			if(j + 1 < v.length)w.cellsAround.push(field[i + 1][j + 1]);
		}
	});
});

setInterval(function() {
	if(!getCheckbox())return;
	field.forEach(function(v, i) {
		v.forEach(function(w, j) {
			// w.alive = getStatus(j, i);
			if(getStatus(j, i))w.set();
		});
	});
	field.forEach(function(v, i) {
		v.forEach(function(w, j) {
			w.update();
		});
	});
	field.forEach(function(v, i) {
		v.forEach(function(w, j) {
			w.draw();
		});
	});
}, 150);

function getQuery() {
    if(window.location.search === "") return;
    const variables = window.location.search.split("?")[1].split("&");
    const obj = {};
    variables.forEach(function(v, i) {
        const variable = v.split("=");
        obj[variable[0]] = Number(variable[1]);
    });
    return obj;
}
