##  getRandomInt Function Documentation 

**Table of Contents**

* [Overview](#overview)
* [Usage](#usage)
* [Parameters](#parameters)
* [Return Value](#return-value)
* [Example](#example)

###  Overview <a name="overview"></a> 

The `getRandomInt` function generates a random integer between two specified bounds (inclusive). 

### Usage <a name="usage"></a> 

The function can be used to generate random numbers for various purposes, such as:

* Simulating random events 🎲
* Generating random data for testing purposes 🧪
* Creating games with randomized elements 🎮

### Parameters <a name="parameters"></a> 

| Parameter | Type | Description |
|---|---|---|
| `min` | Number | The minimum value (inclusive) of the random number. |
| `max` | Number | The maximum value (inclusive) of the random number. |

### Return Value <a name="return-value"></a> 

The function returns a random integer between `min` and `max` (inclusive). The returned value will never be 0.

### Example <a name="example"></a> 

```javascript
import { getRandomInt } from './random-utils';

const randomNumber = getRandomInt(1, 10); // Generates a random number between 1 and 10 (inclusive)

console.log(randomNumber); // Output: A random number between 1 and 10 (inclusive)
``` 
