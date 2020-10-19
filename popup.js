// slider setup.

var slider = document.getElementById("typingSpeedRangeSlider");
var output = document.getElementById("typingSpeedValue");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
}
var link = document.getElementById("url")
link.href = 'https://10fastfingers.com/typing-test/english'
link.innerHTML = '10 fast fingers'

// allMyFunctions that create the typing logic itself.
// myURLs contains the websites where you want your content script to run
const myURLs = ['10fastfingers.com'];

function simulateKeyPress(element, character) {
    element.dispatchEvent(new KeyboardEvent('keydown', { 'key': character }));

}

function typeWord(word) {
    inp = document.getElementById('inputfield');
    word = word + ' ';

    for (var idx = 0; idx < word.length; idx++) {
        var c = word.charAt(idx);
        inp.value += c;
	inp.dispatchEvent(new KeyboardEvent('keyup', { 'keyCode': c.charCodeAt(0) }));
    }
}

function startTyping() {
    wordsdiv = document.getElementById('row1');
    wordsList = [];
    for (i = 0; i < wordsdiv.children.length; i++) {
        wordsList.push(wordsdiv.children[i].textContent); 
    }
    
    // calculate the actual bot wpm needed, considering word typed = fixed number of characters, instead of real word.
    // Thus, applying a search of in which word we get to the total number of character needed to do the wpm, instead of just assumming that it will be in the wpm'th word
    avgWordLength = 5.0;
    numberOfCharsNeeded = wpmVar * avgWordLength;
    console.log('chars', numberOfCharsNeeded);
    cntr = 0
    for (k = 0; k < wordsList.length; k++) {
        cntr += (wordsList[k].length + 1);
        if (cntr >= numberOfCharsNeeded)
            break;
    }
    actualWpm = k;
    console.log('actualWPM ', actualWpm)

    timeoutVars = []
    // put the word writings in timings by the actual WPM.
    delayMs = (60 / actualWpm) * 1000;
    for (i = 0; i < actualWpm; i++) {
        timeoutVar = setTimeout(typeWord, delayMs * i, wordsList[i]);
        timeoutVars.push(timeoutVar);
    }
    // cancel all after round ends.
    totalTime = 60;
    setTimeout(function() {
        for (j = 0; j < timeoutVars.length; j++) {
            clearTimeout(timeoutVars[j]);
        }
    }, totalTime * 1000);


}

let allMyFunctions = new Map();
allMyFunctions.set('simulateKeyPress', simulateKeyPress);
allMyFunctions.set('startTyping', startTyping);
allMyFunctions.set('typeWord', typeWord)

function pasteFunctions() {
    var s = "";
    for (const [key, value] of allMyFunctions.entries()) {
        s += ("var " + key.toString() + " = " + value.toString() + "; ");
    }
    return s;

}


var start = function() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;
        if (myURLs.some(allowed_url => url.includes(allowed_url))) {
            var wpmVar = parseFloat(document.getElementById('typingSpeedValue').innerHTML);
            chrome.tabs.executeScript(null, { code: pasteFunctions() + ';wpmVar = ' + String(wpmVar) + ";" + "startTyping();" }, function(result) {});
            window.close()
        }
    });

}

var startButton = document.getElementById("startTypingButton");
startButton.addEventListener('click', start)
