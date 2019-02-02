// START GLOBAL letS -----------------------------------------------------------
// Basic letiable declaration - keep track of how many of each item we currently own, and how much the new ones should cost.
/*
Data structure should be splitting stuff into what is owned by what.
*/
let gameData = {
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
      speed: 0.00001 // initial should be 0.00001
    },
    phase2: {
      active: false,
      progress: 0,
      speed: 0.000001 // initial should be 0.000001
    }
  },
  io: {
    hireBoxMaker: 'btn-hire-box-maker',
    hireBoxBaker: 'btn-hire-box-baker',
    hirePoxWaker: 'btn-hire-pox-waker',
    upgradeBoxStacking: 'upgrade-btn-box-stacking',
    upgradeBoxShelving: 'upgrade-btn-box-shelving',
    upgradeBoxCompacting: 'upgrade-btn-box-compacting',
    upgradeMarketing: 'upgrade-btn-marketing',
    upgradeBoxedCats: 'upgrade-btn-boxed-cats',
    upgradeDiseaseVectors: 'upgrade-btn-disease-vectors',
    upgradeDyslexia: 'upgrade-btn-dyslexia'
  },
  upgrades: {
    boxStacking: {
      bought: false,
      cost: 100,
      currency: 'numBakedBoxes',
      
    },
    boxShelving: {
      bought: false,
      cost: 500,
      currency: 'numBakedBoxes',
      
    },
    boxCompacting: {
      bought: false,
      cost: 1000,
      currency: 'numBakedBoxes',
      
    },
    marketing: {
      bought: false,
      cost: 200,
      currency: 'numBakedBoxes',
      
    },
    boxedCats: {
      bought: false,
      cost: 750,
      currency: 'numBakedBoxes',
      
    },
    
    diseaseVectors: {
      bought: false,
      cost: 100,
      currency: 'numPoxWaked',
      
    },
    dyslexia: {
      bought: false,
      cost: 200,
      currency: 'numPoxWaked',
      
    }
  },
  milestones: {
    smallBoxCounter:
    {
      triggered: false,
      elements: ['statistics-card', 'counter-small-boxes'],

    },
    boxFactory:
    {
      triggered: false,
      elements: ['box-factory'],

    },
    smallBoxMaker:
    {
      triggered: false,
      elements: ['counter-box-makers'],

    },
    boxBakerButton:
    {
      triggered: false,
      elements: ['li-hire-box-baker'],

    },
    boxBakerCounter:
    {
      triggered: false,
      elements: ['counter-box-bakers'],

    },
    bakedBoxCounter:
    {
      triggered: false,
      elements: ['counter-baked-boxes'],

    },
    poxWakerButton:
    {
      triggered: false,
      elements: ['li-hire-pox-waker'],

    },
    poxWakerCounter:
    {
      triggered: false,
      elements: ['counter-pox-wakers'],

    },
    wakedPoxCounter:
    {
      triggered: false,
      elements: ['counter-waked-poxes'],

    },
    upgradesCard:
    {
      triggered: false,
      elements: ['upgrades-card'],

    },
    upgradeBoxShelving:
    {
      triggered: false,
      elements: ['upgrade-box-shelving'],

    },
    upgradeBoxCompacting:
    {
      triggered: false,
      elements: ['upgrade-box-compacting'],

    },
    upgradeMarketing:
    {
      triggered: false,
      elements: ['upgrade-marketing'],

    },
    upgradeBoxedCats:
    {
      triggered: false,
      elements: ['upgrade-boxed-cats'],

    },
    upgradeDiseaseVectors:
    {
      triggered: false,
      elements: ['upgrade-disease-vectors'],

    },
    upgradeDyslexia:
    {
      triggered: false,
      elements: ['upgrade-dyslexia'],

    },
    showMeowconomyProgressBar:
    {
      triggered: false,
      elements: ['meowconomy-progress'],

    }
  },
  achievements: {},
  etc: {
    doNot: 0,
    moreEvilDoNot: 0
  }
};

