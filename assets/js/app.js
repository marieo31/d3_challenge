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
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Scaling funtions



// Retrieve data from the csv file
d3.csv("assets/data/data.csv", function(err, stateData){
// d3.csv("donuts.csv", function(err, stateData){
    if (err) throw err;

    console.log("blabla")
    console.log(stateData)
    

    // Parsing the data
    stateData.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age
    })

    console.log(stateData[1])
})