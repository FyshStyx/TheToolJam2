//This could probably be improved with some sort of observer pattern to trigger updateDisplay... Too bad!
//Also could probably be improved if I understood how to queue my button inputs before submitting them
//from the front end
// ----------------------------------------------------------
// ---Current attempt at making a basic fucking calculator---
// ----------------------------------------------------------

let lastInput = '0';
let currentNumber = 0;
let storedNumber = -1;
let totalNumber = 0;
let currentOperation = '';
let operationPattern = /[\+\*/=]/;
let numberPattern = /[0-9]/;

// Ok so we have two-ish input types: number and operation
// If I just figure out what each should do when followed
// by either kind of input, we'll be sweet as.
// Also I'm going back to actual math, no more stinky strings.
// Which means I will need to cast them to ints cause input
// will be as str for the purpose of checking last input.

function userInput(buttonInput) {

    if (buttonInput == 'AC') {
        resetCalculator();

    } else if (numberPattern.test(lastInput) && numberPattern.test(buttonInput)) { // Case 1a
        numberThenNumber(buttonInput);

    } else if (numberPattern.test(lastInput) && operationPattern.test(buttonInput)) { // Case 1b
        numberThenOperation(buttonInput);

    } else if (numberPattern.test(lastInput) && buttonInput == '.') { // Case 1c
        numberThenDecimal(buttonInput);

    } else if (operationPattern.test(lastInput) && numberPattern.test(buttonInput)) { // Case 2a
        operationThenNumber(buttonInput);

    } else if (operationPattern.test(lastInput) && operationPattern.test(buttonInput)) { // Case 2b
        operationThenOperation(buttonInput);

    } else if (operationPattern.test(lastInput) && buttonInput == '.') { // Case 2c
        operationThenDecimal(buttonInput);

    } else if (lastInput == '.' && numberPattern.test(buttonInput)) { // Case 3a
        decimalThenNumber(buttonInput);

    } else if (lastInput == '.' && operationPattern.test(buttonInput)) { // Case 3b
        decimalThenOperation(buttonInput);

    } else if (lastInput == '.' && buttonInput == '.') { // Case 3c
        decimalThenDecimal(buttonInput);

    }

    if (buttonInput != 'AC') {
        lastInput = buttonInput;
    }
    
    debugPrint();

}

function debugPrint() {
    console.log('------------------------------');
    console.log('lastInput: ' + lastInput);
    console.log('currentNumber:' + currentNumber);
    console.log('storedNumber:' + storedNumber);
    console.log('totalNumber:' + totalNumber);
    console.log('currentOperation:' + currentOperation);
    console.log('------------------------------');
}


// Case 1a - Number followed by Number
// Process - Append number to current num
// Show - updated current num
function numberThenNumber(input) {
    // currentNumber = currentNumber * 10;
    // currentNumber = currentNumber + parseInt(input);
    //this temp variable lets us precalculate if the number would
    //be too large while still letting us rollback the *10
    let tempNumber = 0;
    // Normal adding a number
    if (Number.isInteger(currentNumber)) {
        tempNumber = currentNumber * 10;
        tempNumber = tempNumber + parseInt(input);
    } else { // Current num is a float so we must be adding after a decimal
        //Find length of num from .
        let tempString = currentNumber.toString();
        let tempIndex = tempString.indexOf('.');
        let decimalNumbers = tempString.slice(tempIndex); // Should leave us with str of nums after . in currnum
        let indice = decimalNumbers.length; // find what inverse pow 10 we are at
        tempNumber = currentNumber + (parseInt(input) / Math.pow(10, indice));
        let tempString2 = tempNumber.toFixed(indice);// Should fix when browser doesnt round properly, intention is to round output to its expected length every time
        tempNumber = parseFloat(tempString2);
    }

    //prevent inputs that would overflow screensize
    //otherwise the input is discarded
    if (numTooLong(tempNumber, 9) == false) {
        currentNumber = tempNumber;
    }

    updateDisplay(currentNumber);
}

