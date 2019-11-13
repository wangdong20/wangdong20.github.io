const DEFAULT_NUM_MISSING_DIGIT = 20;
const DEFAULT_NUM_COL_ROW = 9;
var SRN;
var numberOfMissingDigits;
var numberOfColumnsOrRows;
var matrix = new Array();

function initWithNumberOfMissingDigits(n) {
	SRN = Math.floor(Math.sqrt(DEFAULT_NUM_COL_ROW));
	numberOfMissingDigits = n;
	numberOfColumnsOrRows = DEFAULT_NUM_COL_ROW;
	for(let i = 0; i < numberOfColumnsOrRows; i++) {
		matrix[i] = new Array();
		for(let j = 0; j < numberOfColumnsOrRows; j++) {
			matrix[i][j] = 0;
		}
	}
}

function initWithMissingDigitAndColOrRow(k, n) {
	numberOfMissingDigits = k;
	SRN = Math.floor(Math.sqrt(n));
	numberOfColumnsOrRows = n;
	for(let i = 0; i < numberOfColumnsOrRows; i++) {
		matrix[i] = new Array();
		for(let j = 0; j < numberOfColumnsOrRows; j++) {
			matrix[i][j] = 0;
		}
	}
}

function unUsedInBox(rowStart, colStart, num) {
	for(var i = 0; i < SRN; i++) {
		for(var j = 0; j < SRN; j++) {
			if(matrix[rowStart + i][colStart + j] == num) {
				return false;
			}
		}
	}
	return true;
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function fillBox(row, col) {
	var num;
	for(var i = 0; i < SRN; i++) {
		for(var j = 0; j < SRN; j++) {
			do {
				num = getRandomIntInclusive(1, 9);
			} while(!unUsedInBox(row, col, num));

			matrix[row + i][col + j] = num;
		}
	}
}

function fillDiagonal() {
	for(var i = 0; i < numberOfColumnsOrRows; i = i + SRN) {
		fillBox(i, i);
	}
}

function unUsedInRow(row, num) {
	for(var j = 0; j < numberOfColumnsOrRows; j++) {
		if(matrix[row][j] == num)
			return false;
	}
	return true;
}

function unUsedInCol(col, num) {
	for(var i = 0; i < numberOfColumnsOrRows; i++) {
		if(matrix[i][col] == num)
			return false;
	}
	return true;
}

function checkIfSafe(row, col, num) {
	return unUsedInRow(row, num) && unUsedInCol(col, num) &&
	 unUsedInBox(row - row % SRN, col - col % SRN, num);
}

function fillRemaining(row, col) {
	if(col >= numberOfColumnsOrRows && row < numberOfColumnsOrRows - 1) {
		row++;
		col = 0;
	}
	if(row >= numberOfColumnsOrRows && col >= numberOfColumnsOrRows) {
		return true;
	}
	if(row < SRN) {
		if(col < SRN)
			col = SRN;
	} else if(row < numberOfColumnsOrRows - SRN) {
		if(col == Math.floor(row / SRN) * SRN)
			col = col + SRN;
	} else {
		if(col == numberOfColumnsOrRows - SRN) {
			row++;
			col = 0;
			if(row >= numberOfColumnsOrRows)
				return true;
		}
	}

	for(var num = 1; num <= numberOfColumnsOrRows; num++) {
		if(checkIfSafe(row, col, num)) {
			matrix[row][col] = num;
			if(fillRemaining(row, col + 1))
				return true;

			matrix[row][col] = 0;
		}
	}
	return false;
}

function removeDigits() {
	var count = numberOfMissingDigits;
	while(count != 0) {
		var cellId = getRandomIntInclusive(0, 
			numberOfColumnsOrRows * numberOfColumnsOrRows - 1);

		var i = Math.floor(cellId / numberOfColumnsOrRows);
		var j = cellId % numberOfColumnsOrRows;

		if(matrix[i][j] != 0) {
			count--;
			matrix[i][j] = 0;
		}
	}
}

function fillValues() {
	for(var i = 0; i < numberOfColumnsOrRows; i++) {
		for(var j = 0; j < numberOfColumnsOrRows; j++) {
			matrix[i][j] = 0;
		}
	}

	fillDiagonal();
	fillRemaining(0, SRN);
	removeDigits();
}

function printSudoku() {
	for(var i = 0; i < numberOfColumnsOrRows; i++) {
		for(var j = 0; j < numberOfColumnsOrRows; j++) {
			console.log(matrix[i][j] + " ");
		}
		console.log("\n");
	}
	console.log("\n");
}