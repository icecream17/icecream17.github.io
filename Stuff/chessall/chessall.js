// MIT License. See github repository
// (https://github.com/icecream17/icecream17.github.io)
// for more details

'use strict';
let currentGame = null; // global, set in window.onload

let input = null;

// In unicode order
const HTMLpieces = {
   white: {
      king: '♔',
      queen: '♕',
      rook: '♖',
      bishop: '♗',
      knight: '♘',
      pawn: '♙'
   },
   black: {
      king: '♚',
      queen: '♛',
      rook: '♜',
      bishop: '♝',
      knight: '♞',
      pawn: '♟' // Sometimes the black pawn looks different in html.
   }
};

class Move {
   constructor (piece, row, column, ...special) {
      this.piece = piece;
      this.row = row;
      this.column = column;
      this.special = special;

      this.turn = currentGame.turns.length;
   }

   makeMove () {
      currentGame.board[this.piece.row][this.piece.column].piece = (
         new Nothing(this.piece.row, this.piece.column)
      );

      this.piece.row = this.row;
      this.piece.column = this.column;

      currentGame.board[this.row][this.column].piece = this.piece;

      currentGame.updateVisuals();

      currentGame.switchTurns();
   }

   // algebraic notation
   // https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
   getName () {
      let name = '';

      if (currentGame.notation === 'symbol') {
         name += this.piece.toHTML();
      } else {
         // ....notation = 'letter'
         // also see https://stackoverflow.com/questions/1249531/ and
         // https://stackoverflow.com/questions/332422/

         // WARNING: See links, minify can be bad.

         switch (this.piece.constructor.name) {
            case 'Pawn':
               break;
            case 'Rook':
               name += 'R';
               break;
            case 'Bishop':
               name += 'B';
               break;
            case 'Knight':
               name += 'N';
               break;
            case 'Queen':
               name += 'Q';
               break;
            case 'King':
               name += 'K';
               break;
            default:
               // enjoy
               // https://stackoverflow.com/questions/7505623
               console.error(
                  `Uncaught %cImpossible Error:%c ` +
                  `Unknown piece constructor name ` +
                  `"%c${this.piece.constructor.name}%c"`,
                  'font-style: italic;', 'color: dodgerblue;',
                  'font-style: italic;', 'color: dodgerblue;'
               );
         }

         // Amazing: b && b.constructor && b.constructor.name

         // TODO: Disambiguate

         if (this.special.includes('take')) {
            name += 'x';
         }

         name += ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][this.column];
         name += 8 - this.row;

         if (this.special.includes('castle')) {
            name = this.special.castleNotation;
         }

         if (this.special.includes('mate')) {
            name += '#';
         } else if (this.special.includes('check')) {
            name += '+';
         }

         return name;
      }
   }
}

// orthogonal means "of or involving right angles; at right angles"
// but here it means "up, down, left, or right"
function possibleOrthogonalMoves (row, column, piece) {
   let moves = [];

   // up
   for ( let i = row - 1; i >= 0; i-- ) {
      if (currentGame.board[i][column].piece.side === piece.side) {break;}
      moves.push( new Move (piece, i, column) );

      if (currentGame.board[i][column].piece.side !== null) {break;}
   }

   // down
   for ( let i = row + 1; i <= 7; i++ ) {
      if (currentGame.board[i][column].piece.side === piece.side) {break;}
      moves.push( new Move (piece, i, column) );

      if (currentGame.board[i][column].piece.side !== null) {break;}
   }

   // left
   for ( let j = column - 1; j >= 0; j-- ) {
      if (currentGame.board[row][j].piece.side === piece.side) {break;}
      moves.push( new Move (piece, row, j) );

      if (currentGame.board[row][j].piece.side !== null) {break;}
   }

   // right
   for ( let j = column + 1; j <= 7; j++ ) {
      if (currentGame.board[row][j].piece.side === piece.side) {break;}
      moves.push( new Move (piece, row, j) );

      if (currentGame.board[row][j].piece.side !== null) {break;}
   }

   return moves;
}

