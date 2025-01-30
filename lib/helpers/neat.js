"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var network_1 = __importDefault(require("../architecture/network"));
var methods_1 = __importDefault(require("../methods/methods"));
var config_1 = __importDefault(require("../config"));
var add_node_1 = __importDefault(require("../methods/mutation/add-node"));
var add_conn_1 = __importDefault(require("../methods/mutation/add-conn"));
var add_gate_1 = __importDefault(require("../methods/mutation/add-gate"));
/* Easier variable naming */
var selection = methods_1.default.selection;
var Neat = /** @class */ (function () {
    function Neat(input, output, fitness, options) {
        this.population = [];
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
        this.selection = options.selection || methods_1.default.selection.POWER;
        this.crossover = options.crossover || [
            methods_1.default.crossover.SINGLE_POINT,
            methods_1.default.crossover.TWO_POINT,
            methods_1.default.crossover.UNIFORM,
            methods_1.default.crossover.AVERAGE
        ];
        this.mutation = options.mutation || methods_1.default.mutation.FFW;
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
    Neat.prototype.createPool = function (network) {
        this.population = [];
        for (var i = 0; i < this.popsize; i++) {
            var copy;
            if (this.template) {
                copy = network_1.default.fromJSON(network.toJSON());
            }
            else {
                copy = new network_1.default(this.input, this.output);
            }
            copy.score = undefined;
            this.population.push(copy);
        }
    };
    /**
     * Evaluates, selects, breeds and mutates population
     */
    Neat.prototype.evolve = function () {
        return __awaiter(this, void 0, void 0, function () {
            var fittest, newPopulation, elitists, i;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!(typeof this.population[this.population.length - 1].score === 'undefined')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.evaluate()];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        this.sort();
                        fittest = network_1.default.fromJSON(this.population[0].toJSON());
                        fittest.score = this.population[0].score;
                        newPopulation = [];
                        elitists = [];
                        for (i = 0; i < this.elitism; i++) {
                            elitists.push(this.population[i]);
                        }
                        // Provenance
                        for (i = 0; i < this.provenance; i++) {
                            newPopulation.push(network_1.default.fromJSON(this.template.toJSON()));
                        }
                        // Breed the next individuals
                        for (i = 0; i < this.popsize - this.elitism - this.provenance; i++) {
                            newPopulation.push(this.getOffspring());
                        }
                        // Replace the old population with the new population
                        this.population = newPopulation;
                        this.mutate();
                        (_a = this.population).push.apply(_a, elitists);
                        // Reset the scores
                        for (i = 0; i < this.population.length; i++) {
                            this.population[i].score = undefined;
                        }
                        this.generation++;
                        return [2 /*return*/, fittest];
                }
            });
        });
    };
    /**
     * Breeds two parents into an offspring, population MUST be surted
     */
    Neat.prototype.getOffspring = function () {
        var parent1 = this.getParent();
        var parent2 = this.getParent();
        return network_1.default.crossOver(parent1, parent2, this.equal);
    };
    /**
     * Selects a random mutation method for a genome according to the parameters
     */
    Neat.prototype.selectMutationMethod = function (genome) {
        var mutationMethod = this.mutation[Math.floor(Math.random() * this.mutation.length)];
        if (mutationMethod === add_node_1.default && genome.nodes.length >= this.maxNodes) {
            if (config_1.default.warnings)
                console.warn('maxNodes exceeded!');
            return;
        }
        else if (mutationMethod === add_conn_1.default && genome.connections.length >= this.maxConns) {
            if (config_1.default.warnings)
                console.warn('maxConns exceeded!');
            return;
        }
        else if (mutationMethod === add_gate_1.default && genome.gates.length >= this.maxGates) {
            if (config_1.default.warnings)
                console.warn('maxGates exceeded!');
            return;
        }
        return mutationMethod;
    };
    /**
     * Mutates the given (or current) population
     */
    Neat.prototype.mutate = function () {
        // Elitist genomes should not be included
        for (var i = 0; i < this.population.length; i++) {
            if (Math.random() <= this.mutationRate) {
                for (var j = 0; j < this.mutationAmount; j++) {
                    var mutationMethod = this.selectMutationMethod(this.population[i]);
                    this.population[i].mutate(mutationMethod);
                }
            }
        }
    };
    /**
     * Evaluates the current population
     */
    Neat.prototype.evaluate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var i, genome, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!this.fitnessPopulation) return [3 /*break*/, 2];
                        if (this.clear) {
                            for (i = 0; i < this.population.length; i++) {
                                this.population[i].clear();
                            }
                        }
                        return [4 /*yield*/, this.fitness(this.population)];
                    case 1:
                        _b.sent();
                        return [3 /*break*/, 6];
                    case 2:
                        i = 0;
                        _b.label = 3;
                    case 3:
                        if (!(i < this.population.length)) return [3 /*break*/, 6];
                        genome = this.population[i];
                        if (this.clear) {
                            genome.clear();
                        }
                        _a = genome;
                        return [4 /*yield*/, this.fitness(genome)];
                    case 4:
                        _a.score = _b.sent();
                        _b.label = 5;
                    case 5:
                        i++;
                        return [3 /*break*/, 3];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Sorts the population by score
     */
    Neat.prototype.sort = function () {
        this.population.sort(function (a, b) {
            // @ts-ignore
            return b.score - a.score;
        });
    };
    /**
     * Returns the fittest genome of the current population
     */
    Neat.prototype.getFittest = function () {
        // Check if evaluated
        if (typeof this.population[this.population.length - 1].score === 'undefined') {
            this.evaluate();
        }
        // @ts-ignore
        if (this.population[0].score < this.population[1].score) {
            this.sort();
        }
        return this.population[0];
    };
    /**
     * Returns the average fitness of the current population
     */
    Neat.prototype.getAverage = function () {
        if (typeof this.population[this.population.length - 1].score === 'undefined') {
            this.evaluate();
        }
        var score = 0;
        for (var i = 0; i < this.population.length; i++) {
            // @ts-ignore
            score += this.population[i].score;
        }
        return score / this.population.length;
    };
    /**
     * Gets a genome based on the selection function
     * @todo: вынести реализацию в функции селекции
     * @return {Network} genome
     */
    Neat.prototype.getParent = function () {
        var i;
        switch (this.selection.name) {
            case selection.POWER.name:
                // @ts-ignore
                if (this.population[0].score < this.population[1].score)
                    this.sort();
                var index = Math.floor(Math.pow(Math.random(), this.selection.power) * this.population.length);
                return this.population[index];
            case selection.FITNESS_PROPORTIONATE.name:
                // As negative fitnesses are possible
                // https://stackoverflow.com/questions/16186686/genetic-algorithm-handling-negative-fitness-values
                // this is unnecessarily run for every individual, should be changed
                var totalFitness = 0;
                var minimalFitness = 0;
                for (i = 0; i < this.population.length; i++) {
                    var score = this.population[i].score;
                    minimalFitness = score < minimalFitness ? score : minimalFitness;
                    totalFitness += score;
                }
                minimalFitness = Math.abs(minimalFitness);
                totalFitness += minimalFitness * this.population.length;
                var random = Math.random() * totalFitness;
                var value = 0;
                for (i = 0; i < this.population.length; i++) {
                    var genome = this.population[i];
                    value += genome.score + minimalFitness;
                    if (random < value)
                        return genome;
                }
                // if all scores equal, return random genome
                return this.population[Math.floor(Math.random() * this.population.length)];
            case selection.TOURNAMENT.name:
                if (this.selection.size > this.popsize) {
                    throw new Error('Your tournament size should be lower than the population size, please change methods.selection.TOURNAMENT.size');
                }
                // Create a tournament
                var individuals = [];
                for (i = 0; i < this.selection.size; i++) {
                    var random_1 = this.population[Math.floor(Math.random() * this.population.length)];
                    individuals.push(random_1);
                }
                // Sort the tournament individuals by score
                individuals.sort(function (a, b) {
                    // @ts-ignore
                    return b.score - a.score;
                });
                // Select an individual
                for (i = 0; i < this.selection.size; i++) {
                    if (Math.random() < this.selection.probability || i === this.selection.size - 1) {
                        return individuals[i];
                    }
                }
        }
    };
    /**
     * Export the current population to a json object
     */
    Neat.prototype.export = function () {
        var json = [];
        for (var i = 0; i < this.population.length; i++) {
            var genome = this.population[i];
            json.push(genome.toJSON());
        }
        return json;
    };
    /**
     * Import population from a json object
     */
    Neat.prototype.import = function (json) {
        var population = [];
        for (var i = 0; i < json.length; i++) {
            var genome = json[i];
            population.push(network_1.default.fromJSON(genome));
        }
        this.population = population;
        this.popsize = population.length;
    };
    return Neat;
}());
exports.default = Neat;
//# sourceMappingURL=neat.js.map