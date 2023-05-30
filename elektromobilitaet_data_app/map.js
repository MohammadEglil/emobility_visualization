// <-- contains the code for all the maps ->


// global variables
var map_width = 750, map_height = 500
var municipalities, cantons, lakes
var tooltip_values = {}
var gemeindeScroll = false


var projection = d3.geo.albers()
    .rotate([0, 0])
    .center([8.3, 46.8])
    .scale(12000)
    .translate([map_width / 2, map_height / 2])
    .precision(.1);
 
var path = d3.geo.path()
    .projection(projection)


// gradient from https://colordesigner.io/gradient-generator
var gradient = "#9dc4f9,#74a3ef,#4f81e2,#2d5fd2,#113bbf,#070ba7".split(",")
var scale_steps = {"Anteil_Elektroautos": 1,"Elektroautos_pro_Ladestation":4,"Einwohner_pro_Auto":0.4,"Ladestationen_pro_100km":4}


// loads the geo data and initalize map
function get_map_data(data_path,id,column,is_gemeinde){
  geo_path = "ch-combined.json"
  d3.json(geo_path, function(data) {
    municipalities = topojson.feature(data, data.objects.municipalities).features
    cantons = topojson.feature(data, data.objects.cantons).features
    lakes = topojson.feature(data, data.objects.lakes).features

    // load the data with the abonnement values
    d3.csv(data_path, function(data) {
      if(is_gemeinde){
        gemeinde_data = data
        // we initialite the map only after it's loaded so we don't see a black map
        initialize_gemeinde_map(id)

        // update the color map
        update_gemeinde_map(id, column)
      }
      else{
        canton_data = data
        // we initialite the map only after it's loaded so we don't see a black map
        initialize_kanton_map(id)
        // update the color map
        update_kanton_map(id, column)
      }
    })
  })
}

// we convert data to a dictionary based on selection
function filter_data(data, value){
  var location = {}
  
  for (var i = 0; i < data.length; i++){
    // we add the object to our dictionary
    location[data[i]["GEO_ID"]] = parseFloat(data[i][value])
  }

  return location
}


// tooltip outpt
function get_location_info(d, value){
  var val = tooltip_values[value] // a bit hacky but we create a dictionary which stores the values for the tooltips
  var location = gemeinde_data.find(x => x.GEO_ID == d.id)
  if (location != null){
      return "<b>" + location["GEO_NAME"] + "</b><br>" + parseFloat(location[val]).toFixed(1).toString() + "% " +  val.replaceAll("_", " ")
  } else {
      return "Nicht vorhanden"
  }
  
}

function get_canton_info(d, value){
  var val = tooltip_values[value] // a bit hacky but we create a dictionary which stores the values for the tooltips
  var location = canton_data.find(x => x.GEO_ID == d.id)
  if (location != null){
      return "<b>" + location["GEO_NAME"] + "</b><br>" + parseFloat(location[val]).toFixed(1).toString() + " " +  val.replaceAll("_", " ")
  } else {
      return "Nicht vorhanden"
  }
  
}


function changeSelectedMunic(gemeinde_info_id){

var evt = new MouseEvent("mouseover");

svg = d3.select("#map1")

svg.selectAll(".municipalities")
  .selectAll("path")
  .filter(function(d) { return d.id == gemeinde_info_id  })
  .node().dispatchEvent(evt);

}


// used to create the swiss map
function initialize_gemeinde_map(id){
  // select map
  var svg = d3.select(id).append("svg")
    .attr("width", map_width)
    .attr("height", map_height)

  // add tooltip
  var tooltip = d3.tip()
              .attr('class', 'd3-tip')
              .attr("id", "tool-" + id.substring(1))
              .offset([-5, 0])
              .html(d => get_location_info(d, "tool-" + id.substring(1)))

  // display the municipalities
  svg.append("g")
    .attr("class", "municipalities")
    .selectAll("path")
    .data(municipalities)
    .enter()
    .append("path")
    .attr("id", function(d){ return d.GEO_ID })
    .attr("d", path)
    .on('mouseover', tooltip.show)
    .on('mouseout', tooltip.hide)
    

  // highlight the cantons
  svg.append("g")
    .attr("class", "cantons")
    .selectAll("path")
    .data(cantons)
    .enter()
    .append("path")
    .attr("id", function(d){ return d.id })
    .attr("d", path)

  // add lakes 
  svg.append("g")
    .attr("class", "lakes")
    .selectAll("path")
    .data(lakes)
    .enter()
    .append("path")
    .attr("id", function(d){ return d.id })
    .attr("d", path)

  // add color scale 
  var color_scale = svg.append("g")
                  .attr("class", "colorScale")
                  .selectAll("rect")
                  .data(gradient)
                  .enter()

  color_scale.append("rect")
      .attr("width", 15)
      .attr("height", 40)
      .attr("x", 0)
      .attr("y", function(d, i) {return (gradient.length - i) * 40})
      .attr("fill",  function(d) {return d})

  color_scale.append("text")
      .attr("x", 20)
      .attr("y", function(d, i) {return (gradient.length - i + 1) * 40})
      .attr("fill", "#6e6e6e")
      .style("font-size", "16px")
      .text("test")
  


  let cont = d3.select("#myDropdown")
      .selectAll("div")
      .data(gemeinde_data.sort(function(x, y){
        return d3.ascending(x.GEO_NAME, y.GEO_NAME);
     }))
      .enter()
      .append("a")
      .text(function(d){return d.GEO_NAME})
      .attr("id", function(d){ return d.GEO_ID })
      .on("mousedown",function(d){ changeSelectedMunic(d.GEO_ID) })

        

      
  svg.call(tooltip)

  


  
}



