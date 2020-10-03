// slider setup.

var slider = document.getElementById("typingSpeedRangeSlider");
var output = document.getElementById("typingSpeedValue");
output.innerHTML = slider.value;

slider.oninput = function() {
    output.innerHTML = this.value;
}

// functions that create the typing logic itself.