// WARNING: Script loads before HTML

"use strict";
let time;

let chapter = 0;
let storyLine = 1; // Now this is useless, but maybe I could reuse it

// Used in f startUpdate().
// 1 frame = 77ms. 13 frames = 1001ms
let gameInterval;

let playerDirectory = ''; // Used in playerConsole parseInput

// Player info works!
const locations = [
   'Office (Dallas)'
];

let Player = {
   place: 0,
   actions: 0, // location is a thing. no overwrite or error
   lives: 10,
   inventory: {}
};

let messages = {
   start: (
      `Σ<i class = "dogeblue">` +
      `"Hi. Welcome to SideQuest"</i>Σ` +
      ` says the director. \n` +
      `Σ<i class = "dogeblue">` +
      `"There are only 3 challenges. Simple challenges, ` +
      `but they somehow take up the whole year.\n\nGood luck"</i>Σ` +
      `\n\n\nA TV lights up saying ` +
      `Σ<i class = "gray">"First Challenge: Go to Rowlett"</i>Σ\n\n` +
      `What? That's really easy. Just 15 miles-ish\n` +
      `Σ<i class = "green">"SUPER FREE TREE APPLE!"</i>Σ` +
      ` a kid outside yells. Σ<i class = "orange">gasp</i>Σ\n` +
      `Your car is Σ<em>missing!</em>Σ ` +
      `What used to be a crowded lot with no space\n` +
      `is now replaced by an asteroid.\n\n` +
      `Σ<ul><li>What a boring presentation</li>` +
      `<li>Wait... they said to leave everything</li></ul>Σ` +
      `Σ<u>Test!</u>Σ \n\n` +
      `Σ<a class = "link" onClick = "storyAction(0)">An option</a>Σ`
   ),
   welcome: (
      'Welcome!<br><br>' +
      'You can hover over the menu for instructions and settings and stuff. ' +
      'Click on one of the light blue links to start playing this adventure game'
   ),
   menuInstructions: (
      'Click on the text links to play.<br><br>' +
      'You can also type <em>help</em> in the "console", ' +
      'which is the "orange" box at the bottom with the <em>></em> symbol' +
      '<br><br>' +
      '(Afterwards press Enter)'
   ),
   menuSettings: (
      `Type <em>settings</em> in the "console", ` +
      'the <i style = "orange">orange"</i> box at the bottom' +
      ' with the <em>></em> symbol<br><br>' +
      '(Afterwards press Enter)'
   ),
      // TODO: Turn this into a list or table or something
      // TODO: Figure out copyright and stuff, maybe in a footer
   menuCredits: (
      'Credits:<br><br>' +
      'Me (icecream17)<br>' +
      'Test - JS.do<br>' +
      'Search - Google<br>' +
      'Menu icon - Google<br>' +
      'JQuery - JQuery Foundation (hosted by Google)<br>' +
      '[everything] Understanding - ' +
      'Stack Overflow, W3 Schools, MDN, Google<br>' +
      ' - CSS Understanding<br>' +
      ' - Animation Understanding<br>' +
      ' - Menu Dropdown<br>' +
      ' - Story scroll<br>' +
      ' - Async attempt (Success?)<br>' +
      ' - HTML whitespace (computerhope.com)<br>' +
      ' - https://stackoverflow.com/questions/62054308/' +
      'how-could-i-prevent-the-div-from-blocking-the-dropdown<br>' +
      ' - nbsp; is not a space " " but rather "\xa0"<br>' +
      ' - Custom console.log css <br>' +
      ' - - Example: console.log("%c Wow", "color: dodgerblue")<br>' +
      ' - accessibility<br>' +
      ' - CSS selectors, and Selector Combinators'
   )
};

/*
Consider:

accessibility
   <abbr title = "abbreveation">abbr.</abbr>
      on hover it shows the title
   properties: tab-index
   <a> (link) properties: title, accesskey

syntax--markup syntax--underline syntax--link syntax--https syntax--hyperlink
*/

// checkMenu variables
let previousMenuDisplayState = "none";
let menuDelayLeft = 0;

// no jQuery anymore
function getById(id) {return document.getElementById(id);}
function getByClass(className) {
   return document.getElementsByClassName(className);
}

