// WARNING: Script loads before HTML

"use strict";
let time;

let chapter = 0;
let storyLine = 1; // Now this is useless, but maybe I could reuse it

let storyInstructions = [{name: 'p'}]; // Like a queue
let storyElementNesting = [];
let buttonElements = [];

// Used in f startUpdate().
// 1 frame = 77ms
let gameInterval;

let playerDirectory = ''; // Used in playerConsole parseInput

// Player info works!
const challenges = [
   '-', 'Go to Rowlett'
]

const locations = [
   'Office (Dallas)'
];

const endTag = {name: 'endTag'};
const iTag = {
   none: {name: 'i'},
   dogeblue: {name: 'i', class: 'dogeblue'},
   gray: {name: 'i', class: 'gray'},
   green: {name: 'i', class: 'green'},
   orange: {name: 'i', class: 'orange'}
};
const storyClick = {
   name: 'storyClick'
}
const storyOptionTag = {
   name: 'button',
   class: 'link'
}

let storyClickCount = 0;

let Player = {
   challenge: 0,
   place: 0,
   actions: 0, // location is a thing. no overwrite or error
   lives: 10,
   inventory: {}
};

let UserSettings = {
   gameMenuDelay: 13 // 13 frames = 1001ms
};

let messages = {
   start: [
      iTag.dogeblue, '"Hi. Welcome to SideQuest"', endTag,
      ' says the director. \n',
      iTag.dogeblue,
         '"There are only 3 challenges. Simple challenges, ' +
         'but they somehow take up the whole year.\n\nGood luck"',
      endTag, '\n\n\nA TV lights up saying ',
      iTag.gray, '"First challenge: Go to Rowlett"', endTag,
      `\nWhat? That's really easy. Just 15 miles, ish\n\n`,
      iTag.green, '"LOOK A SUPER TREE APPLE!"', endTag,
      ' a kid outside yells. \n\n', storyOptionTag, '\n', storyOptionTag
   ],
   welcome: (
      'Welcome!<br><br>' +
      'You can hover over the menu (at the top right) ' +
      'for instructions and settings and stuff. ' +
      'Read the story and click on one of the light blue links to ' +
      'start playing.'
   ),
   menuInstructions: (
      'Click on the text links to play.<br><br>' +
      'You can also type <em>help</em> in the "console", ' +
      'which is the "orange" box at the bottom with the <em>></em> symbol' +
      '<br><br>' +
      '(Afterwards press Enter)'
   ),
   menuSettings: (
      'Error 4: This message should be impossible!!!!!'
   ),
      // TODO: Figure out copyright and stuff, maybe in a footer
   menuCredits: `
      <article id = 'credits'>
         <h3>Credits</h3>

         <p>Created by me (icecream17)<p>

         <section>
            <h4>[everything] Understanding</h4>
            <ul class = 'no-margin'>
               <li>Google</li>
               <li>MDN</li>
               <li>Stack Overflow</li>
               <li>W3 Schools</li>
               <li>Youtube</li>
            </ul>
         </section>

         <section class = 'no-p-margin'>
            <h4>Other</h4>
            <p>Me<i class = 'float-right'>favicon</i></p>
            <p>Google<i class = 'float-right'>Menu icon</i></p>
            <p>W3 Schools<i class = 'float-right'>Dropdown</i></p>
            <p>js.do and jsbin<i class = 'float-right'>Testing</i></p>
         </section>
      </article>
   `,
   helpOptions: (
      `<li class = 'one'><i class = 'regular'>How to play</i></li>` +
      `<li class = 'two'><i class = 'regular'>` +
      `What this game is about</i></li>` +
      `<li class = 'three'><i class = 'regular'>` +
      `What the boxes and stuff mean</i></li>` +
      `<li class = 'four'><i class = 'regular'>` +
      `How this console works</i></li>` +
      `<li class = 'five'><i class = 'regular'>` +
      `Winning the game</i></li>` +
      `<li class = 'six'><i class = 'regular'>` +
      `Something else</i></li></ol>`
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

console.clear(); // So helpful

// checkMenu variables
let previousMenuDisplayState = 'none';
let menuDelayLeft = 0;

// no jQuery anymore
function getById(id) {return document.getElementById(id);}
function getByClass(className) {
   return document.getElementsByClassName(className);
}

getById('start').onclick = startGame;
getById('continue').onclick = continueGame;

function startGame() {
   time = new Date();

   // Is there a better way?
   // WOW: The JS whitespace AND the HTML whitespace are good!
   document.body.innerHTML = `
      <main id = 'story'>
      </main>
      <div id = 'infoContainer'>
         <div class = 'dropdown'>
            <button id = 'gameMenu' type = 'button' title = 'menu'>
               <span class = 'material-icons'>menu</span>
            </button>
            <div class = 'dropdownContent'>
               <button id = 'menuInstructions' type = 'button'>
               Instructions </button>

               <button id = 'menuSettings' type = 'button'>
               Settings </button>

               <button id = 'menuCredits' type = 'button'>
               Credits </button>
            </div>
         </div>
         <aside id = 'playerInfoContainer'>
            <h2 id = 'playerInfoHeader'></h2>
            <p id = 'playerInfo'></p>
         </aside>

         <br>
         <aside id = 'messageConsoleContainer'>
            <h2 id = 'messageConsoleHeader'></h2>
            <p id = 'messageConsole'></p>
         </aside>
      </div>
      <div id = 'playerConsoleContainer'>
         <p id = 'playerConsole' contenteditable = 'true'></p>
      </div>
   `;

   // getByClass('dropdownContent')[0].style.display = 'none';

   // Usually I like putting the => notation
   setTimeout( function() {
      storyInstructions.push(...(messages.start));

      setTimeout ( function() {
         startUpdate();
         getById('messageConsole').innerHTML = messages.welcome;
         getById('playerConsole').innerHTML = `<em>>&nbsp;</em>`;

         // MDN keydown event
         getById('playerConsole').addEventListener('keydown', playerConsole);
      }, 2000);
   }, 5000);

   // Keyboard navigation of menu
   // With wraparound!
   addMenuFunctionality();
   addKeyboardMenuNavigation();

   document.body.classList.add('startGameBackgroundTransition');
   getById('story').classList.add('startGameBackgroundTransition');
}

function continueGame() {
   if (getById('potato') === null) {
      let notice = document.createElement('p');
      notice.id = 'potato';
      notice.innerHTML = 'Sorry, this feature is currently unavailable';

      getById('continue').insertAdjacentElement('afterend', notice);
   } else {
      // deletes the element
      getById('continue').parentNode.removeChild(getById('continue'));
      colorLog('green', 'success?');
   }
}

function addMenuFunctionality() {
   ['menuInstructions', 'menuSettings', 'menuCredits'].forEach(
      id => {
         getById(id).onclick = menu.pass(id)
      }
   );

}

function addKeyboardMenuNavigation() {
   function processKeyboardEvent (index, event) {
      let menuOrder = [
         'gameMenu', 'menuInstructions', 'menuSettings', 'menuCredits'
      ];

      if (event.key === 'ArrowDown') {
         if (index === 3) {
            getById(menuOrder[1]).focus();
         } else if (index !== 0) {
            getById(menuOrder[index + 1]).focus();
         } else {
            getByClass('dropdownContent')[0].style.display = 'block';
            getById(menuOrder[1]).focus();
         }
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
         if (index > 1) {
            getById(menuOrder[index - 1]).focus();
         } else if (event.key === 'ArrowLeft') {
            if (index) {
               getById(menuOrder[0]).focus();
            } else {
               getByClass('dropdownContent')[0].style.display = 'block';
               getById(menuOrder[1]).focus();
            }
         } else {
            getById(menuOrder[3]).focus();
         }
      } else if (event.key === 'ArrowRight' && index) {
         getById('gameMenu').focus();
      } else if (event.key === 'Tab' && index === 0) {
         event.preventDefault();
         // otherwise it would focus on the element and then
         // tab to the next element

         getByClass('dropdownContent')[0].style.display = 'block';
         getById(menuOrder[1]).focus();
      } else if (event.key === 'Tab' && index === 3) {
         getByClass('dropdownContent')[0].style.display = '';
      }
   }

   ['gameMenu', 'menuInstructions', 'menuSettings', 'menuCredits'].forEach(
      (id, index) => {
         getById(id).addEventListener('keydown',
            processKeyboardEvent.pass(index)
         );
      }
   );
}

// TODO: Make menu accessible
function menu(elementID) {
   let messageElement = getById('messageConsole');

   const validElementIDs = ['menuInstructions', 'menuCredits'];

   // Automates typing "settings" and pressing Enter like in the message
   if (elementID === 'menuSettings') {
      parseInput('done'); parseInput('done'); parseInput('done');
      parseInput('settings');
      getById('playerConsole').innerHTML = `<em>settings&gt;&nbsp;</em>`
   } else if (validElementIDs.includes(elementID)) {
      messageElement.innerHTML = messages[elementID];
   } else {
      console.error(
         RangeError('#000: Invalid elementID in menu(elementID) function')
      );
   }
}

function messageToStory (...messages) {
   // wouldn't know how to write multiple things
}

function writeToStory (newline = '\n') {
   if (storyInstructions.length) {doInstruction();}

   // TODO: Add li automatically when ul.
   // Exit automatically when HTML elements
   // are incompatible in nesting, with warning.
   function doInstruction() {
      let instruction = storyInstructions.shift();
      if (!instruction) {return}

      let contextElement = (
         storyElementNesting[storyElementNesting.length - 1]
      );

      if (!contextElement) {contextElement = getById('story')}

      if (typeof instruction === 'string') {
         let character = instruction[0];
         //if (character === ' ') {character = '\xa0'}
         if (character === '\n') {character = ''
            contextElement.appendChild(
               document.createElement('br')
            )
         }

         // WARNING: Don't add to textContent, it deletes styles and elements
         contextElement.innerHTML += character;

         if (instruction.length > 1) {
            storyInstructions.unshift(instruction.substring(1));
            // Add the string back, minus the first character
         }
      } else if (typeof instruction === 'object') {
         if (instruction === endTag) {
            storyElementNesting.pop();
         } else {
            let element = document.createElement(instruction.name);
            contextElement.appendChild(element);

            // TODO: Other properties
            if (instruction.hasOwnProperty('class')) {
               element.className = instruction.class
            }

            if (instruction === storyOptionTag) {
               setupStoryAction(element);
            }

            storyElementNesting.push(element)
         }
      } else {
         console.error(
            RangeError('#004: storyInstruction must be a <string> | <object>'));
      }
   }

   // TODO: this function
   function hmmAppend(parent, child) {
      // Current elements used:
      // p, i, br, em, ul, li, button
      let incompatiblities = {
         p: ['ul', 'li']
      }

      if (incompatiblities[parent].includes(child)) {
         storyElementNesting.pop();
         storyElementNesting[storyElementNesting.length - 1].appendChild(child)
         storyElementNesting.push(child);
         console.warn(`Parent ${parent} doesn't support child ${child}`)
      }
   }

   function clickToContinue() {
      // can't do this yet.
      // would be soo great for suspense
   }
}

function updateInfo() {
   // Originally the info declaration at lives: and time: wasn't indented

   let info = (
      `todo: ${challenges[Player.challenge]} <br>` +
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

/*
This game is dedicated to:
Everything!

Easter egg to: You. Hi there =D
Have some pi.

*/

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
         writeToStory();
      }, 77
   );
}

function storyActionText(count) {
   switch (count) {
      case 0:
         return "Keep listening to the director"
      case 1:
         return "Look outside"
      default:
         console.error(RangeError("#005: AAA, " + count))
   }
}

function setupStoryAction(element) {
   element.innerHTML = storyActionText(storyClickCount)
   element.onclick = storyAction.call(storyClickCount)
   buttonElements.push(element)
   storyClickCount++;
   storyElementNesting.pop()
}

function storyAction(choiceID) {
   colorLog('dodgerblue', 'storyAction: ' + choiceID);
   visibleCustomMessage('dogeblue', 'Lol', `It doesn't work yet!`)
}

function playerConsole (event) {
   if (event.key === "Enter") {

      // Don't need to async since the timeout starts after everything.

      let playerInput = getById('playerConsole').innerText.trim();
      const pathLength = playerDirectory.length + 2; // '> '.length

      // NOTE: It trims the space too.
      if (playerInput === '>') {
         visibleError('Huh?', `You didn't type anything.`);
      } else if (
         playerInput.substring(0, pathLength) !== playerDirectory + '> '
      ) {
         visibleError('Error',
            'Do not delete or change the start,<br>' +
            `where it's supposed to say "${playerDirectory + '>'}"`
         );
      } else {
         // Put another trim before if
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
            parseInput(playerInput.toLowerCase());
         }
      }

      // For some reason the setTimeout prevents a div from popping up.
      setTimeout( function() {
         getById('playerConsole').innerHTML =
            `<em>${playerDirectory}>&nbsp;</em>`;
      }, 25 );
   }
}

