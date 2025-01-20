import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {updateSetting} from "../store/settingsSlice";
import SettingField from "../components/SettingFile";
import React from "react";

const Clear = () => {
  const dispatch = useDispatch<AppDispatch>();
  const clear = useSelector((state: RootState) => state.settings.clear);

  const label = `Clear`;

  return (
    <SettingField label={label} description="">
      <input
        type="checkbox"
        checked={clear}
        onChange={(e) => dispatch(updateSetting({ key: 'clear', value: Number(e.target.checked) }))}
        className="toggle"
      />
    </SettingField>
  );
}

export default Clear;