function possibleDiagonalMoves (row, column, piece) {
   let moves = [];

   // maybe I should use the one I made at js.do/celiasnt/chess

   let newlyUnavailableDirections = [null, null, null, null];
   // (row col) -> 0: 0 0, 1: 0 1, 2: 1 0, 3: 1 1

   for (let offset = 1; newlyUnavailableDirections.includes(null); offset++) {
      let rowPossibilities = [row - offset, row + offset];
      let columnPossibilities = [column - offset, column + offset];

      for (let i = 0; i < rowPossibilities.length; i++) {
         if (rowPossibilities[i] < 0 || rowPossibilities[i] > 7) {
            newlyUnavailableDirections[2 * i] = 7; // not null
            newlyUnavailableDirections[2 * i + 1] = 7; // not null
            continue;
         }

         for (let j = 0; j < columnPossibilities.length; j++) {
            if (columnPossibilities[j] < 0 || columnPossibilities[j] > 7) {
               newlyUnavailableDirections[j] = 7;
               newlyUnavailableDirections[2 + j] = 7;
               continue;
            }

            if (currentGame.board[i][j].piece.side === piece.side) {
               newlyUnavailableDirections[2 * i + j] = 7;
               continue;
            }

            moves.push( new Move (piece, row, j) );

            if (currentGame.board[i][j].piece.side !== null) {
               newlyUnavailableDirections[2 * i + j] = 7;
               continue;
            }
         }
      }
   }

   return moves;
}

class Piece {
   constructor (side, row, column) {
      this.side = side;
      this.row = row;
      this.column = column;

      this.moves = [];
   }

   hasMoved() {return Boolean(this.moves.length);}
}

class Rook extends Piece {
   constructor (side, row, column) {
      super(side, row, column);
   }

   getMoves() {
      return possibleOrthogonalMoves(this.row, this.column, this);
   }

   toHTML() {
      return (
         this.side === 'white' ? HTMLpieces.white.rook : HTMLpieces.black.rook
      );
   }
}

class Knight extends Piece {
   constructor (side, row, column) {
      super(side, row, column);
   }

   getMoves() {
      // What a ridiculous return statement
      return ([
         new Move(this, this.row - 2, this.column + 1),
         new Move(this, this.row - 2, this.column - 1),
         new Move(this, this.row - 1, this.column + 2),
         new Move(this, this.row - 1, this.column - 2),
         new Move(this, this.row + 1, this.column + 2),
         new Move(this, this.row + 1, this.column - 2),
         new Move(this, this.row + 2, this.column + 1),
         new Move(this, this.row + 2, this.column - 1)
      ].filter(
         // MDN "this". Also MDN "Arrow function expressions"
         // arrow functions don't provide their own (this) binding,
         // and so retains the (this) value of (knight) in this case

         // Tested - success!
         move => {
            return (move.row >= 0 &&
            move.row < 8 &&
            move.column >= 0 &&
            move.column < 8 &&
            currentGame.board[move.row][move.column].piece.side !== this.side);
         }
      ));
   }

   toHTML() {
      return (
         this.side === 'white'
            ? HTMLpieces.white.knight
            : HTMLpieces.black.knight
      );
   }
}

class Bishop extends Piece {
   constructor (side, row, column) {
      super(side, row, column);
   }

   getMoves() {
      return possibleDiagonalMoves(this.row, this.column, this);
   }

   toHTML() {
      return (
         this.side === 'white'
            ? HTMLpieces.white.bishop
            : HTMLpieces.black.bishop
      );
   }
}

class Queen extends Piece {
   constructor (side, row, column) {
      super(side, row, column);
   }

   getMoves() {
      // MDN Spread syntax (...)
      return possibleOrthogonalMoves(this.row, this.column, this).push(
         ...possibleDiagonalMoves(this.row, this.column, this)
      );
   }

   toHTML() {
      return (
         this.side === 'white'
            ? HTMLpieces.white.queen
            : HTMLpieces.black.queen
      );
   }
}

class King extends Piece {
   constructor (side, row, column) {
      super(side, row, column);
   }

   getMoves() {
      return ([
         new Move(this, this.row - 1, this.column - 1),
         new Move(this, this.row - 1, this.column),
         new Move(this, this.row - 1, this.column + 1),
         new Move(this, this.row, this.column - 1),
         new Move(this, this.row, this.column + 1),
         new Move(this, this.row + 1, this.column - 1),
         new Move(this, this.row + 1, this.column),
         new Move(this, this.row + 1, this.column + 1)
      ].filter(
         // MDN "this". Also MDN "Arrow function expressions"
         // arrow functions don't provide their own (this) binding,
         // and so retains the (this) value of (knight) in this case

         // Tested - success!
         move => {
            return (move.row >= 0 &&
            move.row < 8 &&
            move.column >= 0 &&
            move.column < 8 &&
            currentGame.board[move.row][move.column].piece.side !== this.side);
         }
      ).push(...this.getPossibleCastles()));
   }

   getPossibleCastles() {

   }

   toHTML() {
      return (
         this.side === 'white' ? HTMLpieces.white.king : HTMLpieces.black.king
      );
   }
}

class Pawn extends Piece {
   constructor (side, row, column) {
      super(side, row, column);
   }

