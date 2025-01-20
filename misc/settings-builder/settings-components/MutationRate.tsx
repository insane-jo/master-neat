import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {updateSetting} from "../store/settingsSlice";
import SettingField from "../components/SettingFile";
import React from "react";

const MutationRate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const mutationRate = useSelector((state: RootState) => state.settings.mutationRate);

  const label = `Mutation Rate (${mutationRate})`;

  return (
    <SettingField label={label} description="Value from 0 to 1.">
      <input
        type="range"
        min={0}
        max={1}
        step={.01}
        value={mutationRate}
        onChange={(e) => dispatch(updateSetting({ key: 'mutationRate', value: Number(e.target.value) }))}
        className="range"
      />
    </SettingField>
  );
}

export default MutationRate;
