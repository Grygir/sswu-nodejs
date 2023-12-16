# Simple Calc — performs simple arithmetic operations

```js
// Addition
import {add} from 'simple-calc';
console.log(add(3.141, 9.8, -2.718));
//=> 10.223

// Subtraction
import {sub} from 'simple-calc';
console.log(sub(3.141, 9.8, 2.718));
//=> -9.377

// Multiplication
import {mul} from 'simple-calc';
console.log(mul(2, 2));
//=> 4

// Division
import {div} from 'simple-calc';
console.log(div(7, 2));
//=> 3.5
```

# CLI
The library can also be used from command line.

Note that:
* Operands and operators have to be separated with spaces
* Only type of operation can be used at same time

### Examples:
```shell
> npx simple-calc 3 + 3 + 15
21

> npx simple-calc 3 + 3 + -15
-9

> npx simple-calc 42.5 - 3 - -27
66.5

> npx simple-calc 3.141 "*" 2 "*" 5
31.41

> npx simple-calc 42 / -3 / 2
-7
```

Literal operators also supported:
```shell
> npx simple-calc 3 add 3 add 15
21

> npx simple-calc 3 add 3 add -15
-9

> npx simple-calc 42.5 sub 3 sub -27
66.5

> npx simple-calc 3.141 mul 2 mul 5
31.41

> npx simple-calc 42 div -3 div 2
-7
```
