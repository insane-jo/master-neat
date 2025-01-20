import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {updateSetting} from "../store/settingsSlice";
import SettingField from "../components/SettingFile";
import React from "react";

const Equal = () => {
  const dispatch = useDispatch<AppDispatch>();
  const equal = useSelector((state: RootState) => state.settings.equal);

  const label = `Equality`;

  return (
    <SettingField label={label} description="">
      <input
        type="checkbox"
        checked={equal}
        onChange={(e) => dispatch(updateSetting({ key: 'equal', value: Number(e.target.checked) }))}
        className="toggle"
      />
    </SettingField>
  );
}

export default Equal;
