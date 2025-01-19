let points;

let divisionLineFunctionText;

// Map function to normalize values
function map(value, in_min, in_max, out_min, out_max) {
  return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

const drawLineByPoints = (pointsCollection, color, id) => {
  const svg = d3.select("#points-distribution > svg");
  svg.select(`#${id}`).remove();

  const outerMaxWidth = svg.node().clientWidth,
    outerMaxHeight = svg.node().clientHeight;

  const {minX, minY, maxX, maxY} = pointsCollection
    .reduce((res, point) => {
      res.minX = Math.min(res.minX, point.x);
      res.minY = Math.min(res.minY, point.y);
      res.maxX = Math.max(res.maxX, point.x);
      res.maxY = Math.max(res.maxY, point.y);

      return res;
    }, {
      minX: Number.POSITIVE_INFINITY,
      minY: Number.POSITIVE_INFINITY,
      maxX: Number.NEGATIVE_INFINITY,
      maxY: Number.NEGATIVE_INFINITY
    })

  svg.append("polyline")
    .data([pointsCollection])
    .attr("points", d => d.map(p => `${ map(p.x, minX, maxX, 0, outerMaxWidth)},${map(p.y, minY, maxY, 0, outerMaxHeight)}`).join(" "))
    .attr("stroke", color)
    .attr("stroke-width", 2)
    .attr("fill", "none")
    .attr("id", id);
};

const divisionLineFunction = (() => {
  // Randomize the parameters to make the line function look random
  const a = Math.random();
  const b = Math.random();
  const c = Math.random();
  const d = Math.random();

  divisionLineFunctionText = `f(x) = Math.sin( x ) * ${a} + Math.cos( x * ${b} ) * ${c} + ${d} * Math.pow(x, 2) * 0.005;`;

  // Return a function that uses sin, cos, and other math tricks
  return (x) => {
    return Math.sin(x) * a + Math.cos(x * b) * c + d * Math.pow(x, 2) * 0.005;
  };
})();


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
  if (!points || points.length === 0) {
    // Fill points array
    points = d3.range(0, 1000, 1).map(d => {
      return {
        // x: d,
        // y: divisionLineFunction(map(d, 0, container.node().clientWidth, 0, Math.PI * 4)) * 300
        x: map(d, 0, container.node().clientWidth, 0, Math.PI * 4),
        y: divisionLineFunction(map(d, 0, container.node().clientWidth, 0, Math.PI * 4))
      };
    });
  }

  drawLineByPoints(points, '#06b6d4', 'original-function');

  // Ensure the SVG resizes properly
  d3.select(window).on('resize.points', function () {
    const width = container.node().clientWidth;
    svg.attr('width', width);

    const divisionLineDataResized = d3.range(0, width, 1).map(d => ({
      x: d,
      y: divisionLineFunction(map(d, 0, width, 0, Math.PI * 4)) * 300
    }));

    drawLineByPoints(points, '#06b6d4', 'original-function');
  });

  document.getElementById('division-line-function').innerText = divisionLineFunctionText;

  evolve();
}