   getMoves() {
      // MDN Spread syntax (...)
      let nonTakesToConsider = [currentGame.board[this.row - 1][this.column]];
      let takesToConsider = [];

      if (!this.hasMoved()) {
         nonTakesToConsider.push(currentGame.board[this.row - 2][this.column]);
      }

      if (this.column !== 0) {
         takesToConsider.push(
            currentGame.board[this.row - 1][this.column - 1]
         );
      } else if (this.column !== 7) {
         takesToConsider.push(
            currentGame.board[this.row - 1][this.column + 1]
         );
      }

      let possibleNonTakes = nonTakesToConsider.filter(
         square => square.piece.side === null
      );

      takesToConsider = takesToConsider.filter(
         square => square.piece.side !== this.side
      );

      let possibleTakes = [];
      // let enPassantTakes = [];

      for (let currentConsideration of takesToConsider) {
         if (currentConsideration.piece.side !== null) {
            possibleTakes.push(currentConsideration);
            continue;
         }

         let enPassantIsPossible = (
            this.row === 3 &&
            currentGame[this.row][currentConsideration.column].side === (
               this.side === 'white' ? 'black' : 'white'
            )
         );

         if (enPassantIsPossible) {
            possibleTakes.push(currentConsideration);
         }
      }

      let moves = [];

      possibleNonTakes.forEach((possibleNonTake) => {
         moves.push(
            new Move (this, possibleNonTake.row, possibleNonTake.column)
         );
      });

      possibleTakes.forEach((possibleTake) => {
         moves.push(
            new Move (this, possibleTake.row, possibleTake.column, 'take')
         );
      });


      return moves;
   }


   toHTML() {
      return (
         this.side === 'white' ? HTMLpieces.white.pawn : HTMLpieces.black.pawn
      );
   }
}

class Nothing extends Piece {
   constructor (row, column) {
      // this.side = null
      super(null, row, column);
   }

   getMoves() {return [];}
   toHTML() {return ' ';}
}

class Square {
   constructor (piece) {
      this.piece = piece;
      this.row = piece.row;
      this.column = piece.column;
   }
}

// board[row][column] = square
// a8 = board[7][0]

class Board {
   constructor (orientation, htmlBoard) {
      this.orientation = orientation;
      this.htmlBoard = htmlBoard;

      fillBoard(this);

      /* Board visualization helper - (regular, ARRAY)
         8-0
         7-1
         6-2
         5-3
         4-4
         3-5
         2-6
         1-7
            a0 b1 c2 d3 e4 f5 g6 h7
      */
   }

   updateVisuals () {
      for (let i = 0; i < 8; i++) {
         for (let j = 0; j < 8; j++) {
            this.htmlBoard.children[i].children[j].innerHTML = (
               this[i][j].piece.toHTML()
            );
         }
      }
   }
}

function fillBoard (board) {
   if (board.orientation === 'white') {
      board[0] = [
         new Square (new Rook ('black', 0, 0)),
         new Square (new Knight ('black', 0, 1)),
         new Square (new Bishop ('black', 0, 2)),
         new Square (new Queen ('black', 0, 3)),
         new Square (new King ('black', 0, 4)),
         new Square (new Bishop ('black', 0, 5)),
         new Square (new Knight ('black', 0, 6)),
         new Square (new Rook ('black', 0, 7))
      ];

      board[1] = [];

      for (let i = 0; i < 8; i++) {
         board[1].push(
            new Square (new Pawn ('black', 1, i))
         );
      }

      enterEmptyRows(board);

      board[6] = [];

      for (let i = 0; i < 8; i++) {
         board[6].push(
            new Square (new Pawn ('white', 1, i))
         );
      }

      board[7] = [
         new Square (new Rook ('white', 7, 0)),
         new Square (new Knight ('white', 7, 1)),
         new Square (new Bishop ('white', 7, 2)),
         new Square (new Queen ('white', 7, 3)),
         new Square (new King ('white', 7, 4)),
         new Square (new Bishop ('white', 7, 5)),
         new Square (new Knight ('white', 7, 6)),
         new Square (new Rook ('white', 7, 7))
      ];

   } else {
      board[0] = [
         new Square (new Rook ('white', 0, 0)),
         new Square (new Knight ('white', 0, 1)),
         new Square (new Bishop ('white', 0, 2)),
         new Square (new Queen ('white', 0, 3)),
         new Square (new King ('white', 0, 4)),
         new Square (new Bishop ('white', 0, 5)),
         new Square (new Knight ('white', 0, 6)),
         new Square (new Rook ('white', 0, 7))
      ];

      board[1] = [];

      for (let i = 0; i < 8; i++) {
         board[1].push(
            new Square (new Pawn ('white', 1, i))
         );
      }

      enterEmptyRows();

      board[6] = [];

      for (let i = 0; i < 8; i++) {
         board[6].push(
            new Square (new Pawn ('black', 1, i))
         );
      }

      board[7] = [
         new Square (new Rook ('black', 7, 0)),
         new Square (new Knight ('black', 7, 1)),
         new Square (new Bishop ('black', 7, 2)),
         new Square (new Queen ('black', 7, 3)),
         new Square (new King ('black', 7, 4)),
         new Square (new Bishop ('black', 7, 5)),
         new Square (new Knight ('black', 7, 6)),
         new Square (new Rook ('black', 7, 7))
      ];
   }
}

