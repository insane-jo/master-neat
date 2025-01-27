import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {updateAllowedCollection} from "../store/settingsSlice";
import SettingField from "../components/SettingFile";
import React from "react";

const AllowedMutations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const allowedMutationsSettings = useSelector((state: RootState) => state.settings.allowedMutations);

  let allowedCount = 0;
  let totalMutations = 0;

  const AllowedMutationsCollection = Object.keys(allowedMutationsSettings)
    .map((mutation) => {
      const mutationValue = allowedMutationsSettings[mutation];
      if (mutationValue) {
        allowedCount++;
      }
      totalMutations++;

      return (
        <SettingField label={mutation} description="" key={mutation}>
          <input
            type="checkbox"
            checked={mutationValue}
            onChange={(e) => dispatch(
              updateAllowedCollection({
                collectionName: 'allowedMutations', collectionKey: mutation, collectionValue: !!(e.target.checked)
              })
            )}
            className="toggle"
          />
        </SettingField>
      );
    });

  const label = `Allowed Mutations: ${allowedCount} of ${totalMutations}`;

  return (
    <div className="grid-cols-subgrid col-span-1 md:col-span-2 lg:col-span-3">
      <div tabIndex={0} className="collapse collapse-arrow border-base-300 bg-base-200 border">
        <input type="checkbox"/>
        <div className="collapse-title text-xl font-medium">{label}</div>
        <div className="collapse-content">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 p-2 rounded-lg">
            {AllowedMutationsCollection}
          </div>
        </div>
      </div>
    </div>
  );
}

      export default AllowedMutations;
