const lifeCanvas = document.querySelector("#life-board");
const lifeContext = lifeCanvas.getContext("2d");

if (!lifeContext) {
    throw new Error("No se pudo inicializar el canvas del Juego de la Vida.");
}

const columns = 80;
const rows = 45;
const cellWidth = lifeCanvas.width / columns;
const cellHeight = lifeCanvas.height / rows;
let cells = new Uint8Array(columns * rows);
let running = false;
let frameRequest = 0;
let lastFrameTime = 0;
let drawing = false;
let drawValue = 1;

const toggleButton = document.querySelector("#life-toggle");
const speedInput = document.querySelector("#life-speed");
const speedValue = document.querySelector("#life-speed-value");
const densityInput = document.querySelector("#life-density");
const densityValue = document.querySelector("#life-density-value");
const status = document.querySelector("#life-status");

const cellIndex = (x, y) => y * columns + x;

const render = () => {
    lifeContext.fillStyle = "#101411";
    lifeContext.fillRect(0, 0, lifeCanvas.width, lifeCanvas.height);

    lifeContext.fillStyle = "#a6f0b0";
    for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
            if (cells[cellIndex(x, y)]) {
                lifeContext.fillRect(
                    x * cellWidth + 1,
                    y * cellHeight + 1,
                    cellWidth - 2,
                    cellHeight - 2
                );
            }
        }
    }

    lifeContext.beginPath();
    lifeContext.strokeStyle = "rgb(154 169 158 / 16%)";
    lifeContext.lineWidth = 1;

    for (let x = 0; x <= columns; x += 1) {
        const position = x * cellWidth + 0.5;
        lifeContext.moveTo(position, 0);
        lifeContext.lineTo(position, lifeCanvas.height);
    }

    for (let y = 0; y <= rows; y += 1) {
        const position = y * cellHeight + 0.5;
        lifeContext.moveTo(0, position);
        lifeContext.lineTo(lifeCanvas.width, position);
    }

    lifeContext.stroke();
};

const advance = () => {
    const nextCells = new Uint8Array(cells.length);

    for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < columns; x += 1) {
            let neighbors = 0;

            for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
                for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
                    if (offsetX === 0 && offsetY === 0) {
                        continue;
                    }

                    const neighborX = x + offsetX;
                    const neighborY = y + offsetY;

                    if (
                        neighborX >= 0
                        && neighborX < columns
                        && neighborY >= 0
                        && neighborY < rows
                    ) {
                        neighbors += cells[cellIndex(neighborX, neighborY)];
                    }
                }
            }

            const alive = cells[cellIndex(x, y)] === 1;
            nextCells[cellIndex(x, y)] = neighbors === 3 || (alive && neighbors === 2) ? 1 : 0;
        }
    }

    cells = nextCells;
};

const animate = (timestamp) => {
    if (!running) {
        return;
    }

    const frameDuration = 1000 / Number(speedInput.value);
    if (timestamp - lastFrameTime >= frameDuration) {
        advance();
        render();
        lastFrameTime = timestamp;
    }

    frameRequest = window.requestAnimationFrame(animate);
};

const setRunning = (shouldRun) => {
    running = shouldRun;
    toggleButton.textContent = running ? "Pausar" : "Reanudar";
    toggleButton.setAttribute("aria-pressed", String(running));
    status.textContent = running
        ? "Simulación en marcha. Paúsala para dibujar células."
        : "Simulación pausada. Haz clic o arrastra para dibujar o borrar células.";

    if (running) {
        lastFrameTime = performance.now();
        frameRequest = window.requestAnimationFrame(animate);
    } else {
        window.cancelAnimationFrame(frameRequest);
    }
};

const getCellFromPointer = (event) => {
    const bounds = lifeCanvas.getBoundingClientRect();
    const x = Math.floor(((event.clientX - bounds.left) / bounds.width) * columns);
    const y = Math.floor(((event.clientY - bounds.top) / bounds.height) * rows);

    if (x < 0 || x >= columns || y < 0 || y >= rows) {
        return null;
    }

    return { x, y };
};

