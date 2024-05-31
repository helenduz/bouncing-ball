# D3 Import Module

## Table of Contents

* [Overview](#overview)
* [Usage](#usage)
* [Example](#example)

## Overview

This module provides a convenient way to import the D3.js library into your project. It uses the `import * as` syntax to import all of the D3.js functionality under the `d3` namespace.

## Usage

To use this module, simply import it into your project:

```javascript
import { d3 } from './d3.js'; // Assuming this module is named 'd3.js'
```

Once imported, you can access all of the D3.js functionality using the `d3` object. For example, to select an HTML element:

```javascript
const myElement = d3.select("#myElement");
```

## Example

Here is a simple example of how to use this module to create a basic bar chart:

```javascript
import { d3 } from './d3.js'; 

const data = [10, 20, 30];

const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3.scaleBand().rangeRound([0, width]).padding(0.1);
const yScale = d3.scaleLinear().rangeRound([height, 0]);

xScale.domain(data.map((d, i) => i));
yScale.domain([0, d3.max(data)]);

svg.append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

svg.append("g")
  .attr("class", "y axis")
  .call(d3.axisLeft(yScale))
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", ".71em")
  .style("text-anchor", "end")
  .text("Value");

svg.selectAll(".bar")
  .data(data)
  .enter().append("rect")
  .attr("class", "bar")
  .attr("x", (d, i) => xScale(i))
  .attr("y", d => yScale(d))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - yScale(d));
```

This code will create a simple bar chart with three bars, representing the values in the `data` array. 
