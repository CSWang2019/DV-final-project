        // set the dimensions and margins of the graph
        var margin = { top: 30, right: 200, bottom: 60, left: 60 },
            width = 800 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        // append the svg object to the body of the page
        var svg = d3.select("#my_dataviz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        //Read the data
        d3.csv("multi_flow.csv",

            // When reading the csv, I must format variables:
            function (d) {


                return { date: d3.timeParse("%Y-%m-%d %H:%M:%S")(d.date), value: d.value, city: d.city }
            },

            // Now I can use this dataset:
            function (data) {

                // group the data: I want to draw one line per group
                var sumstat = d3.nest() // nest function allows to group the calculation per level of a factor
                    .key(function (d) { return d.city; })
                    .entries(data);


                // color palette
                var res = sumstat.map(function (d) { return d.key }) // list of group names
                var color = d3.scaleOrdinal()
                    .domain(res)
                    .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#a65628', '#f781bf', '#999999'])


                // Add X axis --> it is a date format
                var x = d3.scaleTime()
                    .domain(d3.extent(data, function (d) { return d.date; }))
                    .range([0, width]);
                svg.append("g")
                    .attr("transform", "translate(0," + height + ")")
                    .call(d3.axisBottom(x));

                // Add Y axis
                var y = d3.scaleLinear()
                    .domain([0, d3.max(data, function (d) { return +d.value; })])
                    .range([height, 0]);

                svg.append("g")
                    .call(d3.axisLeft(y));


                // // gridlines in y axis function
                // function make_y_gridlines() {
                //     return d3.axisLeft(y)
                //         .ticks(5)
                // }
                // // add the Y gridlines
                // svg.append("g")
                //     .attr("class", "grid")
                //     .call(make_y_gridlines()
                //         .tickSize(-width)
                //         .tickFormat("")
                //     )

                // Draw the line
                svg.selectAll(".line")
                    .data(sumstat)
                    .enter()
                    .append("path")
                    .attr("fill", "none")
                    .attr("stroke", function (d) { return color(d.key) })
                    .attr("stroke-width", 1.5)
                    .attr("d", function (d) {
                        return d3.line()
                            .x(function (d) { return x(d.date); })
                            .y(function (d) { return y(+d.value); })
                            (d.values)
                    })

                svg.append("text")
                    .attr("x", (width / 2))
                    .attr("y", 0 - (margin.top / 2))
                    .attr("text-anchor", "middle")
                    .style("font-size", "12px")
                    // .style("text-decoration", "underline")
                    .style("font-family", "Helvetica")
                    .text("Taiwan's Highway Traffic Flow on 15th Oct.");

                // svg.append("text")
                //     .attr("x", (width / 2))
                //     .attr("y", height + 30)
                //     .attr("text-anchor", "middle")
                //     .style("font-size", "10px")
                //     // .style("text-decoration", "underline")
                //     .style("font-family", "Helvetica")
                //     .text("time");

                svg.append("text")
                    .attr("x", (width / 2) + 20)
                    .attr("y", height - 25)
                    .attr("text-anchor", "left")
                    .style("font-size", "10px")
                    // .style("text-decoration", "underline")
                    .style("font-family", "Helvetica")
                    .text("Source: Taiwan Freeway Bureau, MOTC");

                svg.append("text")
                    .attr("x", (width / 2) + 58)
                    .attr("y", height - 12)
                    .attr("text-anchor", "left")
                    .style("font-size", "10px")
                    // .style("text-decoration", "underline")
                    .style("font-family", "Helvetica")
                    .attr("class", "website")
                    .text("https://tisvcloud.freeway.gov.tw")
                    .on("click", function () { window.open("https://tisvcloud.freeway.gov.tw"); });

                svg.append("text")
                    .attr("x", 0 - margin.left / 2 + 10)
                    .attr("y", 0 - (margin.top / 2) + 18)
                    .attr("text-anchor", "middle")
                    .style("font-size", "10px")
                    // .style("text-decoration", "underline")
                    .style("font-family", "Helvetica")
                    .text("cars");





                var list = []

                for (var i = 0; i < data.length; i++) {
                    if (i % 24 == 23) {
                        list.push({ city: data[i].city, date: data[i].date, value: data[i].value })
                    }
                }
                console.log(list)
                // console.log(dataReady)
                // Add a legend at the end of each line
                svg
                    .selectAll("myLabels")
                    .data(list)
                    .enter()
                    .append('g')
                    .append("text")
                    // .datum(function (d) { return { country: d.country, value: v }; }) // keep only the last value of each time series
                    .attr("transform", function (d) { console.log(d); return "translate(" + x(d.date) + "," + y(d.value) + ")"; }) // Put the text at the position of the last point
                    .attr("x", 12) // shift the text a bit more right
                    .text(function (d) { return d.city; })
                    .style("fill", function (d) { return color(d.city) })
                    .style("font-size", 10)

            })