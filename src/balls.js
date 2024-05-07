import { d3 } from "./d3-config.js";
import { getRandomInt } from "./utils.js";

// Global variables
let svg;
let ticker = null;
let memoryUpdateTicker = null;
let animationStatus = null; // 0 = off/stopped, 1 = on/started
const ballsData = [];
const containerId = "container";
const container = document.getElementById(containerId);
const containerHeight = container.clientHeight;
const containerWidth = container.clientWidth;

// Constants
const COLORS_ARRAY = [
    "#a5dee5",
    "#e0f9b5",
    "#fefdca",
    "#ffcfdf",
    "#61c0bf",
    "#bbded6",
    "#fae3d9",
    "#ffb6b9",
    "#ffaaa5",
    "#ffd3b6",
    "#dcedc1",
    "#a8e6cf",
    "#cca8e9",
    "#c3bef0",
    "#cadefc",
    "#defcf9",
];
const REFRESH_INTERVAL = 30; // milliseconds
const MEMORY_UPDATE_INTERVAL = 10000; // milliseconds
const MAX_SPEED = 5; // unit is pixels per REFRESH_INTERVAL
const INITIAL_NUM_BALLS = 20;
const MAX_RADIUS = 40;

/**
 * Calculates the radius of the ball based on memory usage.
 * @returns {number} The radius of the ball.
 */
const getRadiusByMemoryUsage = () => {
    const memory = window.performance.memory;
    const totalJSHeapSize = memory.totalJSHeapSize;
    const usedJSHeapSize = memory.usedJSHeapSize;
    const radius = Math.floor((usedJSHeapSize / totalJSHeapSize) * MAX_RADIUS);
    const memoryInMB = (usedJSHeapSize / 1024 / 1024).toFixed(2);
    document.getElementById(
        "memoryDisplay"
    ).innerHTML = `This JavaScript application is taking up ${memoryInMB} MB of memory (updated every ${Math.floor(
        MEMORY_UPDATE_INTERVAL / 1000
    )} seconds)`;
    return radius;
};

/**
 * Initializes the SVG, ball data, and draws the balls.
 */
const initialize = () => {
    svg = d3
        .create("svg")
        .attr("width", containerWidth)
        .attr("height", containerHeight);

    initializeBallsData();

    // Set up click event listener to change color of ball
    svg.on("click", function (event) {
        const clickCoords = d3.pointer(event);
        processColorChanges(clickCoords);
    });

    container.append(svg.node());
};

/**
 * Initializes the ball data with random speed and a fixed initial radius.
 */
const initializeBallsData = () => {
    for (let i = 0; i < INITIAL_NUM_BALLS; i++) {
        const initialRadius = getRadiusByMemoryUsage();
        ballsData.push({
            id: "n" + i.toString(),
            radius: initialRadius,
            x: getRandomInt(0 + initialRadius, containerWidth - initialRadius),
            y: getRandomInt(0 + initialRadius, containerHeight - initialRadius),
            dx: getRandomInt(-MAX_SPEED, MAX_SPEED),
            dy: getRandomInt(-MAX_SPEED, MAX_SPEED),
            color: COLORS_ARRAY[0],
        });
    }
};

/**
 * Updates the ball data by calculating the next position of the balls and checking for collisions.
 */
const updateData = () => {
    for (let i = 0; i < ballsData.length; i++) {
        const ballRadius = ballsData[i].radius;

        // Check if ball will collide with wall, if so, reverse direction
        if (
            ballsData[i].x + ballRadius >= containerWidth ||
            ballsData[i].x - ballRadius <= 0
        ) {
            ballsData[i].dx *= -1;
        }
        if (
            ballsData[i].y + ballRadius >= containerHeight ||
            ballsData[i].y - ballRadius <= 0
        ) {
            ballsData[i].dy *= -1;
        }

        // Calculate next position, push ball away from wall until not colliding
        while (
            ballsData[i].x + ballRadius >= containerWidth ||
            ballsData[i].x - ballRadius <= 0
        ) {
            ballsData[i].x += ballsData[i].dx;
        }
        while (
            ballsData[i].y + ballRadius >= containerHeight ||
            ballsData[i].y - ballRadius <= 0
        ) {
            ballsData[i].y += ballsData[i].dy;
        }

        ballsData[i].x += ballsData[i].dx;
        ballsData[i].y += ballsData[i].dy;
    }

    processCollisions();
};

