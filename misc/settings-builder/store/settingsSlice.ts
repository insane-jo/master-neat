import {createSelector, createSlice, PayloadAction} from '@reduxjs/toolkit';
import Cost from "../../../src/methods/cost";
import Selection from "../../../src/methods/selection";
import Rate from "../../../src/methods/rate";
import Mutation, {IMutation} from "../../../src/methods/mutation";
import Activation from "../../../src/methods/activation";
import Crossover from "../../../src/methods/crossover";
import {INetworkTrainingOptions} from "../../../src/architecture/network";
import {INeatOptions} from "../../../src/helpers/neat";

declare var redrawNetworkIterations: number;
declare const BROWSER_WORKER_SCRIPT_URL: string;
declare const DRAW_RESULTS_CALLBACK: (startDate: number) => any; //(n: any, result: { error: number, iteration: number, fitness?: number }) => void;
declare const NETWORK_INPUT_AMOUNT: number;
declare const NETWORK_OUTPUT_AMOUNT: number;
declare const TRAINING_SET: any;
declare const drawNetwork: any;
declare const DEFAULT_SETTINGS: SettingsState;

declare const MasterNeat: any;

export enum EEvolveRunningState {
  Running = 'Running',
  Stopped = 'Stopped'
}

interface SettingsState {
  networkRedrawRate: number;
  costFunction: keyof typeof Cost;
  mutationRate: number;
  mutationAmount: number;
  selectionFunction: keyof typeof Selection;
  popsize: number;
  elitism: number;
  rateFunction: keyof typeof Rate;
  equal: boolean;
  clear: boolean;
  allowedMutations: {
    [key: string]: boolean
  };
  allowedActivations: {
    [key: keyof typeof Activation]: boolean
  },
  allowedCrossovers: {
    [key: keyof typeof Crossover]: boolean;
  },

  evolving: {
    networkDate: number
  },

  evolveRunningState: EEvolveRunningState,

  changedSettings: (keyof SettingsState)[]
}

let EVOLVING_NETWORK = new MasterNeat.Network(NETWORK_INPUT_AMOUNT, NETWORK_OUTPUT_AMOUNT);
let currentDrawCallback: any;

const initialState: SettingsState = {
  networkRedrawRate: redrawNetworkIterations,
  costFunction: 'MSE',
  mutationRate: 0.9,
  mutationAmount: 5,
  selectionFunction: 'POWER',
  popsize: 250,
  elitism: 50,
  rateFunction: 'FIXED',
  equal: true,
  clear: false,
  allowedMutations: Mutation.ALL
    .reduce((res: { [key: string]: boolean }, curr) => {
      res[curr.name] = true;

      return res;
    }, {}),
  allowedActivations: Object.keys(Activation)
    .reduce((res: { [key: string]: boolean }, curr) => {
      res[curr] = true;

      return res;
    }, {}),
  allowedCrossovers: Object.keys(Crossover)
    .reduce((res: { [key: keyof typeof Crossover]: boolean }, curr) => {
      res[curr] = true;

      return res;
    }, {}),

  evolving: {
    networkDate: Date.now()
  },

  evolveRunningState: EEvolveRunningState.Stopped,

  changedSettings: []
};

const createSettings = (state: SettingsState): INetworkTrainingOptions & INeatOptions => {
  const mutations = Object.keys(state.allowedMutations)
    .filter((mutationName) => state.allowedMutations[mutationName])
    .map((mutationName) => {
      const exactMutation = Mutation.ALL.find((item) => item.name === mutationName) as IMutation;

      return exactMutation;
    });

  const crossovers = Object.keys(state.allowedCrossovers)
    .filter((crossoverName) => state.allowedCrossovers[crossoverName])
    .map((crossoverName) => {
      return Crossover[crossoverName];
    })

  return {
    cost: Cost[state.costFunction],
    popsize: state.popsize,
    elitism: state.elitism,
    equal: state.equal,
    clear: state.clear,
    selection: Selection[state.selectionFunction],
    mutationAmount: state.mutationAmount,
    mutationRate: state.mutationRate,
    mutation: mutations,
    crossover: crossovers,

    error: Number.NEGATIVE_INFINITY,
    browserWorkerScriptUrl: BROWSER_WORKER_SCRIPT_URL
  }
};

const stateToSet: SettingsState = {
  ...initialState,
  ...(typeof DEFAULT_SETTINGS === 'undefined' ? {} : DEFAULT_SETTINGS)
} as SettingsState;

const settingsSlice = createSlice({
  name: 'settings',
  initialState: stateToSet,
  reducers: {
    updateSetting(state: SettingsState, action: PayloadAction<{ key: keyof SettingsState; value: any }>) {
      const settingsKey = action.payload.key;
      const settingsValue = action.payload.value;

      if (settingsKey === 'networkRedrawRate') {
        redrawNetworkIterations = settingsValue;

        return {
          ...state,
          [settingsKey]: settingsValue
        }
      } else {
        return {
          ...state,
          [settingsKey]: settingsValue,
          changedSettings: [
            ...state.changedSettings,
            settingsKey
          ]
        }
      }
    },
    updateAllowedCollection(state: SettingsState, action: PayloadAction<{ collectionName: keyof SettingsState, collectionKey: string; collectionValue: boolean }>) {
      const {collectionName, collectionKey, collectionValue} = action.payload;

      const originalCollection: {[key: string]: boolean} = state[collectionName] as unknown as {[key: string]: boolean};
      const collectionOriginalValue = {
        ...originalCollection,
      };
      collectionOriginalValue[collectionKey] = collectionValue;

      return {
        ...state,
        [collectionName]: {
          ...collectionOriginalValue,
        },
        changedSettings: [
          ...state.changedSettings,
          collectionName
        ]
      }
    },
    startEvolve(state: SettingsState) {
      const network = EVOLVING_NETWORK;

      currentDrawCallback = DRAW_RESULTS_CALLBACK(Date.now());

      const settingToEvolve = createSettings(state);

      network.evolve(TRAINING_SET, {
        ...settingToEvolve,

        callback: currentDrawCallback
      });

      return {
        ...state,
        changedSettings: [],
        evolveRunningState: EEvolveRunningState.Running
      }
    },
    stopEvolve(state: SettingsState) {
      EVOLVING_NETWORK.stopEvolve()
        .then((results: any) => {
          drawNetwork(EVOLVING_NETWORK, {...results, iteration: 0}, true);
        });

      return {
        ...state,
        evolveRunningState: EEvolveRunningState.Stopped
      }
    }
  },
});

export const createSettingsSelector = createSelector([createSettings], (settings) => settings);

export const {updateSetting, updateAllowedCollection, startEvolve, stopEvolve} = settingsSlice.actions;
export default settingsSlice.reducer;
