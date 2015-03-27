window.Modules = window.Modules || {};
window.Modules.BoxModule = function BoxModule() {

    var targetNode = null,
        frag = null,
        mainBox;

    var colors = ['red', 'green', 'blue', 'yellow'];
    var order = []
    var clicks = [];
    var isPlaying = false;
    var isSuccess = false;
    var targetColorList;
    var playedColorsList;
    var statusDiv;


    function assembleTemplate() {
        var colorButtons = [];
        colors.forEach(function(color) {
            colorButtons.push("<div class='mini-box box' data-color='" + color + "'></div>");
        });

        return "<div class='box-module'> \
                        <div class='left-side partition'> \
                            <div class='main-box box'></div> \
                            <div class='bottom-bar start'>START</div> \
                        </div> \
                        <div class='right-side partition'>"
                            + colorButtons.join("") +
                            "<div class='bottom-bar status'></div> \
                        </div> \
                    </div>";
    }


    function assembleFragment() {
        frag = document.createDocumentFragment();
        var div = document.createElement("div");
        div.innerHTML = assembleTemplate();
        mainBox = div.querySelector('.main-box');
        var miniBoxes = div.querySelectorAll('.mini-box');
        for (var i = 0; i < miniBoxes.length; ++i) {
            miniBoxes[i].addEventListener('click', selectColor);
        }

        div.querySelector('.start').addEventListener('click', handleStart);
        statusDiv = div.querySelector('.status');

        frag.appendChild(div);
    }

    function selectColor(e) {
        var color = e.target.getAttribute('data-color');
        mainBox.setAttribute('data-color', color);
        if (isPlaying) {
            trackGameplay(color);
        }
    }

    function init(targetDiv) {
        if (!targetDiv) { return; }
        targetNode = document.querySelector(targetDiv);
        assembleFragment();
    }

    function render() {
        targetNode.appendChild(frag);
    }

    function generateColorList() {
        var colorCopy = colors.slice(0);
        var colorList = [];
        while (colorCopy.length) {
            var index = Math.floor(Math.random() * colorCopy.length);
            var toAdd = colorCopy.splice(index, 1);
            colorList.push(toAdd);
        }

        console.log("@@@ using these colors: " + JSON.stringify(colorList));
        return colorList;
    }

    function trackGameplay(selected) {
        var desiredColors = targetColorList.join(",");
        playedColorsList.push(selected);
        var playedColors = playedColorsList.join(",");

        console.log("Desired colors: " + desiredColors);
        console.log("Played colors so far: " + playedColors);

        if (playedColors == desiredColors) {
            statusDiv.innerText = "SUCCESS";
            isPlaying = false;
        } else if (desiredColors.indexOf(playedColors) != 0) {
            statusDiv.innerText = "FAIL";
            isPlaying = false;
        }
    }

    function handleStart() {
        // assemble color list
        targetColorList = generateColorList();
        cycleColors(targetColorList);
        playedColorsList = [];
        isPlaying = true;
        statusDiv.innerHTML = "";
    }

    function cycleColors(toCycle) {
        toCycle = toCycle.slice(0);
        toCycle.push(""); // to make it go back to white/ hack
        function displayColor(toDisplay) {

            mainBox.setAttribute('data-color', toDisplay);
            if (toCycle.length) {
                setTimeout(function() { displayColor(toCycle.shift()) }, 500);
            }
        }

        displayColor(toCycle.shift());
    }

    return {

        init: init,
        render: render
    }
}
