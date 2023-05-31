// 1. Deposit some money
// 2. Determine number of lines to bet on
// 3. Collect a bet amount
// 4. Spin slot machine
// 5. Check if user won
// 6. If user won, add winnings to balance
// 7. If user lost, subtract bet amount from balance
// 8. Play again

// Run through terminal with "node project.js"

const prompt = require("prompt-sync")();    // prompt-sync is a node module that allows you to prompt for user input and read user input from the console in a terminal or command-line app

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = { // object with key-value pairs
    A: 2,
    B: 4,
    C: 6,
    D: 8
}

const SYMBOL_VALUES = {
    A: 5,
    B: 4,
    C: 3,
    D: 2
}

//collect deposit from user
const getDeposit = () => {
    while (true) {
        const depositAmount = prompt("Enter a deposit amount: "); // prompt() displays a dialog box that prompts the user for input
        const numberDepositAmount = parseFloat(depositAmount);

        if (isNaN(numberDepositAmount) || numberDepositAmount < 0) {
            console.log("Invalid input. Try again.");
            deposit();
        } else {
            return numberDepositAmount;
        }
    }
};
// collect number of lines to bet on
const getLines = () => {
    while (true) {
        const lines = prompt("Enter number of lines to bet on (1-3): ");
        const numberLines = parseFloat(lines);

        if (isNaN(numberLines) || numberLines <= 0 || numberLines > 3) {
            console.log("Invalid number of lines. Try again.");
        } else {
            return numberLines;
        }
    }
};

// collect bet amount
const getBet = (balance, lines) => {
    while (true) {
        const betAmount = prompt("Enter a bet amount (per line): ");
        const numberBetAmount = parseFloat(betAmount);

        if (isNaN(numberBetAmount) || numberBetAmount < 0) {
            console.log("Bet cannot be 0. Try again.");
        } else if (numberBetAmount > balance / lines) {
            console.log("Bet amount exceeds balance. Try again.");
        } else {
            return numberBetAmount;
        }
    }
};

const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) { // Object.entries returns an array of a given object's own enumerable string-keyed property [key, value] pairs
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols]; // copy of symbols
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length); // Math.floor() returns the largest integer less than or equal to a given number 
            const selectedSymbol = reelSymbols[randomIndex];
            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1); // splice() changes the contents of an array by removing or replacing existing elements and/or adding new elements  
        }
    }
    return reels;
}
//transposes reels array
const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
}

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i < row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
}

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            const symbol = symbols[0];
            const value = SYMBOL_VALUES[symbol];
            winnings += value * bet;
        }
    }
    return winnings;
}

const game = () => {
    let balance = getDeposit();

    while (true) {
        console.log("Current balance is: $" + balance.toString());
        const lines = getLines();
        const bet = getBet(balance, lines);
        balance -= bet * lines;

        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, lines);
        if (winnings != 0) {
            console.log("You won $" + winnings.toString());
            balance += winnings;
        } else {
            console.log("You lost");
        }
        if (balance <= 0) {
            console.log("You lost all your money. Game over.");
            break;
        }
        const playAgain = prompt("Play again? (y/n): ");
        if (playAgain != "y") break;
    }
}


game();
