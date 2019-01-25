// START GLOBAL VARS -----------------------------------------------------------
// Basic variable declaration - keep track of how many of each item we currently own, and how much the new ones should cost.
/*
Data structure should be splitting stuff into what is owned by what.
*/
var gameData = {
  clickPower: 1,
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
  apocalypse: {
    phase1: {
      active: false,
      progress: 0,
      speed: 0.00001
    },
    phase2: {
      active: false,
      progress: 0,
      speed: 0.000001
    }
  },
  upgrades: {
    boxStacking: {
      bought: false,
      cost: 100,
      currency: 'numBakedBoxes',
      effect: {
        function: 'incrementClickPower',
        params: [
          3
        ]
      }
    },
    marketing: {
      bought: false,
      cost: 200,
      currency: 'numBakedBoxes',
      effect: {
        function: 'meowConomy',
        params: [
          'phase1',
          'activate'
        ]
      }
    },
    boxedCats: {
      bought: false,
      cost: 750,
      currency: 'numBakedBoxes',
      effect: {
        function: 'meowConomy',
        params: [
          'phase1',
          'increment',
          1
        ]
      }
    },
    diseaseVectors: {
      bought: false,
      cost: 100,
      currency: 'numPoxWaked',
      effect: {
        function: 'meowPocalypse',
        params: [
          'phase2',
          'activate'
        ]
      }
    },
    dyslexia: {
      bought: false,
      cost: 200,
      currency: 'numPoxWaked',
      effect: {
        function: 'meowPocalypse',
        params: [
          'phase2',
          'transform',
          'rats'
        ]
      }
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
    },
    {
      name: 'upgradesCard',
      triggered: false,
      condition: {
        resource: 'gameData.counters.numBakedBoxes',
        comparison: '>=',
        threshold: 50
      }
    },
    {
      name: 'upgradeMarketing',
      triggered: false,
      condition: {
        resource: 'gameData.counters.numBakedBoxes',
        comparison: '>=',
        threshold: 100
      }
    },
    {
      name: 'upgradeBoxedCats',
      triggered: false,
      condition: {
        resource: 'gameData.counters.numBakedBoxes',
        comparison: '>=',
        threshold: 375
      }
    },
    {
      name: 'upgradeDiseaseVectors',
      triggered: false,
      condition: {
        resource: 'gameData.counters.numPoxWaked',
        comparison: '>=',
        threshold: 5
      }
    },
    {
      name: 'upgradeDyslexia',
      triggered: false,
      condition: {
        resource: 'gameData.counters.numPoxWaked',
        comparison: '>=',
        threshold: 100
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

// this is cool black magic. 
// Source: https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  var a = s.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
}

function showNewElement(elementId) {
    // TO-DO: animation
    document.getElementById(elementId).classList.remove('invisible-stuff');
}
function hideElement(elementId) {
    // TO-DO: animation
    document.getElementById(elementId).classList.add('invisible-stuff');
}

function conditionallyUpdateInterfaceElement(elementId, objectStringKey) {
  // type can be either counter or worker
  var objectValue = Object.byString(gameData, objectStringKey);

  if (document.getElementById(elementId).innerHTML != objectValue) {
    document.getElementById(elementId).innerHTML = objectValue;

  }
}

// END AUX FUNCTIONS -----------------------------------------------------------

// START CUSTOM UPGRADE FUNCTIONS ----------------------------------------------

function incrementClickPower (amount) {
  gameData.clickPower += amount;

  for (var index = 0; index < amount; index++) {
    document.getElementById('make-small-boxes').insertAdjacentHTML('beforeend', ' <i class="fa fa-cube"></i>');
  }
}

function meowConomy (phase, command, increment){
  // TO-DO: implement the counter function to display a progress bar and keep incrementing the apocalypse
  switch (command) {
    case 'activate':
      gameData['apocalypse'][phase]['active'] = true;
      
      break;

    case 'increment':
      gameData['apocalypse'][phase]['speed'] += increment;
      
      break;

    case 'transform':
      // TO-DO: replace all instances of the word cat and cats for rat and rats
  
    default:
      break;
  }
}

// END CUSTOM UPGRADE FUNCTIONS ------------------------------------------------

// START INTERFACE TRIGGERED FUNCTIONS -----------------------------------------

// small box maker button
function makeSmallBox() {
  // add a box and show on the interface
  // document.getElementById('number-small-boxes').innerHTML = gameData.counters.numSmallBoxes + gameData.clickPower;

  // TO-DO: this create a very laggy feeling box making button. Maybe rethink?
  gameData.counters.numSmallBoxes += gameData.clickPower;
}

// hire worker button
function hireWorker(workerType) {
  ++gameData['workers'][workerType]['amount'];

  // Deduct cost
  gameData['counters']['numSmallBoxes'] -= gameData['workers'][workerType]['cost'];

  // Increase cost for the next one, using Math.ceil() to round up
  gameData['workers'][workerType]['cost'] = Math.ceil(gameData['workers'][workerType]['cost'] * gameData['workers'][workerType]['costIncrement']);
}

function buyUpgrade(upgradeName, parentListElement) {
  // get the currency and cost
  var currencyUsedforPurchase = gameData['upgrades'][upgradeName]['currency'];
  var costOfTheUpgrade = gameData['upgrades'][upgradeName]['cost'];

  // perform the currency deduction and register the purchase
  gameData['upgrades'][upgradeName]['purchased'] = true;
  gameData['counters'][currencyUsedforPurchase] -= costOfTheUpgrade;

  // eval the effect function
  var functionName = gameData['upgrades'][upgradeName]['effect']['function'];
  var functionParams = gameData['upgrades'][upgradeName]['effect']['params'];


  document.getElementById(parentListElement).classList.add('really-invisible-stuff');

  eval(functionName + '(' + functionParams.join('') + ')');

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

// testing function to add resources and workers without any cost.
function testAddStuff(resourceGroup, resourceName, resourceParam, amount) {
  if (!resourceParam) {
    // means we're adding counters
    gameData[resourceGroup][resourceName] += amount;

  } else {
    // means we're adding workers
    gameData[resourceGroup][resourceName][resourceParam] += amount;

  }
}

// testing function to show the testing tools
// activate testing utilities by typing ta() into the console
// hide testing utilities by doing the exact same thing.
function ta() {
  if (document.getElementById('testing-area').classList.contains('invisible-stuff')) {
    showNewElement('testing-area');
    
  } else {
    hideElement('testing-area');
    
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
  document.getElementById('number-small-boxes').innerHTML = Math.floor(gameData.counters.numSmallBoxes);
  document.getElementById('number-baked-boxes').innerHTML = Math.floor(gameData.counters.numBakedBoxes);
  document.getElementById('number-waked-poxes').innerHTML = Math.floor(gameData.counters.numPoxWaked);

  // Update the number of workers that were hired so far
  conditionallyUpdateInterfaceElement('number-box-makers', 'workers.boxMakers.amount');
  conditionallyUpdateInterfaceElement('number-box-bakers', 'workers.boxBakers.amount');
  conditionallyUpdateInterfaceElement('number-pox-wakers', 'workers.poxWakers.amount');

}

function priceUpdater() {
  conditionallyUpdateInterfaceElement('cost-hire-box-maker', 'workers.boxMakers.cost');
  conditionallyUpdateInterfaceElement('cost-hire-box-baker', 'workers.boxBakers.cost');
  conditionallyUpdateInterfaceElement('cost-hire-pox-waker', 'workers.poxWakers.cost');

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

  // upgrade purchases below!
  if (gameData.upgrades.boxStacking.cost > gameData.counters.numBakedBoxes) {
    document.getElementById('upgrade-btn-box-stacking').disabled = true;
  } else {
    document.getElementById('upgrade-btn-box-stacking').disabled = false;
  }
  if (gameData.upgrades.marketing.cost > gameData.counters.numBakedBoxes) {
    document.getElementById('upgrade-btn-marketing').disabled = true;
  } else {
    document.getElementById('upgrade-btn-marketing').disabled = false;
  }
  if (gameData.upgrades.boxedCats.cost > gameData.counters.numBakedBoxes) {
    document.getElementById('upgrade-btn-boxed-cats').disabled = true;
  } else {
    document.getElementById('upgrade-btn-boxed-cats').disabled = false;
  }
  if (gameData.upgrades.diseaseVectors.cost > gameData.counters.numPoxWaked) {
    document.getElementById('upgrade-btn-disease-vectors').disabled = true;
  } else {
    document.getElementById('upgrade-btn-disease-vectors').disabled = false;
  }
  if (gameData.upgrades.dyslexia.cost > gameData.counters.numPoxWaked) {
    document.getElementById('upgrade-btn-dyslexia').disabled = true;
  } else {
    document.getElementById('upgrade-btn-dyslexia').disabled = false;
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

  // show the upgrades card and the first upgrade as well when we have at least 10 baked boxes
  if (gameData.milestones[9].triggered) {
    showNewElement('upgrades-card');
  }

  // show the marketing upgrade when we have at least 100 baked boxes
  if (gameData.milestones[10].triggered) {
    showNewElement('upgrade-marketing');
  }

  // show another upgrade item
  if (gameData.milestones[11].triggered) {
    showNewElement('upgrade-boxed-cats');
  }

  // show another upgrade item
  if (gameData.milestones[12].triggered) {
    showNewElement('upgrade-disease-vectors');
  }

  // show another upgrade item
  if (gameData.milestones[13].triggered) {
    showNewElement('upgrade-dyslexia');
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
  // loadTheGame(true);
  document.body.classList.remove('invisible-stuff');
});
