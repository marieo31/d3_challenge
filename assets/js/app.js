// @TODO: YOUR CODE HERE!


// Sizing parameters
//------------------
var svgWidth = 960;
var svgHeight = 600;

var margin = {
  top: 20,
  right: 40,
  bottom: 100,
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
      d3.min(data, d => d[chosenXAxis])*0.9,//*0.8,
      d3.max(data, d => d[chosenXAxis])*1.1,//*1.2
    ])
    .range([0, width]);
  return xLinearScale
}

// function used for updating y-scale var upon click on axis label
function yScale(data, chosenYAxis){
  // create x-scale
  var yLinearScale = d3.scaleLinear()
    .domain([
      d3.min(data, d => d[chosenYAxis])*0.8,
      d3.max(data, d => d[chosenYAxis])*1.2
    ])
    .range([height, 0]);
  return yLinearScale
}

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
  var leftAxis = d3.axisLeft(newYScale);

  yAxis.transition()
    .duration(1000)
    .call(leftAxis);

  return yAxis;
}

// function used for updating the circles position
function renderCircles(circlesGroup, axis, newScale, chosenAxis){
  circlesGroup.transition()
    .duration(1000)
    .attr("c"+axis, d => newScale(d[chosenAxis]));

  return circlesGroup;
}

// function for updating the text into the circle
function renderAbbr(abbrGroup, axis, newScale, chosenAxis){

    if (axis == "y"){
      abbrGroup.transition()
      .duration(1000)
      .attr("d"+axis, d => newScale(d[chosenAxis])+5);
    }
    else {
      abbrGroup.transition()
      .duration(1000)
      .attr("d"+axis, d => newScale(d[chosenAxis]));
    }
    
  return abbrGroup;
}

// function to retrieve labels and value label for a given chosen axis
function getTipLabel(chosenAxis, value){

  switch (chosenAxis){
    case "healthcare":
      var tipLabel = "Lacks Healthcare: "+value+"%";
      break;
    case "obesity":
      var tipLabel = "Obesity: "+value+"%";
      break;
    case "income":
      var tipLabel = "$"+value+" Income";
      break;
    case "poverty":
      var tipLabel = "Poverty: "+value+"%";
      break;
    case "smokes":
      var tipLabel = "Smoking: "+value+"%";
      break;
    case "age":
      var tipLabel = "Median Age: "+value;

  }
  return tipLabel
}


