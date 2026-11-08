
let display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

// Calculator variables
let currentInput = "0";
let firstOperand = null;
let secondOperand = null;
let selectedOperator = null;
let waitingForSecondOperand = false;

// Repeated equals
let lastOperator = null;
let lastOperand = null;

// Calculation History
let history = [];

try {
    history = JSON.parse(
        localStorage.getItem("calculatorHistory")
    ) || [];
} catch {
    history = [];
}

// Update calculator display
function updateDisplay() {
    if (selectedOperator !== null) {
        if (waitingForSecondOperand) {
            display.textContent = `${firstOperand} ${selectedOperator}`;
        } else {
            display.textContent =
                `${firstOperand} ${selectedOperator} ${currentInput}`;
        }
    } else {
        display.textContent = currentInput;
    }
}

// Perform calculation
function calculate(first, operator, second) {
    if (operator === "+") {
        return first + second;
    } else if (operator === "-") {
        return first - second;
    } else if (operator === "*") {
        return first * second;
    } else if (operator === "/") {
        if (second === 0) {
            return "Cannot divide by zero";
        }
        return first / second;
    }
}

// Save calculation to history
function saveHistory(first, operator, second, result) {
    let calculation = {
        firstOperand: first,
        operator: operator,
        secondOperand: second,
        result: result
    };

    history.push(calculation);

    // Keep only the latest 10 calculations
    if (history.length > 7) {
        history = history.slice(-7);
    }

    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(history)
    );

    displayHistory();
}

// Display calculation history
function displayHistory() {
    const historyList = document.getElementById("history-list");

    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.innerHTML = "<p>No calculations yet.</p>";
        return;
    }

    history.forEach((calculation) => {
        const item = document.createElement("div");
        item.className = "history-item";

        const expression = document.createElement("div");
        expression.className = "history-expression";

        expression.textContent =
            `${calculation.firstOperand} ${calculation.operator} ${calculation.secondOperand}`;

        const result = document.createElement("div");
        result.className = "history-result";

        result.textContent = calculation.result;

        item.appendChild(expression);
        item.appendChild(result);

        historyList.appendChild(item);
    });
}

// Display previously saved history on page load
displayHistory();

// Button event listener
buttons.forEach((button) => {

    button.addEventListener("click", () => {

        const vr = button.textContent;

        // Number input
        if (["0","1","2","3","4","5","6","7","8","9"].includes(vr)) {

            if (waitingForSecondOperand) {

                if (selectedOperator === null) {
                    lastOperator = null;
                    lastOperand = null;
                }

                currentInput = vr;
                waitingForSecondOperand = false;

            } else if (currentInput === "0") {
                currentInput = vr;

            } else {
                currentInput = currentInput + vr;
            }
        }

        // Decimal point
        else if (vr === ".") {

            if (waitingForSecondOperand) {

                if (selectedOperator === null) {
                    lastOperator = null;
                    lastOperand = null;
                }

                currentInput = "0.";
                waitingForSecondOperand = false;

            } else if (!currentInput.includes(".")) {
                currentInput = currentInput + ".";
            }
        }

        // Backspace
        else if (vr === "␡") {

            if (waitingForSecondOperand && selectedOperator !== null) {
                return;
            }

            if (waitingForSecondOperand) {
                lastOperator = null;
                lastOperand = null;
                waitingForSecondOperand = false;
            }

            if (currentInput.length <= 1 ||
                (currentInput.length === 2 && currentInput.startsWith("-"))) {

                currentInput = "0";

            } else {
                currentInput = currentInput.slice(0, -1);
            }
        }

        // Sign toggle
        else if (vr === "±") {

            if (waitingForSecondOperand && selectedOperator !== null) {
                return;
            }

            if (waitingForSecondOperand) {
                lastOperator = null;
                lastOperand = null;
                waitingForSecondOperand = false;
            }

            if (currentInput !== "0") {

                if (currentInput.startsWith("-")) {
                    currentInput = currentInput.slice(1);
                } else {
                    currentInput = "-" + currentInput;
                }
            }
        }

        // Percentage
        else if (vr === "%") {

            if (waitingForSecondOperand && selectedOperator !== null) {
                return;
            }

            if (waitingForSecondOperand) {
                lastOperator = null;
                lastOperand = null;
                waitingForSecondOperand = false;
            }

            currentInput = String(Number(currentInput) / 100);
        }

        // Clear
        else if (vr === "C") {

            currentInput = "0";
            firstOperand = null;
            secondOperand = null;
            selectedOperator = null;
            waitingForSecondOperand = false;
            lastOperator = null;
            lastOperand = null;
        }

        // Operator selection
        else if (["+","-","*","/"].includes(vr)) {

            if (!Number.isFinite(Number(currentInput))) {
                return;
            }

            // Calculate pending operation first
            if (selectedOperator !== null && !waitingForSecondOperand) {

                secondOperand = Number(currentInput);

                let result = calculate(
                    firstOperand,
                    selectedOperator,
                    secondOperand
                );

                if (typeof result !== "number" || !Number.isFinite(result)) {

                    currentInput = String(result);
                    firstOperand = null;
                    selectedOperator = null;
                    lastOperator = null;
                    lastOperand = null;
                    waitingForSecondOperand = true;

                    updateDisplay();
                    return;
                }

                saveHistory(
                    firstOperand,
                    selectedOperator,
                    secondOperand,
                    result
                );

                currentInput = String(result);
                firstOperand = result;
            }

            firstOperand = Number(currentInput);
            selectedOperator = vr;
            waitingForSecondOperand = true;
        }

        // Equals
        else if (vr === "=") {

            let result;

            if (selectedOperator !== null) {

                secondOperand = Number(currentInput);

                lastOperator = selectedOperator;
                lastOperand = secondOperand;

                result = calculate(
                    firstOperand,
                    selectedOperator,
                    secondOperand
                );

            } else if (lastOperator !== null) {

                firstOperand = Number(currentInput);
                secondOperand = lastOperand;

                result = calculate(
                    firstOperand,
                    lastOperator,
                    secondOperand
                );

            } else {
                updateDisplay();
                return;
            }

            if (typeof result === "number" && Number.isFinite(result)) {

                saveHistory(
                    firstOperand,
                    selectedOperator !== null ? selectedOperator : lastOperator,
                    secondOperand,
                    result
                );

                currentInput = String(result);

            } else {

                currentInput = String(result);
                lastOperator = null;
                lastOperand = null;
            }

            firstOperand = null;
            selectedOperator = null;
            secondOperand = null;
            waitingForSecondOperand = true;
        }

        // Update display
        updateDisplay();

    });

});

