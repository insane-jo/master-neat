import React, {useEffect} from 'react';
import RedrawRate from "../settings-components/RedrawRate";
import CostFunction from "../settings-components/CostFunction";
import MutationRate from "../settings-components/MutationRate";
import MutationAmount from "../settings-components/MutationAmount";
import SelectionFunction from "../settings-components/SelectionFunction";
import PopulationSize from "../settings-components/PopulationSize";
import Elitism from "../settings-components/Elitism";
import Equal from "../settings-components/Equal";
import Clear from "../settings-components/Clear";
import AllowedMutations from "../settings-components/AllowedMutations";
import AllowedActivations from "../settings-components/AllowedActivations";
import AllowedCrossovers from "../settings-components/AllowedCrossovers";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../store/store";
import {startEvolve} from "../store/settingsSlice";
import MainControls from "./MainControls";

const SettingsForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      startEvolve()
    );
  });

  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

      <div className="grid-cols-subgrid col-span-1 md:col-span-2 lg:col-span-3">
        <div tabIndex={0} className="collapse collapse-open collapse-arrow border-base-300 bg-base-200 border">
          <input type="checkbox"/>
          <div className="collapse-title text-xl font-medium">General Settings</div>
          <div className="collapse-content">

            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 rounded-lg">

              <RedrawRate/>
              <CostFunction/>
              <MutationRate/>
              <MutationAmount/>
              <SelectionFunction/>
              <PopulationSize/>
              <Elitism/>
              {/*<RateFunction/>*/}
              <Equal/>
              <Clear/>
            </div>

          </div>
        </div>
      </div>

      <AllowedMutations/>
      <AllowedActivations/>
      <AllowedCrossovers/>

      <MainControls/>
    </div>
  );
};

export default SettingsForm;
