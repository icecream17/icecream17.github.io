import Chess from './chessModified.js'
globalThis._Chess = Chess

const BOARD_ID = "board1" // hashtag not included
let game = new Chess()
let currentTree = new Map()
currentTree.update = function () {
   let currentBranch = this
   for (let move of game.history()) {
      if (currentBranch.has(move)) {
         currentBranch = currentBranch.get(move)
      } else {
         if (game.in_checkmate()) {
            currentBranch.set(move, 'checkmate')
         } else if (game.in_draw()) {
            currentBranch.set(move, 'draw')
         } else {
            currentBranch.set(move, new Map())
            currentBranch = currentBranch.get(move)
         }
      }
   }
}
globalThis._game = game

// Increase the right number for more speed
globalThis.speed = (60_000) / 314

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
   document.getElementById('output').value = `${game.fen()}

${game.history().length}

${(()=>{
   let moveColor = game.turn() === 'w' ? 'White' : 'Black'

   // checkmate?
   if (game.in_checkmate()) {
      return 'Game over, ' + moveColor + ' got checkmated.'
   }

   // draw?
   else if (game.in_draw()) {
      let reason = '100 half-moves'
      if (game.in_stalemate()) reason = 'stalemate'
      if (game.insufficient_material()) reason = 'insufficient material'
      if (game.in_threefold_repetition()) reason = 'threefold repetition'

      return `Game over, draw by ${reason}`
   }

   // game still on
   else {
      return moveColor + ' to move' + (game.in_check() ? '. Check!' : '')
   }
})()}

${
      JSON.stringify(currentTree, replacer, 1)
          .split('\n')
          .filter(a => a.includes('"'))
          .map(
            a => 
               a.slice(1, a.indexOf('"')) +
               a.slice(a.indexOf('"') + 1, a.lastIndexOf('"'))
          )
          .join('\n')
}`
}

function replacer(key, value) {
   if (value instanceof Map) {
      let obj = {}
      for (let [key, entryValue] of value.entries()) {
         obj[key] = entryValue
      }
      return obj
   } else {
      return value;
   }
}

let board = Chessboard(BOARD_ID, boardConfig)

document.getElementById('start').onclick = function () {
   globalThis.searchIntervals = [
      setInterval(() => {
         for (let i = 0; i < 10; i++) search();
         updateStatus()
      }, 250),
      setInterval(updateBoard, globalThis.speed)
   ]
}
document.getElementById('stop').onclick = function () {
   if (!('searchIntervals' in globalThis)) return;
   globalThis.searchIntervals.forEach(interval => clearInterval(interval))
   delete globalThis.searchIntervals
}
function setSpeed(n) {
   if (!('searchIntervals' in globalThis)) return;
   globalThis.speed = n
   clearInterval(globalThis.searchIntervals[1])
   globalThis.searchIntervals[1] = setInterval(updateBoard, globalThis.speed)
}

function search () {
   currentTree.update()
   let moves = game.moves()
   let currentBranch = currentTree
   for (let move of game.history()) {
      currentBranch = currentBranch.get(move)
   }
   
   if (typeof currentBranch === 'string') {
      game.undo()
   } else { // instanceof Map
      let moved = false
      for (let move of moves) {
         if (!(currentBranch.has(move))) {
            moved = true
            game.move(move)
            break
         }
      }
      if (moved === false) {
         if (game.history().length > 0) {
            game.undo()
         } else {
            document.getElementById('stop').click()  
         }
      }
   }
}

function updateBoard() {
   board.position(game.fen(), false)
}