/**
 * Checks if any pairs of balls collide and updates their velocities accordingly.
 */
const processCollisions = () => {
    for (let i = 0; i < ballsData.length; i++) {
        for (let j = i + 1; j < ballsData.length; j++) {
            const ballRadius = ballsData[i].radius;
            const ball1 = ballsData[i];
            const ball2 = ballsData[j];

            if (pairCollides(ball1.x, ball1.y, ball2.x, ball2.y, ballRadius)) {
                // Update velocities (the physics is only approximate here)
                const ux1 = ball1.dx;
                const uy1 = ball1.dy;
                ball1.dx = ball2.dx;
                ball2.dx = ux1;
                ball1.dy = ball2.dy;
                ball2.dy = uy1;

                // To ensure one ball is not inside the other, push them apart until not colliding
                while (
                    pairCollides(ball1.x, ball1.y, ball2.x, ball2.y, ballRadius)
                ) {
                    ball1.x += ball1.dx;
                    ball1.y += ball1.dy;

                    ball2.x += ball2.dx;
                    ball2.y += ball2.dy;
                }
            }
        }
    }
};

/**
 * Checks if a pair of balls collide.
 * @param {number} x1 - The x-coordinate of the first ball.
 * @param {number} y1 - The y-coordinate of the first ball.
 * @param {number} x2 - The x-coordinate of the second ball.
 * @param {number} y2 - The y-coordinate of the second ball.
 * @param {number} ballRadius - The radius of the balls.
 * @returns {boolean} True if the balls collide, false otherwise.
 */
const pairCollides = (x1, y1, x2, y2, ballRadius) => {
    const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    return dist <= 2 * ballRadius;
};

/**
 * Processes color changes of the balls based on click coordinates.
 * @param {number[]} clickCoords - The coordinates of the click event.
 */
const processColorChanges = (clickCoords) => {
    for (let i = 0; i < ballsData.length; i++) {
        // Calculate click location's distance from current circle's center
        const x1 = ballsData[i].x;
        const y1 = ballsData[i].y;
        const x2 = clickCoords[0];
        const y2 = clickCoords[1];
        const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);

        if (dist <= 1.3 * ballsData[i].radius) {
            shiftBallColor(i);
            return; // Only process one click
        }
    }
};

/**
 * Shifts the color of a ball.
 * @param {number} i - The index of the ball in the ballsData array.
 */
const shiftBallColor = (i) => {
    const curColor = ballsData[i].color;
    let newColor = COLORS_ARRAY[getRandomInt(0, COLORS_ARRAY.length - 1)];

    while (newColor === curColor) {
        newColor = COLORS_ARRAY[getRandomInt(0, COLORS_ARRAY.length - 1)];
    }

    ballsData[i].color = newColor;
};

/**
 * Redraws the balls on the SVG.
 */
const redraw = () => {
    svg.selectAll("circle")
        .data(ballsData, (d) => d.id)
        .join(
            (enter) => enter.append("circle"),
            (update) => update,
            (exit) => exit.remove()
        )
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.radius)
        .attr("fill", (d) => d.color);
};

/**
 * Performs the transition of the balls.
 */
const transition = () => {
    redraw();
    updateData();
};

/**
 * Redraws the balls with updated radius based on memory usage.
 */
const redrawWithMemoryRadius = () => {
    for (let i = 0; i < ballsData.length; i++) {
        ballsData[i].radius = getRadiusByMemoryUsage();
    }
    redraw();
};

/**
 * Starts the animation.
 */
const start = () => {
    initialize();
    ticker = d3.interval(transition, REFRESH_INTERVAL);
    memoryUpdateTicker = d3.interval(
        redrawWithMemoryRadius,
        MEMORY_UPDATE_INTERVAL
    );
    animationStatus = 1;

    // Listen to keyboard press to start/stop game
    d3.select("body").on("keydown", (event) => {
        if (event.code === "Space") {
            if (animationStatus === 0) {
                // Currently stopped, so restart ticker
                ticker = d3.interval(transition, REFRESH_INTERVAL);
                memoryUpdateTicker = d3.interval(
                    redrawWithMemoryRadius,
                    MEMORY_UPDATE_INTERVAL
                );
                animationStatus = 1;
            } else {
                // Currently started, so stop ticker
                ticker.stop();
                memoryUpdateTicker.stop();
                animationStatus = 0;
            }
        }
    });
};

start();
