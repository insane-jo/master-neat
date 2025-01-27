import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {updateAllowedCollection} from "../store/settingsSlice";
import SettingField from "../components/SettingFile";
import React from "react";

const AllowedActivations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const allowedActivationsSetting = useSelector((state: RootState) => state.settings.allowedActivations);

  let allowedCount = 0;
  let totalActivations = 0;

  const AllowedActivationsCollection = Object.keys(allowedActivationsSetting)
    .map((activation) => {
      const activationValue = allowedActivationsSetting[activation];
      if (activationValue) {
        allowedCount++;
      }
      totalActivations++;

      return (
        <SettingField label={activation} description="" key={activation}>
          <input
            type="checkbox"
            checked={activationValue}
            onChange={(e) => dispatch(
              updateAllowedCollection({
                collectionName: 'allowedActivations', collectionKey: activation, collectionValue: !!(e.target.checked)
              })
            )}
            className="toggle"
          />
        </SettingField>
      );
    });

  const label = `Allowed Activations: ${allowedCount} of ${totalActivations}`;

  return (
    <div className="grid-cols-subgrid col-span-1 md:col-span-2 lg:col-span-3">
      <div tabIndex={0} className="collapse collapse-arrow border-base-300 bg-base-200 border">
        <input type="checkbox"/>
        <div className="collapse-title text-xl font-medium">{label}</div>
        <div className="collapse-content">

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-2 rounded-lg">
            {AllowedActivationsCollection}
          </div>

        </div>
      </div>
    </div>
  );
}

export default AllowedActivations;