function startGame() {
   time = new Date();

   // Is there a better way?
   // WOW: The JS whitespace AND the HTML whitespace are good!
   document.body.innerHTML = `
      <main id = 'storyDiv'>
         <p id = 'story'></p>
      </main>
      <div id = 'infoContainer'>
         <div class = 'dropdown'>
            <button id = 'gameMenu'>
               <span class = "material-icons">menu</span>
            </button>
            <div class = 'dropdownContent'>
               <button id = 'menuInstructions'
                  onClick = 'menu("menuInstructions")'
               >
               Instructions </button>

               <button id = 'menuSettings' onClick = 'menu("menuSettings")'>
               Settings </button>

               <button id = 'menuCredits' onClick = 'menu("menuCredits")'>
               Credits </button>
            </div>
         </div>
         <section id = 'playerInfoContainer'>
            <h2 id = 'playerInfoHeader'></h2>
            <p id = 'playerInfo'></p>
         </section>

         <br>
         <section id = 'messageConsoleContainer'>
            <h2 id = 'messageConsoleHeader'></h2>
            <p id = 'messageConsole'></p>
         </section>
      </div>
      <div id = 'playerConsoleContainer'>
         <p id = 'playerConsole' contenteditable = 'true'></p>
      </div>
   `;

   // Usually I like putting the => notation
   setTimeout( function() {
      writeToStory(messages.start);

      setTimeout ( function() {
         startUpdate();
         getById('messageConsole').innerHTML = messages.welcome;
         getById('playerConsole').innerHTML = `<em>>&nbsp;</em>`;

         // MDN keydown event
         getById('playerConsole').addEventListener('keydown', playerConsole);
      }, 2000);
   }, 5000);

   // future self: https://www.w3schools.com/cssref/css3_pr_animation.asp
   document.body.classList.add('startGameBackgroundTransition');
   getById('story').classList.add('startGameBackgroundTransition');
}

function continueGame() {
   if (getById('potato') ?? false) {
      getById('continue').parentNode.removeChild(getById('continue'));
      colorLog('green', 'success?');
   } else {
      let notice = document.createElement('p');
      notice.id = 'potato';
      notice.innerHTML = 'Sorry, this feature is currently unavailable';

      getById('continue').insertAdjacentElement('afterend', notice);
   }
}

// TODO: Make menu accessible
function menu(elementID) {
   let messageElement = getById('messageConsole');

   const validElementIDs = ['menuInstructions', 'menuSettings', 'menuCredits'];

   if (validElementIDs.includes(elementID)) {
      messageElement.innerHTML = messages[elementID];
   } else {
      console.error(
         'Error Code 0: Invalid elementID in menu(elementID) function'
      );
   }
}

console.clear(); // So helpful

function messageToStory (...messages) {
   // wouldn't know how to write multiple things
}

function writeToStory (text, newline = '\n') {
   async function avoidEncryption() {
      await writeCharacters(text + newline);
   }

   function writeCharacters(string) {
      let characters = [];

      let mode = false;
      let currentCharacter = '';

      for (let i = 0; i < string.length; i++) {
         if (mode) {
            // Σ = Alt + 2020
            if (string[i] === 'Σ') {
               characters.push(currentCharacter);
               currentCharacter = '';
               mode = false;
            } else if (string[i] === '\n') {
               currentCharacter += '<br>';
            } else {
               currentCharacter += string[i];
            }
         } else if (string[i] === '\n') {
            characters.push('<br>');
         } else if (string[i] === 'Σ') {
            mode = true;
         } else {
            characters.push(string[i]);
         }
      }

      colorLog('green', 'writeToStory()\nStart:');
      colorLog('dodgerblue', string);

      return new Promise (
         resolve => {
            let writeCharacterByCharacter = setInterval( function () {
               let nextCharacter = characters.shift();

               // Instead of appendChild becuase it's not an element
               getById('story').innerHTML += nextCharacter;

               if (characters.length === 0) {
                  clearInterval(writeCharacterByCharacter);
                  resolve('done!');
               }
            }, 10);
         }
      );
   }
   // oh...
   // wow this is the longest return statement ever

   function clickToContinue() {
      // can't do this yet.
      // would be soo great for suspense
   }

   // amazing
   avoidEncryption();
}

function updateInfo() {
   // Originally the info declaration at lives: and time: wasn't indented

   let info = (
      `location: ${locations[Player.place]} <br> ` +
      `lives: ${Player.lives} <br> actions: ${Player.actions} <br> ` +
      `time: ${humanTime()} <br><br> Inventory <br>`
   );

   if (Object.keys(Player.inventory).length === 0) {
      info += 'none';
   } else {
      for (let i of Object.keys(Player.inventory)) {
         let keyInfo = `${i}: ${Player.inventory[i]} <br> `;
         info += keyInfo;
      }
   }

   getById('playerInfo').innerHTML = info;
}

// TODO: Finish time for longer periods, like days
function humanTime() {
   let ms = new Date() - time;

   let sec = Math.floor(ms / 1000);
   ms -= (sec * 1000);

   for (ms = String(ms); ms.length < 3; ms = '0' + ms) {/* empty */}

   let min = Math.floor(sec / 60);
   sec -= (min * 60);

   if (min < 60) {
      if (sec < 10) {sec = '0' + sec;}
      return `${min}:${sec}.${ms}`;
   } else if (min < 200) {
      return `${min} minutes`;
   }

   let hrs = Math.floor(min / 60);
   min -= (hrs * 60);

   return `${hrs} hrs, ${min} minutes`;
}