const drawAtPointer = (event) => {
    const point = getCellFromPointer(event);
    if (!point) {
        return;
    }

    cells[cellIndex(point.x, point.y)] = drawValue;
    render();
};

lifeCanvas.addEventListener("pointerdown", (event) => {
    if (running) {
        status.textContent = "Pausa la simulación para dibujar células.";
        return;
    }

    event.preventDefault();
    drawing = true;
    const point = getCellFromPointer(event);
    drawValue = point && cells[cellIndex(point.x, point.y)] ? 0 : 1;
    lifeCanvas.setPointerCapture(event.pointerId);
    drawAtPointer(event);
});

lifeCanvas.addEventListener("pointermove", (event) => {
    if (drawing && !running) {
        drawAtPointer(event);
    }
});

lifeCanvas.addEventListener("pointerup", () => {
    drawing = false;
});

lifeCanvas.addEventListener("pointercancel", () => {
    drawing = false;
});

const parseRle = (rle) => {
    const pattern = [];
    let x = 0;
    let y = 0;
    let countText = "";

    for (const character of rle) {
        if (/\d/.test(character)) {
            countText += character;
            continue;
        }

        const count = Number(countText || 1);
        countText = "";

        if (character === "$") {
            y += count;
            x = 0;
        } else if (character === "!") {
            break;
        } else if (character === "b" || character === "o") {
            for (let index = 0; index < count; index += 1) {
                if (character === "o") {
                    pattern.push([x, y]);
                }

                x += 1;
            }
        }
    }

    return pattern;
};

const pulsarPattern = [];
for (const y of [0, 5, 7, 12]) {
    for (const x of [2, 3, 4, 8, 9, 10]) {
        pulsarPattern.push([x, y]);
    }
}
for (const y of [2, 3, 4, 8, 9, 10]) {
    for (const x of [0, 5, 7, 12]) {
        pulsarPattern.push([x, y]);
    }
}

const patterns = {
    gosper: {
        width: 36,
        height: 9,
        cells: parseRle("24bo$22bobo$12b2o6b2o12b2o$11bo2bo4b2o12b2o$2o8b2o2bo4b2o$2o8b2o6b2o$10bo2bo$11b2o!")
    },
    pulsar: { width: 13, height: 13, cells: pulsarPattern },
    lwss: {
        width: 5,
        height: 4,
        cells: [[1, 0], [4, 0], [0, 1], [0, 2], [4, 2], [0, 3], [1, 3], [2, 3], [3, 3]]
    }
};

document.querySelectorAll("[data-life-pattern]").forEach((button) => {
    button.addEventListener("click", () => {
        const pattern = patterns[button.dataset.lifePattern];
        const startX = Math.floor((columns - pattern.width) / 2);
        const startY = Math.floor((rows - pattern.height) / 2);

        for (const [x, y] of pattern.cells) {
            cells[cellIndex(startX + x, startY + y)] = 1;
        }

        render();
        status.textContent = `${button.textContent} insertado en el centro del tablero.`;
    });
});

toggleButton.addEventListener("click", () => setRunning(!running));

speedInput.addEventListener("input", () => {
    speedValue.value = speedInput.value;
    speedValue.textContent = speedInput.value;
});

densityInput.addEventListener("input", () => {
    densityValue.value = densityInput.value;
    densityValue.textContent = densityInput.value;
});

document.querySelector("#life-randomize").addEventListener("click", () => {
    const probability = Number(densityInput.value) / 100;
    cells = Uint8Array.from(cells, () => (Math.random() < probability ? 1 : 0));
    render();
    status.textContent = `Tablero aleatorizado con ${densityInput.value}% de densidad.`;
});

document.querySelector("#life-clear").addEventListener("click", () => {
    setRunning(false);
    cells.fill(0);
    render();
    status.textContent = "Tablero limpio.";
});

render();
