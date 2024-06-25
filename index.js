const inputslider = document.querySelector("[data-lengthslider]");
const inputNumber = document.querySelector("[data-lengthNumber]");
const Datadisplay = document.querySelector("[data-passwordDispaly]");
const copybutt = document.querySelector("[data-copy]");
const datacopyMsg = document.querySelector("[data-copyMsg]");
const Uppercasel = document.querySelector("#Uppercase");
const Lowercasel = document.querySelector("#Lowercase");
const Symbolinclude = document.querySelector("#Symbols");
const Numberinclude = document.querySelector("#Number");
const dataIndicator = document.querySelector("[data-indicator]");
const Allcheckbox = document.querySelectorAll("input[type=checkbox]");
const Generatebutt = document.querySelector(".generatebutton");
const symbols = '~!@#$%^&&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkcount = 0;

setIndicator("#ccc")

handleSlider();
function handleSlider() {
    inputslider.value = passwordLength;
    inputNumber.innerText = passwordLength;
    //or kuch bhi karna chahiye ? - HW
    const min = inputslider.min;
    const max = inputslider.max;
    inputslider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    dataIndicator.style.backgroundColor = color;
    dataIndicator.style.boxShadow = `0px 0px 12px 5px ${color}`;
}

function getInteger(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function generateInteger() {
    return getInteger(0, 9);
}

function generateLowercase() {
    return String.fromCharCode(getInteger(97, 123));
}

function generateUppercase() {
    return String.fromCharCode(getInteger(65, 91));
}

function generateSymbol() {
    const lennum = getInteger(0, symbols.length);
    return symbols.charAt(lennum);
}

function Calstrength() {
    let upper = false;
    let lower = false;
    let num = false;
    let sym = false;
    if (Uppercasel.checked) upper = true;
    if (Lowercasel.checked) lower = true;
    if (Numberinclude.checked) num = true;
    if (Symbolinclude.checked) sym = true;
    if (upper && lower && (num || sym) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if ((upper || lower) && (num || sym) && passwordLength >= 6) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copycontent() {
    try {
        await navigator.clipboard.writeText(Datadisplay.value);
        datacopyMsg.innerText = "copied";
    } catch (e) {
        datacopyMsg.innerText = "failed";
    }
    datacopyMsg.classList.add("active");

    setTimeout(() => {
        datacopyMsg.classList.remove("active");
    }, 1000);
}

function handleCheckboxchange() {
    checkcount = 0;
    Allcheckbox.forEach((check) => {
        if (check.checked) {
            checkcount++;
        }
    });
    if (passwordLength < checkcount) {
        passwordLength = checkcount;
        handleSlider();
        console.log("handlecheckboxes");
    }
}

function shufflePassword(Array) {
    for (let i = Array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = Array[i];
        Array[i] = Array[j];
        Array[j] = temp;
    }
    let str = "";
    Array.forEach((el) => (str += el));
    return str;
}

Allcheckbox.forEach((element) => {
    element.addEventListener('change', handleCheckboxchange);
});

inputslider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copybutt.addEventListener('click', () => {
    if (Datadisplay.value) {
        copycontent();
    }
});

Generatebutt.addEventListener('click', () => {
    if (checkcount <= 0) return;

    if (passwordLength < checkcount) {
        passwordLength = checkcount;
        handleSlider();
    }
    password = "";
    let funcArr = [];
    if (Uppercasel.checked) {
        funcArr.push(generateUppercase);
    }
    if (Lowercasel.checked) {
        funcArr.push(generateLowercase);
    }
    if (Numberinclude.checked) {
        funcArr.push(generateInteger);
    }
    if (Symbolinclude.checked) {
        funcArr.push(generateSymbol);
    }
    //compulsory addition
    for (let i = 0; i < funcArr.length; i++) {
        password += funcArr[i]();
    }
    //remaining addition
    for (let i = 0; i < passwordLength - funcArr.length; i++) {
        let randIndex = getInteger(0, funcArr.length);
        password += funcArr[randIndex]();
    }

    //shuffle the password
    password = shufflePassword(Array.from(password));

    Datadisplay.value = password;
    // calculate strength
    Calstrength();
});
