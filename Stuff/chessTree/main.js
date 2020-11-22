import Chess from './chessModified.js'

const BOARD_ID = "board1"
let game = new Chess()

const whiteGreySquare = '#a9a9a9'
const blackGreySquare = '#696969'

let boardConfig = {
   draggable: true,
   position: 'start',
   onDragStart: preventIllegalStart,
   onDrop: preventIllegalMove,
   onMouseoverSquare: greyLegalMoves,
   onMouseoutSquare: removeGreySquares,
   onSnapEnd() {board.position(game.fen())}
}

function preventIllegalStart(source, piece, _position, _orientation) {
   if (
      game.game_over() ||
      game.turn() === 'w' && piece.search(/^b/) !== -1 ||
      game.turn() === 'b' && piece.search(/^w/) !== -1 ||
      game.moves({ square: source }).length === 0
   ) return false
}

function preventIllegalMove(source, target) {
   // see if the move is legal
   let move = game.move({
      from: source,
      to: target
   })

   // illegal move
   if (move === null) return 'snapback'

   updateStatus()
}


function removeGreySquares() {
   for (let element of document.querySelectorAll(`${BOARD_ID} .square-55d63`))
      element.style.backgroundColor = ''
}

function greySquare(square) {
   square = document.querySelectorAll(`${BOARD_ID} .square-${square}`)

   let backgroundColor = whiteGreySquare
   if (square.classList.contains('black-3c85d')) {
      backgroundColor = blackGreySquare
   }

   square.style.backgroundColor = backgroundColor
}

function greyLegalMoves(square, piece) {
   // get list of possible moves for this square
   let moves = game.moves({
      square: square,
      verbose: true
   })

   // exit if there are no moves available for this square
   if (moves.length === 0) return

   // highlight the square they moused over
   greySquare(square)

   // highlight the possible squares for this piece
   for (let i = 0; i < moves.length; i++) {
      greySquare(moves[i].to)
   }
}

let board = Chessboard(BOARD_ID, boardConfig)