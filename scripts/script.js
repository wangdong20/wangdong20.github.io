$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.
    
    // Called function to update the name, happiness, and weight of our pet in our HTML
    var canvas = $('#canvas')[0];

    canvas.addEventListener("mouseup", function(e) {
		var p = getEventPosition(e);
		console.log(p);
		var col = Math.floor(p.x / (canvas.width / 9));
		var row = Math.floor(p.y / (canvas.height / 9));
		newCell.row = row;
		newCell.col = col;
		canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
		drawGrid();
	}, false);
	setInitNumbers();
	initButtons();
    drawGrid();
 })

function fix_dpi() {
	//get DPI
	let dpi = window.devicePixelRatio;
	//get CSS height
	//the + prefix casts it to an integer
	//the slice method gets rid of "px"
	let style_height = +getComputedStyle(canvas).getPropertyValue("height").slice(0, -2);
	//get CSS width
	let style_width = +getComputedStyle(canvas).getPropertyValue("width").slice(0, -2);
	//scale the canvas
	canvas.setAttribute('height', style_height * dpi);
	canvas.setAttribute('width', style_width * dpi);
} 

function getEventPosition(ev){
	let dpi = window.devicePixelRatio;
  	var x, y;
	if (ev.layerX || ev.layerX == 0) {
	    x = ev.layerX * dpi;
	    y = ev.layerY * dpi;
	} else if (ev.offsetX || ev.offsetX == 0) { // Opera
	    x = ev.offsetX * dpi;
	    y = ev.offsetY * dpi;
	}
	return {x: x, y: y};
}

var currentCell = {row: -1, col: -1};
var newCell = {row: -1, col: -1};
var editedNumbers = new Array();

function drawGrid() {
	var canvas = $('#canvas')[0];
	if (canvas.getContext) {
    	var ctx = canvas.getContext('2d');

		fix_dpi();

		var width = canvas.width;
		var height = canvas.height;
		
		if(newCell.row != -1 && newCell.col != -1) {
			if(currentCell.row != newCell.row ||
				currentCell.col != newCell.col) {
				currentCell.row = newCell.row;
				currentCell.col = newCell.col;
				console.log("row: " + currentCell.row + " col: " + currentCell.col);
			}
			drawRelatedRect(ctx, currentCell, width, height);
				ctx.fillStyle = "rgb(179, 221, 253)";
				ctx.fillRect(currentCell.col * width / 9, 
					currentCell.row * height / 9, width / 9, height / 9);
		}

		drawInitNumbers(ctx, matrix, width, height);
		drawEditNumbers(ctx, editedNumbers, width, height);

		// Stroke lines
		for(var row = 1; row < 9; row++) {
			for(var col = 1; col < 9; col++) {
				ctx.lineWidth = 1;
				ctx.strokeStyle = "LightGray";
				
				if(col % 3 != 0) {
					ctx.beginPath();
					ctx.moveTo(col * width / 9, 0);
					ctx.lineTo(col * width / 9, height);
					ctx.closePath();
					ctx.stroke();
				}

				if(row % 3 != 0) {
					ctx.beginPath();
					ctx.moveTo(0, row * height / 9);
					ctx.lineTo(width, row * height / 9);
					ctx.closePath();
					ctx.stroke();
				}
			}
		}

		for(var row = 3; row < 9; row += 3) {
			for(col = 3; col < 9; col += 3) {
				ctx.lineWidth = 3;
				ctx.strokeStyle = "Black";
				ctx.beginPath();
				ctx.moveTo(col * width / 9, 0);
				ctx.lineTo(col * width / 9, height);
				ctx.closePath();
				ctx.stroke();

				ctx.beginPath();
				ctx.moveTo(0, row * height / 9);
				ctx.lineTo(width, row * height / 9);
				ctx.closePath();
				ctx.stroke();
			}
		}
	}
}

