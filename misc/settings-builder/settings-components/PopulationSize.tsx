import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {updateSetting} from "../store/settingsSlice";
import SettingField from "../components/SettingFile";
import React from "react";

const PopulationSize = () => {
  const dispatch = useDispatch<AppDispatch>();
  const popsize = useSelector((state: RootState) => state.settings.popsize);

  const label = `Population Size`;

  return (
    <SettingField label={label} description="Value from 1 to infinity.">
      <input
        type="input"
        min={1}
        step={1}
        value={popsize}
        onChange={(e) => dispatch(updateSetting({ key: 'popsize', value: Number(e.target.value) }))}
        className="input input-bordered"
      />
    </SettingField>
  );
}

export default PopulationSize;
