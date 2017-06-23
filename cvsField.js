cvs = document.getElementById("field");
ctx = document.getElementById("field").getContext("2d");
isRunning = document.getElementById("isRunning");
canvasWidth = 0;
canvasHeight = 0;
resolution = 1.5;
cellWidth = 7;
cellHeight = 7;
linePixel = 1;
lineColor = decToRgb(180180180);
bgColor = decToRgb(255255255);
cellColor = decToRgb(000000000);
borderPixel = 2;
pixelMap = [];
query = getQuery();
width = 100;
height = 100;
delay = 150;
if(!(query === undefined || query.width === undefined || isNaN(query.width)))if(query.width)width = query.width;
if(!(query === undefined || query.height === undefined || isNaN(query.height)))if(query.height)height = query.height;
// if(!(query === undefined || query.lineWidth === undefined || isNaN(query.lineWidth)))if(query.lineWidth >= 0)linePixel = query.lineWidth;
if(!(query === undefined || query.lineColor === undefined || isNaN(query.lineColor)))if(query.lineColor >= 0 && query.lineColor <= 255255255)lineColor = decToRgb(query.lineColor);
if(!(query === undefined || query.bgColor === undefined || isNaN(query.bgColor)))if(query.bgColor >= 0 && query.bgColor <= 255255255)bgColor = decToRgb(query.bgColor);
if(!(query === undefined || query.cellColor === undefined || isNaN(query.cellColor)))if(query.cellColor >= 0 && query.cellColor <= 255255255)cellColor = decToRgb(query.cellColor);

// console.log(decToRgb(query.lineColor))
console.log(cellColor);
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
			this.style = cellColor;
		} else {
			this.style = bgColor;
		}
	}

	// regulate() {
	// 	this.isRegulated = !this.isRegulated;
	// 	this.isSculpted = false;
	// 	if(this.isRegulated){
	// 		this.style = "rgb(200,200,200)";
	// 	} else {
	// 		this.style = "rgb(255,255,255)";
	// 	}
	// }

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
	ctx.fillStyle = lineColor;
	for(let i = 0; i < height; i++) {
		pixelMap.push([]);
		for(let j = 0; j < width; j++) {
			// ctx.fillStyle = "rgb(0,0,0)";
			ctx.fillRect(borderPixel - linePixel + (cellWidth + linePixel) * j, borderPixel - linePixel + (cellHeight + linePixel) * i, cellWidth + linePixel * 2, cellHeight + linePixel * 2);
			// ctx.fillStyle = "rgb(255,0,0)";
			const coordinate = [linePixel + (cellWidth + linePixel) * j + linePixel, linePixel + (cellHeight + linePixel) * i + linePixel];
			ctx.fillStyle = bgColor;
			ctx.fillRect(coordinate[0], coordinate[1], cellWidth, cellHeight);
			ctx.fillStyle = lineColor;
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
	ctx.fillStyle = lineColor;
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

function decToRgb(num) {
	if(typeof num !== "number")return;
	let str = "" + num;
	for(let i = 0; str.length < 9; i++) {
		str = "0" + str;
	}
	// if(str.length !== 9)return;
	const rgb = [str.slice(0, 3), str.slice(3, 6), str.slice(6, 9)];
	return "rgb(" + rgb.join(",") + ")";
}

function getCheckbox() {
	return isRunning.checked;
}

function getStatus(x, y) {
	return pixelMap[y][x].isSculpted;
}

function kill(x, y, opt) {
	if(!pixelMap[y][x].isSculpted && opt === undefined)return;
	pixelMap[y][x].turn();
	pixelMap[y][x].update();
}

function revive(x, y) {
	if(pixelMap[y][x].isSculpted)return;
	pixelMap[y][x].turn();
	pixelMap[y][x].update();
}


fieldGenerator();

const saveGif = {
	recording: false,
	ctx: ctx,
	encoder: new GIFEncoder(),
	isLoop: 0,
	start: function() {
		this.recording = true;
		this.encoder.setRepeat(this.isLoop);
		this.encoder.setDelay(delay);
		this.encoder.setSize(canvasWidth * resolution|0, canvasHeight * resolution|0);
		this.encoder.start();
	},
	end: function() {
		this.recording = false;
		this.encoder.finish();
		this.bin = new Uint8Array(this.encoder.stream().bin);
		this.blob = new Blob([this.bin.buffer], {type: "image/gif"});
		this.url = URL.createObjectURL(this.blob);
		this.image = new Image();
		this.image.src = this.url;
		this.image.onload = function() {
			URL.revokeObjectURL(this.url);
		};
		console.log(this.image, this.url);
		// document.getElementById("img").src = this.url;
		const win = window.open(this.url, '_blank');
		win.focus();
	}
}

function record() {
	const button = document.getElementById("recButton");
	const loopCheck = document.getElementById("gifLoop");
	if(!saveGif.recording) {
		button.setAttribute("recording", "1");
		saveGif.isLoop = 1;
		if(loopCheck.checked)saveGif.isLoop = 0;
		saveGif.start();
	} else {
		button.setAttribute("recording", "0");
		saveGif.end();
	}
}

