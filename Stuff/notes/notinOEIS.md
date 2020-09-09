# Not in OEIS
This is a list of integer sequences I have made that are not in the OEIS

* Alphabetical order of (Numbers in word form, but backwards)
   * derdnuh eerht (300)
   * derdnuh eerht dnasuot eerht (3300)
   * derdnuh eerht dnasuot eerht noillib eerht (3000003300)
* Number of different square a knight can be at after n moves in (this obscure grid)
   * (this obscure grid) is made by the following steps, and is inspired by [How to count past infinity](https://www.youtube.com/watch?v=SrU9YDoXE88) - from [Cantor's theorem](https://en.wikipedia.org/wiki/Cantor%27s_theorem)
      * Step 1: Imagine an infinite grid of bits, where g(r, c) is the value of the bit in the rth row and cth column of the grid.
      * All bits in row 1 are set to 0
      * Now, where x = row of current bit, and y = column of current bit, for each bit, the bit's value is not(g((x mod y) + 1, y))
      * Example:
         * ```1st row: 00000000000...```
         * ```2nd row: 11111111111...```
         * ```3rd row: 10101010101...```
         * ```4th row: 10010110010...```
         * ```5th row: 10001001100...```
      * Step 2: (this obscure grid) is the grid in step 1, but there's a "0th" column" too, where g(1, 0) = 1, and the rest of the "0th" column is 0.
      * The knight starts at g(1, 0), and can only be at, or go to, bits with a value of 1.
   * Anyways, handy sheet is at https://docs.google.com/spreadsheets/d/1tyKU2ff-3KWQlUEPTu7FgMjlETDuwLXTczfs-ptuxsc/edit?usp=sharing, sequence goes:
   * 1, 2, 3, 5, 7, 14, 11, 20
* Number of different squares a knight can be at after n moves in (this obscure grid), not counting squares a knight could reach in less than n moves.
   * Same handy sheet at https://docs.google.com/spreadsheets/d/1tyKU2ff-3KWQlUEPTu7FgMjlETDuwLXTczfs-ptuxsc/edit?usp=sharing, sequence goes:
   * 1, 2, 2, 3, 4, 9, 4, 9
* Number of letters in English words, sorted most to least common.
   * Variable, but wikipedia has a nice list at https://en.wikipedia.org/wiki/Most_common_words_in_English
   * the, be, to, of, and, a, in, that, have, ....
   * 3, 2, 2, 2, 3, 1, 2, 4, 4