function enterEmptyRows (board) {
   for (let i = 2; i < 6; i++) {
      board[i] = [];
      for (let j = 0; j < 8; j++) {
         // https://stackoverflow.com/questions/21034662
         board[i][j] = new Square (new Nothing (i, j));
      }
   }
}

class Game {
   constructor (notation, players, orientation, htmlBoard) {
      this.notation = notation;
      this.players = players;
      this.board = new Board(orientation, htmlBoard);
      this.turns = [];
      this.currentSide = 'white';
   }

   possibleMoves () {
      let moves = [];
      for (let row of this.board) {
         for (let square of row) {
            if (this.currentSide === square.piece.side) {
               moves.push(...square.getMoves());
            }
         }
      }

      return moves;
   }

   switchTurns () {

      // switchSide before "doMove"
      if (this.currentSide === 'white') {
         this.currentSide = 'black';

         if (this.players[1].constructor.name !== 'Person') {
            this.players[1].doMove();
         }
      } else {
         this.currentSide = 'white';

         if (this.players[0].constructor.name !== 'Person') {
            this.players[0].doMove();
         }
      }
   }
}

class Player {
   constructor (name) {
      this.name = name;
   }
}

class Bot extends Player {
   constructor (name, algorithm) {
      super(name);
      this.doMove = algorithm;
   }
}

let RandomMove = new Bot('Random Move', () => {
   let possibleMoves = Game.possibleMoves();
   return possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
});

class Person extends Player {
   constructor (name) {
      super(name);

      this.customGameSettings = {
         orientation: 'white',
         players: [this, RandomMove],
         notation: 'symbol'
      };
   }

   // MDN "Nullish coalescing operator"
   updateCustomGameSettings (orientation, players) {
      this.orientation = orientation ?? this.orientation;
      this.players = players ?? this.players;
   }
}

window.onload = function () {

   // usually tables are bad
   let table = document.createElement('table');
   document.body.appendChild(table);
   table.id = 'chess-table';

   // MDN "tbody" (html)
   let tbody = document.createElement('tbody');
   table.appendChild(tbody);
   tbody.id = 'chess-tbody';

   for (let i = 0; i < 8; i++) {
      let currentRow = document.createElement('tr');
      tbody.appendChild(currentRow);
      currentRow.id = 'chess-row-' + i /* + 1 */;

      for (let j = 0; j < 8; j++) {
         let currentCell = document.createElement('td');
         currentCell.id = 'chess-cell-' + i + '-' + j;

         // checkerboard pattern
         currentCell.className = 'chess-cell-class-' + ((i + j) % 2);

         /* Example css:
            .chess-cell-class-0 {background-color: #C4D7E3}
            .chess-cell-class-1 {background-color: #EFEFEF}
         */

         currentCell.onclick = function() {registerClick(i, j)};

         currentRow.appendChild(currentCell);
      }
   }

   let currentUser = new Person(
      'Guest' + String(Math.random()).substring(2)
   );

   currentGame = new Game (
      currentUser.customGameSettings.notation,
      currentUser.customGameSettings.players,
      currentUser.customGameSettings.orientation,
      tbody
   );

   currentGame.board.updateVisuals();
};

function registerClick(i, j) {
   let thingClicked = currentGame.board[i][j].piece;

   if (input === null) {
      if (thingClicked.side === currentGame.currentSide) {
         input = thingClicked;
      }
   } else {
      let secondClickResult = secondClickIsGood(i, j);
      if (secondClickResult[0] !== undefined) {
         secondClickResult.makeMove();
      }

      input = null;
   }
}

function secondClickIsGood(i, j) {
   return (
      input.getMoves().filter((possibleMove) => {

         // Horrible
         let theMoveIsActuallyPossible = (
            currentGame.possibleMoves().filter((actuallyPossibleMove) => {

               // MDN Destructuring_assignment
               // Shorter names
               let [pieceMoved, actualPieceMoved] = [
                  possibleMove.piece, actuallyPossibleMove.piece
               ];

               return (
                  pieceMoved.row === actualPieceMoved.row &&
                  pieceMoved.column === actualPieceMoved.column &&
                  pieceMoved.toHTML() === actualPieceMoved.toHTML()
               );
            })
         );

         return (
            possibleMove.row === i && possibleMove.column === j &&
            theMoveIsActuallyPossible
         );
      })[0]
   );
}
