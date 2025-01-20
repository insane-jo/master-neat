import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {updateSetting} from "../store/settingsSlice";
import SettingField from "../components/SettingFile";
import React from "react";

const RedrawRate = () => {
  const dispatch = useDispatch<AppDispatch>();
  const networkRedrawRate = useSelector((state: RootState) => state.settings.networkRedrawRate);

  const label = `Network Redraw Rate (${networkRedrawRate})`;

  return (
    <SettingField label={label} description="Value from 1 to 1000.">
      <input
        type="range"
        min={1}
        max={1000}
        value={networkRedrawRate}
        onChange={(e) => dispatch(updateSetting({ key: 'networkRedrawRate', value: Number(e.target.value) }))}
        className="range"
      />
    </SettingField>
  );
}

export default RedrawRate;
