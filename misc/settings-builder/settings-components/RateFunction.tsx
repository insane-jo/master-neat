import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import SettingField from "../components/SettingFile";
import {updateSetting} from "../store/settingsSlice";
import Rate from "../../../src/methods/rate";

const RateFunction = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rateFunction = useSelector((state: RootState) => state.settings.rateFunction);

  const rateFunctions = Object.keys(Rate);

  return (
    <SettingField label="Rate Function" description="Select rate function.">
      <select
        value={rateFunction}
        onChange={(e) => dispatch(updateSetting({key: 'rateFunction', value: e.target.value}))}
        className="select select-bordered"
      >
        {rateFunctions.map((func) => (
          <option key={func} value={func}>{func}</option>
        ))}
      </select>
    </SettingField>
  );
};

export default RateFunction;
