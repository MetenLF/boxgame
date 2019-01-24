// START GLOBAL VARS -----------------------------------------------------------
// Basic variable declaration - keep track of how many of each item we currently own, and how much the new ones should cost.
/*
Data structure should be splitting stuff into what is owned by what.
*/
var gameData = {
  counters: {
    numSmallBoxes: 0,
    numBakedBoxes: 0,
    numPoxWaked: 0
  },
  workers: {
    boxMakers: {
      amount: 0,
      cost: 10,
      costIncrement: 1.1
    },
    boxBakers: {
      amount: 0,
      cost: 25,
      costIncrement: 1.3
    },
    poxWakers: {
      amount: 0,
      cost: 100,
      costIncrement: 1.6
    }
  },
  milestones: [
    {
      name: 'boxCounter',
      triggered: false,
      condition: {
        resource: 'gameData.counters.numSmallBoxes',
        comparison: '>=',
        threshold: 1
      }
    },
    {
      name: 'boxFactory',
      triggered: false,
      condition: {
        resource: 'gameData.counters.numSmallBoxes',
        comparison: '>=',
        threshold: 10
      }
    },
    {
      name: 'smallBoxMaker',
      triggered: false,
      condition: {
        resource: 'gameData.workers.boxMakers.amount',
        comparison: '>=',
        threshold: 1
      }
    },
    {
      name: 'boxBakerButton',
      triggered: false,
      condition: {
        resource: 'gameData.counters.numSmallBoxes',
        comparison: '>=',
        threshold: 25
      }
    },
    {
      name: 'boxBakerCounter',
      triggered: false,
      condition: {
        resource: 'gameData.workers.boxBakers.amount',
        comparison: '>=',
        threshold: 1
      }
    },
    {
      name: 'bakedBoxCounter',
      triggered: false,
      condition: {
        resource: 'gameData.counters.numBakedBoxes',
        comparison: '>=',
        threshold: 1
      }
    },
    {
      name: 'poxWakerButton',
      triggered: false,
      condition: {
        resource: 'gameData.counters.numBakedBoxes',
        comparison: '>=',
        threshold: 25
      }
    },
    {
      name: 'poxWakerCounter',
      triggered: false,
      condition: {
        resource: 'gameData.workers.poxWakers.amount',
        comparison: '>=',
        threshold: 1
      }
    },
    {
      name: 'wakedPoxCounter',
      triggered: false,
      condition: {
        resource: 'gameData.counters.numPoxWaked',
        comparison: '>=',
        threshold: 1
      }
    }
  ],
  achievements: {},
  etc: {
    doNot: 0,
    moreEvilDoNot: 0
  }
};


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

// hire worker button
function hireWorker(workerType) {
    ++gameData['workers'][workerType]['amount'];

    // Deduct cost
    gameData['counters']['numSmallBoxes'] -= gameData['workers'][workerType]['cost'];

    // Increase cost for the next one, using Math.ceil() to round up
    gameData['workers'][workerType]['cost'] = Math.ceil(gameData['workers'][workerType]['cost'] * gameData['workers'][workerType]['costIncrement']);
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
  gameData.counters.numBakedBoxes += (gameData.workers.boxBakers.amount * 1) / 200;
  gameData.counters.numPoxWaked += (gameData.workers.poxWakers.amount * 1) / 500;

  // Update the text showing how many boxes we have, using Math.floor() to round down
  document.getElementById('number-small-boxes').innerHTML = Math.floor(
    gameData.counters.numSmallBoxes
  );
  document.getElementById('number-baked-boxes').innerHTML = Math.floor(
    gameData.counters.numBakedBoxes
  );
  document.getElementById('number-waked-poxes').innerHTML = Math.floor(
    gameData.counters.numPoxWaked
  );

  document.getElementById('number-box-makers').innerHTML = gameData.workers.boxMakers.amount;

  document.getElementById('number-box-bakers').innerHTML = gameData.workers.boxBakers.amount;

  document.getElementById('number-pox-wakers').innerHTML = gameData.workers.poxWakers.amount;

}