const gameMethods = {
  io: {
    hireBoxMaker: function () { return this.gameData.counters.numSmallBoxes >= gameData.workers.boxMakers.cost; },
    hireBoxBaker: function () { return this.gameData.counters.numSmallBoxes >= gameData.workers.boxBakers.cost; },
    hirePoxWaker: function () { return this.gameData.counters.numSmallBoxes >= gameData.workers.poxWakers.cost; },
    upgradeBoxStacking: function () { return this.gameData.counters.numBakedBoxes >= gameData.upgrades.boxStacking.cost; },
    upgradeBoxShelving: function () { return this.gameData.counters.numBakedBoxes >= gameData.upgrades.boxShelving.cost; },
    upgradeBoxCompacting: function () { return this.gameData.counters.numBakedBoxes >= gameData.upgrades.boxCompacting.cost; },
    upgradeMarketing: function () { return this.gameData.counters.numBakedBoxes >= gameData.upgrades.marketing.cost; },
    upgradeBoxedCats: function () { return this.gameData.counters.numBakedBoxes >= gameData.upgrades.boxedCats.cost; },
    upgradeDiseaseVectors: function () { return this.gameData.counters.numBakedBoxes >= gameData.upgrades.diseaseVectors.cost; },
    upgradeDyslexia: function () { return this.gameData.counters.numBakedBoxes >= gameData.upgrades.dyslexia.cost; }

  },
  upgrades: {
    boxStacking: function () { incrementClickPower(3, 'stack') },
    boxShelving: function () { incrementClickPower(12, 'shelf') },
    boxCompacting: function () { incrementClickPower(48, 'compact') },
    marketing: function () { meowConomy('phase1', 'activate') },
    boxedCats: function () { meowConomy('phase1', 'increment', 1) },
    diseaseVectors: function () { meowConomy('phase2', 'activate') },
    dyslexia: function () { meowConomy('phase2', 'transform', 'rats') }
  },
  milestones: {
    smallBoxCounter: function () { return this.gameData.counters.numSmallBoxes >= 1; },
    boxFactory: function () { return this.gameData.counters.numSmallBoxes >= 10; },
    smallBoxMaker: function () { return this.gameData.workers.boxMakers.amount >= 1; },
    boxBakerButton: function () { return this.gameData.counters.numSmallBoxes >= 25; },
    boxBakerCounter: function () { return this.gameData.workers.boxBakers.amount >= 1; },
    bakedBoxCounter: function () { return this.gameData.counters.numBakedBoxes >= 1; },
    poxWakerButton: function () { return this.gameData.counters.numBakedBoxes >= 25; },
    poxWakerCounter: function () { return this.gameData.workers.poxWakers.amount >= 1; },
    wakedPoxCounter: function () { return this.gameData.counters.numPoxWaked >= 1; },
    upgradesCard: function () { return this.gameData.counters.numBakedBoxes >= 50; },
    upgradeBoxShelving: function () { return this.gameData.counters.numBakedBoxes >= 250; },
    upgradeBoxCompacting: function () { return this.gameData.counters.numBakedBoxes >= 500; },
    upgradeMarketing: function () { return this.gameData.counters.numBakedBoxes >= 100; },
    upgradeBoxedCats: function () { return this.gameData.counters.numBakedBoxes >= 375; },
    upgradeDiseaseVectors: function () { return this.gameData.counters.numPoxWaked >= 50; },
    upgradeDyslexia: function () { return this.gameData.counters.numPoxWaked >= 100; },
    showMeowconomyProgressBar: function () { return this.gameData.apocalypse.phase1.active == true; }

  }
}


// END GLOBAL VARS -------------------------------------------------------------

// START AUX FUNCTIONS ---------------------------------------------------------