// TODO: Different types of player info, and change the header accordingly
function startUpdate() {
   getById('playerInfoHeader').innerHTML = 'Player info';
   getById('messageConsoleHeader').innerHTML = 'Game messages';

   gameInterval = setInterval(
      () => {
         updateInfo();
         checkMenu();
      }, 77
   );
}

function storyAction(choiceID) {
   colorLog('dodgerblue', 'storyAction: ' + choiceID);
}

function playerConsole (event) {
   if (event.code === "Enter") {

      // Don't need to async since the timeout starts after everything.

      let playerInput = getById('playerConsole').innerText.trim();
      const pathLength = playerDirectory.length + 2;

      // .substr() is legacy, and '\xa0' means 'nbsp;'
      if (playerInput === '>\xa0') {
         visibleError('Huh?', `You didn't type anything.`);
      } else if (
         playerInput.substring(0, pathLength) !== playerDirectory + '> '
      ) {
         visibleError('Error',
            'Do not delete or change the start,<br>' +
            `where it's supposed to say "${playerDirectory + '>'}"`
         );
      } else {
         // Put trim before if
         playerInput = (
            playerInput.substring(pathLength, playerInput.length)
         ).trim();

         colorLog('dodgerblue', playerInput, playerInput.length);

         if (playerInput.length === 0) {
            visibleError('Huh?',
               `You didn't type anything...<br>` +
               `Exiting the "${playerDirectory}" path`
            );

            // 'help/how/why' => 'help/how'
            playerDirectory = playerDirectory.substring(
               0, playerDirectory.lastIndexOf('/')
            );
         } else {
            parseInput(playerInput);
         }
      }

      // For some reason the setTimeout prevents a div from popping up.
      setTimeout( function() {
         getById('playerConsole').innerHTML =
            `<em>${playerDirectory}>&nbsp;</em>`;
      }, 25 );
   }
}

function visibleError(type, text) {
   if (type === 'Error') {
      getById('messageConsole').html(
         '<i class = "red">Error</i><br>' + text
      );
   } else if (type === 'Warn') {
      getById('messageConsole').html(
         '<i class = "orange">Warning</i><br>' + text
      );
   } else if (type === 'Huh?') {
      getById('messageConsole').html(
         '<i class = "dogeblue">Huh?</i><br>' + text
      );
   } else {
      console.error('Error Code 1: unsupported visibleError type: ' + type);
   }
}

function parseInput (playerInput) {
   let startCommands = [
      'help', 'settings'
   ];

   if (playerInput === 'done') {
      getById('#messageConsole').html(
         '<i class = "green">ok ✓</i>'
      );
   }

   let standardNote = '(Type the number corresponding to the option you want)';

   if (playerDirectory === '') {
      if (startCommands.indexOf(playerInput) !== -1) {
         parseStartCommand(playerInput);
         playerDirectory = playerInput;
      } else {
         exitPathAndWarnPlayer(playerInput,
            `I don't actually talk english and ` +
            `so I have no idea what you mean by "${playerInput}"`
         );
      }
   } else if (playerDirectory.substring(0, 4) === 'help') {
      parseHelpCommand(playerInput);
   }

   function parseStartCommand(command) {
      if (command === 'help') {
         getById('messageConsole').html(
            `What do you need help on?<br><ol>` +
            `<li>How to play</li>` +
            `<li>What this game is about</li>` +
            `<li>What the boxes and stuff mean</li>` +
            `<li>How this console works</li>` +
            `<li>Winning the game</li>` +
            `<li>Something else</li></ol>` + standardNote
         );
      }
   }

   function parseHelpCommand(command) {
      if (playerDirectory === 'help') {
         // isNaN() vs Number.isNaN()
         // isNaN() converts to Number automatically

         let helpOptions = (
            standardNote + `<br><ol>` +
            `<li>How to play</li>` +
            `<li>What this game is about</li>` +
            `<li>What the boxes and stuff mean</li>` +
            `<li>How this console works</li>` +
            `<li>Winning the game</li>` +
            `<li>Something else</li></ol>`
         );

         // NaN strings to NaN
         command = extraNumberConvert(command.toLowercase());

         if (Number.isNaN(command)) {
            exitPathAndWarnPlayer(command,
               `Errr, sorry. You actually have to type in a number.<br>` +
               `Otherwise I don't really understand.` + helpOptions
            );
         } else if (!Number.isInteger(command)) {
            visibleError('Warn',
               `${command}? <br>` +
               `That's like saying you want the "5.2"th cupcake.` +
               helpOptions
            );
         } else if (command < 1) {
            visibleError('Warn', `${command} is too small.` + helpOptions);
         } else if (command > 6) {
            visibleError('Warn', `${command} is too big.` + helpOptions);
         } else {
            switch (command) {
               case 1:
                  getById('messageConsole').innerHTML = (
                     `This is an adventure story. <br>` +
                     `You are presented with the current situation. <br>` +
                     `Read (the story). Then look at the links. <br>` +
                     `The links are choices, things you can do. <br>` +
                     `When you click on a link, the story continues, <br>` +
                     `as if you have done the choice. <br>` +
                     `For example, if you click on the link "Eat"<br>` +
                     `the story might continue with "It was delicious" <br>` +
                     `or "It was poisoned!" <br>` +
                     `or something else. This is an adventure. <br>` +
                     `Explore the world`
                  );
                  break;
               case 2:

                  break;
               case 3:

                  break;
               case 4:

                  break;
               case 5:

                  break;
               case 6:

                  break;
               default:
                  console.error('Error Code 2: Impossible error');
                  console.stack();
            }
         }
      }
   }

   function exitPathAndWarnPlayer(playerInput, message) {
      visibleError('Warn',
         message + `<br><br>Exiting the "${playerDirectory}" path`
      );

      // 'help/how/why' => 'help/how'
      playerDirectory = playerDirectory.substring(
         0, playerDirectory.lastIndexOf('/')
      );
   }

   let words = playerInput.split(' ');
}

