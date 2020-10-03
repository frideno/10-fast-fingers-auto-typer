// slider setup.

var slider = document.getElementById("typingSpeedRangeSlider");
var output = document.getElementById("typingSpeedValue");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
}

// functions that create the typing logic itself.
// myURLs contains the websites where you want your content script to run
const myURLs = ['google.com'];

var startTyping = function() {
    // on google search bar.
    inp = document.getElementsByTagName('input')[4];
    inp.value = 'trytry123';
    inp.focus();

}

var start = function() {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
        let url = tabs[0].url;
        console.log(url);
        if (myURLs.some(allowed_url => url.includes(allowed_url))) {
            chrome.tabs.executeScript(null, { code: "var startTyping = " + startTyping.toString() + ";startTyping();" }, function(result) {});
            window.close()
        }
    });

}

var startButton = document.getElementById("startTypingButton");
startButton.addEventListener('click', start)