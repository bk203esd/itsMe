window.i18nReady.then(() => {
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
        fahrenheitResult.textContent = t("tool.temperature.empty");
        return;
    }

    const celsius = Number(celsiusInput.value);

    if (!Number.isFinite(celsius)) {
        fahrenheitResult.textContent = t("tool.temperature.invalid");
        return;
    }

    const converted = isFahrenheitToCelsius ? ((celsius - 32) * 5) / 9 : (celsius * 9) / 5 + 32;
    const fromUnit = isFahrenheitToCelsius ? "°F" : "°C";
    const toUnit = isFahrenheitToCelsius ? "°C" : "°F";
    fahrenheitResult.textContent = `${celsius} ${fromUnit} = ${converted.toFixed(2)} ${toUnit}`;
};

celsiusInput.addEventListener("input", convertTemperature);
const updateTemperatureControls = () => {
    const inputUnit = isFahrenheitToCelsius ? "°F" : "°C";
    const inputName = isFahrenheitToCelsius ? "Fahrenheit" : "Celsius";

    temperatureInputLabel.textContent = t("tool.temperature.input", { unit: inputName });
    temperatureUnit.textContent = inputUnit;
    temperatureSwapButton.setAttribute("aria-label", t(
        isFahrenheitToCelsius ? "tool.swap.temperature.reverse" : "tool.swap.temperature"
    ));
    celsiusInput.placeholder = t(
        isFahrenheitToCelsius ? "tool.temperature.placeholderReverse" : "tool.temperature.placeholder"
    );
    convertTemperature();
};

temperatureSwapButton.addEventListener("click", () => {
    isFahrenheitToCelsius = !isFahrenheitToCelsius;
    updateTemperatureControls();
});
updateTemperatureControls();

const storageValue = document.querySelector("#storage-value");
const storageFrom = document.querySelector("#storage-from");
const storageTo = document.querySelector("#storage-to");
const storageResult = document.querySelector("#storage-result");
const decimalByteUnits = { b: 0.125, B: 1, KB: 1e3, MB: 1e6, GB: 1e9, TB: 1e12 };

const convertStorage = () => {
    if (storageValue.value.trim() === "") {
        storageResult.textContent = t("tool.storage.empty");
        return;
    }

    const value = Number(storageValue.value);

    if (!Number.isFinite(value) || value < 0) {
        storageResult.textContent = t("tool.storage.invalid");
        return;
    }

    const converted = (value * decimalByteUnits[storageFrom.value]) / decimalByteUnits[storageTo.value];
    storageResult.textContent = `${value} ${storageFrom.value} = ${Number(converted.toPrecision(12))} ${storageTo.value}`;
};

storageValue.addEventListener("input", convertStorage);
storageFrom.addEventListener("change", convertStorage);
storageTo.addEventListener("change", convertStorage);
convertStorage();

const squareMetersInput = document.querySelector("#square-meters");
const hectaresResult = document.querySelector("#hectares-result");
const areaInputLabel = document.querySelector("#area-input-label");
const areaUnit = document.querySelector("#area-unit");
const areaSwapButton = document.querySelector("#swap-area");
let isHectaresToSquareMeters = false;

const convertArea = () => {
    if (squareMetersInput.value.trim() === "") {
        hectaresResult.textContent = t("tool.area.empty");
        return;
    }

    const squareMeters = Number(squareMetersInput.value);

    if (!Number.isFinite(squareMeters) || squareMeters < 0) {
        hectaresResult.textContent = t("tool.area.invalid");
        return;
    }

    const converted = isHectaresToSquareMeters ? squareMeters * 10000 : squareMeters / 10000;
    const fromUnit = isHectaresToSquareMeters ? "ha" : "m²";
    const toUnit = isHectaresToSquareMeters ? "m²" : "ha";
    hectaresResult.textContent = `${squareMeters} ${fromUnit} = ${converted} ${toUnit}`;
};

