const allbuttons = document.getElementById("allbuttons");
const original = allbuttons.querySelector("#original");
const expansion = allbuttons.querySelector("#expansion");
const ogbutton = original.getElementsByClassName("ogbutton");
const expbutton = expansion.getElementsByClassName("expbutton");
const specialbutton = expansion.getElementsByClassName("specialbutton");

const ansbutton = document.getElementById("ansbutton");
const evalbutton = document.getElementById("evalbutton");
const delbutton = document.getElementById("delbutton");
const textbox = document.getElementById("textbox");
const okbutton = document.getElementById("okbutton");
const toggleTrigButton = document.getElementById("toggleTrigButton");
const errorwindow = document.getElementById("errorwindow");
const errorbox = document.getElementById("errorbox");
const errormessage = document.getElementById("errormessage");

let previousEq = ""; 
let store = ""; 
const numbers = ['1','2','3','4','5','6','7','8','9','0', '.'];
const allowedletters = ['l','o','g','n','e','s','i','c','t','a','L','O','G','N','E','S','I','C','T','A'];
const allowedcharacters = ['!','%','^','*','(',')','-','+','=','{','}','/','[',']','<','>',' ', '√'];
const functions = ['√','n√','log','ln','sin','cos','tan'];
const open = ['(', '{', '[']; 
const close = [')', '}', ']'];


/***** ALL EVENT LISTENERS *****/
// adds functionality to all valid keypresses to add to display, as well as adding functionality to some of the special function keys
document.addEventListener('keydown', function(event){
    if (document.activeElement != textbox && isHidden(errorbox)){
        if(event.key == 'Backspace'){
            event.preventDefault();
            backspace();
        } else if (event.key == 'Tab'){
            event.preventDefault();
            clearDisplay();
        } else if (event.key == 'Enter'){
            event.preventDefault();
            previousEq = textbox.value; 
            clearDisplay();
            addToDisplay(evaluate(previousEq)); 
        } else if (allowedcharacters.includes(event.key) || numbers.includes(event.key) 
                    || allowedletters.includes(event.key)){
            event.preventDefault();
            addToDisplay(event.key);
        }
    } else if (isHidden(errorbox)) {
        if(event.key == 'Tab'){
            event.preventDefault();
            clearDisplay();
        } else if (event.key == 'Enter'){
            event.preventDefault();
            previousEq = textbox.value; 
            clearDisplay();
            store = evaluate(previousEq);
            addToDisplay(store); 
        } else if (!allowedcharacters.includes(event.key) && !numbers.includes(event.key) 
                    && !allowedletters.includes(event.key) && event.key != 'Backspace' 
                    && event.key != 'ArrowLeft' && event.key != 'ArrowRight'){
            event.preventDefault();
        }
    } else if (!isHidden(errorbox)){
        if(event.key == 'Tab' || event.key == 'Enter' || event.key == ' '){
            event.preventDefault();
            hide(errorbox);
            hide(errorwindow);
        } 
    }
});

