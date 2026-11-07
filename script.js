
let display = document.getElementById("display");
const buttons = document.querySelectorAll(".buttons button");

let currentInput = "0";
let firstOperand = null;
let secondOperand = null;
let selectedOperator = null;
let waitingForSecondOperand = false;

let lastOperator = null;
let lastOperand = null;

buttons.forEach((button) => {
    button.addEventListener("click", () => {
        const vr = button.textContent;

        // Number input
        if (["0","1","2","3","4","5","6","7","8","9"].includes(vr)) {
            if (waitingForSecondOperand) {
                currentInput = vr;
                waitingForSecondOperand = false;
            } else {
                if (currentInput === "0") {
                    currentInput = vr;
                } else {
                    currentInput = currentInput + vr;
                }
            }

            if (selectedOperator === null) {
                display.textContent = currentInput;
            } else {
                display.textContent =
                    `${firstOperand} ${selectedOperator} ${currentInput}`;
            }
        }

        // Operator selection
        if (["+","-","*","/"].includes(vr)) {
            firstOperand = Number(currentInput);
            selectedOperator = vr;
            waitingForSecondOperand = true;

            display.textContent = `${firstOperand} ${selectedOperator}`;
        }

        // Clear
        if (vr === "C") {
            currentInput = "0";
            firstOperand = null;
            secondOperand = null;
            selectedOperator = null;
            waitingForSecondOperand = false;
            lastOperator = null;
            lastOperand = null;

            display.textContent = "0";
        }

        // Equals
        if (vr === "=") {
            let result;

            if (lastOperator === null || selectedOperator !== null) {
                secondOperand = Number(currentInput);

                lastOperator = selectedOperator;
                lastOperand = secondOperand;
            } else {
                firstOperand = Number(currentInput);
                secondOperand = lastOperand;
                selectedOperator = lastOperator;
            }

            if (selectedOperator === "+") {
                result = firstOperand + secondOperand;
            } else if (selectedOperator === "-") {
                result = firstOperand - secondOperand;
            } else if (selectedOperator === "*") {
                result = firstOperand * secondOperand;
            } else if (selectedOperator === "/") {
                if (secondOperand === 0) {
                    result = "Cannot divide by zero";
                } else {
                    result = firstOperand / secondOperand;
                }
            }

            display.textContent = result;
            currentInput = String(result);

            firstOperand = null;
            selectedOperator = null;
            secondOperand = null;
            waitingForSecondOperand = true;
        }
    });
});
