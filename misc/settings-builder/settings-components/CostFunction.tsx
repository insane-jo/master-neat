import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import SettingField from "../components/SettingFile";
import {updateSetting} from "../store/settingsSlice";
import React from "react";
import Cost from "../../../src/methods/cost";

const CostFunction = () => {
  const dispatch = useDispatch<AppDispatch>();
  const costFunction = useSelector((state: RootState) => state.settings.costFunction);

  const costFunctions = Object.keys(Cost);

  return (
    <SettingField label="Cost Function" description="Select the cost function.">
      <select
        value={costFunction}
        onChange={(e) => dispatch(updateSetting({key: 'costFunction', value: e.target.value}))}
        className="select select-bordered"
        id="cost-function"
      >
        {costFunctions.map((func) => (
          <option key={func} value={func}>{func}</option>
        ))}
      </select>
    </SettingField>
  );
};

export default CostFunction;
