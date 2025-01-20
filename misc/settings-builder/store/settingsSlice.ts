import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import cost from "../../../src/methods/cost";
import selection from "../../../src/methods/selection";

interface SettingsState {
  networkRedrawRate: number;
  costFunction: keyof typeof cost;
  mutationRate: number;
  mutationAmount: number;
  selectionFunction: keyof typeof selection;
  popsize: number;
  // Add other settings
}

const initialState: SettingsState = {
  networkRedrawRate: 100,
  costFunction: 'MSE',
  mutationRate: 0.7,
  mutationAmount: 1,
  selectionFunction: 'POWER',
  popsize: 250
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