// Case 1b - Number followed by Operation
// Process - Save operation to expression.
// If stored number != -1, then we need to compute
// the pending expression first
// Show - no change
function numberThenOperation(input) {
    if (storedNumber != -1) {
        totalNumber = doMath(storedNumber, currentOperation, currentNumber);
        storedNumber = -1;
        currentNumber = totalNumber;
        currentOperation = input;
        updateDisplay(totalNumber);
    } else {
        currentOperation = input;
    }
}

// Case 1c - Number followed by Decimal
function numberThenDecimal() {
    //todo?
}


// Case 2a - Operation followed by Number
// Process - Move currNumber to storedNumber
// and put this new num in curr
function operationThenNumber(input) {
    storedNumber = currentNumber;
    currentNumber = parseInt(input);
    updateDisplay(currentNumber);
}

// Case 2b - Operation followed by Operation
// Process - Replace current operation
function operationThenOperation(input) {
    currentOperation = input;
}

// Case 2c - Operation followed by Decimal
function operationThenDecimal(input) {
    //todo!
}

// Case 3a - Decimal followed by Number
//we need to add a flag to change how we multiply
//when adding numbers to curr from now on
function decimalThenNumber(input) {
    let tempNumber = currentNumber;
    tempNumber = tempNumber + (parseInt(input) / 10);

    //prevent inputs that would overflow screensize
    //otherwise the input is discarded
    if (numTooLong(tempNumber, 9) == false) {
        currentNumber = tempNumber;
    }

    updateDisplay(currentNumber);
}

// Case 3b - Decimal followed by Operation
function decimalThenOperation(input) {
    //todo?
}

// Case 3c - Decimal followed by Decimal
function decimalThenDecimal(input) {
    //todo?
}

// Haha, you found my secret = does nothing does nothing does nothing does nothing does nothing
function doMath(num1, symbol, num2) {
    let result = 0;

    if (symbol == '+') {
        result = num1 + num2;
    } else if (symbol == '*') {
        result = num1 * num2;
    } else if (symbol == '/') {
        result = num1 / num2;
    }

    return result;
}

function resetCalculator() {
    lastInput = '0';
    currentNumber = 0;
    storedNumber = -1;
    totalNumber = 0;
    currentOperation = '';

    updateDisplay(currentNumber);
}

//outdated comment, feature basically implemented :))
//probably cast to string and check length < 9 char
// if number value > 999999999, then we put in some sort of 
//base 10 version.
// if number value < 999999999, then we know its just a long
// decimal, so we can clamp down and remove all but first 9 char
// edge case will be if the decimal would be last char in which case
// we just leave our 8 char long output with no decimal visible
function updateDisplay(content) {
    
    displayedContent = content;
    let maxLength = 9;

    if (numTooLong(content, maxLength)) {
        if (content > 999999999) { //display as exponent
            displayedContent = numTooBig(content);
        } else { // Must be a number with a long decimal
            displayedContent = decimalTooBig(content);
        }
    }
    //console.log('displayedContent: '+ displayedContent);
    document.getElementById('calculator-screen-text').innerHTML = displayedContent;
}

// For a given int, convert to string and make sure less than
// 9 characters long
function numTooLong(number, maxLength) {
    //console.log('Is ' + number + ' a float? ' + !Number.isInteger(number));
    stringNumber = (number).toString();
    if (stringNumber.length > maxLength) {
        return true;
    }
    return false;
}

