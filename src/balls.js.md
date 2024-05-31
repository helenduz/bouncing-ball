##  Ball Animation with Memory Visualization 

This code implements a simple animation of bouncing balls within an SVG container. The ball size dynamically adjusts to reflect the current memory usage of the JavaScript application.  Users can interact with the animation by clicking on balls to change their color.

### Table of Contents

| Section                        | Description                                                                                                                    |
|---------------------------------|---------------------------------------------------------------------------------------------------------------------------------|
| [Global Variables](#global-variables) | Variables that store global state, such as the SVG element, animation tickers, and ball data.                                   |
| [Constants](#constants)          | Predefined values used throughout the code, like colors, refresh intervals, and maximum speeds.                              |
| [Functions](#functions)          | Functions that handle various aspects of the animation, including initialization, data updates, collisions, and rendering. |


### Global Variables 

* `svg`:  An SVG element representing the container for the bouncing balls.
* `ticker`: A `d3.interval` object used to control the animation loop.
* `memoryUpdateTicker`: A `d3.interval` object used to update the ball radii based on memory usage.
* `animationStatus`: A flag indicating whether the animation is active (1) or stopped (0). 
* `ballsData`: An array containing data for each ball, including its position, velocity, radius, and color.
* `containerId`:  The ID of the HTML element that will contain the SVG.
* `container`: The HTML element that will contain the SVG.
* `containerHeight`: The height of the container.
* `containerWidth`: The width of the container.

### Constants

* `COLORS_ARRAY`: An array of colors used to assign to the balls.
* `REFRESH_INTERVAL`: The time interval in milliseconds between animation frames.
* `MEMORY_UPDATE_INTERVAL`: The time interval in milliseconds for updating the ball radius based on memory usage.
* `MAX_SPEED`: The maximum speed of the balls in pixels per `REFRESH_INTERVAL`.
* `INITIAL_NUM_BALLS`: The initial number of balls in the animation.
* `MAX_RADIUS`:  The maximum radius of the balls in pixels.

### Functions

#### `getRadiusByMemoryUsage()`

This function calculates the radius of a ball based on the current memory usage.  

* It retrieves the total and used JavaScript heap sizes from `window.performance.memory`.
* It calculates the ratio of used heap to total heap.
* This ratio is then used to determine a proportional radius value within the range of `0` to `MAX_RADIUS`.
* Finally, it updates a memory display element on the page with the current memory usage in MB.

#### `initialize()`

This function initializes the animation by creating the SVG element, generating the initial ball data, and attaching an event listener for click interactions.

* It creates an SVG element with the dimensions of the container and appends it to the container. 
* It calls `initializeBallsData()` to populate the `ballsData` array with initial ball information.
* It adds a click event listener to the SVG element, which calls `processColorChanges()` to handle color changes based on click locations.

#### `initializeBallsData()`

This function initializes the `ballsData` array with data for the initial set of balls. 

* It creates `INITIAL_NUM_BALLS` ball objects.
* Each ball object is assigned a unique ID, random initial position within the container, random velocity (within the limits of `MAX_SPEED`), and an initial radius based on memory usage using `getRadiusByMemoryUsage()`.

#### `updateData()`

This function updates the position and velocity of each ball in the `ballsData` array, taking into account collisions with walls and other balls.

* It iterates through each ball in the `ballsData` array.
* For each ball, it checks if it will collide with any of the container walls. If so, the ball's velocity component is reversed to reflect the bounce.
* The ball's position is then updated based on its current velocity. 
* It calls `processCollisions()` to check for collisions between pairs of balls.

#### `processCollisions()`

This function checks for collisions between pairs of balls and updates their velocities accordingly.

* It uses a nested loop to compare every pair of balls.
* The `pairCollides()` function is used to determine if two balls are colliding.
* If two balls collide, their velocities are swapped to simulate a bounce.
* To prevent balls from becoming stuck inside each other, their positions are adjusted until they are no longer colliding.

#### `pairCollides()`

This function determines if two balls are colliding based on their distance.

* It calculates the distance between the centers of the two balls.
* It compares the distance to twice the ball radius.
* If the distance is less than or equal to twice the ball radius, the balls are colliding and the function returns `true`. Otherwise, it returns `false`. 

#### `processColorChanges()`

This function processes color changes for balls based on click events.

* It iterates through each ball in the `ballsData` array.
* It calculates the distance between the click coordinates and the center of each ball.
* If the click is within a certain distance from the ball's center (1.3 times the radius), it calls `shiftBallColor()` to change the ball's color and then exits the function, only processing one click per event.

#### `shiftBallColor()`

This function changes the color of a ball by selecting a new color from the `COLORS_ARRAY` that is different from the current color.

* It retrieves the ball's current color from the `ballsData` array.
* It randomly selects a new color from the `COLORS_ARRAY`.
* It continues to randomly select new colors until it finds a color that is different from the ball's current color.
* It updates the ball's color in the `ballsData` array with the new color.

#### `redraw()`

This function redraws the balls on the SVG based on the data in the `ballsData` array.

* It uses `d3.selectAll()` to select all the circle elements in the SVG.
* It uses `d3.data()` to bind the data from the `ballsData` array to the circle elements.
* It uses `d3.join()` to handle entering, updating, and exiting circles. 
* The `attr()` method is used to set the attributes of the circle elements (cx, cy, r, fill) based on the corresponding data in the `ballsData` array.

#### `transition()`

This function updates the animation by redrawing the balls and updating their data.

* It calls `redraw()` to update the visual representation of the balls on the SVG.
* It calls `updateData()` to update the position and velocity of the balls.

#### `redrawWithMemoryRadius()`

This function updates the ball radii based on the current memory usage.

* It iterates through the `ballsData` array and updates the `radius` property of each ball object using the `getRadiusByMemoryUsage()` function. 
* It calls `redraw()` to update the visual representation of the balls with the new radii.

#### `start()`

This function starts the animation, initializes the SVG, and sets up event listeners for keyboard interactions.

* It calls `initialize()` to set up the initial state of the animation.
* It starts the animation loop using `d3.interval()` with a `REFRESH_INTERVAL` of 30 milliseconds.
* It starts a timer using `d3.interval()` with a `MEMORY_UPDATE_INTERVAL` of 10000 milliseconds to update the ball radii based on memory usage.
* It sets the `animationStatus` flag to 1, indicating that the animation is running.
* It adds a keydown event listener to the body element to allow users to start and stop the animation using the space bar. 
* If the animation is stopped, pressing the space bar restarts the animation tickers.
* If the animation is running, pressing the space bar stops the animation tickers. 
