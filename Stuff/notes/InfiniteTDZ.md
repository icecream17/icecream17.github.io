# Intro
The Temporal Dead Zone or TDZ is a zone where variables are placed before they've been initialized (assigned), and after they're declared.

Note that ```let x;``` automatically assigns ```x``` as ```undefined```

See more at [MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let#Temporal_dead_zone)

Example:
```javascript
console.log(typeof test)

let test = "does it work?"; // No it doesn't. 
```

# The Infinite TDZ
There is a way to declare a variable without ever assigning it anything!

How is this possible?

```javascript
const neverAssigned = neverAssigned;
```

This throws ```Uncaught ReferenceError: Cannot access 'neverAssigned' before initialization```, so you'll have to catch it.

So first, it declares ```neverAssigned```.
Also, it can only initialize the variable after it calculates the right side: ``` = neverAssigned;```

But it *never finishes* calculating it in the first place because of the error!

## Fixes
If you use ```let```:

```javascript
let test = test; // ERROR

// FIXED
let test = 7; // 7
```

If you use const, i'm sorry but either:
 1. You get a "already declared"
 2. You get a "can't assign to const variable"

So you can't fix it. Therefore, **using const makes it truly infinite**

Also it's impossible to use ```var``` and still have a TDZ because ```var``` assigns ```undefined``` immediately when declaring a variable.



# Side effects

## typeof
ES6 says that typeof will throw an error if a variable is in the TDZ.

## errors
Even mentioning the variable will throw an error, unless you're fixing it.

This could have really bad effects, but I don't know, i'm just imagining the consequences.










