// Number too big to display, crunch it down into
// prefix eY, where eY is power of 10 and prefix is base? Math terminology
// is rusty af
// e.g. 1 000 000 000 = 1e9
function numTooBig(number) {
    let exponent = Math.log10(number);
    let prefix = number / Math.pow(10, exponent);

    exponent = Math.floor(exponent);
    let result = '';

    //Max length will be a base of 7?, made smaller by length of exponent
    // e takes spot 8 and a minimum exponent size of 1 char for 9th space
    let tempExponent = exponent.toString(); // can exponent even be longer than 8? probably. sigh.
    //Ensure exponent will occupy no more than 7 characters of screen
    //EVENTUALLY ONE OF THESE MAX LENGTHS WILL CONFLICT WITH THE OTHER
    //WHY DID YOU PUT SUCH LARGE NUMBERS IN THE CALCULATOR WHYWHYWHYWHYWHY
    //let maxLengthExponent = 

    let maxLengthPrefix = 8 - tempExponent.length;

    //Make sure our final result will fit on screen by cutting back how much of the
    // prefix we will actually display
    if (numTooLong(prefix, maxLengthPrefix)) {
        let tempPrefix = prefix.toString().slice(0, maxLengthPrefix);
        result = tempPrefix + 'e' + tempExponent;
        //result = 'err'; //I think this should only be hit if prefix + exponent too large?
    } else {
        let tempPrefix = prefix.toString();
        result = tempPrefix + 'e' + tempExponent;
    }

    return result;
}

function decimalTooBig(number) {
    result = number.toString();
    //discard all but first 9 char of number
    result = result.slice(0, 9);

    //discard final char if it is a decimal point
    if (result.slice(-1) == '.') {
        result = result.slice(0, 8);
    }

    return result;
}

// ----------------------------------------------------------
// ------------Actually good, functioning code---------------
// ----------------------------------------------------------
function inspirationalQuote() {

    //https://stackoverflow.com/questions/196498/how-do-i-load-the-contents-of-a-text-file-into-a-javascript-variable
    let response = fetch('./quotes.json')
    .then(response => response.json())
    .then((data) => {
        let quoteNum = getRndInteger();
        let quoteJson = data[quoteNum];
        let name = quoteJson.name;
        let quote = quoteJson.quote;
        
        document.getElementById('quote-name').innerHTML = name;
        document.getElementById('quote-body').innerHTML = quote;
    })
    
    
    
    document.getElementById('dialog-default').showModal();
}

//rnd int 0-600
function getRndInteger() {
    return Math.floor(Math.random() * (301 - 0 + 1) ) + 0;
}

//https://stackoverflow.com/questions/32913026/click-a-button-to-play-sound-on-javascript
function playSound() {
    let snd = new Audio('./click.wav');
    // console.log('BEEP');
    snd.play();
}



// ----------------------------------------------------------
// -------------------Code graveyard, RIP--------------------
// ----------------------------------------------------------

// ----------------------------------------------------------
// -----------------Failed calculator code 1-----------------
// ----------------------------------------------------------
// let input1 = 0;
// let input2 = 0;
// let intComplete = true;
// let operation = '';
// let operationReady = false;


// // Reset calculator to default
// function clearScreen() {
//     input1 = 0;
//     input2 = 0;
//     intComplete = true;
//     operation = '';
//     operationReady = false;
//     updateDisplay(input2);
//     debPrt();
// }


// // If user has just started app/just used an operation
// // Then they will start a new number. Otherwise they will add
// // a digit in 1's column of their existing input
// function insertNumber(number) {
//     if (intComplete == false) {
//         appendNumber(number)
//     } else {
//         intComplete = false;
//         operationReady = true;
//         newNumber(number)
//     }
// }

// //this runs when user is inputting an entirely new integer
// //exisitng int is saved to stored and curr is set to 0
// function newNumber(number){
//     input2 = number;
//     updateDisplay(input2);
//     debPrt();

// }

// //this runs when user is still adding digits to their existing input
// function appendNumber(number){
//     input2 = input2 * 10;
//     input2 = input2 + number;
//     updateDisplay(input2);
//     debPrt();

// }

// //int complete only triggers when you hit an operation key
// //this states that you have finished with your first input and
// //want to enter a new integer
// function chooseOperation(op){
//     intComplete = true;
//     operation = op;

//     // if (operationReady == true) {
//     //     if (operation == '+') {
//     //         add();
//     //     } else if (operation == '/') {
//     //         divide();
//     //     } else if (operation == '*') {
//     //         multiply();
//     //     }
//     //     operationReady = false;
//     //     updateDisplay(input1);
//     // }
    