function priceUpdater() {
  // TO-DO: rework this into a smarter function
  // Update the workers with their current prices
  document.getElementById('btn-hire-box-maker').innerHTML =
    'Hire box maker - cost: ' + gameData.workers.boxMakers.cost;

  document.getElementById('btn-hire-box-baker').innerHTML =
    'Hire box baker - cost: ' + gameData.workers.boxBakers.cost;

  document.getElementById('btn-hire-pox-waker').innerHTML =
    'Hire pox waker - cost: ' + gameData.workers.poxWakers.cost;
}

function interfaceIO() {
  // TO-DO: rework this into a smarter function
  // Enable/disable the worker buttons based on our boxes
  if (gameData.workers.boxMakers.cost > gameData.counters.numSmallBoxes) {
    document.getElementById('btn-hire-box-maker').disabled = true;
  } else {
    document.getElementById('btn-hire-box-maker').disabled = false;
  }

  if (gameData.workers.boxBakers.cost > gameData.counters.numSmallBoxes) {
    document.getElementById('btn-hire-box-baker').disabled = true;
  } else {
    document.getElementById('btn-hire-box-baker').disabled = false;
  }

  if (gameData.workers.poxWakers.cost > gameData.counters.numSmallBoxes) {
    document.getElementById('btn-hire-pox-waker').disabled = true;
  } else {
    document.getElementById('btn-hire-pox-waker').disabled = false;
  }
}

function interfaceDisplayer() {

  // show counter if any boxes were made
  if (gameData.milestones[0].triggered) {
    showNewElement('statistics-card');
    showNewElement('counter-small-boxes');
  }

  // show factory and box maker button if we have at least 10 boxes
  if (gameData.milestones[1].triggered) {
    showNewElement('box-factory');
  }

  // show box makers counter if we have at least 1 box maker
  if (gameData.milestones[2].triggered) {
    showNewElement('counter-box-makers');
  }

  // show box baker button if we have at least 25 boxes or something
  if (gameData.milestones[3].triggered) {
    showNewElement('li-hire-box-baker');
  }

  // show box bakers counter if we have at least 1 box baker
  if (gameData.milestones[4].triggered) {
    showNewElement('counter-box-bakers');
  }

  // show baked boxes counter if we have at least 1 baked box
  if (gameData.milestones[5].triggered) {
    showNewElement('counter-baked-boxes');
  }

  // show pox waker button if we have at least 25 baked boxes
  if (gameData.milestones[6].triggered) {
    showNewElement('li-hire-pox-waker');
  }

  // show waked pox counter if we have at least 1 waked pox
  if (gameData.milestones[7].triggered) {
    showNewElement('counter-pox-wakers');
  }

  // show waked pox counter if we have at least 1 waked pox
  if (gameData.milestones[8].triggered) {
    showNewElement('counter-waked-poxes');
  }
    
}

/*
this exists so when a player reaches 9001 boxes and buys an upgrade worth 9000 
boxes and then saves the game, when they reload it, the interface of the
unlocked element will disappear, making it very confusing.

This crazy function is a way to work around that!
*/
function milestoneTriggerer() {
  for (var index = 0; index < gameData.milestones.length; index++) {

    if (!gameData.milestones[index].triggered) {
      
      var interpretedCondition = [
        'if (',
        gameData.milestones[index].condition.resource,
        gameData.milestones[index].condition.comparison,
        gameData.milestones[index].condition.threshold,
        '){',
        'gameData.milestones[index].triggered = true;',
        '}'
      ];

      eval(interpretedCondition.join(''));
    }
    
  }

}

// END INTERVAL MANAGERS -------------------------------------------------------

// START INTERVAL FUNCTION -----------------------------------------------------

// Run UI update code every 10ms
window.setInterval(function () {
  counterUpdater();
  priceUpdater();
  interfaceIO();
  interfaceDisplayer();
  milestoneTriggerer();
}, 10);

// END INTERVAL FUNCTION -------------------------------------------------------

// YE POOR LOAD FUNCTION -------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  console.log("ready!");
  loadTheGame(true);
  document.body.classList.remove('invisible-stuff');
});
