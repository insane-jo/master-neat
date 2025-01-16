var drawInitted = false;

const drawNetwork = (network, results, width = 400, height = 400, container = "svgContainer") => {

  if (drawInitted && results.iteration % 1000 !== 0) {
    return
  }

  drawInitted = true;

  var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("id", "best-network");

  const preparedNodes = network.nodes.map((n, idx) => {
    const node = n.toJSON();
    node.index = idx;

    return node;
  });
  const connections = network.connections.map((c, idx) => {
    const fromIndex = network.nodes.indexOf(c.from);
    const toIndex = network.nodes.indexOf(c.to);

    return {
      source: preparedNodes[fromIndex],
      target: preparedNodes[toIndex],
      weight: c.weight,
      enabled: true
    }
  });

  function getNodeWithIndex(node) {
    const index = network.nodes.indexOf(node);

    const currNode = node.toJSON();
    currNode.index = index;

    return currNode;
  }

  var force = d3.layout.force()
    .gravity(.05)
    .distance(100)
    .charge(-100)
    .size([width, height]);

  const nodes = preparedNodes.map((node) => {
      // if (node.type == 0) {
      if (node.type == 'hidden') {
        node.fixed = true;
        node.y = height - (height * 0.2);
        node.x = ((width / network.input) * node.number) + (width / network.input) / 2;
      }

      if (node.output) {
        node.fixed = true;
        node.y = (height * 0.2);
        node.x = ((width / network.output) * (node.number - network.input)) + (width / network.output) / 2;
      }

      return node
  })

  force.nodes(nodes)
    .links(connections)
    .start();

  var link = svg.selectAll(".link")
    .data(connections)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function (d) {
      return d.enabled ? (d.weight > 0 ? 0.3 + d.weight : 0.3 + d.weight * -1) : 0
    })
    .style("stroke", function (d) {
      return d.weight > 0 ? "#0f0" : "#f00";
    });

  var node = svg.selectAll(".node")
    .data(nodes)
    .enter().append("g")
    .attr("class", "node")
    .call(force.drag);

  node.append("circle")
    .attr("r", "5")
    .attr("fill", function (d) {
      if (d.type === 'input') {
        return '#00f'
      } else if (d.type === 'output') {
        return '#f00'
      } else {
        return '#000'
      }
    });

  node.append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(function (d) {
      return d.index + (d.type !== 'input' ? "(" + d.squash + ")" : null)
    });

  force.on("tick", function () {
    link.attr("x1", function (d) {
      return d.source.x;
    })
      .attr("y1", function (d) {
        return d.source.y;
      })
      .attr("x2", function (d) {
        return d.target.x;
      })
      .attr("y2", function (d) {
        return d.target.y;
      });

    node.attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    });
  });

  // var element = document.getElementById(this.id);
  document.getElementById(container)
    .innerHTML = '';

  var element = document.getElementById("best-network");
  document.getElementById(container)
    .append(element);
}
