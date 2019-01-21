/*------------------------------------------------------------------------------
Plans (old):

PRIORITY: make some testing utils

- add a way to make money off boxes
- add a hint thing on the top like in infinity clicker
- end of the world trigger when there's too much pox
- only cats survive
- "meowconomy" - after all who do you think that keeps buying boxes
- warp space developments: how to make boxes bigger on the inside
- warp space attacts CHAOS.
- initiate the DARK MILLENIUM protocol for war 

Plans (new!):
OK- rewrite this entire crap in vanilla javascript

- fucking start a repo

- rework game data variable so I can work better later on the save and load

- finish game's core features:
. counters
. workers
. values
. save/load
. testing utilities
. upgrades
. some progression
. an alert box on the top or something

- finally go use some fucking framework
------------------------------------------------------------------------------*/

// START GLOBAL VARS -----------------------------------------------------------
// Basic variable declaration - keep track of how many of each item we currently own, and how much the new ones should cost.

// TO-DO: put all in an object
// boxes
var GnumSmallBoxes = 0;

// workers
var GnumSmallBoxMakers = 0;

// costs
var GsmallBoxMakerCost = 10;

// etc
// don't click counter
var GdoNot = 0;


// END GLOBAL VARS -------------------------------------------------------------

// START AUX FUNCTIONS ---------------------------------------------------------

function showNewElement (elementId) {
    // TO-DO: animation
    var element = document.getElementById(elementId);
    element.classList.remove('invisible-stuff');

}

// END AUX FUNCTIONS -----------------------------------------------------------


// START INTERFACE TRIGGERED FUNCTIONS -----------------------------------------

// small box maker button
function makeSmallBox (){
    // add a box and show on the interface
    document.getElementById('number-small-boxes').innerHTML = ++GnumSmallBoxes;
    
    // show counter if there were no boxes made
    if (GnumSmallBoxes == 1) {
        showNewElement('statistics-card');
        showNewElement('counter-small-boxes');
    }
    if (GnumSmallBoxes == 10) {
        showNewElement('box-factory');
    }

}

// hire small box maker button
function hireBoxMaker () {
    document.getElementById('number-box-makers').innerHTML = ++GnumSmallBoxMakers;
    
    if (GnumSmallBoxMakers == 1) {
        showNewElement('counter-box-makers');
    }

    // Deduct cost
    GnumSmallBoxes -= GsmallBoxMakerCost;

    // Increase cost for the next one, using Math.ceil() to round up
    GsmallBoxMakerCost = Math.ceil(GsmallBoxMakerCost * 1.1);
}

// do not click thing
function doNotClick (domElement) {

    var arrTexts = [
        'Why did you click here?',
        'You\'re not supposed to click again.',
        'Stop clicking.',
        'Seriously, stop.',
        'Bad things will happen if you continue to click.',
        'You are bringing this upon yourself.',
        'You should stop before its too late.',
        'You are being warned. Do not proceed.',
        'Stop.',
        'This is your last warning.'
    ];

    if (GdoNot < arrTexts.length) {
        domElement.innerHTML = arrTexts[GdoNot++];

    } else if (GdoNot++ == arrTexts.length) {
        // $('#jups').addClass('jups');
        domElement.classList.remove('btn');
        domElement.classList.remove('btn-outline-dark');
        domElement.innerHTML = '';
        domElement.classList.add('jups');
        setTimeout(function () {
            domElement.classList.add('btn');
            domElement.classList.add('btn-outline-dark');
            domElement.classList.remove('jups');
            domElement.innerHTML = 'I hope you are happy with yourself.';
        }, 3000);
    } else {
        // do nothing
        domElement.innerHTML = '';
    }   

}

// END INTERFACE TRIGGERED FUNCTIONS -------------------------------------------

// START INTERVAL FUNCTION -----------------------------------------------------

// Run UI update code every 10ms
window.setInterval(function() {
    // workers add 1 box per second (1/100 every 10ms)
    GnumSmallBoxes += (GnumSmallBoxMakers * 1) / 100;

    // Update the text showing how many boxes we have, using Math.floor() to round down
    document.getElementById('number-small-boxes').innerHTML = Math.floor(GnumSmallBoxes);

    // Update the workers with their current prices
    document.getElementById('btn-hire-box-maker').innerHTML = 'Hire box maker - cost: ' + GsmallBoxMakerCost;

    // Enable/disable the worker buttons based on our boxes
    if (GsmallBoxMakerCost > GnumSmallBoxes) {
        document.getElementById('btn-hire-box-maker').disabled = true;
    } else {
        document.getElementById('btn-hire-box-maker').disabled = false;

    }
}, 10);

// END INTERVAL FUNCTION -------------------------------------------------------

// YE POOR LOAD FUNCTION -------------------------------------------------------
document.addEventListener("DOMContentLoaded", function (event) {
    console.log("ready!");
});



