import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {updateAllowedCollection} from "../store/settingsSlice";
import SettingField from "../components/SettingFile";
import React from "react";

const AllowedCrossovers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const allowedCrossoversSettings = useSelector((state: RootState) => state.settings.allowedCrossovers);

  let allowedCount = 0;
  let totalCrossovers = 0;

  const AllowedCrossoversCollection = Object.keys(allowedCrossoversSettings)
    .map((crossover) => {
      const mutationValue = allowedCrossoversSettings[crossover];
      if (mutationValue) {
        allowedCount++;
      }
      totalCrossovers++;

      return (
        <SettingField label={crossover} description="" key={crossover}>
          <input
            type="checkbox"
            checked={mutationValue}
            onChange={(e) => dispatch(
              updateAllowedCollection({
                collectionName: 'allowedCrossovers', collectionKey: crossover, collectionValue: !!(e.target.checked)
              })
            )}
            className="toggle"
          />
        </SettingField>
      );
    });

  const label = `Allowed Crossover: ${allowedCount} of ${totalCrossovers}`;

  return (
    <div className="grid grid-cols-subgrid gap-4 col-span-1 md:col-span-2 lg:col-span-3 border border-current pt-6 p-2 rounded-lg">
      <div className="form-control absolute -mt-8">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      </div>
      {AllowedCrossoversCollection}
    </div>
  );
}

export default AllowedCrossovers;
