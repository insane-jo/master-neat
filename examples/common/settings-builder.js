function applyNewRedrawNetworkIterations (v) {
  redrawNetworkIterations = v;
  d3.select('#redraw-rate').text(v);
}

d3.select('#network-redraw-rate').on('change', (e) => {
  const value = +e.target.value;
  applyNewRedrawNetworkIterations(value);
});

applyNewRedrawNetworkIterations(redrawNetworkIterations);

let costFunction = 'MSE';
