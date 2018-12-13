// @TODO: YOUR CODE HERE!


// Sizing parameters
//------------------
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG wrapper
//------------
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);


// Scaling funtions
//-----------------

// Initial chosen axis
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare"

// function used for updating x-scale var upon click on axis label
function xScale(data, chosenXAxis){
  // create x-scale
  var xLinearScale = d3.scaleLinear()
    .domain([
      d3.min(data, d => d[chosenXAxis])*0.8,
      d3.max(data, d => d[chosenXAxis])*1.2
    ])
    .range([0, width]);
  return xLinearScale
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis){
  // create x-scale
  var xLinearScale = d3.scaleLinear()
    .domain([
      d3.min(data, d => d[chosenYAxis])*0.8,
      d3.max(data, d => d[chosenYAxis])*1.2
    ])
    .range([height, 0]);
  return xLinearScale
}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

//



// Retrieve data from the csv file
// --------------------------------
d3.csv("assets/data/data.csv", function(err, stateData){
// d3.csv("donuts.csv", function(err, stateData){
    if (err) throw err;

    // Parse the data
    stateData.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age
        // data.abbr = data.abbr+"b"
        // console.log(data.abbr)
    })

    console.log(stateData[0])

    // Create x-Scale
    var xLinearScale = xScale(stateData, chosenXAxis);
    
    // Create y-Scale
    var yLinearScale = yScale(stateData, chosenYAxis);

    // Create initial axis funtion
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    // append y axis
    chartGroup.append("g")
      .call(leftAxis);    

    // append Circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(stateData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 15)
      .attr("fill", "blue")
      .attr("opacity", ".7");

    // append text into the circles
    
    var abbrGroup = chartGroup.append("g")

      abbrGroup.selectAll("text")
      .data(stateData)
      .enter()
      .append("text")    
      .attr("dx", d => xLinearScale(d[chosenXAxis]))
      .attr("dy", d => yLinearScale(d[chosenYAxis])+5)
      .attr("font-size", 12)
      .classed("stateText", true)
      .text(d => d.abbr)

    // console.log(stateData)


    // console.log(xLinearScale)
    // console.log(circlesGroup)
})