function drawRelatedRect(ctx, currentCell, width, height) {
	var originX = Math.floor(currentCell.col / 3) * 3;
	var originY = Math.floor(currentCell.row / 3) * 3;
	ctx.fillStyle = "rgb(224, 231, 237)";
	ctx.fillRect(originX * width / 9, originY * height / 9, width / 3, height / 3);

	if(originX > 0) {
        ctx.fillRect(0, currentCell.row * height / 9, (originX * width / 9), height / 9);
    }
    
    if(originX + 3 < 9) {
        ctx.fillRect((originX + 3) * width / 9, currentCell.row * height / 9, (6 - originX) * width / 9, height / 9);
    }
    
    if(originY > 0) {
        ctx.fillRect(currentCell.col * width / 9, 0, width / 9, originY * height / 9);
    }
    
    if(originY + 3 < 9) {
        ctx.fillRect(currentCell.col * width / 9, (originY + 3) * height / 9, width / 9, (6 - originY) * height / 9);
    }

    // [[UIColor colorWithDisplayP3Red:0.757 green:0.812 blue:0.851 alpha: 1] setFill];
    ctx.fillStyle = "rgb(193, 207, 217)";
    let digit = editedNumbers[currentCell.row][currentCell.col];
    if(digit != 0) {
        for(let i = 0; i < 9; i++) {
            for(let j = 0; j < 9; j++) {
                if((i !== currentCell.row || j !== currentCell.col) && digit == editedNumbers[i][j]) {
                	ctx.fillRect(j * width / 9, i * height / 9, width / 9, height / 9);
                }
            }
        }
    }
}

function checkValid(digit, cell) {
	var row  = cell.row;
	var col = cell.col;
	var originX = Math.floor(col / 3) * 3;
	var originY = Math.floor(row / 3) * 3;
	for(let i = originY; i < originY + 3; i++) {
        for(let j = originX; j < originX + 3; j++) {
            if(editedNumbers[i][j] != 0) {
                if(i == row && j == col) {
                    continue;
                }
                if(digit == editedNumbers[i][j]) {
                    return false;
                }
            }
        }
    }
    
    for(let i = 0; i < 9; i++) {
        if(i != col && editedNumbers[row][i] == digit) {
            return false;
        }
        if(i != row && editedNumbers[i][col] == digit) {
            return false;
        }
    }
    return true;
}

function drawInitNumbers(ctx, matrix, width, height) {
	ctx.font = "14px serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "Black";
	setAdaptiveFontsize(ctx, width / (9 * 2.8));
	for(let i = 0; i < matrix.length; i++) {
		for(let j = 0; j < matrix.length; j++) {
			if(matrix[i][j] != 0) {
				ctx.fillText(matrix[i][j], j * width / 9 + width / 18, i * height / 9 + height / 18);
			}
		}
	}
}

function drawEditNumbers(ctx, editedNumbers, width, height) {
	ctx.font = "14px serif";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";
	ctx.fillStyle = "Blue";
	setAdaptiveFontsize(ctx, width / (9 * 2.8));
	for(let i = 0; i < editedNumbers.length; i++) {
		for(let j = 0; j < editedNumbers.length; j++) {
			if(editedNumbers[i][j] != 0 && matrix[i][j] == 0) {
				ctx.fillText(editedNumbers[i][j], j * width / 9 + width / 18, i * height / 9 + height / 18);
			}
		}
	}
}

function setAdaptiveFontsize(ctx, width) {
	var tempMax = 100;
	var tempMin = 14;
	var mid = 0;
	var difference = 0.0;

	while (tempMin <= tempMax) {
        mid = Math.floor(tempMin + (tempMax - tempMin) / 2);
        ctx.font = ctx.font.replace(/\d+px/, mid + "px");
        difference = width - ctx.measureText("1").width;
        
        if (mid == tempMin || mid == tempMax) {
            if (difference < 0) {
                ctx.font = ctx.font.replace(/\d+px/, (mid - 1) + "px");
            } else if(difference > 0) {
                ctx.font = ctx.font.replace(/\d+px/, (mid + 1) + "px");
            }
            break;
        }
        
        if (difference < 0) {
            tempMax = mid - 1;
        } else if (difference > 0) {
            tempMin = mid + 1;
        } else {
        	break;
        }
    }
}

function setInitNumbers() {
	initWithNumberOfMissingDigits(50);
	fillValues();
	for(let i = 0; i < numberOfColumnsOrRows; i++) {
		editedNumbers[i] = new Array();
		for(let j = 0; j < numberOfColumnsOrRows; j++) {
			editedNumbers[i][j] = matrix[i][j];
		}
	}
}

function initButtons() {
	$(".digit_btn").children().each(function(i, btn) {
		$(btn).click(function() {
			if(currentCell.row != -1 &&
				currentCell.col != -1 && 
				matrix[currentCell.row][currentCell.col] == 0) {
					let digit = parseInt($(btn).context.innerText);
					if(checkValid(digit, currentCell)) {
						editedNumbers[currentCell.row][currentCell.col] = parseInt($(btn).context.innerText);
					} else {
						shake();
					}
				drawGrid();
			}
		})
	})
}

function shake() {
	$('#canvas').effect("shake");
}