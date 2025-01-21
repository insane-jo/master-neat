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
    <div className="grid grid-cols-subgrid gap-4 col-span-1 md:col-span-2 lg:col-span-3 border border-current pt-6 p-2 rounded-lg">
      <div className="form-control absolute -mt-8">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      </div>
      {AllowedActivationsCollection}
    </div>
  );
}

export default AllowedActivations;