// update the map to the new informations
function update_gemeinde_map (id, value) {
  // select data
  selection = filter_data(gemeinde_data, value)

  // select map
  var svg = d3.select(id)

  // select tooltip
  var tooltip = d3.select()
  var name = "tool-" + id.substring(1)
  tooltip_values[name] = value

  // update map color
  svg.selectAll(".municipalities")
    .selectAll("path")
    .attr("fill", function(d) { return get_color(value, selection[d.id]) })

  // update scale number
  svg.selectAll(".colorScale")
    .selectAll("text")
    .text(function(d, i) { 
      if (i+1 === gradient.length){
        return ">" + (i * scale_steps[value]).toString() + " " + value.replaceAll("_", " ")
      } else {
        return (i * scale_steps[value]).toString()
      }
  })
}


// get color based on value and scale
function get_color(value, n) {
  if (n != null) {
    var i = Math.min(parseInt(n / scale_steps[value]), gradient.length - 1)
    var i = Math.max(Math.min(i, gradient.length - 1), 0)
    return gradient[i]
  } 
  return "#FFFFFF"
}

function initialize_kanton_map(id){
  // select map
  var svg = d3.select(id).append("svg")
    .attr("width", map_width)
    .attr("height", map_height)

  // add tooltip
  tooltip = d3.tip()
              .attr('class', 'd3-tip')
              .attr("id", "tool-" + id.substring(1))
              .offset([-5, 0])
              .html(d => get_canton_info(d, "tool-" + id.substring(1)))

  // display the municipalities
  svg.append("g")
    .attr("class", "municipalities")
    .selectAll("path")
    .data(municipalities)
    .enter()
    .append("path")
    .attr("id", function(d){ return d.id })
    .attr("d", path)

  // highlight the cantons
  svg.append("g")
    .attr("class", "cantons")
    .selectAll("path")
    .data(cantons)
    .enter()
    .append("path")
    .attr("id", function(d){ return d.id })
    .attr("d", path)
    .style("stroke","white")
    .style("stroke-width","0.5")
    .on('mouseover', tooltip.show)
    .on('mouseout', tooltip.hide)

  // add lakes 
  svg.append("g")
    .attr("class", "lakes")
    .selectAll("path")
    .data(lakes)
    .enter()
    .append("path")
    .attr("id", function(d){ return d.id })
    .attr("d", path)

  // add color scale 
  var color_scale = svg.append("g")
                  .attr("class", "colorScale")
                  .selectAll("rect")
                  .data(gradient)
                  .enter()

  color_scale.append("rect")
      .attr("width", 15)
      .attr("height", 40)
      .attr("x", 0)
      .attr("y", function(d, i) {return (gradient.length - i - 0.5) * 40})
      .attr("fill",  function(d) {return d})

  color_scale.append("text")
      .attr("x", 20)
      .attr("y", function(d, i) {return (gradient.length - i + 0.5) * 40})
      .attr("fill", "#6e6e6e")
      .style("font-size", "16px")
      .text("test")

  svg.call(tooltip)
}

function update_kanton_map (id, value) {
  // select data
  selection = filter_data(canton_data, value)

  // select map
  var svg = d3.select(id)

  // select tooltip
  var tooltip = d3.select()
  var name = "tool-" + id.substring(1)
  tooltip_values[name] = value

  // update map color
  svg.selectAll(".cantons")
    .selectAll("path")
    .attr("fill", function(d) { return get_color(value, selection[d.id]) })

  // update scale number
  svg.selectAll(".colorScale")
    .selectAll("text")
    .text(function(d, i) { 
      if (i+1 === gradient.length){
        return ">" + (i * scale_steps[value]).toString() + " " + value.replaceAll("_", " ")
      } else {
        return (Math.round((i * scale_steps[value])*10)/10).toString()
      }
  })
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {

  document.getElementById("myDropdown").classList.toggle("show")
  
}



function filterFunction() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}
