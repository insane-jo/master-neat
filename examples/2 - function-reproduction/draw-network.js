let drawInitted = false;

let globalBestNetwork,
  globalResults;

const drawNetwork = (network, results, forceRedraw = false, containerId = "best-network", width = 400, height = 300) => {
  if (!forceRedraw && drawInitted && results.iteration % 1000 !== 0) {
    return;
  }

  globalBestNetwork = network;
  globalResults = results;

  drawInitted = true;

  // Select the container
  const svgContainer = d3.select(`#${containerId}`);
  if (svgContainer.empty()) {
    console.error(`Container with id #${containerId} not found.`);
    return;
  }

  // Clear any existing SVG elements
  svgContainer.html('');

  const containerWidth = Math.max(svgContainer.node().offsetWidth || 400, 400);
  const containerHeight = Math.max(svgContainer.node().offsetHeight || 300, 300);

  const svg = svgContainer.append("svg")
    .attr("width", containerWidth)
    .attr("height", height)
    .attr("id", "best-network");

  // Rest of the code remains the same...

  const preparedNodes = network.nodes.map((n, idx) => {
    const node = n.toJSON();
    node.index = idx;
    return node;
  });

  const connections = network.connections.map((c) => {
    const fromIndex = network.nodes.indexOf(c.from);
    const toIndex = network.nodes.indexOf(c.to);
    return {
      source: preparedNodes[fromIndex],
      target: preparedNodes[toIndex],
      weight: c.weight,
      enabled: true
    };
  });

  const inputs = preparedNodes.filter(n => n.type === 'input');
  const outputs = preparedNodes.filter(n => n.type === 'output');

  // Set fixed coordinates for input and output nodes
  inputs.forEach((node, i) => {
    node.fixed = true;
    // node.fx = (containerWidth / inputs.length) * i + (containerWidth / inputs.length) / 2;
    // node.fy = height * 0.9;

    node.fx = containerWidth * 0.1; // (containerWidth / inputs.length) * i + (containerWidth / inputs.length) / 2;
    node.fy = (containerHeight / inputs.length) * i + (containerHeight / inputs.length) / 2; //height * 0.9;
  });

  outputs.forEach((node, i) => {
    node.fixed = true;
    // node.fx = (containerWidth / outputs.length) * i + (containerWidth / outputs.length) / 2;
    // node.fy = height * 0.1;

    node.fx = containerWidth * 0.9; // (containerWidth / outputs.length) * i + (containerWidth / outputs.length) / 2;
    node.fy = (containerHeight / outputs.length) * i + (containerHeight / outputs.length) / 2; // height * 0.1;
  });

  const force = d3.forceSimulation(preparedNodes)
    .force("link", d3.forceLink(connections).distance(100).strength(0.5))
    .force("charge", d3.forceManyBody().strength(-200))
    .force("center", d3.forceCenter(containerWidth / 2, height / 2));

  // Add links
  const link = svg.selectAll(".link")
    .data(connections)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", d => Math.abs(d.weight) * 2)
    .style("stroke", d => d.weight > 0 ? "#A2D8A1" : "#FFB3B3");

  // Add nodes
  const node = svg.selectAll(".node")
    .data(preparedNodes)
    .enter().append("g")
    .attr("class", "node")
    .call(d3.drag()
      .on("start", d => {
        if (!d3.event.active) force.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", d => {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      })
      .on("end", d => {
        if (!d3.event.active) force.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      }));

  node.append("circle")
    .attr("r", 10)
    .attr("fill", d => {
      if (d.type === 'input') return "#A2C9E0";
      if (d.type === 'output') return "#A2D8A1";
      return "#C0C0C0";  // Gray for hidden nodes
    });

  node.append("text")
    .attr("dx", 12)
    .attr("dy", ".35em")
    .text(d => d.type !== 'input' ? d.squash : '');

  force.on("tick", () => {
    link.attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    node.attr("transform", d => `translate(${d.x},${d.y})`);
  });
};

d3.select(window).on('resize.network', function () {
  drawNetwork(globalBestNetwork, globalResults, true)
});
