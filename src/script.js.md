## Bouncing Balls 🏀

This code implements a simple animation of bouncing balls within a defined container. 

### Table of Contents 📑

1.  **Global Variables** 🌎
2.  **Initialization** 🏗️
3.  **Ball Data** 📊
4.  **Update Logic** 🔄
5.  **Collision Detection** 💥
6.  **Color Change on Click** 🖱️
7.  **Redraw Function** 🎨
8.  **Animation Loop** 🔁

### 1. Global Variables 🌎

This section defines variables that are accessible throughout the code.

| Variable Name     | Description                                                                 | Data Type     |
| :---------------- | :--------------------------------------------------------------------------- | :------------- |
| `svg`            | An SVG element representing the canvas for the bouncing balls.              | `d3.selection` |
| `ballsData`       | An array containing data for each ball, such as position, velocity, and color. | `array`        |
| `containerId`    | The ID of the HTML element that will contain the SVG canvas.                 | `string`       |
| `container`      | The HTML element itself.                                                     | `HTMLElement`   |
| `containerHeight` | The height of the container.                                                 | `number`       |
| `containerWidth`  | The width of the container.                                                  | `number`       |
| `colorsArray`    | An array of color strings used for the balls.                               | `array`        |
| `REFRESH_INTERVAL` | The interval in milliseconds at which the animation updates.              | `number`       |
| `MAX_SPEED`       | The maximum speed of a ball in pixels per `REFRESH_INTERVAL`.                 | `number`       |
| `NUM_BALLS`       | The number of balls in the animation.                                         | `number`       |
| `RADIUS`          | The radius of each ball in pixels.                                           | `number`       |

### 2. Initialization 🏗️

The `initialize()` function sets up the initial state of the animation.

-   Creates an SVG canvas with the dimensions of the container.
-   Initializes the `ballsData` array with the specified number of balls.
-   Attaches a click event listener to the SVG canvas to handle color changes.
-   Appends the SVG canvas to the container element.

### 3. Ball Data 📊

The `initializeBallsData()` function populates the `ballsData` array.

-   Each ball is represented as an object with the following properties:
    -   `id`: A unique identifier for the ball.
    -   `radius`: The radius of the ball.
    -   `x`: The x-coordinate of the ball's center.
    -   `y`: The y-coordinate of the ball's center.
    -   `dx`: The horizontal velocity of the ball.
    -   `dy`: The vertical velocity of the ball.
    -   `color`: The color of the ball.
-   The initial position, velocity, and color of each ball are randomly generated within defined limits.

### 4. Update Logic 🔄

The `updateData()` function updates the position and velocity of each ball for each frame of the animation.

-   For each ball, it checks if it collides with the walls of the container. If so, it reverses the ball's velocity in the corresponding direction.
-   It then calculates the ball's next position based on its current velocity.
-   It then calls the `processCollisions()` function to check for collisions between pairs of balls.

### 5. Collision Detection 💥

The `processCollisions()` function checks for collisions between pairs of balls and updates their velocities accordingly.

-   It iterates through all pairs of balls and uses the `pairCollides()` function to determine if they are colliding.
-   If a collision is detected, it swaps the horizontal and vertical velocities of the two balls to simulate a bounce.
-   It then ensures that the balls are not overlapping by moving them apart until they are no longer colliding.

### 6. Color Change on Click 🖱️

The `processColorChanges()` function handles color changes when the user clicks on the canvas.

-   It iterates through the `ballsData` array and calculates the distance between the click point and the center of each ball.
-   If the distance is within a certain threshold, it calls the `shiftBallColor()` function to change the color of the corresponding ball.
-   It then returns to prevent multiple color changes from a single click.

### 7. Redraw Function 🎨

The `redraw()` function redraws all the balls on the SVG canvas based on their updated data.

-   It selects all the circle elements on the canvas and binds them to the `ballsData` array.
-   It then updates the `cx`, `cy`, `r`, and `fill` attributes of each circle element based on the corresponding ball data.

### 8. Animation Loop 🔁

The `transition()` function updates the data for all balls and redraws them on the canvas.

-   It calls the `updateData()` function to update the ball data.
-   It then calls the `redraw()` function to redraw the balls on the canvas.

The `start()` function initializes the animation and starts the animation loop.

-   It calls the `initialize()` function to set up the initial state.
-   It then uses the `d3.interval()` function to call the `transition()` function at the specified `REFRESH_INTERVAL`.