squareMetersInput.addEventListener("input", convertArea);
const updateAreaControls = () => {
    const inputUnit = isHectaresToSquareMeters ? "ha" : "m²";
    const inputName = isHectaresToSquareMeters ? t("tool.area.hectares") : t("tool.area.squareMeters");

    areaInputLabel.textContent = t("tool.area.input", { unit: inputName });
    areaUnit.textContent = inputUnit;
    areaSwapButton.setAttribute("aria-label", t(
        isHectaresToSquareMeters ? "tool.swap.area.reverse" : "tool.swap.area"
    ));
    squareMetersInput.placeholder = t(
        isHectaresToSquareMeters ? "tool.area.placeholderReverse" : "tool.area.placeholder"
    );
    convertArea();
};

areaSwapButton.addEventListener("click", () => {
    isHectaresToSquareMeters = !isHectaresToSquareMeters;
    updateAreaControls();
});
updateAreaControls();

const gameResult = document.querySelector("#game-result");
const playerIcon = document.querySelector("#player-icon");
const computerIcon = document.querySelector("#computer-icon");
const gameOutcome = document.querySelector("#game-outcome");
const gameScore = document.querySelector("#game-score");
const score = { player: 0, computer: 0 };
const choices = ["rock", "paper", "scissors"];
const choiceIcons = { rock: "🪨", paper: "📄", scissors: "✂️" };
const choiceTranslationKeys = { rock: "game.rock", paper: "game.paper", scissors: "game.scissors" };
let lastGameOutcomeKey = "game.turn";
let lastGameChoices = null;

const renderGameText = () => {
    gameOutcome.textContent = t(lastGameOutcomeKey);
    gameScore.textContent = t("game.score", score);

    if (lastGameChoices) {
        gameResult.setAttribute("aria-label", t("game.round", {
            player: t(choiceTranslationKeys[lastGameChoices.player]).toLowerCase(),
            computer: t(choiceTranslationKeys[lastGameChoices.computer]).toLowerCase()
        }));
    }
};

document.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => {
        const playerChoice = button.dataset.choice;
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];
        let outcomeKey = "game.draw";

        if (playerChoice !== computerChoice) {
            const playerWins =
                (playerChoice === "rock" && computerChoice === "scissors")
                || (playerChoice === "paper" && computerChoice === "rock")
                || (playerChoice === "scissors" && computerChoice === "paper");

            if (playerWins) {
                score.player += 1;
                outcomeKey = "game.win";
            } else {
                score.computer += 1;
                outcomeKey = "game.lose";
            }
        }

        playerIcon.textContent = choiceIcons[playerChoice];
        computerIcon.textContent = choiceIcons[computerChoice];
        lastGameOutcomeKey = outcomeKey;
        lastGameChoices = { player: playerChoice, computer: computerChoice };
        renderGameText();
    });
});
renderGameText();

const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskMessage = document.querySelector("#task-message");
const storageKey = "guillem-interaccion-tasks";
let tasks = [];
let taskMessageKey = "";

const setTaskMessage = (key) => {
    taskMessageKey = key;
    taskMessage.textContent = key ? t(key) : "";
};

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
    setTaskMessage("tasks.loadError");
    console.error("Error al cargar las tareas:", error);
}

const saveTasks = () => {
    try {
        localStorage.setItem(storageKey, JSON.stringify(tasks));
        setTaskMessage("");
        return true;
    } catch (error) {
        setTaskMessage("tasks.saveError");
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
        checkbox.setAttribute("aria-label", t("tasks.mark", {
            state: t(task.completed ? "tasks.completed" : "tasks.pending"),
            text: task.text
        }));
        label.htmlFor = checkbox.id;
        label.textContent = task.text;
        deleteButton.className = "delete-button";
        deleteButton.type = "button";
        deleteButton.textContent = t("tasks.delete");
        deleteButton.setAttribute("aria-label", t("tasks.deleteLabel", { text: task.text }));

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
        setTaskMessage("tasks.inputError");
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

document.addEventListener("languagechange", () => {
    updateTemperatureControls();
    convertStorage();
    updateAreaControls();
    renderGameText();
    renderTasks();
    setTaskMessage(taskMessageKey);
});
});
