cvs = document.getElementById("field");
ctx = document.getElementById("field").getContext("2d");
isRunning = document.getElementById("isRunning");
canvasWidth = 0;
canvasHeight = 0;
resolution = 1.5;
cellWidth = 7;
cellHeight = 7;
linePixel = 1;
borderPixel = 2;
pixelMap = [];
query = getQuery();
width = 100;
height = 100;
if(!(query === undefined || query.width === undefined || isNaN(query.width)))if(query.width)width = query.width;
if(!(query === undefined || query.height === undefined || isNaN(query.height)))if(query.height)height = query.height;

document.onkeydown = function(e) {
	if(e.keyCode === 32) {
		isRunning.checked = !isRunning.checked;
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
	// console.log(e)
}

class FieldCell {
	constructor(field, cellCoord, startCoord) {
		this.field = field;
		this.startCoord = startCoord;
		this.cellCoord = cellCoord;
		this.isSculpted = false;
		this.isRegulated = false;
		this.style = "";
	}

	// defrag() {
	// 	this.isSculpted = false;
	// 	this.isRegulated = false;
	// }

	turn() {
		if(this.isRegulated)return;
		this.isSculpted = !this.isSculpted;
		if(this.isSculpted){
			this.style = "rgb(0,0,0)";
		} else {
			this.style = "rgb(255,255,255)";
		}
	}

	regulate() {
		this.isRegulated = !this.isRegulated;
		this.isSculpted = false;
		if(this.isRegulated){
			this.style = "rgb(200,200,200)";
		} else {
			this.style = "rgb(255,255,255)";
		}
	}

	update() {
		this.field.ctx.fillStyle = this.style;
		this.field.ctx.fillRect(this.startCoord[0], this.startCoord[1], this.field.cellWidth, this.field.cellHeight);
	}
}

const cellCalc = (x, y) => {
	const cx = Math.floor(x / (cellWidth + linePixel) / resolution);
	const cy = Math.floor(y / (cellWidth + linePixel) / resolution);
	if(!(cx >= 0 && cx < width && cy >= 0 && cy < height))return false;
	return [cx, cy];
};
const mouseMove = (event) => {
	const currCell = cellCalc(event.layerX, event.layerY);
	if(currCell[0] === prevCell[0] && currCell[1] === prevCell[1])return;
	if(!currCell)return;
	if(event.button === 0 && !isRunning.checked) {
		pixelMap[currCell[1]][currCell[0]].turn();
		pixelMap[currCell[1]][currCell[0]].update();
	}
	// if(event.button === 2) {
	// 	pixelMap[currCell[1]][currCell[0]].regulate();
	// }
	prevCell = currCell;
};
const eventEnd = (event) => {
	cvs.removeEventListener("mousemove", mouseMove);
	cvs.removeEventListener("mouseup", eventEnd);
};
const eventStart = (event) => {
	// event.button: left -> 0, right -> 2
	const currCell = cellCalc(event.layerX, event.layerY);
	if(!currCell)return;
	if(event.button === 0 && !isRunning.checked) {
		pixelMap[currCell[1]][currCell[0]].turn();
		pixelMap[currCell[1]][currCell[0]].update();
	}
	// if(event.button === 2) {
	// 	pixelMap[currCell[1]][currCell[0]].regulate();
	// }
	prevCell = currCell;
	cvs.addEventListener("mousemove", mouseMove);
	cvs.addEventListener("mouseup", eventEnd);
};

function fieldGenerator() {
	cvs.removeEventListener("mousedown", eventStart);
	// width = document.getElementById("numOfCol").value;
	// height = document.getElementById("numOfRow").value;
	pixelMap = [];

	canvasWidth = cellWidth * width + linePixel * (width - 1) + borderPixel * 2;
	canvasHeight = cellHeight * height + linePixel * (height - 1) + borderPixel * 2;
	canvasInitialize();
	// セル描画
	// 小枠
	ctx.fillStyle = "rgb(180,180,180)";
	for(let i = 0; i < height; i++) {
		pixelMap.push([]);
		for(let j = 0; j < width; j++) {
			// ctx.fillStyle = "rgb(0,0,0)";
			ctx.fillRect(borderPixel - linePixel + (cellWidth + linePixel) * j, borderPixel - linePixel + (cellHeight + linePixel) * i, cellWidth + linePixel * 2, cellHeight + linePixel * 2);
			// ctx.fillStyle = "rgb(255,0,0)";
			const coordinate = [linePixel + (cellWidth + linePixel) * j + linePixel, linePixel + (cellHeight + linePixel) * i + linePixel];
			ctx.clearRect(coordinate[0], coordinate[1], cellWidth, cellHeight);
			pixelMap[i].push(new FieldCell(this, [j, i], coordinate));
		}
	}
	// 大枠
	/*
		1
	  4	□ 2
		3
	*/
	const borderWidth = cellWidth * width + linePixel * (width - 1) + borderPixel * 2;
	const borderHeight = cellHeight * height + linePixel * (height - 1) + borderPixel * 2;
	ctx.fillStyle = "rgb(180,180,180)";
	ctx.fillRect(0, 0, borderWidth, borderPixel);
	ctx.fillRect(borderWidth - borderPixel, 0, borderPixel, borderHeight);
	ctx.fillRect(0, borderHeight - borderPixel, borderWidth, borderPixel);
	ctx.fillRect(0, 0, borderPixel, borderHeight);
	// mouse event
	let prevCell = [];
	cvs.addEventListener("mousedown", eventStart);
}

function canvasInitialize() {
	cvs.setAttribute("width", canvasWidth * resolution);
	cvs.setAttribute("height", canvasHeight * resolution);
	ctx.scale(resolution, resolution);
}

// function exportArray() {
// 	let exportMap = [];
// 	pixelMap.forEach(function(v, i) {
// 		exportMap.push([]);
// 		v.forEach(function(w, j) {
// 			exportMap[i][j] = w.isSculpted ? 1 : 0;
// 		});
// 	});
// 	console.table(exportMap);
// 	document.getElementById("exportArea").innerText = JSON.stringify(exportMap);
// }

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

function getCheckbox() {
	return isRunning.checked;
}

function getStatus(x, y) {
	return pixelMap[y][x].isSculpted;
}

function kill(x, y) {
	if(!pixelMap[y][x].isSculpted)return;
	pixelMap[y][x].turn();
	pixelMap[y][x].update();
}

function revive(x, y) {
	if(pixelMap[y][x].isSculpted)return;
	pixelMap[y][x].turn();
	pixelMap[y][x].update();
}

fieldGenerator();
