// MIT License. See github repository
// (https://github.com/icecream17/icecream17.github.io)
// for more details

(function ChessClosure() {
   'use strict';
   
   /* Empty when initialized
      It's easier to set many constant fields and methods using Object.defineProperties for now */
   const Chess = {};
   
   
   
   class ChessStatus extends String {
      #message;
      #code;
      constructor (code, message) {
         super(`${code}: ${message}`)
         this.#message = message;
         this.#code = code;
      }
   
      get message () {return this.#message}
      get code () {return this.#code}
      get type () {return "chess"}
   }
   
   class ChessResponse {
      #status = null;
      #content = null;
      constructor (status, content) {
         this.#status = status;
         this.#content = content;
      }
      
      get status () {return this.#status}
      get content () {return this.#content}
      get isOk () {return this.#status.code >= 200 || this.#status.code < 300}
      get type () {return "chess"}
   }
   
   const ChessStatusCodes = {}
   
   Object.defineProperties(ChessStatusCodes, {
      OK: {value: new ChessStatus(200, "OK")},
      NOT_FOUND: {value: new ChessStatus(404, "Piece not found")}
   })
   
   
   
   const PieceRepresentations = {}
   const UnicodePieces = {}
   const PieceCharacters = {}
   const PieceNames = {}
   
   // UnicodePieces look different depending on the font
   Object.defineProperties(UnicodePieces, {
      WHITE_KING: {value: '♔', enumerable: true},
      WHITE_QUEEN: {value: '♕', enumerable: true},
      WHITE_ROOK: {value: '♖', enumerable: true},
      WHITE_BISHOP: {value: '♗', enumerable: true},
      WHITE_KNIGHT: {value: '♘', enumerable: true},
      WHITE_PAWN: {value: '♙', enumerable: true},
      BLACK_KING: {value: '♚', enumerable: true},
      BLACK_QUEEN: {value: '♛', enumerable: true},
      BLACK_ROOK: {value: '♜', enumerable: true},
      BLACK_BISHOP: {value: '♝', enumerable: true},
      BLACK_KNIGHT: {value: '♞', enumerable: true},
      BLACK_PAWN: {value: '♟', enumerable: true}, // Sometimes the black pawn looks different in html.
      // Unknown could be question mark?
      
      includes: {value: function characterIsUnicodeChessPiece(char) {
         return char.codePointAt(0) >= 0x2654 && char.codePointAt(0) < 0x2660;
      }},
      [Symbol.iterator]: {value: function* unicodeChessCharacterGenerator() {
         yield "♔";
         yield "♕";
         yield "♖";
         yield "♗";
         yield "♘";
         yield "♙";
         yield "♚";
         yield "♛";
         yield "♜";
         yield "♝";
         yield "♞";
         yield "♟";
      }},
   });
   
   // TODO: Support for other languages
   Object.defineProperties(PieceCharacters, {
      // TODO
   });
   
   // TODO: Support for other languages
   Object.defineProperties(PieceNames, {
      // TODO
   });
   
   
   Object.defineProperties(PieceRepresentations, {
      Unicode: {value: UnicodePieces, enumerable: true},
      Letters: {value: PieceCharacters, enumerable: true},
      Names:   {value: PieceNames, enumerable: true},
   });
   
   // Pieces
   Object.defineProperties(Chess.prototype, {
      PAWN: {value: Symbol("Pawn")},
      KNIGHT: {value: Symbol("Knight")},
      BISHOP: {value: Symbol("Bishop")},
      ROOK: {value: Symbol("Rook")},
      QUEEN: {value: Symbol("Queen")},
      KING: {value: Symbol("King")},
      UNDEFINED_PIECE: {value: Symbol("Undefined chess piece")},
      NULL_PIECE: {value: Symbol("Nullish Unknown chess piece")},
      PIECE_REPRESENTATIONS: {value: PieceRepresentations},
      
      WHITE: {value: Symbol("White (side)")},
      BLACK: {value: Symbol("Black (side)")},
   });
   Object.defineProperty(Chess.prototype, "PIECE_TYPES", {value: [Chess.prototype.PAWN, Chess.prototype.KNIGHT, Chess.prototype.BISHOP, Chess.prototype.ROOK, Chess.prototype.QUEEN, Chess.prototype.KING]})
   Object.defineProperty(Chess.prototype, "SIDES",       {value: [Chess.prototype.WHITE, Chess.prototype.BLACK]});
   
   
   
   
   
   // Maybe save state the square or something
   class ChessSquare {
      constructor (rowIndex_Or_SquareID_Or_SquareIndex, columnIndex_if_row) {
         if (col === null || col === undefined) { // Not row then
            if (typeof rowIndex_Or_SquareID_Or_SquareIndex === "string")      return Chess.prototype[rowIndex_Or_SquareID_Or_SquareIndex] ?? Chess.prototype.undefinedSquare;
            else if (typeof rowIndex_Or_SquareID_Or_SquareIndex === "number") return rowIndex_Or_SquareID_Or_SquareIndex;
            throw TypeError("rowIndex_Or_SquareID_Or_SquareIndex was not a number or string. Therefore the value provided was not a rowIndex, SquareId, or a SquareIndex");
         }
         
         if (rowIndex_Or_SquareID_Or_SquareIndex < 0)       throw RangeError("rowIndex was less than 0");
         else if (rowIndex_Or_SquareID_Or_SquareIndex >= 8)
            if (rowIndex_Or_SquareID_Or_SquareIndex === 8)  throw RangeError("rowIndex was 8,           \n out of bounds. \n Did you forget about: rowINDEEXXX");
            else                                            throw RangeError("rowIndex was more than 8, \n out of bounds. \n (Value 8 gets a seperate error)");
         else if (columnIndex_if_row < 0)  throw RangeError("columnIndex was less than 0");
         else if (columnIndex_if_row >= 8)
            if (columnIndex_if_row === 8)  throw RangeError("columnIndex was 8,           \n out of bounds. Did you forget about: columnINDEEXXX");
            else                           throw RangeError("columnIndex was more than 8, \n out of bounds. \n (Value 8 gets a seperate error)");
         else if (!Number.isInteger(rowIndex_Or_SquareID_Or_SquareIndex)) throw TypeError("rowIndex was not an integer");
         else if (!Number.isInteger(columnIndex_if_row))                  throw TypeError("columnIndex was not an integer");
         return Number(rowIndex_Or_SquareID_Or_SquareIndex) * 8 + Number(columnIndex_if_row);
      }
   }
   Object.defineProperty(ChessSquare.prototype, "isSquare", {
      value: function isSquare(number) {
         return typeof number === "number" && Number.isInteger(number) && number >= 0 && number < 64
      }
   });

   Object.defineProperties(Chess.prototype, {
      A1: {value: 0x00}, A2: {value: 0x01}, A3: {value: 0x02}, A4: {value: 0x03}, A5: {value: 0x04}, A6: {value: 0x05}, A7: {value: 0x06}, A8: {value: 0x07},
      B1: {value: 0x08}, B2: {value: 0x09}, B3: {value: 0x0A}, B4: {value: 0x0B}, B5: {value: 0x0C}, B6: {value: 0x0D}, B7: {value: 0x0E}, B8: {value: 0x0F},
      C1: {value: 0x10}, C2: {value: 0x11}, C3: {value: 0x12}, C4: {value: 0x13}, C5: {value: 0x14}, C6: {value: 0x15}, C7: {value: 0x16}, C8: {value: 0x17},
      D1: {value: 0x18}, D2: {value: 0x19}, D3: {value: 0x1A}, D4: {value: 0x1B}, D5: {value: 0x1C}, D6: {value: 0x1D}, D7: {value: 0x1E}, D8: {value: 0x1F},
      E1: {value: 0x20}, E2: {value: 0x21}, E3: {value: 0x22}, E4: {value: 0x23}, E5: {value: 0x24}, E6: {value: 0x25}, E7: {value: 0x26}, E8: {value: 0x27},
      F1: {value: 0x28}, F2: {value: 0x29}, F3: {value: 0x2A}, F4: {value: 0x2B}, F5: {value: 0x2C}, F6: {value: 0x2D}, F7: {value: 0x2E}, F8: {value: 0x2F},
      G1: {value: 0x30}, G2: {value: 0x31}, G3: {value: 0x32}, G4: {value: 0x33}, G5: {value: 0x34}, G6: {value: 0x35}, G7: {value: 0x36}, G8: {value: 0x37},
      H1: {value: 0x38}, H2: {value: 0x39}, H3: {value: 0x3A}, H4: {value: 0x3B}, H5: {value: 0x3C}, H6: {value: 0x3D}, H7: {value: 0x3E}, H8: {value: 0x3F},
      UndefinedSquare: {value: Symbol('Undefined square')},
      NullSquare: {value: Symbol('Nullish Unknown square')},
   });
   Object.defineProperty(Chess.prototype, "SQUARE_IDS", {value: [
      Chess.prototype.A1, Chess.prototype.A2, Chess.prototype.A3, Chess.prototype.A4, Chess.prototype.A5, Chess.prototype.A6, Chess.prototype.A7, Chess.prototype.A8,
      Chess.prototype.B1, Chess.prototype.B2, Chess.prototype.B3, Chess.prototype.B4, Chess.prototype.B5, Chess.prototype.B6, Chess.prototype.B7, Chess.prototype.B8,
      Chess.prototype.C1, Chess.prototype.C2, Chess.prototype.C3, Chess.prototype.C4, Chess.prototype.C5, Chess.prototype.C6, Chess.prototype.C7, Chess.prototype.C8,
      Chess.prototype.D1, Chess.prototype.D2, Chess.prototype.D3, Chess.prototype.D4, Chess.prototype.D5, Chess.prototype.D6, Chess.prototype.D7, Chess.prototype.D8,
      Chess.prototype.E1, Chess.prototype.E2, Chess.prototype.E3, Chess.prototype.E4, Chess.prototype.E5, Chess.prototype.E6, Chess.prototype.E7, Chess.prototype.E8,
      Chess.prototype.F1, Chess.prototype.F2, Chess.prototype.F3, Chess.prototype.F4, Chess.prototype.F5, Chess.prototype.F6, Chess.prototype.F7, Chess.prototype.F8,
      Chess.prototype.G1, Chess.prototype.G2, Chess.prototype.G3, Chess.prototype.G4, Chess.prototype.G5, Chess.prototype.G6, Chess.prototype.G7, Chess.prototype.G8,
      Chess.prototype.H1, Chess.prototype.H2, Chess.prototype.H3, Chess.prototype.H4, Chess.prototype.H5, Chess.prototype.H6, Chess.prototype.H7, Chess.prototype.H8,
   ]});
   Object.defineProperty(Number.prototype, "toChessSquareID",  {
      value: function toChessSquareID () {
         return "ABCDEFGH"[this >> 3] + String(this & 7);
      }
   });
         
   
   class ChessBoard {
      
   }
   
   
   class ChessPiece {
      constructor (pieceType, pieceSide, square = Chess.UndefinedSquare) {
         this.type = pieceType
         this.side = pieceSide
         this.square = square
      }
   }
   
   // Defines the toChessPiece addition to the String.prototype
   Object.defineProperty(String.prototype, "toChessPiece", {
      value: 
      function toChessPiece() {
         let trimmedString = this.trim();
         if (trimmedString.length === 1) {
            if (trimmedString === "♔" || trimmedString === "K") return new ChessPiece(Chess.prototype.KING, Chess.prototype.WHITE);
            else if (trimmedString === "♕" || trimmedString === "Q") return new ChessPiece(Chess.prototype.QUEEN, Chess.prototype.WHITE);
            else if (trimmedString === "♖" || trimmedString === "R") return new ChessPiece(Chess.prototype.ROOK, Chess.prototype.WHITE);
            else if (trimmedString === "♗" || trimmedString === "B") return new ChessPiece(Chess.prototype.BISHOP, Chess.prototype.WHITE);
            else if (trimmedString === "♘" || trimmedString === "N") return new ChessPiece(Chess.prototype.KNIGHT, Chess.prototype.WHITE);
            else if (trimmedString === "♙" || trimmedString === "P") return new ChessPiece(Chess.prototype.PAWN, Chess.prototype.WHITE);
            else if (trimmedString === "♚" || trimmedString === "k") return new ChessPiece(Chess.prototype.KING, Chess.prototype.BLACK);
            else if (trimmedString === "♛" || trimmedString === "q") return new ChessPiece(Chess.prototype.QUEEN, Chess.prototype.BLACK);
            else if (trimmedString === "♜" || trimmedString === "r") return new ChessPiece(Chess.prototype.ROOK, Chess.prototype.BLACK);
            else if (trimmedString === "♝" || trimmedString === "b") return new ChessPiece(Chess.prototype.BISHOP, Chess.prototype.BLACK);
            else if (trimmedString === "♞" || trimmedString === "n") return new ChessPiece(Chess.prototype.KNIGHT, Chess.prototype.BLACK);
            else if (trimmedString === "♟" || trimmedString === "p") return new ChessPiece(Chess.prototype.PAWN, Chess.prototype.BLACK);
         } else if (trimmedString.length === 2) {
            let piece = Chess.SQUARE[trimmedString];
            if (piece !== undefined) return piece;
         }
         return new ChessResponse(
            ChessStatusCodes.NOT_FOUND, Chess.prototype.UNKNOWN_PIECE
         );
      }
   });
   
   
   
   Object.defineProperty(globalThis, "Chess", {value: Chess});
   Object.defineProperty(globalThis, "ChessBoard", {value: ChessBoard});
   Object.defineProperty(globalThis, "ChessPiece", {value: ChessPiece});
   Object.defineProperty(globalThis, "ChessResponse", {value: ChessResponse});
   Object.defineProperty(globalThis, "ChessStatus", {value: ChessStatus});
   Object.defineProperty(globalThis, "ChessStatusCodes", {value: ChessStatusCodes});
})()

/*



*/
