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
    <div className="grid-cols-subgrid col-span-1 md:col-span-2 lg:col-span-3">
      <div tabIndex={0} className="collapse collapse-arrow border-base-300 bg-base-200 border">
        <input type="checkbox"/>
        <div className="collapse-title text-xl font-medium">{label}</div>
        <div className="collapse-content">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 rounded-lg">
            {AllowedCrossoversCollection}
          </div>

        </div>
      </div>
    </div>
  );
}

export default AllowedCrossovers;
