function setDimensions(cols, rows) {
    NUM_COLS = cols;
    NUM_ROWS = rows;
}

setDimensions(7, 14);

function layout() {
    breakColumns(NUM_COLS);
    breakRows(NUM_ROWS);
}

function breakColumns(cols) {
    const increment = 100 / cols;
    for (let i = 0 ; i < cols ; i++) {
        const elements = document.getElementsByClassName(`align-col-${ ( i + 1 ) }`);
        for (const e of elements) {            
            e.setAttribute('x', `${ i * increment }%`);
            e.setAttribute('width', `${ increment }%`);
        }
    }
}

function breakRows(rows) {
    const increment = 100 / rows;    
    for (let i = 0 ; i < rows ; i++) {
        const elements = document.getElementsByClassName(`align-row-${ ( i + 1 ) }`);
        for (const e of elements) {
            e.setAttribute('y', `${ Math.floor(i * increment) }%`);
            e.setAttribute('height', `${ Math.floor(increment) }%`);
        }
    }
}