function extraNumberConvert (string) {
   if (isNaN(string)) {
      // TODO: Expand number lookup. Maybe multiple languages
      //       Also detect stuff like "1 + 2" and "2 + x = 3 + 7"

      let numberLookup = [
         'zero', 'one', 'two', 'three', 'four', 'five',
         'six', 'seven', 'eight', 'nine', 'ten'
      ];

      if (numberLookup.includes(string)) {
         return numberLookup.indexOf(string);
      } else {
         return NaN;
      }
   } else {
      return Number(string);
   }
}

function colorLog (color, ...messages) {

   // WARNING: Do not use the variable name "arguments"
   let logArguments = ['%c', 'color: ' + color];

   for (let message of messages) {
      logArguments[0] += ' ';

      switch (typeof message) {
         case "string":
            logArguments[0] += message;
            break;
         case "number":
            if (Number.isInteger(message)) {
               logArguments[0] += '%i';
            } else {
               logArguments[0] += '%f';
            }
            logArguments.push(message);
            break;
         case "object":
            logArguments[0] += '%o';
            logArguments.push(message);
            break;
         default:
            console.error(
               'Error Code 3: Unsupported colorLog message type: ' +
               (typeof message)
            );
      }
   }

   console.log(...logArguments);
}

function checkMenu() {
   let currentMenuDisplayState = getByClass('dropdownContent')[0].style.display;

   if (menuDelayLeft > 0) {
      menuDelayLeft--;
      if (menuDelayLeft === 0) {
         // Inline overrrides css file so set to nothing
         getByClass('dropdownContent')[0].style.display = '';

         console.timeEnd('Menu');

         // fixed: Menu keeps popping up over and over again
         previousMenuDisplayState = 'none';
         currentMenuDisplayState = 'none';
      }
   }

   // Menu accessibility: 1001ms delay before menu disappears
   if (currentMenuDisplayState !== previousMenuDisplayState) {
      if (previousMenuDisplayState === 'block') {
         menuDelayLeft = 13; // 13 * 77 = 1001 milliseconds
         getByClass('dropdownContent')[0].style.display = 'block';

         console.time('Menu');
      }
   }

   previousMenuDisplayState = currentMenuDisplayState;
}

/*
eslint:

5:5   error  'chapter' is assigned a value but never used         no-unused-vars
6:5   error  'storyLine' is assigned a value but never used       no-unused-vars

8:5   error  'updateInterval' is assigned a value but never used  no-unused-vars
58:10  error  'startGame' is defined but never used               no-unused-vars
132:10  error  'continueGame' is defined but never used           no-unused-vars
143:10  error  'menu' is defined but never used                   no-unused-vars
These are Used

195:10  error  'messageToStory' is defined but never used         no-unused-vars
195:29  error  'messages' is defined but never used               no-unused-vars
253:13  error  'clickToContinue' is defined but never used        no-unused-vars
317:10  error  'storyAction' is defined but never used            no-unused-vars
454:8   error  'words' is assigned a value but never used         no-unused-vars

✖ 33 problems (33 errors, 0 warnings)

NOTES:
The storyDiv / story's background doesn't fade like the rest of the elements.

*/