// disallows the addition of any non-mathematical symbols to the display 
textbox.addEventListener('input', function(event) {
    const blockedcharacters = /[qwryupdfhjk;zxvbm@#$&_|:;'"<>?]/g;
    textbox.value = textbox.value.replace(blockedcharacters, '');
});

// adds functionality for 3 buttons above display bar 
delbutton.addEventListener('click', () => backspace());
ansbutton.addEventListener('click', function() {
    addToDisplay(store);
});
evalbutton.addEventListener('click', function() {
    previousEq = textbox.value; 
    clearDisplay();
    addToDisplay(evaluate(previousEq));
});

// adds functionality to all other clickable buttons on webpage
Array.from(ogbutton).forEach(button => {
    button.addEventListener('click', function() {
        if(this.innerHTML == 'C'){
            clearDisplay();
        } else {
            addToDisplay(this.innerHTML);
        }
    }); 
}); 
Array.from(expbutton).forEach(button => {
    button.addEventListener('click', function() {
        addToDisplay(this.innerHTML)
    });
});
Array.from(specialbutton).forEach(button => {
    button.addEventListener('click', function() {
        if(this.innerHTML != 'n√'){
            addToDisplay(this.innerHTML + "(");
        } else { 
            if(this.innerHTML == 'n√'){
                addToDisplay("{n}√(");
            }
        }
    })
});
okbutton.addEventListener('click', function() {
    hide(errorbox); 
    hide(errorwindow);
});
toggleTrigButton.addEventListener('click', function() {
    if(this.innerHTML == "deg"){
        this.innerHTML = "rad";
    } else if (this.innerHTML == "rad"){
        this.innerHTML = "deg";
    }
});


/***** ALL FUNCTIONS *****/

// functions for all display changes 
function addToDisplay(character){
    textbox.value += character; 
}
function clearDisplay(){
    textbox.value = ""; 
}
function backspace(){
    textbox.value = textbox.value.substring(0, textbox.value.length-1);
}
function throwError(message){
    errorbox.style.display = "block";
    errorwindow.style.display = "block"; 
    errormessage.innerHTML = message;
}
function isHidden(element){
    let style = window.getComputedStyle(element);
    return style.display == 'none' || style.display == 'hidden';
}
function hide(element){
    element.style.display = 'none'; 
}
function unhide(element){
    element.style.display = 'visible'; 
}

// function which separates operators from numbers and returns them all as an array of components 
function breakdown(expression){
    let components = []; 
    
    for(let i = 0; i < expression.length; i++){
        let statement = ""; 
        let curr = expression.charAt(i); 

        if(allowedcharacters.includes(curr) ){ // checks if current character is a special symbol
            if(curr == ' ') continue;  
            statement = curr;
            components.push(statement);
        } else if (numbers.includes(curr)){ // checks if current character is a number
            let decimal = false;  

            while(i < expression.length){
                curr = expression.charAt(i); 
                if(numbers.includes(curr) && curr != '.' && curr != '-'){
                    statement += curr;
                    i++; 
                } else if (curr == '.'){ 
                    if(decimal) throwError("Incorrect decimal placements."); 
                    statement += curr; 
                    decimal = true;
                    i++;  
                } else { 
                    break;
                }
            }
            i--;

            components.push(Number(statement));
        } else if (curr == 'e' || curr == 'π' || (curr == 'p' && expression.charAt(i+1) == 'i')){
            if(curr == 'π'){
                components.push('(', Math.PI, ')');
            } else if (curr == 'e'){
                components.push('(', Math.E, ')');
            }
        } else if (allowedletters.includes(curr)) { // checks if current character is the start of a math function 
            let foundFunction = false;

            for (const func of functions) {
                if (expression.substring(i, i + func.length) == func) {
                    statement = func;
                    i += func.length - 1; 
                    foundFunction = true;
                    break;
                }
            }

            if (!foundFunction) {
                throwError("Not a real expression."); 
            } else {
                components.push(statement);
            }
        } 
    }

    // turns all instances of a number following a negative sign into a negative number (when valid)
    
    for(let i = 0; i < components.length; i++){
        if(i == 0 && components[i] == '-'){
            if(!isNaN(components[i+1])){
                components.splice(0, 2, components[i+1]*-1);
            } else {
                components.splice(0, 1, -1, '*');
            }
        } else if (components[i] == '-' && !(!isNaN(components[i-1]) || close.includes(components[i-1]))){
            components.splice(i, 2, components[i+1]*-1);
        } else if (components[i] == '-' && open.includes(components[i-1])){
            components.splice(i, 1, -1, '*');

        }
    }
        
    // makes sure that all adjacent parenthesis/number pairs are interpreted as multiplication
    for(let i = 0; i < components.length; i++){
        if((close.includes(components[i]) || !isNaN(components[i]))){
            if(open.includes(components[i+1]) || !isNaN(components[i+1]) || functions.includes(components[i+1])){
                components.splice(i, 2, components[i], '*', components[i+1]);
            }
        }
    }

    if(functions.includes(components[components.length-1])) throwError("Invalid expression.");  // edge case
    return components;
}

function isValidFunction(comparr){
    return validGrouping(comparr) && validOperators(comparr) && validArithmetic(comparr);
}


function validGrouping(comparr){
    let stack = [];

    // validates that there are no empty parenthesis
    for(let i = 0; i < comparr.length-1; i++){
        if(open.includes(comparr[i]) && close.includes(comparr[i+1])){
            throwError("Empty parentheses.");
            return false; 
        }
    }

    // validates the grouping of parenthesis using a stack
    for(let i = 0; i < comparr.length; i++){
        if (open.includes(comparr[i])){ // adds to stack if open parenthesis
            stack.push(comparr[i]);
        } else if (close.includes(comparr[i])){ // checks match for closing parenthesis 
            if(stack.length == 0 || open[close.indexOf(comparr[i])] != stack[stack.length-1]){
                throwError("Unmatched parenthesis.");
                return false; 
            }
            stack.pop();
        } else if(close.includes(comparr[i]) && stack.length == 0){
            throwError("Incorrect grouping.");
            return false; 
        }
    }

    if (stack.length > 0){
        throwError("Unmatched parenthesis");
        return false; 
    }

    return stack.length == 0; 
}

// validates that all operators are able to be performed
function validOperators(comparr){
    let operators = ['+', '-', '*', '/', '%', '^'];

    for(let i = 0; i < comparr.length; i++){
        if(operators.includes(comparr[i])){ 
            if(i == comparr.length-1 || (i == 0 && comparr[i] != '-')){
                throwError("Incorrect operator use.");
                return false; 
            }  

            let prev = comparr[i-1]; 
            let next = comparr[i+1];
            if(!(!isNaN(prev) || close.includes(prev)) || !(!isNaN(next) || open.includes(next) || functions.includes(next))){
                throwError("Incorrect operator usage.");
                return false; 
            }
        }
    }

    return true; 
}

// validates that no 2 numbers follow right after each other and also turns all valid instances of minus signs into negative numbers
function validArithmetic(comparr){
    for(let i = 1; i < comparr.length; i++){
        if(!isNaN(comparr[i]) && !isNaN(comparr[i-1])){
            throwError();
            return false;
        }
    }

    return true; 
}

// function which decides which simple operational function is called for each smaller expression(s)
function evaluate(expression){
    let comparr = breakdown(expression); 
    // addToDisplay(comparr + " \t"); // used for debugging

    if(isValidFunction(comparr)) {
        // parenthesis 
        comparr = P(comparr);

        // exponents, square roots and special functions 
        while(comparr.includes('^') || comparr.includes('!') || comparr.includes('√') || comparr.includes('n√')
        || comparr.includes('log') || comparr.includes('ln') || comparr.includes('sin') || comparr.includes('cos')
        || comparr.includes('tan')){
            E(comparr);
        }
            
        // multiplication and division and modulo 
        while(comparr.includes('*') || comparr.includes('/') || comparr.includes('%')){
            MD(comparr);
        }

        // addition and subtraction 
        while(comparr.includes('+') || comparr.includes('-')){
            AS(comparr);
        }
    }

    
    if (comparr.length == 1) return comparr[0];
    return "undefinedd"; 
}


// helper functions for evaluate function 
function P(comparr){
    let pindexes = []; 
    
    for(let i = 0; i < comparr.length; i++){
        if(open.includes(comparr[i])){
            pindexes.push(i);
        } else if (close.includes(comparr[i])){
            let start = pindexes.pop();
            let result = evaluate(comparr.slice(start+1, i).join(""));
            comparr.splice(start, i-start+1, result);

            i = start-1; 
        } else { 
            continue;
        }
    }

    return comparr; 
}
function E(comparr){
    let expindex = (comparr.lastIndexOf('^') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('^'); 
    let factindex = (comparr.indexOf('!') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('!'); 
    let sqrtindex = (comparr.indexOf('√') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('√'); 
    let nrtindex = (comparr.indexOf('n√') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('n√'); 
    let logindex = (comparr.indexOf('log') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('log'); 
    let lnindex = (comparr.indexOf('ln') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('ln'); 
    let sinindex = (comparr.indexOf('sin') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('sin');
    let cosindex = (comparr.indexOf('cos') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('cos'); 
    let tanindex = (comparr.indexOf('tan') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('tan'); 

    let min = Math.min(expindex, factindex, sqrtindex, nrtindex, logindex, lnindex, sinindex, cosindex, tanindex)

    if(min == expindex){
        comparr.splice(expindex-1, 3, exp(comparr[expindex-1], comparr[expindex+1]));
    } else if (min == factindex){
        comparr.splice(factindex-1, 2, fact(comparr[factindex-1]));
    } else if (min == sqrtindex){
        comparr.splice(sqrtindex, 2, sqroot(comparr[sqrtindex+1]));
    } else if (min == nrtindex){
        comparr.splice();
    } else if (min == logindex){
        comparr.splice(logindex, 2, log(comparr[logindex+1], 10));
    } else if (min == lnindex){
        comparr.splice(lnindex, 2, ln(comparr[lnindex+1]));
    } else if (min == sinindex){
        comparr.splice(sinindex, 2, sin(comparr[sinindex+1]));
    } else if (min == cosindex){
        comparr.splice(cosindex, 2, cos(comparr[cosindex+1]));
    } else if (min == tanindex){
        comparr.splice(tanindex, 2, tan(comparr[tanindex+1]));
    }

    return comparr; 
}
function MD(comparr){
    let multindex = (comparr.indexOf('*') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('*'); 
    let divindex = (comparr.indexOf('/') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('/');
    let modindex = (comparr.indexOf('%') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('%');
    let first = Math.min(multindex, divindex, modindex); 

    if(first == multindex){
        comparr.splice(multindex-1, 3, mult(comparr[multindex-1], comparr[multindex+1]));
    } else if (first == divindex){
        comparr.splice(divindex-1, 3, div(comparr[divindex-1], comparr[divindex+1]));
    } else if (first == modindex){
        comparr.splice(modindex-1, 3, mod(comparr[modindex-1], comparr[modindex+1]));
    }

    return comparr; 
}
function AS(comparr){
    let addindex = (comparr.indexOf('+') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('+');
    let subindex = (comparr.indexOf('-') == -1) ? Number.MAX_SAFE_INTEGER : comparr.indexOf('-');
    let first = Math.min(addindex, subindex);

    if(first == addindex){
        comparr.splice(addindex-1, 3, add(comparr[addindex-1], comparr[addindex+1]));
    } else if (first == subindex){
        comparr.splice(subindex-1, 3, sub(comparr[subindex-1], comparr[subindex+1]));
    }

    return comparr; 
}


// all single operational functions
function add(n1, n2){
    return n1 + n2; 
}
function sub(n1, n2){
    return n1 - n2;
}
function mult(n1, n2){
    return n1 * n2; 
}
function div(n1, n2){
    return n1 / n2;
}
function mod(n1, n2){
    return n1 % n2; 
}
function sqroot(num){
    return Math.sqrt(num);
}
function nthroot(root, num){
    return exp(num, 1/root);
}
function exp(base, power){
    return Math.pow(base, power); 
}
function fact(num){
    let ans = 1; 
    for(let i = num; i >= 1; i--) {
        ans *= i; 
    }
    return ans; 
}
function log(num, base){ // is base 10 by default 
    return Math.log(num) / Math.log(base);
}
function ln(num){
    return Math.log(num);
}
function sin(num){
    return Math.sin(num);
}
function cos(num){
    return Math.cos(num);
}
function tan(num){
    return Math.tan(num);
}