import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {updateSetting} from "../store/settingsSlice";
import SettingField from "../components/SettingFile";
import React from "react";

const RedrawRate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const popsize = useSelector((state: RootState) => state.settings.popsize);
  const elitism = useSelector((state: RootState) => state.settings.elitism);

  const label = `Elitism`;

  return (
    <SettingField label={label} description="Value from 1 to population size.">
      <input
        type="input"
        min={1}
        max={popsize}
        step={1}
        value={elitism}
        onChange={(e) => dispatch(updateSetting({ key: 'elitism', value: Number(e.target.value) }))}
        className="input input-bordered"
      />
    </SettingField>
  );
}

export default RedrawRate;
