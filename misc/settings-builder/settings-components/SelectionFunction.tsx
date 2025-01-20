import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import SettingField from "../components/SettingFile";
import {updateSetting} from "../store/settingsSlice";
import Selection from "../../../src/methods/selection";

const CostFunction = () => {
  const dispatch = useDispatch<AppDispatch>();
  const selectionFunction = useSelector((state: RootState) => state.settings.selectionFunction);

  const selectionFunctions = Object.keys(Selection);

  return (
    <SettingField label="Selection Function" description="Select selection function.">
      <select
        value={selectionFunction}
        onChange={(e) => dispatch(updateSetting({key: 'selectionFunction', value: e.target.value}))}
        className="select select-bordered"
      >
        {selectionFunctions.map((func) => (
          <option key={func} value={func}>{func}</option>
        ))}
      </select>
    </SettingField>
  );
};

export default CostFunction;
