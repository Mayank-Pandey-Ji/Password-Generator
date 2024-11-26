const inputSlider  = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copyBtn]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector('#uppercase');
const lowercaseCheck = document.querySelector('#lowercase');
const symbolsCheck = document.querySelector('#symbols');
const numbersCheck = document.querySelector('#numbers');
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll('input[type=checkbox]');  
const symbols = '~`!@#$%^&*()_-+={[}}|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkcount = 0;

handleSlider();

function handleSlider()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
    
}

function setIndicator(color)
{
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow =`0px 0px 12px 1px ${color}`;
    // shadow
}
setIndicator('#ccc')

// Math.random -> koi bhi ek number 0 se 1 ke beech me , yeh value decimal me bhi ho sakti hai
// Math.random * (max - min) -> 0 se max-min tak ka number ;
// Math.random * (max - min) + min ; -> min se max tak ka ek random number ;
// Math.floor(Math.random * (max - min)) + min ; ab hamesha hi ek integer number milega

function getRndInteger(min , max)
{
    return Math.floor(Math.random() * (max - min)) + min ;
}

function generateRandonNumber()
{
    return getRndInteger(0,9);
}

function generateLowerCase()
{
    return String.fromCharCode(getRndInteger(97 , 123)); // askii ki value ki help li hai
}

function generateUpperCase()
{
    return String.fromCharCode(getRndInteger(65 , 91)); // askii ki value ki help li hai
}

function generateSymbol()
{
    const rand = getRndInteger(0,symbols.length);
    return symbols.charAt(rand);
}

function calcStrength()
{
    let hasUpper = false;
    let hasLower = false;
    let hasNum   = false;
    let hasSym   = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(symbolsCheck.checked)  hasSym = true;
    if(numbersCheck.checked) hasNum = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >=8)
    {
        setIndicator("#0f0");
    }

    else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength>=6)
    {
        setIndicator("#ff0");
    }

    else {
        setIndicator("#f00");
    }
}

async function copyContent()
{
    try{
        await navigator.clipboard.writeText(passwordDisplay.value); // isse clipboard pe copy ho jata hai
        copyMsg.innerText = "copied";
    }
    catch(e)
    {
        copyMsg.innerText = "Failed"
    }

    /// to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    } , 3000);
}

function shufflePassword(shufflePassword)
{
    // fishers yates Method
    for(let i  = shufflePassword.length -1 ; i>0 ; i--)
    {
        const j = Math.floor(Math.random()*(i+1));
        const temp = shufflePassword[i];
        shufflePassword[i] = shufflePassword[j];
        shufflePassword[j] = temp;
    }
    let str = "";
    shufflePassword.forEach((el) => ( str += el));
    return str;  
}

function handleCheckBoxChange()
{
    checkcount = 0;
    allCheckBox.forEach((checkbox) =>{
        if(checkbox.checked)
        {
            checkcount++;
        }
    });
    // special condition 
    if(passwordLength < checkcount)
    {
        passwordLength = checkcount;
        handleSlider();
    }
}

allCheckBox.forEach((checkbox) => {
    checkbox.addEventListener('change' , handleCheckBoxChange);
});


inputSlider.addEventListener('input' , (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click' , ()=>{
    if(passwordDisplay.value)
    {
        copyContent(); 
    }
});

generateBtn.addEventListener('click' , ()=>{
    // none of the checkbox are checked 
    if(checkcount <= 0)
    {
        return;
    }

    console.log("checkcount = 0")

    // let's start the journey to find a new password
    // remove the old password
    password = "";

    // lst's put th stuff mentioned by the check boxes

    // if(uppercaseCheck.checked) 
    // {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password += generateRandonNumber();
    // }

    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }


    let funArr = [];
    if(uppercaseCheck.checked) {
        funArr.push(generateUpperCase);
    }
    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }
    if(numbersCheck.checked){
        funArr.push(generateRandonNumber);
    }
    if(symbolsCheck.checked)
    {
        funArr.push(generateSymbol);
    }

    // compulsory addition
    for(let i=0 ; i<funArr.length;i++)
    {
        password += funArr[i]();
    }
    console.log("compulsory addition ho gaya");

    // remaining addition
    for(let i = 0 ; i< passwordLength - funArr.length ;i++)
    {
        let randIndex = getRndInteger(0,funArr.length);
        password += funArr[randIndex]();
    }
    console.log("remaining addition ho gaya")

    password = shufflePassword(Array.from(password));
    // show in UI
    passwordDisplay.value = password;
    calcStrength();

});

