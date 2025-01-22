import Network from "../architecture/network";
import { ICrossover } from "../methods/crossover";
import { IMutation } from "../methods/mutation";
import { ISelection } from "../methods/selection";

import methods from '../methods/methods';
import config from '../config';
import addNode from "../methods/mutation/add-node";
import addConn from "../methods/mutation/add-conn";
import addGate from "../methods/mutation/add-gate";

/* Easier variable naming */
var selection = methods.selection;

/*******************************************************************************
                                         NEAT
*******************************************************************************/

// type INetworkFitnessFunction = (population: Network) => number;
// type IGenomeFitnessFunction = (genome: Network[]) => Promise<undefined>;
// type IFitnessFunction = INetworkFitnessFunction | IGenomeFitnessFunction;
export type IFitnessFunction = (popGenome: Network | Network[]) => (number | Promise<undefined>);

export interface INeatOptions {
  equal?: boolean;
  clear?: boolean;
  popsize?: number;
  elitism?: number;
  provenance?: number;
  mutationRate?: number;
  mutationAmount?: number;
  fitnessPopulation?: boolean;
  selection?: ISelection;
  crossover?: ICrossover[];
  mutation?: IMutation[];
  network?: Network;

  maxNodes?: number;
  maxConns?: number;
  maxGates?: number;

  mutationSelection?: (genome: Network) => IMutation;
}

export default class Neat {
  public input: number;
  public output: number;
  public fitness: IFitnessFunction;
  public equal: boolean;
  public clear: boolean;
  public popsize: number;
  public elitism: number;
  public provenance: number;
  public mutationRate: number;
  public mutationAmount: number;
  fitnessPopulation: boolean;
  selection: ISelection;
  crossover: ICrossover[];
  mutation: IMutation[];
  template?: Network;

  maxNodes: number;
  maxConns: number;
  maxGates: number;

  generation: number;

  population: Network[] = [];

  constructor(input: number, output: number, fitness: IFitnessFunction, options: INeatOptions) {
    this.input = input; // The input size of the networks
    this.output = output; // The output size of the networks
    this.fitness = fitness; // The fitness function to evaluate the networks

    // Configure options
    options = options || {};
    this.equal = options.equal || false;
    this.clear = options.clear || false;
    this.popsize = options.popsize || 50;
    this.elitism = options.elitism || 0;
    this.provenance = options.provenance || 0;
    this.mutationRate = options.mutationRate || 0.3;
    this.mutationAmount = options.mutationAmount || 1;

    this.fitnessPopulation = options.fitnessPopulation || false;

    this.selection = options.selection || methods.selection.POWER;
    this.crossover = options.crossover || [
      methods.crossover.SINGLE_POINT,
      methods.crossover.TWO_POINT,
      methods.crossover.UNIFORM,
      methods.crossover.AVERAGE
    ];
    this.mutation = options.mutation || methods.mutation.FFW;

    this.template = options.network || undefined;

    this.maxNodes = options.maxNodes || Infinity;
    this.maxConns = options.maxConns || Infinity;
    this.maxGates = options.maxGates || Infinity;

    // Custom mutation selection function if given
    this.selectMutationMethod = typeof options.mutationSelection === 'function' ? options.mutationSelection.bind(this) : this.selectMutationMethod;

    // Generation counter
    this.generation = 0;

    // Initialise the genomes
    this.createPool(this.template);
  }

  /**
   * Create the initial pool of genomes
   */
  createPool(network: any) {
    this.population = [];

    for (var i = 0; i < this.popsize; i++) {
      var copy;
      if (this.template) {
        copy = Network.fromJSON(network.toJSON());
      } else {
        copy = new Network(this.input, this.output);
      }
      copy.score = undefined;
      this.population.push(copy);
    }
  }

  /**
   * Evaluates, selects, breeds and mutates population
   */
  async evolve() {
    // Check if evaluated, sort the population
    if (typeof this.population[this.population.length - 1].score === 'undefined') {
      await this.evaluate();
    }
    this.sort();

    var fittest = Network.fromJSON(this.population[0].toJSON());
    fittest.score = this.population[0].score;

    var newPopulation = [];

    // Elitism
    var elitists = [];
    for (var i = 0; i < this.elitism; i++) {
      elitists.push(this.population[i]);
    }

    // Provenance
    for (i = 0; i < this.provenance; i++) {
      newPopulation.push(Network.fromJSON((this.template as Network).toJSON()));
    }

    // Breed the next individuals
    for (i = 0; i < this.popsize - this.elitism - this.provenance; i++) {
      newPopulation.push(this.getOffspring());
    }

    // Replace the old population with the new population
    this.population = newPopulation;
    this.mutate();

    this.population.push(...elitists);

    // Reset the scores
    for (i = 0; i < this.population.length; i++) {
      this.population[i].score = undefined;
    }

    this.generation++;

    return fittest;
  }

  /**
   * Breeds two parents into an offspring, population MUST be surted
   */
  getOffspring() {
    var parent1 = this.getParent() as Network;
    var parent2 = this.getParent() as Network;

    return Network.crossOver(parent1, parent2, this.equal);
  }

