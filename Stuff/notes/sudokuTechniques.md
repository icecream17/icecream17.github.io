# Sudoku Techniques
Recently i've become amazed by sudoku.
Here's a list of techniques i've found from around the internet

## What is sudoku?
Sudoku is a puzzle. There's a 9 by 9 grid, and the rule is

_Place the digits 1 to 9 in each row, column, and box_

A box is a smaller 3x3 grid inside of the whole sudoku grid

Here's an example sudoku in text form:
```
1 4 3 | . . . | 9 . 7
. . . | . 7 . | 3 4 .
2 . . | 9 . . | . . .
------+-------+------
. 1 . | . . . | . 5 .
. . 9 | 4 . . | 1 . .
. 3 . | 6 . . | . . .
------+-------+------
7 . 2 | . 4 . | 8 . .
. . . | . 8 2 | . . 9
. . . | 5 . . | . 7 3
```

A picture of the same sudoku:  
![The same sudoku as before](https://i.imgur.com/ESaYXz1.png)

Search it up online for more if you want, recommended if you don't think you really understood.

## What is this?
A list of logic techniques. Not many images, maybe will add later if I feel like it

## Super basic techniques
Some logic is very easy

#1  There cannot be two of the same number in a row/column/box.  
    (A row/column/box has 9 squares. There are 9 digits.)   

#2  If 4 is in the first row/column/box, there cannot be another 4 in the first row/column/box

#3  If 4 can only be in one square in a row/column/box, then that square is a 4

#4  If a square can only possibly be 4, then it is 4.

There are many examples of this in the sudoku. 
```
    1 2 3   4 5 6   7 8 9

A   1 4 3 | . . . | 9 . 7
B   . . . | . 7 . | 3 4 .
C   2 . . | 9 . . | . . .
    ------+-------+------
D   . 1 . | . . . | . 5 .
E   . . 9 | 4 . . | 1 . .
F   . 3 . | 6 . . | . . .
    ------+-------+------
G   7 . 2 | . 4 . | 8 . .
H   . . . | . 8 2 | . . 9
J   . . . | 5 . . | . 7 3
```
A4 cannot be a 4. (There's a 4 on A2)

Look at column 2. Where can 2 go? (C2 and G3 cancel out many 2s)

Ah-ha, in column 2, the only place 2 can go is E2.

Ah-ha, in box 2, the only place 2 can go is E2. That's 2 reasons why 2 has to be in E2

https://www.sudokuwiki.org/Getting_Started has more info on these simple strategies.

## Some more strategies
I got tired of writing strategies so i'm gonna put a "random one" down.

This one starts with a hidden pair. Well, almost
```
    1 2 3   4 5 6   7 8 9

A   1 . . | . . . | 3 . .
B   . . 3 | 6 . . | . . .
C   . 7 . | . 9 . | . 2 .
    ------+-------+------
D   . 5 . | . . 7 | . . .
E   . . . | . 3 5 | 7 . .
F   . . . | 1 . . | 2 3 .
    ------+-------+------
G   . . 1 | 9 . . | . 6 8
H   . . . | 5 . . | 1 . .
J   . . . | . . 4 | . . .
```

If you look at the top box
