// @TODO: YOUR CODE HERE!
// Load dat from health.csv
url = "assets/data/data.csv"

d3.csv(url, d3.autoType).then(function (hData) {
    console.log(hData);
    console.log(hData.columns)
    console.log(hData.length)

    var stateAbbr = hData.map(data => data.abbr);
    console.log("State Abbr: ", stateAbbr)

    var povertyData = hData.map(data => data.poverty);
    console.log("Poverty Percentage: ", povertyData)

    var healthcareData = hData.map(data => data.healthcare);
    console.log("HealthCare: ", healthcareData)

    // All Data is string, Math for poverty and healthcare
    // hData.forEach(data => {
    //     data.poverty = +data.poverty;
    //     console.log("poverty", data.poverty);
    // });
    // hData.forEach(data => {
    //     data.healthcare = +data.healthcare;
    //     console.log("healthcare", data.healthcare);
    // });


    // Create scaler functions
    console.log("min value poverty ", d3.min(povertyData));
    console.log("max value poverty ", d3.max(povertyData));

    console.log("max value healthcare", d3.min(healthcareData));
    console.log("max value healthcare", d3.max(healthcareData));

    console.log("min and max values poverty ", d3.extent(povertyData));
    console.log("min and max values healthcare", d3.extent(healthcareData));

    // Setting Scaler up hard coding
    // var yScale = d3.scaleLinear()
    //     .domain([0, 25])
    //     .range([0, 1000]);

    // console.log(`50 returns ${yScale(10)}`);


    // Set up our chart

    var svgWidth = 800;
    var svgHeight = 600;

    var margin = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50
    };

    var chartWidth = svgWidth - margin.left - margin.right;
    var chartHeight = svgHeight - margin.top - margin.bottom;

    // Create and size the SVG container. Then append,size, and position SVG gorup inside within margin
    var svg = d3.select("#scatter")
        .append("svg")
        .attr("width", svgWidth)
        .attr("height", svgHeight);

    // Make a group so we can shift our margins
    var chartGroup = svg.append("g")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Create scaling functions for x and y
    var xScale = d3.scaleLinear()
        .domain([0, d3.max(hData, d => d.poverty)])
        .range([0, chartWidth]);
    // Create axis functions

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(hData, d => d.healthcare)])
        .range([chartHeight, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xScale);
    var leftAxis = d3.axisLeft(yScale);

    // Add axis
    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`).call(bottomAxis)

    chartGroup.append("g")
        .call(leftAxis);

    var circlesGroup = chartGroup.selectAll("circle")
        .data(hData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.poverty))
        .attr("cy", d => yScale(d.healthcare))
        .attr("r", 10)
        .attr("fill", "lightblue")
        .attr("opacity", ".5")
        .attr("stroke", "white");

    chartGroup.append("text")
        .style("text-anchor", "middle")
        .style("font-family", "sans-serif")
        .style("font-size", "8px")
        .selectAll("tspan")
        .data(hData)
        .enter()
        .append("tspan")
        .attr("x", function (data) {
            return xScale(data.poverty);
        })
        .attr("y", function (data) {
            return yScale(data.healthcare - .02);
        })
        .text(function (data) {
            return data.abbr
        });

    // Initalize Tooltip
    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -70])
        .style("position", "absolute")
        .style("background", "lightsteelblue")
        .style("pointer-events", "none")
        .html(function (d) {
            return (`${d.state}<br>In Poverty (%): ${d.poverty}<br>Lacks Healthcare (%): ${d.healthcare}`)
        });

    // tooltip in the chart
    chartGroup.call(toolTip);

    // Add an onmouseover event to display a tooltip   
    circlesGroup.on("mouseover", function (data) {
        toolTip.show(data, this);
    })

        // Add an on mouseout    
        .on("mouseout", function (data, index) {
            toolTip.hide(data);
        });

    // Create axes labels  
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left - 5)
        .attr("x", 0 - (height / 1.30))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .text("Lacks Healthcare (%)");

    chartGroup.append("text")
        .attr("transform", `translate(${width / 2.5}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .text("In Poverty (%)");





    console.log(`${yScale(healthcareData[0])}`);




}).catch(error => console.log(error));