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
* Length of Symbols for ASCII characters
   * Here's an [ascii table](https://www.ascii-code.com/)
   * NUL, SOH, STX, ETX, EOT, ENQ, ACK, BEL, BS, HT, LF, VT, FF, CR, SO, SI, DLE
   * 3, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3
   * 8 threes, then 8 twos gets 31 results, but another 3 doesn't get any results.
   * Eventually you'll to some printable characters and there will be a lot of 1s
       * Might need to look at the actual table here.
* List of MegaFavNumbers
   * See playlist on youtube, goes 666030256, 1169809367327212570704813632106852886389036911
* Concatenation of all {n mod (all prime numbers smaller than n)}
   * 0, 0, 0, 1, 1, 12, 1, 112, 231, 1042
* Of the sequence {1, 1/2, 1/(2 + 3), 1/(2 + 3/4), 1/(2 + 3/(4 + 5)), 1/(2 + 3/(4 + 5/6)), 1/(2 + 3/(4 + 5/(6 + 7))), 1/(2 + 3/(4 + 5/(6 + 7/8))), etc...}
   * Simplified numerators:
       * 1, 1, 1, 4, 3, 29, 19, 52
   * Simplified denominators:
       * 1, 2, 5, 11, 7, 76, 51, 137
* See https://docs.google.com/document/d/1wmtR2oZQkczNzOVNBPs04BxUh91rhloMqQUQ8YjjxGE/edit?usp=sharing
   * ![Take a number, say 8439. This is written in binary as  10000011110111.
Now shift the digits to the right until there’s a number that’s not greater: 10000011110111 >> 01111000001111
And now the same but the opposite, waiting for a number that’s not lesser: 10000011110111 >> 11000001111011
And now the same but the opposite, shifting to the left:
10000011110111 << 00000111101111
10000011110111 << 11110111100000
And finally… bitwise and all of those together:
01111000001111 & 
11000001111011 &
00000111101111 &
11110111100000 = 0](https://user-images.githubusercontent.com/58114641/115335602-233d8280-a163-11eb-903c-6142fd9e407e.png)
   * Although there's a spreadsheet at the doc (or here: https://docs.google.com/spreadsheets/d/1pNS9AYsXV4uIqfBbtzekho4C708UEy8Awvjvk_MJDeM/edit?usp=sharing), [there's also a markdown table of the pattern](./random-pattern.md)
