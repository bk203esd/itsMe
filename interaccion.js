const celsiusInput = document.querySelector("#celsius");
const fahrenheitResult = document.querySelector("#fahrenheit-result");
const temperatureInputLabel = document.querySelector("#temperature-input-label");
const temperatureUnit = document.querySelector("#temperature-unit");
const temperatureSwapButton = document.querySelector("#swap-temperature");
let isFahrenheitToCelsius = false;
const converterTabs = [...document.querySelectorAll('[role="tab"]')];

const activateConverterTab = (selectedTab) => {
    for (const tab of converterTabs) {
        const isSelected = tab === selectedTab;
        tab.setAttribute("aria-selected", String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
        document.querySelector(`#${tab.getAttribute("aria-controls")}`).hidden = !isSelected;
    }
};

converterTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => activateConverterTab(tab));
    tab.addEventListener("keydown", (event) => {
        let nextIndex;

        if (event.key === "ArrowRight") {
            nextIndex = (index + 1) % converterTabs.length;
        } else if (event.key === "ArrowLeft") {
            nextIndex = (index - 1 + converterTabs.length) % converterTabs.length;
        } else if (event.key === "Home") {
            nextIndex = 0;
        } else if (event.key === "End") {
            nextIndex = converterTabs.length - 1;
        } else {
            return;
        }

        event.preventDefault();
        converterTabs[nextIndex].focus();
        activateConverterTab(converterTabs[nextIndex]);
    });
});

const convertTemperature = () => {
    if (celsiusInput.value.trim() === "") {
        fahrenheitResult.textContent = "Introduce una temperatura para convertirla.";
        return;
    }

    const celsius = Number(celsiusInput.value);

    if (!Number.isFinite(celsius)) {
        fahrenheitResult.textContent = "Introduce una temperatura válida.";
        return;
    }

    const converted = isFahrenheitToCelsius ? ((celsius - 32) * 5) / 9 : (celsius * 9) / 5 + 32;
    const fromUnit = isFahrenheitToCelsius ? "°F" : "°C";
    const toUnit = isFahrenheitToCelsius ? "°C" : "°F";
    fahrenheitResult.textContent = `${celsius} ${fromUnit} = ${converted.toFixed(2)} ${toUnit}`;
};

celsiusInput.addEventListener("input", convertTemperature);
temperatureSwapButton.addEventListener("click", () => {
    isFahrenheitToCelsius = !isFahrenheitToCelsius;
    const inputUnit = isFahrenheitToCelsius ? "°F" : "°C";
    const outputUnit = isFahrenheitToCelsius ? "°C" : "°F";
    const inputName = isFahrenheitToCelsius ? "Fahrenheit" : "Celsius";
    const outputName = isFahrenheitToCelsius ? "Celsius" : "Fahrenheit";

    temperatureInputLabel.textContent = `Temperatura en grados ${inputName}`;
    temperatureUnit.textContent = inputUnit;
    temperatureSwapButton.setAttribute("aria-label", `Invertir conversión de ${inputName} a ${outputName}`);
    celsiusInput.placeholder = isFahrenheitToCelsius ? "Por ejemplo, 72" : "Por ejemplo, 22";
    convertTemperature();
});

const storageValue = document.querySelector("#storage-value");
const storageFrom = document.querySelector("#storage-from");
const storageTo = document.querySelector("#storage-to");
const storageResult = document.querySelector("#storage-result");
const decimalByteUnits = { b: 0.125, B: 1, KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12 };

const convertStorage = () => {
    if (storageValue.value.trim() === "") {
        storageResult.textContent = "Introduce una cantidad para convertirla.";
        return;
    }

    const value = Number(storageValue.value);

    if (!Number.isFinite(value) || value < 0) {
        storageResult.textContent = "Introduce una cantidad válida (cero o mayor).";
        return;
    }

    const converted = (value * decimalByteUnits[storageFrom.value]) / decimalByteUnits[storageTo.value];
    storageResult.textContent = `${value} ${storageFrom.value} = ${Number(converted.toPrecision(12))} ${storageTo.value}`;
};

storageValue.addEventListener("input", convertStorage);
storageFrom.addEventListener("change", convertStorage);
storageTo.addEventListener("change", convertStorage);

const squareMetersInput = document.querySelector("#square-meters");
const hectaresResult = document.querySelector("#hectares-result");
const areaInputLabel = document.querySelector("#area-input-label");
const areaUnit = document.querySelector("#area-unit");
const areaSwapButton = document.querySelector("#swap-area");
let isHectaresToSquareMeters = false;

const convertArea = () => {
    if (squareMetersInput.value.trim() === "") {
        hectaresResult.textContent = "Introduce una superficie para convertirla.";
        return;
    }

    const squareMeters = Number(squareMetersInput.value);

    if (!Number.isFinite(squareMeters) || squareMeters < 0) {
        hectaresResult.textContent = "Introduce una superficie válida (cero o mayor).";
        return;
    }

    const converted = isHectaresToSquareMeters ? squareMeters * 10000 : squareMeters / 10000;
    const fromUnit = isHectaresToSquareMeters ? "ha" : "m²";
    const toUnit = isHectaresToSquareMeters ? "m²" : "ha";
    hectaresResult.textContent = `${squareMeters} ${fromUnit} = ${converted} ${toUnit}`;
};

