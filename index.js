import inquirer from "inquirer";
import chalk from "chalk";
import chalkAnimation from "chalk-animation";
let correct_pass = (/^[0-9]{4}$/);
let min_bal = 1000;
const sleep = () => {
    return new Promise((res) => {
        setTimeout(res, 2000);
    });
};
async function welcome() {
    let title = chalkAnimation.rainbow('Starting ATM ...');
    await sleep();
    title.stop();
}
await welcome();
let passTry = 3;
async function askPin() {
    const { name } = await inquirer.prompt([
        {
            type: "string",
            name: "name",
            message: "Enter your name"
        }
    ]);
    const { bankName } = await inquirer
        .prompt([
        /* Pass your questions in here */
        {
            type: "list",
            name: "operator",
            message: `Dear ${name} What is your bank name? \n`,
            choices: ["HBL", "ABL", "SCB", "MCB"]
        }
    ]);
    const { pin } = await inquirer.prompt([
        {
            type: "number",
            name: "pin",
            message: `Dear ${name} , Enter your 4 digits PIN`
        }
    ]);
    await checkPassword(pin, name);
}
async function checkPassword(password, name) {
    if (correct_pass.test(password)) {
        await optionMenu();
    }
    else {
        passTry = 3;
        while (!(correct_pass.test(password))) {
            console.log(chalk.red("You don't a valid PIN, input the correct one now \n"));
            console.log(chalk.red(`You have only ${passTry--} chances to try \n`));
            if (passTry === 0) {
                console.log(chalk.red("Maximum tries exceeded, please contact your bank to retrieve your ATM card"));
                return;
            }
            const { pin } = await inquirer.prompt([
                {
                    type: "number",
                    name: "pin",
                    message: `Dear ${name} , Enter your 4 digits PIN`
                }
            ]);
        }
        await optionMenu();
    }
}
// menu selection
async function optionMenu() {
    const { select_account } = await inquirer
        .prompt([
        /* Pass your questions in here */
        {
            type: "list",
            name: "select_account",
            message: `Which type of account do you have?\n`,
            choices: ["Savings", "Current", "Credit"]
        }
    ]);
    if (select_account) {
        const { atm_functions } = await inquirer
            .prompt([
            /* Pass your questions in here */
            {
                type: "list",
                name: "atm_functions",
                message: `Hello, customer, what can we do for you today ?\n`,
                choices: ["Inquiry", "withdrawal", "Deposit", "Exit"]
            }
        ]);
        if (atm_functions) {
            switch (atm_functions) {
                case "Inquiry":
                    await inquiry();
                    break;
                case "withdrawal":
                    await withdrawal();
                    break;
                case "Deposit":
                    await deposit();
                    break;
                case "Exit":
                    console.log(chalk.red(`Allah Hafiz!!`));
                    break;
                default:
                    console.log(chalk.red(`Please make a valid selection`));
                    break;
            }
        }
    }
}
var availableBal = 35000;
// to calculate the balance for before, during and after withdrawal and deposit
async function inquiry() {
    console.log(chalk.yellow("Your avaialable balance is " + availableBal));
    await toContinue();
}
async function deposit() {
    let { deposit } = await inquirer.prompt([
        {
            type: "number",
            name: "deposit",
            message: `How much do you want to deposit?`
        }
    ]);
    if (isNaN(deposit) || deposit === " ") {
        console.log(chalk.red('Error: please enter a number!'));
        await deposit();
    }
    availableBal = availableBal + deposit;
    console.log(chalk.green("You have successfully deposited " + deposit + " ...You now have " + availableBal));
    await toContinue();
}
async function withdrawal() {
    let { withdrawal } = await inquirer.prompt([
        {
            type: "number",
            name: "withdrawal",
            message: `How much do you want to withdraw ? \t The minimum amount you can withdraw is 1000`
        }
    ]);
    if (isNaN(withdrawal) || withdrawal === " ") {
        console.log(chalk.red('Error: please enter a number!'));
        await withdrawal();
    }
    if (withdrawal > availableBal) {
        console.log(chalk.red("You have insufficient funds"));
    }
    else {
        availableBal = availableBal - withdrawal;
        console.log(chalk.green("transaction is successful"));
        console.log(chalk.green("Your remaining balance is " + availableBal));
    }
    await toContinue();
}
async function toContinue() {
    const { again } = await inquirer
        .prompt([
        /* Pass your questions in here */
        {
            type: "list",
            name: "again",
            message: `Do you want to perform another transaction?\n`,
            choices: ["Yes", "No"]
        }
    ]);
    if (again) {
        switch (again) {
            case "Yes":
                await optionMenu();
                break;
            case "No":
                break;
            default:
                break;
        }
    }
}
async function restart() {
    do {
        await askPin();
        var inp = await inquirer.prompt([
            {
                type: "input",
                name: "choice",
                message: "Do you want to start again? enter y/n"
            }
        ]);
    } while (inp.choice === 'y');
}
restart();
