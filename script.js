
// set the dimensions and margins of the graph
var margin = { top: 100, right: 30, bottom: 60, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

svg.append('text')
    .text("Traffic flow at YuanShan on Oct. 29th, 2020, 11:00pm-12:00pm")
    .attr('x', 150)
    .attr('y', -20)
    .attr('font-size', 14)

// Add a tooltip div. Here I define the general feature of the tooltip: stuff that do not depend on the data point.
// Its opacity is set to 0: we don't see it by default.
// var tooltip = d3.select("#my_dataviz")
//     .append("div")
//     .style("opacity", 0)
//     .attr("class", "tooltip")
//     .style("background-color", "#dedede")
//     .style("border", "solid")
//     .style("border-width", "0")
//     .style("border-radius", "10px")
//     .style("padding", "10px")
//     .style("position", 'absolute')
//     .style("font-size", "12px")
//     .style("font-family", "Helvetica")

// A function that change this tooltip when the user hover a point.
// Its opacity is set to 1: we can now see it. Plus it set the text and position of tooltip depending on the datapoint (d)
// var mouseover = function (d) {
//     tooltip
//         .style("opacity", 1)
// }

// var mousemove = function (d) {
//     console.log(d3.mouse(this))
//     tooltip
//         .html("Emissions: "+d.value)

//         .style("left", (d3.mouse(this)[0] + 90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
//         .style("top", (d3.mouse(this)[1]) + "px")
// }

// A function that change this tooltip when the leaves a point: just need to set opacity to 0 again
// var mouseleave = function (d) {
//     tooltip
//         .transition()
//         .duration(200)
//         .style("opacity", 0)
// }

//Read the data
d3.csv("flow_yuan.csv",

    // When reading the csv, I must format variables:
    function (d) {
        return { time: d3.timeParse("%Y-%m-%d %H:%M:%S")(d.time), flow: d.flow }
    },

    // Now I can use this dataset:
    function (data) {
        console.log(data)

        // Add X axis --> it is a date format
        var x = d3.scaleTime()
            .domain(d3.extent(data, function (d) { return d.time; }))
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        // Add Y axis
        var y = d3.scaleLinear()
            .domain([0, d3.max(data, function (d) { return +d.flow; })])
            .range([height, 0]);
        svg.append("g")
            .call(d3.axisLeft(y));

        // Add the line
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 3)
            .attr("d", d3.line()
                .x(function (d) { return x(d.time) })
                .y(function (d) { return y(d.flow) })
            )

        // Add dots
        // svg.append('g')
        //     .selectAll("dot")
        //     .data(data)
        //     // .data(data.filter(function (d, i) { return i < 50 })) // the .filter part is just to keep a few dots on the chart, not all of them
        //     .enter()
        //     .append("circle")
        //     .attr("cx", function (d) { return x(d.time); })
        //     .attr("cy", function (d) { return y(d.flow); })
        //     .attr("r", 5)
        //     .style("fill", "#69b3a2")
        //     .style("opacity", 0.5)
        //     .style("stroke", "white")
        // .on("mouseover", mouseover)
        // .on("mousemove", mousemove)
        // .on("mouseleave", mouseleave)

        // svg.append("text")
        //     .attr("x", (width / 2))
        //     .attr("y", 0 - (margin.top / 2))
        //     .attr("text-anchor", "middle")
        //     .style("font-size", "12px")
        //     // .style("text-decoration", "underline")
        //     .style("font-family", "Helvetica")
        //     .text("CO2 emissions in Taiwan from 1970-2012");

        // svg.append("text")
        //     .attr("x", (width / 2))
        //     .attr("y", height + 40)
        //     .attr("text-anchor", "middle")
        //     .style("font-size", "12px")
        //     // .style("text-decoration", "underline")
        //     .style("font-family", "Helvetica")
        //     .text("Year");

        // svg.append("text")
        //     .attr("x", 0 - margin.left / 2 + 10)
        //     .attr("y", 0 - (margin.top / 2) + 10)
        //     .attr("text-anchor", "middle")
        //     .style("font-size", "10px")
        //     // .style("text-decoration", "underline")
        //     .style("font-family", "Helvetica")
        //     .text("CO2 emissions");


    })
