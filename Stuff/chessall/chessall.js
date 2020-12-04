// MIT License. See github repository
// (https://github.com/icecream17/icecream17.github.io)
// for more details

(function ChessClosure() {
   'use strict';
   
   /* Empty when initialized
      It's easier to set many constant fields and methods using Object.defineProperties for now */
   class Chess {}
   
   class ChessStatus extends String {
      constructor (code, message) {
         super(`${code}: ${message}`)
         this.message = message;
         this.code = code;
      }
   }
   
   const ChessStatusCodes = {}
   
   Object.defineProperties(Chess, {
      PAWN: {value: Symbol("Pawn")},
      KNIGHT: {value: Symbol("Knight")},
      BISHOP: {value: Symbol("Bishop")},
      ROOK: {value: Symbol("Rook")},
      QUEEN: {value: Symbol("Queen")},
      KING: {value: Symbol("King")}
   });
   
   Object.defineProperty(String, {
      toChessPiece: {value: function toChessPiece() {
         let pieceName = this//.toUpperCase();
         // TODO: pieceName, pieceLetter, pieceHTML
         return globalThis.ChessStatusCodes.PIECE_NOT_FOUND;
      }}
   });
   
   Object.defineProperties(ChessStatusCodes, {
      OK: {value: new ChessStatus(200, "OK")},
      PIECE_NOT_FOUND: {value: new ChessStatus(404, "Piece not found")}
   })
   
   globalThis.Chess = Chess;
   globalThis.ChessStatusCodes = ChessStatusCodes;
})()

/*
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

*/
