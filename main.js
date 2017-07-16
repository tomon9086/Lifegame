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
for(let i = 0; i < height; i++) {
	field.push([]);
	for(let j = 0; j < width; j++) {
		field[i][j] = new Cell(j, i);
	}
}

let isCirculate = Boolean(query === undefined || query.circulate === undefined || isNaN(query.circulate) ? false : query.circulate);

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

killAll(false);
killAll(false);
// killAll();

setInterval(function() {
	if(!getCheckbox())return;
	// killAll();
	koma();
}, delay);

document.onkeydown = function(e) {
	// console.log(e)
	if(e.keyCode === 32) {
		isRunning.checked = !isRunning.checked;
		return false;
	}
	if(e.keyCode === 39) {	// right
		if(getCheckbox())return;
		koma();
		return false;
	}
	if(e.keyCode === 65) {
		putRandom();
		return false;
	}
	if(e.keyCode === 46 || e.keyCode === 68) {
		killAll();
		return false;
	}
}

function koma() {
	field.forEach(function(v, i) {
		v.forEach(function(w, j) {
			// w.alive = getStatus(j, i);
			w.alive = false;
			w.nextStat = false;
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
	if(saveGif.recording) {
		saveGif.encoder.addFrame(saveGif.ctx);
	}
}

function putRandom() {
	if(getCheckbox())return;
	killAll();
	field.forEach(function(v, i) {
		v.forEach(function(w, j) {
			if(!(Math.random() * 4 | 0))revive(j, i);
		});
	});
}

function killAll(opt) {
	if(getCheckbox())return;
	field.forEach(function(v, i) {
		v.forEach(function(w, j) {
			kill(j, i, opt);
		});
	});
}