  /**
   * Selects a random mutation method for a genome according to the parameters
   */
  selectMutationMethod(genome: Network) {
    var mutationMethod = this.mutation[Math.floor(Math.random() * this.mutation.length)];

    if (mutationMethod === addNode && genome.nodes.length >= this.maxNodes) {
      if (config.warnings) console.warn('maxNodes exceeded!');
      return;
    }

    if (mutationMethod === addConn && genome.connections.length >= this.maxConns) {
      if (config.warnings) console.warn('maxConns exceeded!');
      return;
    }

    if (mutationMethod === addGate && genome.gates.length >= this.maxGates) {
      if (config.warnings) console.warn('maxGates exceeded!');
      return;
    }

    return mutationMethod;
  }

  /**
   * Mutates the given (or current) population
   */
  mutate() {
    // Elitist genomes should not be included
    for (var i = 0; i < this.population.length; i++) {
      if (Math.random() <= this.mutationRate) {
        for (var j = 0; j < this.mutationAmount; j++) {
          const mutationMethod = this.selectMutationMethod(this.population[i]);
          this.population[i].mutate(mutationMethod);
        }
      }
    }
  }

  /**
   * Evaluates the current population
   */
  async evaluate() {
    var i;
    if (this.fitnessPopulation) {
      if (this.clear) {
        for (i = 0; i < this.population.length; i++) {
          this.population[i].clear();
        }
      }
      await this.fitness(this.population);
    } else {
      for (i = 0; i < this.population.length; i++) {
        var genome = this.population[i];
        if (this.clear) {
          genome.clear();
        }
        genome.score = await this.fitness(genome);
      }
    }
  }

  /**
   * Sorts the population by score
   */
  sort() {
    this.population.sort(function (a, b) {
      // @ts-ignore
      return b.score - a.score;
    });
  }

  /**
   * Returns the fittest genome of the current population
   */
  getFittest() {
    // Check if evaluated
    if (typeof this.population[this.population.length - 1].score === 'undefined') {
      this.evaluate();
    }
    // @ts-ignore
    if (this.population[0].score < this.population[1].score) {
      this.sort();
    }

    return this.population[0];
  }

  /**
   * Returns the average fitness of the current population
   */
  getAverage() {
    if (typeof this.population[this.population.length - 1].score === 'undefined') {
      this.evaluate();
    }

    var score = 0;
    for (var i = 0; i < this.population.length; i++) {
      // @ts-ignore
      score += this.population[i].score;
    }

    return score / this.population.length;
  }

  /**
   * Gets a genome based on the selection function
   * @todo: вынести реализацию в функции селекции
   * @return {Network} genome
   */
  getParent() {
    var i;
    switch (this.selection.name) {
      case selection.POWER.name:
        // @ts-ignore
        if (this.population[0].score < this.population[1].score) this.sort();

        var index = Math.floor(Math.pow(Math.random(), (this.selection.power as number)) * this.population.length);
        return this.population[index];
      case selection.FITNESS_PROPORTIONATE.name:
        // As negative fitnesses are possible
        // https://stackoverflow.com/questions/16186686/genetic-algorithm-handling-negative-fitness-values
        // this is unnecessarily run for every individual, should be changed

        var totalFitness = 0;
        var minimalFitness = 0;
        for (i = 0; i < this.population.length; i++) {
          var score = this.population[i].score as number;
          minimalFitness = score < minimalFitness ? score : minimalFitness;
          totalFitness += score;
        }

        minimalFitness = Math.abs(minimalFitness);
        totalFitness += minimalFitness * this.population.length;

        var random = Math.random() * totalFitness;
        var value = 0;

        for (i = 0; i < this.population.length; i++) {
          let genome = this.population[i];
          value += (genome.score as number) + minimalFitness;
          if (random < value) return genome;
        }

        // if all scores equal, return random genome
        return this.population[Math.floor(Math.random() * this.population.length)];
      case selection.TOURNAMENT.name:
        if ((this.selection.size as number) > this.popsize) {
          throw new Error('Your tournament size should be lower than the population size, please change methods.selection.TOURNAMENT.size');
        }

        // Create a tournament
        var individuals = [];
        for (i = 0; i < (this.selection.size as number); i++) {
          let random = this.population[Math.floor(Math.random() * this.population.length)];
          individuals.push(random);
        }

        // Sort the tournament individuals by score
        individuals.sort(function (a, b) {
          // @ts-ignore
          return b.score - a.score;
        });

        // Select an individual
        for (i = 0; i < (this.selection.size as number); i++) {
          if (Math.random() < (this.selection.probability as number) || i === (this.selection.size as number) - 1) {
            return individuals[i];
          }
        }
    }
  }

  /**
   * Export the current population to a json object
   */
  export() {
    var json = [];
    for (var i = 0; i < this.population.length; i++) {
      var genome = this.population[i];
      json.push(genome.toJSON());
    }

    return json;
  }

  /**
   * Import population from a json object
   */
  import(json: any) {
    var population = [];
    for (var i = 0; i < json.length; i++) {
      var genome = json[i];
      population.push(Network.fromJSON(genome));
    }
    this.population = population;
    this.popsize = population.length;
  }
}
