import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import Cost from "../../../src/methods/cost";
import Selection from "../../../src/methods/selection";
import Rate from "../../../src/methods/rate";

interface SettingsState {
  networkRedrawRate: number;
  costFunction: keyof typeof Cost;
  mutationRate: number;
  mutationAmount: number;
  selectionFunction: keyof typeof Selection;
  popsize: number;
  elitism: number;
  rateFunction: keyof typeof Rate;
  // Add other settings
}

const initialState: SettingsState = {
  networkRedrawRate: 100,
  costFunction: 'MSE',
  mutationRate: 0.7,
  mutationAmount: 1,
  selectionFunction: 'POWER',
  popsize: 250,
  elitism: 50,
  rateFunction: 'FIXED'
  // Initialize other settings
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
  },
});

export const { updateSetting } = settingsSlice.actions;
export default settingsSlice.reducer;
