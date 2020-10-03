// slider setup.

var slider = document.getElementById("typingSpeedRangeSlider");
var output = document.getElementById("typingSpeedValue");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
}

// allMyFunctions that create the typing logic itself.
// myURLs contains the websites where you want your content script to run
const myURLs = ['10fastfingers.com'];

function simulateKeyPress(element, character) {
    element.dispatchEvent(new KeyboardEvent('keydown', { 'key': character }));

}

function typeWord(word) {
    inp = document.getElementById('inputfield');
    console.log(word);
    word = word + ' ';

    for (var idx = 0; idx < word.length; idx++) {
        var c = word.charAt(idx);
        inp.value += c;
        inp.dispatchEvent(new KeyboardEvent('keyup', { 'keyCode': c.charCodeAt(0) }));
    }
}

function startTyping() {
    wordsdiv = document.getElementById('row1');
    wordlist = [];
    for (i = 0; i < wordsdiv.children.length; i++) {
        wordlist.push(wordsdiv.children[i].textContent);
    }
    var timeoutVars = []
        // put the word writings in timings by the WPM.
    for (i = 0; i < wordlist.length; i++) {
        timeoutVar = setTimeout(typeWord, ((60 / wpm_var) * 1000) * i, wordlist[i]);
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
            var wpm_var = parseFloat(document.getElementById('typingSpeedValue').innerHTML);
            chrome.tabs.executeScript(null, { code: pasteFunctions() + ';wpm_var = ' + String(wpm_var) + ";" + "startTyping();" }, function(result) {});
            window.close()
        }
    });

}

var startButton = document.getElementById("startTypingButton");
startButton.addEventListener('click', start)