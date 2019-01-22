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

OK- fucking start a repo

OK- rework game data variables into a huge object so I can work better later on the save and load

- make game autoload when page loads

- make sure interface is automatically updated with that (logic rework)

- save game and load game
. save game
. load game
. delete save
. buttons to do these things

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
/*
Data structure should be splitting stuff into what is owned by what.
*/
var gameData = {
    'counters': {
        'numSmallBoxes': 0,
        'numBakedBoxes': 0,
        'numPoxWaked': 0
    },
    'workers': {
        'boxMakers': {
            'amount': 0,
            'cost': 10,
            'costIncrement': 1.1
        },
        'boxBakers': {
            'amount': 0,
            'cost': 25,
            'costIncrement': 1.3
        },
        'poxWakers': {
            'amount': 0,
            'cost': 100,
            'costIncrement': 1.6
        }
    },
    'milestones': {

    },
    'etc': {
        'doNot': 0,
        'moreEvilDoNot': 0

    }
}


// END GLOBAL VARS -------------------------------------------------------------

// START AUX FUNCTIONS ---------------------------------------------------------

function showNewElement(elementId) {
    // TO-DO: animation
    document.getElementById(elementId).classList.remove('invisible-stuff');
}

// END AUX FUNCTIONS -----------------------------------------------------------


// START INTERFACE TRIGGERED FUNCTIONS -----------------------------------------

// small box maker button
function makeSmallBox() {
  // add a box and show on the interface
  document.getElementById('number-small-boxes').innerHTML = ++gameData.counters.numSmallBoxes;
}

// hire small box maker button
function hireBoxMaker() {
    ++gameData.workers.boxMakers.amount;

    // Deduct cost
    gameData.counters.numSmallBoxes -= gameData.workers.boxMakers.cost;

    // Increase cost for the next one, using Math.ceil() to round up
    gameData.workers.boxMakers.cost = Math.ceil(gameData.workers.boxMakers.cost * gameData.workers.boxMakers.costIncrement);
}

// do not click thing
function doNotClick(thisElement) {
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

    if (gameData.etc.doNot < arrTexts.length) {
        thisElement.innerHTML = arrTexts[gameData.etc.doNot++];
    } else if (gameData.etc.doNot++ == arrTexts.length) {
        // $('#jups').addClass('jups');
        thisElement.classList.remove('btn');
        thisElement.classList.remove('btn-outline-dark');
        thisElement.innerHTML = '';
        thisElement.classList.add('jups');
        setTimeout(function () {
            thisElement.classList.add('btn');
            thisElement.classList.add('btn-outline-dark');
            thisElement.classList.remove('jups');
            thisElement.innerHTML = 'I hope you are happy with yourself.';
        }, 3000);
    } else {
        // do nothing
        thisElement.innerHTML = '';
    }
}

// functions that save, load and delete the game
function saveTheGame() {
    localStorage.setItem('boxGameSave', JSON.stringify(gameData));
    // TO-DO: turn this into an alert or toast
    alert('Game saved!');
}

function loadTheGame(silent) {
    var savegame = JSON.parse(localStorage.getItem('boxGameSave'));
    if (savegame) {
        gameData = savegame;
    } else {
        // silent is used when the game autoloads so no annoying alert on page load
        // TO-DO: turn this into an alert or toast
        if (!silent) {
            alert('No save game found :(');
            
        }
    }
}

function deleteTheGame() {
    var areYouSure = confirm('Are you sure you want to delete your save?')
    if (areYouSure) {
        localStorage.removeItem('boxGameSave');
        location.reload();
    }
}

// END INTERFACE TRIGGERED FUNCTIONS -------------------------------------------

// START INTERVAL MANAGERS -----------------------------------------------------

function counterUpdater() {
  // workers add 1 box per second (1/100 every 10ms)
  gameData.counters.numSmallBoxes += (gameData.workers.boxMakers.amount * 1) / 100;

  // Update the text showing how many boxes we have, using Math.floor() to round down
  document.getElementById('number-small-boxes').innerHTML = Math.floor(
    gameData.counters.numSmallBoxes
  );

  document.getElementById('number-box-makers').innerHTML = gameData.workers.boxMakers.amount;

}

function priceUpdater() {
  // Update the workers with their current prices
  document.getElementById('btn-hire-box-maker').innerHTML =
    'Hire box maker - cost: ' + gameData.workers.boxMakers.cost;
}

function interfaceIO() {
  // Enable/disable the worker buttons based on our boxes
  if (gameData.workers.boxMakers.cost > gameData.counters.numSmallBoxes) {
    document.getElementById('btn-hire-box-maker').disabled = true;
  } else {
    document.getElementById('btn-hire-box-maker').disabled = false;
  }
}

function interfaceDisplayer() {

  // show counter if any boxes were made
  if (gameData.counters.numSmallBoxes >= 1) {
    showNewElement('statistics-card');
    showNewElement('counter-small-boxes');
  }

  // show factory if we have at least 10 boxes
  if (gameData.counters.numSmallBoxes >= 10) {
    showNewElement('box-factory');
  }

  if (gameData.workers.boxMakers.amount >= 1) {
    showNewElement('counter-box-makers');
  }

  // example fucky milestone
  if (gameData.counters.numSmallBoxes >= 9000) {
    // don't forget to think about this
  }
    
}


// END INTERVAL MANAGERS -------------------------------------------------------

// START INTERVAL FUNCTION -----------------------------------------------------

// Run UI update code every 10ms
window.setInterval(function () {
  counterUpdater();
  priceUpdater();
  interfaceIO();
  interfaceDisplayer()
}, 10);

// END INTERVAL FUNCTION -------------------------------------------------------

// YE POOR LOAD FUNCTION -------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  console.log("ready!");
  loadTheGame(true);
  document.body.classList.remove('invisible-stuff');
});
