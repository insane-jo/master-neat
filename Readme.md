
# Master-Neat

Master-Neat is a powerful library designed to facilitate the creation and management of neural networks. It provides a comprehensive set of tools and utilities for developers looking to implement advanced neural network architectures.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [API Reference](#api-reference)
4. [Examples](#examples)
5. [Contributing](#contributing)
6. [License](#license)

## Installation

To install Master-Neat, use npm:

```bash
npm install -S master-neat
```

Or using yarn:

```bash
yarn add master-neat
```

## Usage

### Train

Here's a basic example of how to use Master-Neat to create and train a neural network:

```javascript
const {MasterNeat} = require('master-neat');
const { helpers } = MasterNeat;

const network = helpers.architect.Perceptron(2, 3, 1);

// Training the network
network.train([
    { input: [0, 0], output: [0] },
    { input: [0, 1], output: [1] },
    { input: [1, 0], output: [1] },
    { input: [1, 1], output: [0] }
], {
  iterations: 1000
});

// Using the network
const output = network.activate([1, 0]);
console.log(output); // Output will be close to [1]
```

### Evolve
**This training method uses multithreading. But cat take much more time to get result.**
Here's an example of how to use Master-Neat to evolve a neural network using the provided TypeScript code:

```javascript
const {MasterNeat} = require('master-neat');
const { Network } = MasterNeat;

const network = new Network(2, 1);

(async () => {
  // Training the network using evolution
  await network.evolve([
    {input: [0, 0], output: [0]},
    {input: [0, 1], output: [1]},
    {input: [1, 0], output: [1]},
    {input: [1, 1], output: [0]}
  ], {
    error: .03,
    iterations: 1000,
    callback: (bestNetwork, result) => {
      //get data every iteration
      console.log(result);
    }
  });

  const output = network.activate([1, 0]);
  console.log(output); // Output will be close to [1]
})();
```

Make sure to adjust the paths and configurations according to your project's setup.

## Examples

For more detailed examples and use cases, please refer to the [examples folder](./examples/index.html).

## Contributing

We welcome contributions from the community! Please follow these guidelines:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with descriptive messages.
4. Push your branch to GitHub.
5. Open a pull request.

## License

Master-Neat is released under the MIT License. See [LICENSE](LICENSE) for more details.
```