// function for updating the tooltips
//-----------------------------------
function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis, offsetText=false){

  // Adding an extra offset when the tooltip is on the text inside the bubble
  if (offsetText == true){
    var offval = -17;
  }
  else{
    var offval = -8;
  }

  // creating the tooltip
  var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([offval, 0])
        .html(function(d){
          return (`${d.state}<br>${getTipLabel(chosenXAxis, d[chosenXAxis])}<br>${getTipLabel(chosenYAxis, d[chosenYAxis])}`)
        });     


  // adding it to the circles or abbreviation group
  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data){
    toolTip.show(data);    
  })
  circlesGroup.on("mouseout", function(data){
    toolTip.hide(data);    
  })  

  return circlesGroup;
}


    // create group for the x-axis labels
    var labelsXGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    var povertyLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("In Poverty (%)");

    var ageLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age (Median)");

    var incomeLabel = labelsXGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income") // value to grab for event listener
    .classed("inactive", true)
    .text("Household income (median)");    

    // create group for the y-axis labels
    var labelsYGroup = chartGroup.append("g")    
    .attr("transform", "rotate(-90)")
    
    var healthcareLabel = labelsYGroup.append("text")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")  
      .attr("value", "healthcare")
      .classed("active", true)
      .text("Lacks HealthCare (%)")

    var smokesLabel = labelsYGroup.append("text")
      .attr("y", 20 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")  
      .attr("value", "smokes")
      .classed("inactive", true)
      .text("Smokes (%)")
  

    var obesityLabel = labelsYGroup.append("text")
      .attr("y", 40 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")  
      .attr("value", "obesity")
      .classed("inactive", true)
      .text("Obesity (%)") 



// Retrieve data from the csv file
// --------------------------------
d3.csv("assets/data/data.csv", function(err, stateData){

    if (err) throw err;

    // Parse the data
    stateData.forEach(function(data){
        data.healthcare = +data.healthcare;
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.poverty = +data.poverty;
        data.smokes = +data.smokes;
        data.age = +data.age
    })


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
    var yAxis = chartGroup.append("g")
      .classed("y-axis", true)
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
      .selectAll("text")
      .data(stateData)
      .enter()
      .append("text")    
      .attr("dx", d => xLinearScale(d[chosenXAxis]))
      .attr("dy", d => yLinearScale(d[chosenYAxis])+5)
      .attr("font-size", 12)
      .classed("stateText", true)
      .text(d => d.abbr)

    // Add tooltips
    var circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis )
    var abbrGroup = updateToolTip(abbrGroup, chosenXAxis, chosenYAxis, offset=true )

    // Xaxis event listener
    labelsXGroup.selectAll("text")
      .on("click", function(){
        // get the value of the selection
        let value = d3.select(this).attr("value");
        // console.log(chosenXAxis)
        // console.log(value)
        if (value !== chosenXAxis){
          // replaces chosenXAxis with value
          chosenXAxis = value;

          // update xscale
          xLinearScale = xScale(stateData, chosenXAxis);

          // update x axis
          xAxis = renderXAxes(xLinearScale, xAxis);

          // updqte circles position
          circlesGroup = renderCircles(circlesGroup, "x", xLinearScale, chosenXAxis)

          // update abbr position
          abbrGroup = renderAbbr(abbrGroup, "x", xLinearScale, chosenXAxis)

          // update tooltips
          circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis )
          abbrGroup = updateToolTip(abbrGroup, chosenXAxis, chosenYAxis, offset=true )
      

          // changes classes to change bold text     
          switch(value){
            case "poverty":
              povertyLabel
                .classed("active", true)
                .classed("inactive", false)
              ageLabel
                .classed("active", false)
                .classed("inactive", true)
              incomeLabel
                .classed("active", false)
                .classed("inactive", true)
              break;
            case "age":
              povertyLabel
                .classed("active", false)
                .classed("inactive", true)
              ageLabel
                .classed("active", true)
                .classed("inactive", false)
              incomeLabel
                .classed("active", false)
                .classed("inactive", true)
              break;
            case "income":
              povertyLabel
                .classed("active", false)
                .classed("inactive", true)
              ageLabel
                .classed("active", false)
                .classed("inactive", true)
              incomeLabel
                .classed("active", true)
                .classed("inactive", false) 
              break;               

          }     
        }
      })

    // Yaxis event listener
    labelsYGroup.selectAll("text")
      .on("click", function(){
        // get the value of the selection
        let value = d3.select(this).attr("value");

        if (value !== chosenYAxis){
          // replaces chosenYaxis with value
          chosenYAxis = value;

          // update yscale
          yLinearScale = yScale(stateData, chosenYAxis);

          // ypdate y axis
          yAxis = renderYAxes(yLinearScale, yAxis);

          // update circle and abbr position
          circlesGroup = renderCircles(circlesGroup, "y", yLinearScale, chosenYAxis);
          abbrGroup = renderAbbr(abbrGroup, "y", yLinearScale, chosenYAxis);

          // update tooltips
          circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis )
          abbrGroup = updateToolTip(abbrGroup, chosenXAxis, chosenYAxis, offset=true )
      

          // changes classes to change bold text
          switch(value){
            case "healthcare":
              healthcareLabel
                .classed("active", true)
                .classed("inactive", false)
              smokesLabel
                .classed("active", false)
                .classed("inactive", true)
              obesityLabel
                .classed("active", false)
                .classed("inactive", true)
              break;
            case "smokes":
              healthcareLabel
                .classed("active", false)
                .classed("inactive", true)
              smokesLabel
                .classed("active", true)
                .classed("inactive", false)
              obesityLabel
                .classed("active", false)
                .classed("inactive", true)            
              break;
            case "obesity":
              healthcareLabel
                .classed("active", false)
                .classed("inactive", true)
              smokesLabel
                .classed("active", false)
                .classed("inactive", true)
              obesityLabel
                .classed("active", true)
                .classed("inactive", false)                          
              break;
          }
        }

      })
})