// class is a keyword =/
// with intro!
function visibleCustomMessage(className = '', intro = '', text = '') {
   // I'd put parenthesis but atom removes the html syntax colors =/
   getById('messageConsole').innerHTML =
      `<i class = "${className}">${intro}</i><br>${text}`;
}

function visibleError(type, text) {
   if (type === 'Error') {
      visibleCustomMessage('red', type, text);
   } else if (type === 'Warn') {
      visibleCustomMessage('orange', type, text);
   } else if (type === 'Huh?') {
      visibleCustomMessage('dogeblue', type, text);
   } else {
      console.error(RangeError('#001: unsupported visibleError type: ' + type));
   }
}

function parseInput(playerInput) {
   let startCommands = [
      'help', 'settings',
      'hi', 'hello', 'easteregg'
   ];

   if (playerInput === 'done') {
      getById('messageConsole').innerHTML = (
         '<i class = "green">ok ✓</i><br><br>' +
         `Exiting the "${playerDirectory}" path`
      );

      playerDirectory = playerDirectory.substring(
         0, playerDirectory.lastIndexOf('/')
      );

      return;
   }

   let standardNote = (
      '(Type the number corresponding to the option you want)' +
      '<br>(Unless you are done. Then type <em>done</em>.)'
   );

   if (playerDirectory === '') {
      if (startCommands.includes(playerInput)) {
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
         getById('messageConsole').innerHTML = (
            `What do you need help on?<br><ol>` +
            messages.helpOptions + standardNote
         );
      } else if (command === 'settings') {
         getById('messageConsole').innerHTML = (
            `Unavailable...`
         );
      } else if (['hi', 'hello'].includes(command)) {
         visibleCustomMessage('dogeblue', 'hi!', '=D');
      } else if (command === 'easteregg') {
         visibleCustomMessage('orange', 'hmm...');
      }
   }

   /* function parseCommand(helpOptionText, command, options, responses) {
      if (responses[command] !== undefined) {
         getById('messageConsole').innerHTML = (
            responses[command] + options
         );
      } else {
         command = extraNumberConvert(command);
         let maxNumber = 1;
         while (responses[maxNumber + 1] !== undefined) {maxNumber++;}

         if (Number.isNaN(command)) {
            exitPathAndWarnPlayer(command,
               `Errr, sorry. You actually have to type in a number.<br>` +
               `Otherwise I don't really understand.` + helpOptionText
            );
         } else if (!Number.isInteger(command)) {
            visibleError('Warn',
               `${command}? <br>` +
               `That's like saying you want the "5.2"th cupcake.` +
               helpOptionText
            );
         } else if (command < 1) {
            visibleError(
               'Warn', `${command} is too small.` + helpOptionText
            );
         } else if (command > maxNumber) {
            visibleError(
               'Warn', `${command} is too big.` + helpOptionText
            );
         } else if (responses[command] !== undefined) {
            // todo
         }
      }

   }

   Never used
   TODO: Use ParseCommand as a general function, like in parsehelpCommand
   */

   function parseHelpCommand(command) {
      if (playerDirectory === 'help') {
         // isNaN() vs Number.isNaN()
         // isNaN() converts to Number automatically

         let helpOptionText = (
            `<br><br>` + standardNote + `<br><ol>` + messages.helpOptions
         );

         // NaN strings to NaN
         command = extraNumberConvert(command);

         if (Number.isNaN(command)) {
            exitPathAndWarnPlayer(command,
               `Errr, sorry. You actually have to type in a number.<br>` +
               `Otherwise I don't really understand.` + helpOptionText
            );
         } else if (!Number.isInteger(command)) {
            visibleError('Warn',
               `${command}? <br>` +
               `That's like saying you want the "5.2"th cupcake.` +
               helpOptionText
            );
         } else if (command < 1) {
            visibleError(
               'Warn', `${command} is too small.` + helpOptionText
            );
         } else if (command > 7) {
            visibleError(
               'Warn', `${command} is too big.` + helpOptionText
            );
         } else {
            switch (command) {
               case 1:
                  getById('messageConsole').innerHTML = (
                     `This is an adventure story. <br>` +
                     `You are presented with the current situation. <br>` +
                     `Read (the story). Then look at the links. <br>` +
                     `The links are choices, things you can do. <br>` +
                     `When you click on a link, the story continues, <br>` +
                     `as if you have done the choice. <br><br>` +
                     `For example, if you click on the link ` +
                     `<button class = 'link' type = 'button'>` +
                     `"Eat"</button><br>` +
                     `the story might continue with ` +
                     `<i class = 'green'>"It was delicious"</i> <br>` +
                     `or <i class = 'purple'>"It was poisoned!"</i>` +
                     ` or something else.` +
                     ` This is an adventure <br>` +
                     `<i class = 'dogeblue'>Have fun</i><br>` +
                     helpOptionText
                  );
                  break;
               case 2:
                  getById('messageConsole').innerHTML = (
                     `This is an adventure story. <br>` +
                     `This is about exploring the story and stuff<br><br>` +
                     `Okay, I know this is vague, ` +
                     `but I can't just ruin the story. <br>` +
                     `But if you look at the start, it says ` +
                     `<i class = 'dogeblue'>"Hi. Welcome to SideQuest"</i>` +
                     `, which tells you the title or theme of the story.<br>` +
                     `<br><i class = 'dogeblue'>Just have fun</i><br>` +
                     `What are games about, anyway?` +
                     helpOptionText
                  );
                  break;
               case 3:
                  getById('messageConsole').innerHTML = (
                     `This is the "Game messages" box.<br>` +
                     `The box above this one is called "Player info".<br>` +
                     `<br>The text in the top left is the story.<br>` +
                     `Click the links to play.<br><br>` + 
                     `And the box at the bottom is the player console.<br>` +
                     `The player console box is where you can get help or ` +
                     `change the settings. Hopefully "Player info" and ` +
                     `"Game messages" is self-explanatory. <br><br>` +
                     `By the way, inside the "Player info" box, <br>` +
                     `"actions" is how many links you've clicked on, <br>` +
                     `and "Inventory" is any stuff you have.` +
                     helpOptionText
                  );
                  break;
               case 4:
                  getById('messageConsole').innerHTML = (
                     `Commands i'll tell you about:<br>` +
                     `<ul><li>help</li><li>settings</li><li>done</li></ul>` +
                     `There <em>are</em> more!<br>` +
                     `But you'll have to find them yourself.<br><br>` +
                     `=D ${helpOptionText}`
                  );
                  break;
               case 5:
                  getById('messageConsole').innerHTML = (
                     `What! Why would I tell you that? ${helpOptionText}`
                  );
                  break;
               case 6:
                  getById('messageConsole').innerHTML = (
                     `Well, I can't really predict that... ${helpOptionText}`
                  );
                  break;
               case 7:
                  visibleCustomMessage(
                     'dogeblue', 'lol', 'Extra option!' + helpOptionText
                  );
               default:
                  console.error(Error('#002: Impossible error'));
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
      string = string.toLowerCase();

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

function checkMenu() {
   let currentMenuDisplayState = (
      getComputedStyle(getByClass('dropdownContent')[0]).display
   );

   // none or block
   let isStillInFocus = (
      ['menuInstructions', 'menuSettings', 'menuCredits'].includes(
         document.activeElement.id
      )
   );

   if (menuDelayLeft > 0) {
      if (isStillInFocus) {
         menuDelayLeft = 13;
      } else {
         menuDelayLeft--;
      }

      if (menuDelayLeft === 0) {
         // Inline overrrides css file so set to nothing
         getByClass('dropdownContent')[0].style.display = '';

         console.timeEnd('Menu');

         // fixed: Menu keeps popping up over and over again
         previousMenuDisplayState = currentMenuDisplayState = 'none';
      }
   }

   // Menu accessibility: 1001ms delay before menu disappears
   if (currentMenuDisplayState !== previousMenuDisplayState) {
      if (previousMenuDisplayState === 'block') {
         menuDelayLeft = UserSettings.gameMenuDelay;
         getByClass('dropdownContent')[0].style.display = 'block';

         console.time('Menu');
      }
   }

   previousMenuDisplayState = currentMenuDisplayState;
}

Function.prototype.pass = function (...args) {
   let func = this;
   return function (...moreArgs) {
      return func.apply(this, args.concat(moreArgs))
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
               TypeError('#003: Unsupported colorLog message type: ' +
               (typeof message))
            );
      }
   }

   // https://github.com/atom/language-javascript/pull/681
   window.console.log.bind(window.console, ...logArguments);
}

/*
eslint:

5:5   error  'chapter' is assigned a value but never used         no-unused-vars
6:5   error  'storyLine' is assigned a value but never used       no-unused-vars

8:5   error  'gameInterval' is assigned a value but never used  no-unused-vars
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
button name

The line number in colorlog is the colorlog function instead of the place where
colorlog was done

onclick events are "bad"

BUGS:
When tabbing off the gameMenu into the dropdown, it selects:
   0. button#menu
   1. body
   2. button#menu + (Instructions, 3. Settings, 4. Credits)

IDEAS:
Presentation words: https://www.youtube.com/watch?v=C-r8rUydKHo

https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
"Are you okay?: You're holding a button down"
> hi --> "Hi there"

Easter egg
Extra options

*/