//     debPrt();
// }

// //This doesn't mess with any logic. It just contiuously calls
// //the last input function
// function computeResult() {
//     intComplete = true;
//     if (operation == '+') {
//         add();
//     } else if (operation == '/') {
//         divide();
//     } else if (operation == '*') {
//         multiply();
//     }
//     updateDisplay(input1);
//     debPrt();
// }

// function add() {
//     input1 = input1 + input2;
// }

// function divide() {
//     input1 = input1 / input2;
// }

// function multiply() {
//     input1 = input1 * input2;
// }

// function updateDisplay(number) {
//     let checkedNumber = number;
//     if(number > 999999999) {
//         checkedNumber = 123456789;
//     }
//     document.getElementById('calculator-screen-text').innerHTML = checkedNumber;
// }

// function debPrt() {
//     console.log('11111111111111111111111');
//     console.log('intComplete:' + intComplete);
//     console.log('operationReady:' + operationReady);
//     console.log('input1:' + input1);
//     console.log('input2:' + input2);
//     console.log('operation:' + operation);
//     console.log('11111111111111111111111');
// }

// ----------------------------------------------------------
// -----------------Failed calculator code 2-----------------
// ----------------------------------------------------------
// let totalExpression = '';
// let expression = '';

// function userInput(btn) {
//     //Regex to figure out what button pressed
//     //Need to wrap in // to make it regex
//     //Need to use a \ before +, * since they are regex operators
//     oprPattern = /[(AC)\+\*/=]/;
//     numPattern = /[0-9]/;

//     //Each function will return a number that we are meant to display on
//     //the screen. Sometimes this will be just the number we are inputting
//     //other times it will be the evaluated expression.
//     let displayContent = '';

//     //Ok so "apparently" you're meant to run .test() off the regex, not the string
//     //Why was that so hard to figure out... :(
//     //Anyway this checks the input to filter which function to call,
//     //Did the user click a number key or a operation key
//     if (oprPattern.test(btn) == true) {
//         console.log("Operation: "+btn);
//         displayContent = mathOperation(btn);

//     } else if (numPattern.test(btn) == true) {
//         console.log("Number: "+btn);
//         displayContent = mathNumber(btn);

//     } else if (btn == '.') {
//         console.log(".");
//         displayContent = mathDecimal(btn);
        
//     }

//     //so scuffed its causing me pain
//     if (displayContent.length > 9) {

//     }

//     updateDisplay(displayContent);
// }

// //Using eval() is super not good for security reasons
// //since we are just blindly trusting that we aren't
// //running malicious code. Oh well :))
// function mathOperation(operation) {
//     if (operation == '=') {
//         //compute the current input
//         expression = eval(expression);

//         // //append that number to totalExpression string
//         // //we always end totalExpression with an operation, so should never cause issues
//         // //to be safe if totalExpression doesn't end with an operation, we clear totalExpression
//         // //and overwrite it with expressions value
//         // oprPattern = /[\+\*/=]/;
//         // lastChar = totalExpression.slice(-1);

//         // if (oprPattern.test(lastChar) == true) { //if last input to total WAS an operation
//         //     totalExpression = totalExpression + expression;
//         //     totalExpression = eval(totalExpression)
//         // } else { //if last input to total was NOT an operation
//         //     totalExpression = expression;
//         // }
        
//     } else if (operation == '+') {
//         expression = expression + '+';
//     } else if (operation == '/') {
//         expression = expression + '/';
//     } else if (operation == '*') {
//         expression = expression + "*";
//     } else if (operation == "AC") {
//         expression = '';
//         return '0';
//     }

//     return expression
// }

// function mathNumber(number) {
//     expression = expression + number;
//     return expression;
// }

// function mathDecimal(dot) {
//     if (expression.slice(-1) != '.') {
//         expression = expression + '.';
//     }
//     return expression;
// }


// function updateDisplay(numberStr) {
//     document.getElementById('calculator-screen-text').innerHTML = numberStr;
// }