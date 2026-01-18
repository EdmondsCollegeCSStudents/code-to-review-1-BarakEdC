/* 
    Barak Llewellyn
    CS 248, Autumn 2024
    Project 4: Fifteen Puzzle
    Description:
        Sets up a Fifteen puzzle game, with 15 movable tiles, and 
        a shuffle button that shuffles the tiles into a random, 
        solvable starting order.
        https://en.wikipedia.org/wiki/15_puzzle
*/

(function() {
    "use strict";

    const TILES_COUNT = 15;
    const ROWS_COLS = 4;
    let emptyRow = 3;
    let emptyCol = 3;

    window.onload = function() {
        initTiles();
        document.getElementById("shufflebutton").onclick = shuffle;
    };  

    // Creates the 15 tiles for the game and finds the tiles that are
    // movable in the initial order of tiles.
    function initTiles() {
        let label = 0; // The number label of the tile

        // running two for loops 
        // TODO: Maybe find an alternative to two for loops
        for (let row = 0; row < ROWS_COLS - 1; row++) {
            for (let col = 0; col < ROWS_COLS; col++) {
                label++;
                createTile(row, col, label);
            }
        }
        for (let col = 0; col < ROWS_COLS - 1; col++) {
            label++;
            createTile(ROWS_COLS - 1, col, label);
        }
        setAllNeighbors();
    };

    // Creates a tile (div element) with a given starting row 
    // and column, and a number label
    function createTile(row, col, label) {
        let newTile = document.createElement("div");
        newTile.innerHTML = label;
        newTile.classList.add("row" + row, "col" + col);
        document.getElementById("puzzlearea").appendChild(newTile);
    };

    // Returns the index of the child div of #puzzlearea matching 
    // the given row and column
    function getTile(row, col) {
        for (let t = 0; t < TILES_COUNT; t++) {
            let tileClassList = document.getElementById("puzzlearea").children[t].classList;
            if (tileClassList.contains("row" + row) && tileClassList.contains("col" + col)) {
                return t;
            }
        }
    };

    // Moves a tile of a given index into the empty space by changing the tile's
    // row and column class, then resetting the row and column of the empty tile
    function moveTile(tileIndex, newEmptyRow, newEmptyCol) {
        let tile = document.getElementById("puzzlearea").children[tileIndex];
        // reset the classes of the tile
        tile.className = "";
        tile.classList.add("row" + emptyRow, "col" + emptyCol, "neighbor");
        // update the empty row and column variables
        emptyRow = newEmptyRow;
        emptyCol = newEmptyCol;
        setAllNeighbors();
    };

    // Adds "neighbor" class to a tile in a given row and column and adds onclick 
    // functionality
    function setNeighbor(row, col, direction) {
        let puzzle = document.getElementById("puzzlearea");
        let tile = getTile(row, col);
        puzzle.children[tile].classList.add("neighbor", direction);
        puzzle.children[tile].onclick = function() {
            moveTile(tile, row, col);
        }
    };

    // Finds the tiles orthogonally adjacent to the empty tile space and calls
    // the setNeighbor() function to label them and add onclick functionality
    function setAllNeighbors() {
        let puzzle = document.getElementById("puzzlearea");
        // clear the "neighbor" and related classes from all tiles
        for (let t = 0; t < TILES_COUNT; t++) {
            puzzle.children[t].classList.remove("neighbor", "up", "right", "down", "left");
            puzzle.children[t].onclick = null;
        }
        // Set the "up" neighbor
        if (emptyRow > 0) {
            setNeighbor(emptyRow - 1, emptyCol, "up");
        }
        // Set the "right" neighbor
        if (emptyCol < 3) {
            setNeighbor(emptyRow, emptyCol + 1, "right");
        }
        // Set the "down" neighbor
        if (emptyRow < 3) {
            setNeighbor(emptyRow + 1, emptyCol, "down");
        }
        // Set the "left" neighbor
        if (emptyCol > 0) {
            setNeighbor(emptyRow, emptyCol - 1, "left");
        }
    };

    // Shuffles the tiles by performing a valid tile move 1,000 times.
    function shuffle() {
        for (let i = 0; i <= 1000; i++) {
            // make a list of all the neighbors
            let neighbors = [];
            for (let t = 0; t < TILES_COUNT; t++) {
                let tileClassList = document.getElementById("puzzlearea").children[t].classList;
                if (tileClassList.contains("neighbor")) {
                    neighbors.push(t);
                }
            }
            // randomly select a neighbor to move
            let randomTile = Math.floor(Math.random() * neighbors.length);
            let tileClassList = document.getElementById("puzzlearea").children[neighbors[randomTile]].classList;
            if (tileClassList.contains("up")) {
                moveTile(neighbors[randomTile], emptyRow - 1, emptyCol);
            } else if (tileClassList.contains("right")) {
                moveTile(neighbors[randomTile], emptyRow, emptyCol + 1);
            } else if (tileClassList.contains("down")) {
                moveTile(neighbors[randomTile], emptyRow + 1, emptyCol);
            } else { // move the "left" tile
                moveTile(neighbors[randomTile], emptyRow, emptyCol - 1);
            }
        }
    };
})();
