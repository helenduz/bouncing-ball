import { d3 } from "./d3-config.js";
import { getRandomInt } from "./utils.js";

// global variables
var svg;
var ballsData = [];
var ticker = null;
var memoryUpdateTicker = null;
var animationStatus = null; // 0 = off/stopped, 1 = on/started
const containerId = "container";
const container = document.getElementById(containerId);
const containerHeight = container.clientHeight;
const containerWidth = container.clientWidth;

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
const REFRESH_INTERVAL = 30; // millisecond
const MEMORY_UPDATE_INTERVAL = 10000; // millisecond
const MAX_SPEED = 5; // unit: pixels per REFRESH_INTERVAL
const INITIAL_NUM_BALLS = 20;
const MAX_RADIUS = 60;
const INITIAL_RADIUS = 20;

const getRadiusByMemoryUsage = () => {
    const memory = window.performance.memory;
    const totalJSHeapSize = memory.totalJSHeapSize;
    const usedJSHeapSize = memory.usedJSHeapSize;
    const radius = Math.floor((usedJSHeapSize / totalJSHeapSize) * MAX_RADIUS);
    return radius;
};

// initialize canvas, balls data, draw balls, calls update with time interval
const initialize = () => {
    console.log(window.performance);
    svg = d3
        .create("svg")
        .attr("width", containerWidth)
        .attr("height", containerHeight);
    initializeBallsData();
    // set up click event listener to change color of ball
    svg.on("click", function (event) {
        var clickCoords = d3.pointer(event);
        processColorChanges(clickCoords);
    });
    container.append(svg.node());
};

const initializeBallsData = () => {
    for (var i = 0; i < INITIAL_NUM_BALLS; i++) {
        ballsData.push({
            id: "n" + i.toString(),
            radius: INITIAL_RADIUS,
            x: getRandomInt(
                0 + INITIAL_RADIUS,
                containerWidth - INITIAL_RADIUS
            ),
            y: getRandomInt(
                0 + INITIAL_RADIUS,
                containerHeight - INITIAL_RADIUS
            ),
            dx: getRandomInt(-MAX_SPEED, MAX_SPEED),
            dy: getRandomInt(-MAX_SPEED, MAX_SPEED),
            color: COLORS_ARRAY[0],
        });
    }
};

// function to update balls data
const updateData = () => {
    for (let i = 0; i < ballsData.length; i++) {
        const ballRadius = ballsData[i].radius;
        // check if ball will collide with wall
        // if so, reverse direction
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
        // calculate next position
        // push ball away from wall until not colliding
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

// function to check if any pairs of balls collide and update their velocities accordingly
const processCollisions = () => {
    for (var i = 0; i < ballsData.length; i++) {
        for (var j = i + 1; j < ballsData.length; j++) {
            const ballRadius = ballsData[i].radius;
            const ball1 = ballsData[i];
            const ball2 = ballsData[j];
            if (pairCollides(ball1.x, ball1.y, ball2.x, ball2.y, ballRadius)) {
                // update velocities (physics is only approximate here)
                const ux1 = ball1.dx;
                const uy1 = ball1.dy;
                ball1.dx = ball2.dx;
                ball2.dx = ux1;
                ball1.dy = ball2.dy;
                ball2.dy = uy1;
                // ensure one ball is not inside the other: we push them apart till not colliding
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

const pairCollides = (x1, y1, x2, y2, ballRadius) => {
    const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
    return dist <= 2 * ballRadius;
};

const processColorChanges = (clickCoords) => {
    for (var i = 0; i < ballsData.length; i++) {
        // calculate click location's distance from current circle's center
        const x1 = ballsData[i].x;
        const y1 = ballsData[i].y;
        const x2 = clickCoords[0];
        const y2 = clickCoords[1];
        const dist = Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
        if (dist <= 1.3 * ballsData[i].radius) {
            shiftBallColor(i);
            return; // only process one click
        }
    }
};

const shiftBallColor = (i) => {
    const curColor = ballsData[i].color;
    var newColor = COLORS_ARRAY[getRandomInt(0, COLORS_ARRAY.length - 1)];
    while (newColor === curColor) {
        newColor = getRandomInt(0, COLORS_ARRAY.length - 1);
    }
    ballsData[i].color = newColor;
};

// function to draw balls on canvas
const redraw = () => {
    svg.selectAll("circle")
        .data(ballsData)
        .join("circle")
        .attr("cx", (d) => d.x)
        .attr("cy", (d) => d.y)
        .attr("r", (d) => d.radius)
        .attr("fill", (d) => d.color);
};

const transition = () => {
    redraw();
    updateData();
};
const redrawWithMemoryRadius = () => {
    for (var i = 0; i < ballsData.length; i++) {
        ballsData[i].radius = getRadiusByMemoryUsage();
    }
    redraw();
};

const start = () => {
    initialize();
    ticker = d3.interval(transition, REFRESH_INTERVAL);
    memoryUpdateTicker = d3.interval(
        redrawWithMemoryRadius,
        MEMORY_UPDATE_INTERVAL
    );
    animationStatus = 1;
    // listen to keyboard press to start/stop game
    d3.select("body").on("keydown", (event) => {
        if (event.code === "Space") {
            if (animationStatus == 0) {
                // currently stopped, so restart ticker
                ticker = d3.interval(transition, REFRESH_INTERVAL);
                memoryUpdateTicker = d3.interval(
                    redrawWithMemoryRadius,
                    MEMORY_UPDATE_INTERVAL
                );
                animationStatus = 1;
            } else {
                // currently started, so stop ticker
                ticker.stop();
                memoryUpdateTicker.stop();
                animationStatus = 0;
            }
        }
    });
};

start();
