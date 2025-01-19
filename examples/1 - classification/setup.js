var points = [];
const divisionLineFunction = (() => {
  // Randomize the parameters to make the line function look random
  const a = Math.random();
  const b = Math.random();
  const c = Math.random();
  const d = Math.random();

  // Return a function that uses sin, cos, and other math tricks
  return (x) => {
    return Math.sin(x) * a + Math.cos(x * b) * c + d * Math.pow(x, 2) * 0.005;
  };
})();

// Map function to normalize values
function map(value, in_min, in_max, out_min, out_max) {
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function projectPointStyle(pointIndex, assumedType, updatePointCenter = false) {
  const point = points[pointIndex];
  const color = assumedType === point.type ? (point.type === 1 ? "#A2D8A1" : "#A2C9E0") : "#FFB3B3"; // Red pastel if types are different

  if (!point.outerSelector) {
    point.outerSelector = d3.select(`#point-outer-${pointIndex}`);
  }
  // Update the point's outer circle color if the assumed type is different
  point.outerSelector
    .attr("stroke", color);

  if (updatePointCenter) {
    if (!point.innerSelector) {
      point.innerSelector = d3.select(`#point-inner-${pointIndex}`);
    }
    // Update the point's inner circle color
    point.innerSelector
      .attr("fill", color);
  }
}

function setup() {
  // Select the resizable #points-distribution element
  const container = d3.select("#points-distribution")
    .style("height", "300px")
    .style("width", "100%");

  // Create SVG container inside the #points-distribution element
  const svg = container.append("svg")
    .attr("width", "100%")
    .attr("height", "300px");

  // Generate and draw points (only once)
  if (points.length === 0) {
    // Fill points array
    for (let i = 0; i < 1000; i++) {
      const y = Math.random();
      const x = Math.random() * Math.PI * 4;
      const type = y > divisionLineFunction(x) ? 1 : 0;
      points.push({ x: x, y: y, type: type });
    }
  }

  // Draw the division line using polyline
  const divisionLineData = d3.range(0, container.node().clientWidth, 1).map(d => ({
    x: d,
    y: divisionLineFunction(map(d, 0, container.node().clientWidth, 0, Math.PI * 4)) * 300
  }));

  svg.append("polyline")
    .data([divisionLineData])
    .attr("points", d => d.map(p => `${p.x},${p.y}`).join(" "))
    .attr("stroke", "gray")
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("id", "division-line");

  // Draw the points
  const pointGroups = svg.selectAll(".point")
    .data(points)
    .enter().append("g")
    .attr("transform", d => `translate(${map(d.x, 0, Math.PI * 4, 0, container.node().clientWidth)}, ${d.y * 300})`)
    .attr("class", "point")
    .each(function (d, i) {
      const color = d.type === 1 ? "#A2D8A1" : "#A2C9E0"; // Pastel Green for class 1, Pastel Blue for class 2
      const pointGroup = d3.select(this);

      // Create inner circle (filled)
      pointGroup.append("circle")
        .attr("r", 3)
        .attr("fill", color)
        .attr("id", `point-inner-${i}`);

      // Create outer circle (not filled)
      pointGroup.append("circle")
        .attr("r", 5)
        .attr("stroke", color)
        .attr("stroke-width", 1)
        .attr("fill", "none")
        .attr("id", `point-outer-${i}`);
    });

  // Ensure the SVG resizes properly
  d3.select(window).on('resize', function () {
    const width = container.node().clientWidth;
    svg.attr('width', width);
    svg.selectAll(".point")
      .attr("transform", function(d) {
        return `translate(${map(d.x, 0, Math.PI * 4, 0, width)}, ${d.y * 300})`;
      });

    const divisionLineDataResized = d3.range(0, width, 1).map(d => ({
      x: d,
      y: divisionLineFunction(map(d, 0, width, 0, Math.PI * 4)) * 300
    }));

    svg.select("#division-line")
      .attr("points", divisionLineDataResized.map(p => `${p.x},${p.y}`).join(" "));
  });

  evolve();
}
