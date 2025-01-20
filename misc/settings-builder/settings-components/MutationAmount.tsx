import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {updateSetting} from "../store/settingsSlice";
import SettingField from "../components/SettingFile";
import React from "react";

const RedrawRate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const mutationAmount = useSelector((state: RootState) => state.settings.mutationAmount);

  const label = `Mutation Amount`;

  return (
    <SettingField label={label} description="Value from 1 to infinity.">
      <input
        type="input"
        min={1}
        step={1}
        value={mutationAmount}
        onChange={(e) => dispatch(updateSetting({ key: 'mutationAmount', value: Number(e.target.value) }))}
        className="input input-bordered"
      />
    </SettingField>
  );
}

export default RedrawRate;