squareMetersInput.addEventListener("input", convertArea);
areaSwapButton.addEventListener("click", () => {
    isHectaresToSquareMeters = !isHectaresToSquareMeters;
    const inputUnit = isHectaresToSquareMeters ? "ha" : "m²";
    const inputName = isHectaresToSquareMeters ? "hectáreas" : "metros cuadrados";
    const outputName = isHectaresToSquareMeters ? "metros cuadrados" : "hectáreas";

    areaInputLabel.textContent = `Superficie en ${inputName}`;
    areaUnit.textContent = inputUnit;
    areaSwapButton.setAttribute("aria-label", `Invertir conversión de ${inputName} a ${outputName}`);
    squareMetersInput.placeholder = isHectaresToSquareMeters ? "Por ejemplo, 1" : "Por ejemplo, 10000";
    convertArea();
});

const gameResult = document.querySelector("#game-result");
const playerIcon = document.querySelector("#player-icon");
const computerIcon = document.querySelector("#computer-icon");
const gameOutcome = document.querySelector("#game-outcome");
const gameScore = document.querySelector("#game-score");
const score = { player: 0, computer: 0 };
const choices = ["piedra", "papel", "tijera"];
const choiceIcons = { piedra: "🪨", papel: "📄", tijera: "✂️" };

document.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
        const playerChoice = button.dataset.choice;
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
        let outcome = "Empate.";

        if (playerChoice !== computerChoice) {
            const playerWins =
                (playerChoice === "piedra" && computerChoice === "tijera")
                || (playerChoice === "papel" && computerChoice === "piedra")
                || (playerChoice === "tijera" && computerChoice === "papel");

            if (playerWins) {
                score.player += 1;
                outcome = "¡Has ganado!";
            } else {
                score.computer += 1;
                outcome = "Esta vez gana el ordenador.";
            }
        }

        playerIcon.textContent = choiceIcons[playerChoice];
        computerIcon.textContent = choiceIcons[computerChoice];
        gameResult.setAttribute("aria-label", `Tú: ${playerChoice}. Ordenador: ${computerChoice}.`);
        gameOutcome.textContent = outcome;
        gameScore.textContent = `Tú ${score.player} — ${score.computer} Ordenador`;
    });
});

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskMessage = document.querySelector("#task-message");
const storageKey = "guillem-interaccion-tasks";
let tasks = [];

try {
    const savedTasks = localStorage.getItem(storageKey);

    if (savedTasks !== null) {
        const parsedTasks = JSON.parse(savedTasks);

        if (!Array.isArray(parsedTasks) || !parsedTasks.every((task) =>
            task
            && typeof task.id === "string"
            && typeof task.text === "string"
            && typeof task.completed === "boolean"
        )) {
            throw new Error("El formato guardado no es válido.");
        }

        tasks = parsedTasks;
    }
} catch (error) {
    taskMessage.textContent = "No se pudieron cargar las tareas guardadas. Puedes añadir tareas nuevas.";
    console.error("Error al cargar las tareas:", error);
}

const saveTasks = () => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
        taskMessage.textContent = "";
        return true;
    } catch (error) {
        taskMessage.textContent = "No se pudieron guardar los cambios en este navegador.";
        console.error("Error al guardar las tareas:", error);
        return false;
    }
};

const renderTasks = () => {
    taskList.replaceChildren();

    for (const task of tasks) {
        const item = document.createElement("li");
        const checkbox = document.createElement("input");
        const label = document.createElement("label");
        const deleteButton = document.createElement("button");

        item.className = `task-item${task.completed ? " is-complete" : ""}`;
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.id = `task-${task.id}`;
        checkbox.setAttribute("aria-label", `Marcar como ${task.completed ? "pendiente" : "completada"}: ${task.text}`);
        label.htmlFor = checkbox.id;
        label.textContent = task.text;
        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.textContent = "Eliminar";
        deleteButton.setAttribute("aria-label", `Eliminar tarea: ${task.text}`);

        checkbox.addEventListener("change", () => {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        deleteButton.addEventListener("click", () => {
            tasks = tasks.filter((savedTask) => savedTask.id !== task.id);
            saveTasks();
            renderTasks();
        });

        item.append(checkbox, label, deleteButton);
        taskList.append(item);
    }
};

taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = taskInput.value.trim();

    if (!text) {
        taskMessage.textContent = "Escribe una tarea antes de añadirla.";
        taskInput.focus();
        return;
    }

    tasks.push({
        id: globalThis.crypto.randomUUID(),
        text,
        completed: false
    });
    saveTasks();
    renderTasks();
    taskForm.reset();
    taskInput.focus();
});

renderTasks();
