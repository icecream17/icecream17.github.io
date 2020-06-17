// MIT License. See github repository
// (https://github.com/icecream17/icecream17.github.io)
// for more details

'use strict';

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
   constructor (piece, row, column) {
      this.piece = piece;
      this.row = row;
      this.column = column;
   }

   makeMove () {

   }

   // algebraic notation
   // https://en.wikipedia.org/wiki/Algebraic_notation_(chess)
   getName () {

   }
}

// orthogonal means "of or involving right angles; at right angles"
// but here it means "up, down, left, or right"
function possibleOrthogonalMoves (row, column, piece) {
   let moves = [];

   // up and down
   for ( let i = 0; i < 8; i++ ) {
      if (i !== row) {
         moves.push( new Move (piece, i, column) );
      }
   }

   // left and right
   for ( let j = 0; j < 8; j++ ) {
      if (j !== column) {
         moves.push( new Move (piece, row, j) );
      }
   }

   return moves;
}

function possibleDiagonalMoves (row, column, piece) {
   let moves = [];

   for (let offset = 1;; offset++) {
      let rows = [row - offset, row + offset];
      let columns = [column - offset, column + offset];

      let amountOffBounds = 0;
      
   }
}

class Piece {
   constructor (side, row, column) {
      this.side = side;
      this.row = row;
      this.column = column;
   }
}

class Rook extends Piece {
   constructor (side, row, column) {
      super(side, row, column);
   }

   getMoves() {
      return possibleOrthogonalMoves(this.row, this.column, this);
   }
}

class Knight extends Piece {
   constructor (side, row, column) {
      super(side, row, column);
   }

   getMoves() {
      return [
         new Move(this, this.row - 2, this.column + 1),
         new Move(this, this.row - 2, this.column - 1),
         new Move(this, this.row - 1, this.column + 2),
         new Move(this, this.row - 1, this.column - 2),
         new Move(this, this.row + 1, this.column + 2),
         new Move(this, this.row + 1, this.column - 2),
         new Move(this, this.row + 2, this.column + 1),
         new Move(this, this.row + 2, this.column - 1)
      ];
   }
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
   constructor (orientation) {
      this.orientation = orientation;

      // TODO: fill boards
      if (orientation === 'white') {
         this[0][0] = new Square (new Rook ('black', 0, 0));
         this[0][1] = new Square (new Knight ('black', 0, 1));
      } else {
         // TODO: this too
      }
   }

   update () {

   }
}

class Game {
   constructor (settings) {
      this.settings = settings;
      this.board = new Board(settings.orientation);
   }
}

class Player {
   constructor (name) {
      this.name = name;
   }
}

class Person extends Player {
   constructor (name) {
      super(name);

      this.customGameSettings = {
         orientation: 'white',
         players: [this, (new Random())]
      };
   }

   // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing_operator
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

   // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
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

         currentRow.appendChild(currentCell);
      }
   }

   let currentUser = new Person(
      'Guest' + (Math.random() % 1)
   );

   let currentGame = new Game
   currentGame.board.update();
};
