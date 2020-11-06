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

# Looking at the spec

Using the example:
const wrong = wrong;


13.3.1 Let and Const Declarations
https://tc39.es/ecma262/2020/#sec-let-and-const-declarations


__let__ and __const__ declarations define variables that are scoped to the (running execution context's) LexicalEnvironment.
The variables are created when their containing (Lexical Environment) is instantiated but may not be accessed in any way until the variable's _LexicalBinding_ is evaluated.
A variable defined by a _LexicalBinding_ with an _Initializer_ is assigned the value of its _Initializer_'s _AssignmentExpression_ when the _LexicalBinding_ is evaluated, not when the variable is created. 
If a _LexicalBinding_ in a __let__ declaration does not have an _Initializer_ the variable is assigned the value __undefined__ when the _LexicalBinding_ is evaluated.


Lexical Declaration
 - LetOrConst BindingList __;__

LetOrConst
 - __let__
 - __const__

BindingList
 - LexicalBinding
 - BindingList __,__ LexicalBinding

LexicalBinding
 - BindingIdentifier Initializer
 - BindingPattern Initializer

BindingIdentifier
 - Identifier
 - __yield__
 - __await__

Identifier
 - IdentifierName but not ReservedWord

IdentifierName
 - IndentifierStart
 - IndentifierName IdentifierPart

IdentifierPart
 - UnicodeIDContinue
 - __$__
 - __\\__ UnicodeEscapeSequence
 - <ZWNJ>
 - <ZWJ>
 
IdentifierStart
 - UnicodeIDStart
 - __$__
 - __\___
 - __\\__ UnicodeEscapeSequence

UnicodeIDStart
 - any Unicode code point with the Unicode property "ID_Start"

UnicodeIDContinue
 - any Unicode code point with the Unicode property "ID_Continue"
 
https://unicode.org/reports/tr44/#ID_Continue
Used to determine programming identifiers, as described in Unicode Standard Annex #31, "Unicode Identifier and Pattern Syntax" UAX31.

https://unicode.org/reports/tr41/tr41-26.html#UAX31
	Unicode Standard Annex #31: Unicode Identifier and Pattern Syntax
Latest version: http://www.unicode.org/reports/tr31/

http://www.unicode.org/reports/tr31/#Table_Lexical_Classes_for_Identifiers
ID_Continue characters _include ID_Start characters_, plus characters having the Unicode General_Category of nonspacing marks, spacing combining marks, decimal number, connector punctuation, plus Other_ID_Continue, minus Pattern_Syntax and Pattern_White_Space code points.

ID_Start characters are derived from the Unicode General_Category of uppercase letters, _lowercase letters_, titlecase letters, modifier letters, other letters, letter numbers, plus Other_ID_Start, minus Pattern_Syntax and Pattern_White_Space code points.

Back to the JS spec

ReservedWord, one of
 - __await break case catch class const continue debugger default delete do else enum export extends false finally for function if import in instanceof new null return super switch this throw true try typeof var void while with yield__


Now, the part after the equals sign:
Oh no, operator precedence

Initializer
 - __=__ AssignmentExpression

AssignmentExpression
 - ConditionalExpression
 - YieldExpression
 - ArrowFunction
 - AsyncArrowFunction
 - LeftHandSideExpression __=__ AssignmentExpression
 - LeftHandSideExpression AssignmentOperator AssigmentExpression
 
ConditionalExpression
 - ShortCircuitExpression
 - ShortCircuitExpression __?__ AssignmentExpression __:__ AssignmentExpression

ShortCircuitExpression
 - LogicalORExpression
 - CoalesceExpression

LogicalORExpression
 - LogicalANDExpression
 - LogicalORExpression __||__ LogicalANDExpression

LogicalANDExpression
 - BitwiseORExpression
 - LogicalANDExpression __&&__ BitwiseORExpression

BitwiseORExpression
 - BitwiseXORExpression
 - BitwiseORExpression __|__ BitwiseXORExpression

BitwiseXORExpression
 - BitwiseAndExpression
 - BitwiseXORExpression __^__ BitwiseANDExpression

BitwiseANDExpression
 - EqaulityExpression
 - BitwiseANDExpression __&__ EqualityExpression

EqualityExpression
 - RelationalExpression
 - EqualityExpression __==__ RelationalExpression
 - EqualityExpression __!=__ RelationalExpression
 - EqualityExpression __===__ RelationalExpression
 - EqualityExpression __!==__ RelationalExpression

RelationalExpression
 - ShiftExpression
 - RelationalExpression __<__ ShiftExpression
 - RelationalExpression __>__ ShiftExpression
 - RelationalExpression __<=__ ShiftExpression
 - RelationalExpression __>=__ ShiftExpression
 - RelationalExpression __instanceof__ ShiftExpression
 - RelationalExpression __in__ ShiftExpression

ShiftExpression
 - AdditiveExpression
 - ShiftExpression __<<__ AdditiveExpression
 - ShiftExpression __>>__ AdditiveExpression
 - ShiftExpression __>>>__ AdditiveExpression

AdditiveExpression
 - MultiplicativeExpression
 - AdditiveExpression __+__ MultiplicativeExpression
 - AdditiveExpression __-__ MultiplicativeExpression

MultiplicativeExpression
 - ExponentiationExpression
 - MultiplicativeExpression MultiplicativeOperator ExponentiationExpression

ExponentationExpression
 - UnaryExpression
 - UpdateExpression __**__ ExponentiationExpression

UnaryExpression
 - UpdateExpression
 - __delete__ UnaryExpression
 - __void__ UnaryExpression
 - __typeof__ UnaryExpression
 - __+__ UnaryExpression
 - __-__ UnaryExpression
 - __~__ UnaryExpression
 - __!__ UnaryExpression
 - AwaitExpression

UpdateExpression
 - LeftHandSideExpression
 - LeftHandSideExpression (no _LineTerminator_ here) __++__
 - LeftHandSideExpression (no _LineTerminator_ here) __--__
 - __++__ UnaryExpression
 - __--__ UnaryExpression

LeftHandSideExpression
 - NewExpression
 - CallExpression
 - OptionalExpression

NewExpression
 - MemberExpression
 - __new__ NewExpression

MemberExpression
 - PrimaryExpression
 - MemberExpression __[__ Expression __]__
 - MemberExpression __.__ IdentifierName
 - MemberExpression __.__ TemplateLiteral
 - SuperProperty
 - MetaProperty
 - __new__ MemberExpression Arguments

PrimaryExpression
 - __this__
 - IdentifierReference
 - Literal
 - ArrayLiteral
 - ObjectLiteral
 - FunctionExpression
 - ClassExpression
 - AsyncFunctionExpression
 - AsyncGeneratorExpression
 - RegularExpressionLiteral
 - TemplateLiteral
 - CoverParenthesizedExpressionAndArrowParameterList

IdentifierReference: Already shown, and matches too!
Doesn't match anything else in PrimaryExpression

Literal: number, string, null, etc.
RegularExpression: That means regex
TheLastOne: 
 ( Expression )
 ( )
 ( ...also spread syntax )
 
__SOO IN CONCLUSION__
The parsing of
const wrong = wrong;

goes like this:

```
Text surrounded like __this__, means an actual character.
So for example, LetOrConst: __const__


LexicalDeclaration: LetOrConst BindingList __;__
-0/ LetOrConst: __const__
-0/ BindingList: LexicalBinding
-0/ -1/ LexicalBinding: BindingIdentifier Initializer
-0/ -1/ -2/ BindingIdentifier: Identifier
-0/ -1/ -2/ -3/ Identifier: IdentifierName
-0/ -1/ -2/ -3/ -4/ IdentifierName: IdentifierName IdentifierPart
-0/ -1/ -2/ -3/ -4/ -5/ IdentifierName: IdentifierName IdentifierPart
-0/ -1/ -2/ -3/ -4/ -5/ -6/ IdentifierName: IdentifierName IdentifierPart
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ IdentifierName: IdentifierName IdentifierPart
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ IdentifierName: IdentifierStart
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ IdentifierStart: UnicodeIDStart
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ UnicodeIDStart: (Lowercase __w__)
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ IdentifierPart: UnicodeIDContinue
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ UnicodeIDContinue: (Lowercase __r__)
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ IdentifierPart: UnicodeIDContinue
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ UnicodeIDContinue: (Lowercase __o__)
-0/ -1/ -2/ -3/ -4/ -5/ -6/ IdentifierPart: UnicodeIDContinue
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ UnicodeIDContinue: (Lowercase __n__)
-0/ -1/ -2/ -3/ -4/ -5/ IdentifierPart: UnicodeIDContinue
-0/ -1/ -2/ -3/ -4/ -5/ -6/ UnicodeIDContinue: (Lowercase __g__)
-0/ -1/ -2/ Initializer: __=__ AssignmentExpression
-0/ -1/ -2/ -3/ AssignmentExpression: ConditionalExpression
-0/ -1/ -2/ -3/ -4/ ConditionalExpression: ShortCircuitExpression
-0/ -1/ -2/ -3/ -4/ -5/ ShortCircuitExpression: LogicalORExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ LogicalORExpression: LogicalANDExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ LogicalANDExpression: BitwiseORExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ BitwiseORExpression: BitwiseXORExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ BitwiseXORExpression: BitwiseANDExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ BitwiseANDExpression: EqualityExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ EqualityExpression: RelationalExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ RelationalExpression: ShiftExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ ShiftExpression: AdditiveExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ AdditiveExpression: MultiplicativeExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ MultiplicativeExpression: ExponentiationExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ ExponentiationExpression: UnaryExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ UnaryExpression: UpdateExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ UpdateExpression: LeftHandSideExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ LeftHandSideExpression: NewExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ NewExpression: MemberExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ MemberExpression: PrimaryExpression
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ PrimaryExpression: IdentifierReference
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ IdentifierReference: Identifier
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ Identifier: IdentifierName
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ IdentifierName: IdentifierName IdentifierPart
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ IdentifierName: IdentifierName IdentifierPart
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ 27/ IdentifierName: IdentifierName IdentifierPart
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ 27/ 28/ IdentifierName: IdentifierName IdentifierPart
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ 27/ 28/ 29/ IdentifierName: IdentifierStart
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ 27/ 28/ 29/ 30/ IdentifierStart: UnicodeIDStart
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ 27/ 28/ 29/ 30/ UnicodeIDStart: (Lowercase __w__)
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ 27/ 28/ 29/ IdentifierPart: UnicodeIDContinue
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ 27/ 28/ 29/ 30/ UnicodeIDContinue: (Lowercase __r__)
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ 27/ 28/ IdentifierPart: UnicodeIDContinue
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ 27/ 28/ 29/ UnicodeIDContinue: (Lowercase __o__)
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ 27/ IdentifierPart: UnicodeIDContinue
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ 27/ 28/ UnicodeIDContinue: (Lowercase __n__)
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ IdentifierPart: UnicodeIDContinue
-0/ -1/ -2/ -3/ -4/ -5/ -6/ -7/ -8/ -9/ 10/ 11/ 12/ 13/ 14/ 15/ 16/ 17/ 18/ 19/ 20/ 21/ 22/ 23/ 24/ 25/ 26/ 27/ UnicodeIDContinue: (Lowercase __g__)


Basically:
LexicalDeclaration: LetOrConst LexicalBinding __;__
-0/ LetOrConst: __const__
-1/ LexicalBinding: Identifier Initializer
... -3/ Identifier: __wrong__
... -2/ Initializer: __=__ Identifier
... ... 24/ Identifier: __wrong__
```


Runtime Semantics: Evaluation
LexicalBinding: BindingIdentifier Initializer

1. Let bindingId be StringValue of BindingIdentifier.
2. Let lhs be ResolveBinding(bindingId).
3. If IsAnonymousFunctionDefinition(Initializer) is true, then
 a. Let value be NamedEvaluation of Initializer with argument bindingId.
4. Else,
 a. Let rhs be the result of evaluating Initializer.
 b. Let value be ? GetValue(rhs).
5. Return InitializeReferencedBinding(lhs, value).


5.2.3.4 ReturnIfAbrupt Shorthands
Invocations of abstract operations and syntax-directed operations that are prefixed by ? indicate that ReturnIfAbrupt should be applied to the resulting Completion Record.   
For example, the step:
 1. ? OperationName()

is equivalent to:
 1. ReturnIfAbrupt(OperationName())



12.2.6.7 (Evaulation of Initializer)
nothing


12.1.5 (IdentifierReference)
With parameters value and environment

IdentifierReference: Identifier
 1. Return ? ResolveBinding(StringValue of Identifier)
 

12.1.4 (StringValue)
Identifier: IdentifierName but not ReservedWord
 1. Return the StringValue of IdentifierName


11.6.1.2 (IdentifierName: StringValue)
 1. Let idText be the source text matched by IdentifierName
 2. Let idTextUnescaped be the result of replacing any occurrences of __\\__ UnicodeEscapeSequence in idText with the code point represented by the UnicodeEscapeSequence
 3. Return ! UTF16Encode(idTextUnescaped)

UTF16Encode(text)
This abstract operation converts text, a sequence of Unicode code points, into a String value, as described in 6.1.4.
Return the string-concatenation of the code units that are the UTF16Encoding of each code point in text, in order.

! function, means return Completion.value, function will not be abrupt
(Meaning, return the value of the function, the function is guaranteed to not break, throw, etc., (it will be normal), if it does break that's a bug in the spec).



Now back,
Runtime Semantics: Evaluation
LexicalBinding: BindingIdentifier Initializer

1. Let bindingId be "wrong"
2. Let lhs be ResolveBinding(bindingId).
3. If IsAnonymousFunctionDefinition(Initializer) is true, then
 a. Let value be NamedEvaluation of Initializer with argument bindingId.
4. Else,
 a. Let rhs be the result of evaluating Initializer.
 b. Let value be ? GetValue(rhs).
5. Return InitializeReferencedBinding(lhs, value).


ResolveBinding(name[, env])
 1. If env is not present or if env is undefined, then
   a. Set env to the running execution context's LexicalEnvironment.
 2. Assert: env is a Lexical Environment.
 3. If the code matching the syntactic production that is being evaluated is contained in strict mode code, let strict be true; else let strict be false.
 4. Return ? GetIdentifierReference(env, name, strict).

GetIdentifierRefernece(env, name, strict)
 1. If lex is the value null, then
   a. Return a value of type Reference whose base value component is undefined, whose referenced name component is name, and whose strict reference flag is strict.
 2. Let envRec be lex's EnvironmentRecord.
 3. Let exists be ? envRec.HasBinding(name).
 4. If exists is true, then
   a. Return a value of type Reference whose base value component is envRec, whose referenced name component is name, and whose strict reference flag is strict.
 5. Else,
   a. Let outer be the value of lex's outer environment reference.
   b. Return ? GetIdentifierReference(outer, name, strict).


Remember the note at the very beginning...?

__let__ and __const__ declarations define variables that are scoped to the (running execution context's) LexicalEnvironment.
The variables are created when their containing (Lexical Environment) is instantiated but may not be accessed in any way until the variable's _LexicalBinding_ is evaluated.
A variable defined by a _LexicalBinding_ with an _Initializer_ is assigned the value of its _Initializer_'s _AssignmentExpression_ when the _LexicalBinding_ is evaluated, not when the variable is created. 
If a _LexicalBinding_ in a __let__ declaration does not have an _Initializer_ the variable is assigned the value __undefined__ when the _LexicalBinding_ is evaluated.


envRec.HasBinding(name)
The concrete Environment Record method HasBinding for declarative Environment Records simply determines if the argument identifier is one of the identifiers bound by the record:

if this envRec has a binding for name, return true, otherwise return false (too lazy to type what it actually is)






















