// this is cool black magic. 
// Source: https://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key
Object.byString = function (o, s) {
  s = s.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  s = s.replace(/^\./, '');           // strip a leading dot
  let a = s.split('.');
  for (let i = 0, n = a.length; i < n; ++i) {
    let k = a[i];
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
  let objectValue = Object.byString(gameData, objectStringKey);

  if (document.getElementById(elementId).innerHTML != objectValue) {
    document.getElementById(elementId).innerHTML = objectValue;

  }
}

// END AUX FUNCTIONS -----------------------------------------------------------

// START CUSTOM UPGRADE FUNCTIONS ----------------------------------------------

function incrementClickPower (amount, method) {
  // TO-DO: make this less dumb
  gameData.clickPower += amount;

  switch (method) {
    case 'stack':
      document
        .getElementById('make-small-boxes')
        .innerHTML = 'Make small boxes <br><i class="fa fa-cube"></i><br><i class="fa fa-cube"></i><br><i class="fa fa-cube"></i><br><i class="fa fa-cube"></i>';
      
      break;

    case 'shelf':
      document
        .getElementById('make-small-boxes')
        .innerHTML = `Make small boxes 
          <br> 
          <i class="fa fa-cube"></i> <i class="fa fa-cube"></i> <i class="fa fa-cube"></i> <i class="fa fa-cube"></i>
          <br>
          <i class="fa fa-cube"></i> <i class="fa fa-cube"></i> <i class="fa fa-cube"></i> <i class="fa fa-cube"></i>
          <br>
          <i class="fa fa-cube"></i> <i class="fa fa-cube"></i> <i class="fa fa-cube"></i> <i class="fa fa-cube"></i>
          <br>
          <i class="fa fa-cube"></i> <i class="fa fa-cube"></i> <i class="fa fa-cube"></i> <i class="fa fa-cube"></i>`
        ;
      
      break;
    
    case 'compact':
      document
        .getElementById('make-small-boxes')
        .innerHTML = `Make small boxes
          <br> 
          <i class="fa fa-2x fa-cubes"></i> <i class="fa fa-2x fa-cubes"></i> <i class="fa fa-2x fa-cubes"></i> <i class="fa fa-2x fa-cubes"></i>
          <br>
          <i class="fa fa-2x fa-cubes"></i> <i class="fa fa-2x fa-cubes"></i> <i class="fa fa-2x fa-cubes"></i> <i class="fa fa-2x fa-cubes"></i>
          <br>
          <i class="fa fa-2x fa-cubes"></i> <i class="fa fa-2x fa-cubes"></i> <i class="fa fa-2x fa-cubes"></i> <i class="fa fa-2x fa-cubes"></i>
          <br>
          <i class="fa fa-2x fa-cubes"></i> <i class="fa fa-2x fa-cubes"></i> <i class="fa fa-2x fa-cubes"></i> <i class="fa fa-2x fa-cubes"></i>`
        ;

      break;
  
    default:
      break;
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
  let currencyUsedforPurchase = gameData['upgrades'][upgradeName]['currency'];
  let costOfTheUpgrade = gameData['upgrades'][upgradeName]['cost'];

  // perform the currency deduction and register the purchase
  gameData['upgrades'][upgradeName]['purchased'] = true;
  gameData['counters'][currencyUsedforPurchase] -= costOfTheUpgrade;

  // execute the effect function
  gameMethods['upgrades'][upgradeName].call();

  document.getElementById(parentListElement).classList.add('really-invisible-stuff');

}

// do not click thing
function doNotClick(thisElement) {
    let arrTexts = [
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
    let savegame = JSON.parse(localStorage.getItem('boxGameSave'));
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
    let areYouSure = confirm('Are you sure you want to delete your save?')
    if (areYouSure) {
        localStorage.removeItem('boxGameSave');
        location.reload();
    }
}

// necessary for method persistence between saves. Will be called by both document.ready and loadTheGame functions
function addMethods () {

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
  // Enable/disable the worker buttons based on our boxes
  // now uses the io object to loop through
  // added another if to only do this for visible elements too

  // rework
  for (ioDataKey in gameMethods.io) {
    let thresholdTest = gameMethods.io[ioDataKey].call({ gameData });

    if (thresholdTest) {
      // if we can click the button
      document.getElementById(gameData.io[ioDataKey]).disabled = false;
    } else {
      // if we can't click the butten
      document.getElementById(gameData.io[ioDataKey]).disabled = true;

    }
    
  }

}

function interfaceDisplayer() {
  // rework
  for (let milestoneDataKey in gameData.milestones) {
    if (gameMethods.milestones.hasOwnProperty(milestoneDataKey)) {
      if (gameData.milestones[milestoneDataKey].triggered) {
        for (let interfaceElement = 0; interfaceElement < gameData.milestones[milestoneDataKey].elements.length; interfaceElement++) {
          showNewElement(gameData.milestones[milestoneDataKey].elements[interfaceElement]);
        }

      }

    }
  }
    
}

function meowconomyUpdater() {
  // this updates the progress bar towards the endgame
  // depends on which phase is active. Its kinda pseudo-milestone.
  if (gameData.apocalypse.phase1.active && !gameData.apocalypse.phase2.active) {
    // phase 1 is green
    gameData.apocalypse.phase1.progress += gameData.apocalypse.phase1.speed;
    document.getElementById('meowconomy-bar').style.width = Math.floor(gameData.apocalypse.phase1.progress) + '%';

    // type can be either counter or worker

    if (document.getElementById('meowconomy-speed').innerHTML != gameData.apocalypse.phase1.speed * 100) {
      document.getElementById('meowconomy-speed').innerHTML = gameData.apocalypse.phase1.speed * 100;

    }

  } else if (gameData.apocalypse.phase1.active && gameData.apocalypse.phase2.active) {
    // phase 2 is red. Long if just to guarantee consistency
  } 

}

/*
this exists so when a player reaches 9001 boxes and buys an upgrade worth 9000 
boxes and then saves the game, when they reload it, the interface of the
unlocked element will disappear, making it very confusing.

This crazy function is a way to work around that!
Now better thanks to Farcaller who helped me kill the Eval()
*/
function milestoneTriggerer() {
  for (let milestoneDataKey in gameData.milestones){
    if (gameMethods.milestones.hasOwnProperty(milestoneDataKey)) {
      if (!gameData.milestones[milestoneDataKey].triggered) {
        // if not triggered, search for its function using milestoneDataKey
        let thresholdTest = gameMethods.milestones[milestoneDataKey].call({ gameData });
        
        if (thresholdTest) {
          gameData.milestones[milestoneDataKey].triggered = true;
        }

      }

    }
  }

}

// END INTERVAL MANAGERS -------------------------------------------------------

// START INTERVAL FUNCTION -----------------------------------------------------

// Run UI update code every 10ms
window.setInterval(function () {
  counterUpdater();
  priceUpdater();
  interfaceDisplayer();
  milestoneTriggerer();
  meowconomyUpdater()
  interfaceIO();
}, 10);

// END INTERVAL FUNCTION -------------------------------------------------------

// ONLOAD FUNCTION -------------------------------------------------------
document.addEventListener("DOMContentLoaded", function () {
  console.log("ready!");
  loadTheGame(true);
  document.body.classList.remove('invisible-stuff');
});
