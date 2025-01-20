import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import cost from "../../../src/methods/cost";

interface SettingsState {
  networkRedrawRate: number;
  costFunction: keyof typeof cost;
  // Add other settings
}

const initialState: SettingsState = {
  networkRedrawRate: 100,
  costFunction: 'MSE',
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
