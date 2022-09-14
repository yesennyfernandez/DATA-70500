/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 5;

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale;
let yScale;

/* APPLICATION STATE */
let state = {
  data: [],
  selection: "Manhattan", // + YOUR FILTER SELECTION
};

/* LOAD DATA */
// + SET YOUR DATA PATH
d3.csv('../data/DV-NYPD-Radiorun.csv', d => {
  
  const formattedObj = {
    Borough: d.Borough,
    RadioRuns: +d.RadioRuns,
    Year: new Date(+d.Year, 0, 1), // (year, month, day)
    Year2:+d.Year
  }
  return formattedObj
})
  //.then(data => {
   // console.log("loaded data:", data);
    //sorting
    //function sortByBoroughDateAscending(a, b){
    //return a.Borough.localCompare(b.Borough) || a.Year - b.Year;
   //data = data.sort(sortByBoroughDateAscending);
      // console.log("sorted data:", data);
    //state.data = data;
    //init();
 // });

   .then(data => {
    console.log("loaded data:", data);
    
    function sortByDateAscending(a, b) {

      return a.Year - b.Year;
  } data = data.sort(sortByDateAscending);
  console.log("sorted data:", data);
  
    state.data = data;
    init();
  });


/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
// SCALES
xScale = d3.scaleTime()
.domain(d3.extent(state.data, d=> d.Year))
.range([margin.left, width - margin.right])

yScale = d3.scaleLinear()
.domain(d3.extent(state.data, d=> d.RadioRuns)) // [min, max]
.range([height-margin.bottom, margin.top])

// AXES
const xAxis = d3.axisBottom(xScale)
const yAxis = d3.axisLeft(yScale)

// Create svg
svg = d3.select("#container")
.append("svg")
.attr('width', width)
.attr('height', height)

svg.append("g")
.attr("class", "xAxis")
.attr("transform", `translate(${0}, ${height-margin.bottom})`)
.call(xAxis)
.append("text")
.text("Ideology Score 2020")
.attr("transform", `translate(${width/2}, ${40})`)

svg.append("g")
.attr("class", "yAxis")
.attr("transform", `translate(${margin.left}, ${0})`)
.call(yAxis)

// SETUP UI ELEMENTS
const dropdown = d3.select("#dropdown")

dropdown.selectAll("options")
.data(Array.from(new Set(state.data.map(d=> d.Borough))))
.join("option")
.attr("value", d => d)
.text(d=> d)

dropdown.on("change", event=> {
  console.log("dropdown changed!", event.target.value)
  state.selection = event.target.value
  console.log("new state:", state)
  draw();
})


  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this everytime there is an update to the data/state
function draw() {
  console.log("state.selected",state.selection)
  // + FILTER DATA BASED ON STATE
  const filteredData = state.data
  .filter(d=> state.selection === d.Borough)

  yScale
  .domain(d3.extent(filteredData, d=> d.RadioRuns))

  // + DRAW LINE AND/OR AREA
  const lineFunction = d3.line()
    .x(d=> xScale(d.Year))
    .y(d=> yScale(d.RadioRuns))

  svg.selectAll("path.line")
    .data([filteredData])
    .join("path")
    .attr("class", "line")
    .attr("fill", "none")
    .attr("stroke", "Purple")
    .attr("d", d =>lineFunction(d))

  // SELECT_ALL()
  // JOIN DATA
  // RENDER ELEMENTS
}
