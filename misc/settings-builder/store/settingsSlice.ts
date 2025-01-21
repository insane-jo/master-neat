import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import Cost from "../../../src/methods/cost";
import Selection from "../../../src/methods/selection";
import Rate from "../../../src/methods/rate";
import Mutation from "../../../src/methods/mutation";

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
}

const initialState: SettingsState = {
  networkRedrawRate: 100,
  costFunction: 'MSE',
  mutationRate: 0.7,
  mutationAmount: 1,
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
    }, {})
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateSetting(state: SettingsState, action: PayloadAction<{ key: keyof SettingsState; value: any }>) {
      const settingsKey = action.payload.key;
      const settingsValue = action.payload.value;

      return {
        ...state,
        [settingsKey]: settingsValue
      }
    },
    updateMutation(state: SettingsState, action: PayloadAction<{ mutationName: string; mutationValue: boolean }>) {
      const {mutationName, mutationValue} = action.payload;

      const mutationsValue = {
        ...state.allowedMutations
      };
      mutationsValue[mutationName] = mutationValue;

      return {
        ...state,
        allowedMutations: {
          ...mutationsValue,
        }
      }
    }
  },
});

export const {updateSetting, updateMutation} = settingsSlice.actions;
export default settingsSlice.reducer;
