// MIT License. See github repository
// (https://github.com/icecream17/icecream17.github.io)
// for more details

// In unicode order
const HTMLpieces = {
   white: {
      king: ♔,
      queen: ♕,
      rook: ♖,
      bishop: ♗,
      knight: ♘,
      pawn: ♙
   },
   black: {
      king: ♚,
      queen: ♛,
      rook: ♜,
      bishop: ♝,
      knight: ♞,
      pawn: ♟ // Sometimes the black pawn looks different in html.
   }
}

class Square {
   constructor (piece, row, column) {
      this.piece = piece
      this.row = row
      this.column = column
   }
}

class Board {
   constructor (orientation) {
      this.orientation = orientation

      if (orientation = 'white') {

      }
   }
}

class Game {
   constructor (settings) {
      this.settings = settings;
      this.board = new Board(settings.orientation)
   }
}

class User {
   constructor (name, pass) {
      this.name = name
      this.pass = pass
      this.customGameSettings = {
         orientation: 'white',
         players: 1,
         opponents: ['random']
      }
   }
}



window.onload = function () {
   // usually tables are bad
   let table = document.createElement('table')
   document.body.appendChild(table)
   table.id = 'chess-table'

   // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/tbody
   let tbody = document.createElement('tbody')
   table.appendChild(tbody)
   tbody.id = 'chess-tbody'

   for (let i = 0; i < 8; i++) {
      let currentRow = document.createElement('tr')
      tbody.appendChild(currentRow)
      currentRow.id = 'chess-row-' + i // + 1

      for (let j = 0; j < 8; j++) {
         let currentCell = document.createElement('td')
         currentCell.id = 'chess-cell-' + i + '-' + j

         // checkerboard pattern
         currentCell.className = 'chess-cell-class-' + ((i + j) % 2)

         /* Example css:
            .chess-cell-class-0 {background-color: #C4D7E3}
            .chess-cell-class-1 {background-color: #EFEFEF}
         */

         currentRow.appendChild(currentCell)
      }
   }
}
