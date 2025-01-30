import Network from "../architecture/network";
import { ICrossover } from "../methods/crossover";
import { IMutation } from "../methods/mutation";
import { ISelection } from "../methods/selection";
/*******************************************************************************
                                         NEAT
*******************************************************************************/
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
    input: number;
    output: number;
    fitness: IFitnessFunction;
    equal: boolean;
    clear: boolean;
    popsize: number;
    elitism: number;
    provenance: number;
    mutationRate: number;
    mutationAmount: number;
    fitnessPopulation: boolean;
    selection: ISelection;
    crossover: ICrossover[];
    mutation: IMutation[];
    template?: Network;
    maxNodes: number;
    maxConns: number;
    maxGates: number;
    generation: number;
    population: Network[];
    constructor(input: number, output: number, fitness: IFitnessFunction, options: INeatOptions);
    /**
     * Create the initial pool of genomes
     */
    createPool(network: any): void;
    /**
     * Evaluates, selects, breeds and mutates population
     */
    evolve(): Promise<Network>;
    /**
     * Breeds two parents into an offspring, population MUST be surted
     */
    getOffspring(): Network;
    /**
     * Selects a random mutation method for a genome according to the parameters
     */
    selectMutationMethod(genome: Network): IMutation | undefined;
    /**
     * Mutates the given (or current) population
     */
    mutate(): void;
    /**
     * Evaluates the current population
     */
    evaluate(): Promise<void>;
    /**
     * Sorts the population by score
     */
    sort(): void;
    /**
     * Returns the fittest genome of the current population
     */
    getFittest(): Network;
    /**
     * Returns the average fitness of the current population
     */
    getAverage(): number;
    /**
     * Gets a genome based on the selection function
     * @todo: вынести реализацию в функции селекции
     * @return {Network} genome
     */
    getParent(): Network | undefined;
    /**
     * Export the current population to a json object
     */
    export(): {
        nodes: any[];
        connections: any[];
        input: number;
        output: number;
        dropout: number;
    }[];
    /**
     * Import population from a json object
     */
    import(json: any): void;
}
