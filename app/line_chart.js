function initialize_line_chart(){// set the dimensions and margins of the graph

// set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 50},
width = 750 - margin.left - margin.right,
height = 350 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#ratio_trend")
.append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.csv("antriebsarten.csv", function(error, data) {
if (error) throw error;

// Parse the date strings from the Jahr column
var parseDate = d3.time.format("%Y").parse;
data.forEach(function(d) {
  d.Jahr = parseDate(d.Jahr);
});

// Define the X scale using the parsed date values
var x = d3.time.scale()
  .domain(d3.extent(data, function(d) { return d.Jahr; }))
  .range([0, width-70]);

// Create the X axis
var xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom");

// Append the X axis to the SVG
var xAxisGroup = svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);
  
// Change the color of the tick labels
xAxisGroup.selectAll("text")
  .style("fill", "silver")

xAxisGroup.selectAll("path")
  .style({ 'stroke': 'silver', 'fill': 'none', 'stroke-width': '1px'})


// Add Y axis
var y = d3.scale.linear()
  .domain([0, 0.7])
  .range([height, 0]);

// Create the Y axis
var yAxis = d3.svg.axis()
  .scale(y)
  .orient("left")
  .tickFormat(d3.format(".0%")); // Use the desired percentage format specifier

// Append the Y axis to the SVG
var yAxisGroup = svg.append("g")
  .call(yAxis);

// Change the color of the tick labels
yAxisGroup.selectAll("text")
  .style("fill", "silver")

yAxisGroup.selectAll("path")
  .style({ 'stroke': 'silver', 'fill': 'none', 'stroke-width': '1px'})






const lines = ['Benzin', 'Diesel', 'Elektrisch', 'Plug_In', 'Stecker'];
var colors = "#808080,#909090,#2d5fd2,#74a3ef,#4f81e2".split(",")

//add lines
lines.forEach(function(line,index) {
  svg.append("path")
    .datum(data)
    .attr("class", "line line-" + index) // Add a unique class for each line
    .attr("fill", "none")
    .attr("stroke", colors[index])
    .attr("stroke-width", 3)
    .attr("stroke-dasharray", line === "Stecker" ? "3,3" : (line === "Diesel" ? "5,5" : ""))
    .attr("d", d3.svg.line()
      .x(function(d) { return x(d.Jahr); })
      .y(function(d) { return y(d[line]); })
    )
    .on('mouseover', function (d, i){
      d3.selectAll(".line").transition()
      .duration(200)
      .attr('opacity', '0.2')
      d3.select(this).transition()
          .duration(200)
          .attr('opacity', '1')
        })
    .on('mouseout',function (d, i){
      d3.selectAll(".line").transition()
      .duration(200).delay(1000)
      .attr('opacity', '1')
      })
             
  // add tooltip
var tip = d3.tip()
.attr('class', 'd3-tip')
.attr("id", "line-chart")
.offset([-5, 0])
.html(function(d) {
  return "<strong>" + line + "</strong><br>" + 
           "<span>Jahr: " + d.Jahr.getFullYear() + "</span><br>" +
           "<span>Anteil: " + (d[line] * 100).toFixed(0) + "%</span>";
  });
// Invoke the tip in the context of your visualization
svg.call(tip);

  
   // Add data points
   svg.selectAll(".data-point-" + index) // Add a unique class for each line's data points
   .data(data)
   .enter().append("circle")
   .attr("class", "data-point data-point-" + index) // Apply the unique class
   .attr("cx", function(d) { return x(d.Jahr); })
   .attr("cy", function(d) { return y(d[line]); })
   .attr("r", 10) // Adjust the radius as needed
   .style("fill", "transparent")
   .on('mouseover', tip.show)
   .on('mouseout', tip.hide)

  
  // Calculate the position for the label
  var lastIndex = data.length - 1;
  var xPos = x(data[lastIndex].Jahr) + 5; // Adjust the x position as needed
  var yPos = y(data[lastIndex][line]); // Adjust the y position as needed

  // Add the label
  svg.append("text")
    .attr("class", "line-label")
    .attr("x", xPos)
    .attr("y", yPos)
    .text(line)
    .style("font-size", "16px") // Adjust the font size as needed
    .style("fill", colors[index]); // Adjust the font color as needed
});

//show every second tick
var ticks = svg.selectAll(".tick text");
ticks.each(function(_,i){
    if(i%2 == 0) d3.select(this).remove();
})



})

}

