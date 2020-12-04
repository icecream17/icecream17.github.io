import Chess from './chessModified.js'
globalThis._Chess = Chess

const BOARD_ID = "board1" // hashtag not included
let game = new Chess()
globalThis._game = game

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
      to: target,
      promotion: (game.get(source).type === game.PAWN && target[1] % 7 === 1 ? getPromotion() : "q")
   })

   // illegal move
   if (move === null) return 'snapback'

   updateStatus()
}

function getPromotion() {
   let promotion = prompt("Oh what piece would you like to promote to").trim()
   if (promotion.length === 1) return promotion
   return game[promotion.toUpperCase()]
}

function removeGreySquares() {
   for (let element of document.querySelectorAll(`#${BOARD_ID} .square-55d63`))
      element.style.backgroundColor = ''
}

function greySquare(square) {
   square = document.querySelector(`#${BOARD_ID} .square-${square}`)

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


function updateStatus() {
   return 'Status not needed yet'

   let status = ''

   let moveColor = game.turn() === 'w' ? 'White' : 'Black'

   // checkmate?
   if (game.in_checkmate()) {
      status = 'Game over, ' + moveColor + ' got checkmated.'
   }

   // draw?
   else if (game.in_draw()) {
      let reason = '100 half-moves'
      if (game.in_stalemate()) reason = 'stalemate'
      if (game.insufficient_material()) reason = 'insufficient material'
      if (game.in_threefold_repetition()) reason = 'threefold repetition'

      status = `Game over, draw by ${reason}`
   }

   // game still on
   else {
      status = moveColor + ' to move'

      // check?
      if (game.in_check()) {
         status += ', ' + moveColor + ' is in check'
      }
   }

   $status.html(status)
   $fen.html(game.fen())
   $pgn.html(game.pgn())
}

let board = Chessboard(BOARD_ID, boardConfig)
