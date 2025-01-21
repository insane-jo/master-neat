import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "../store/store";
import {updateMutation} from "../store/settingsSlice";
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
            onChange={(e) => dispatch(updateMutation({mutationName: mutation, mutationValue: !!(e.target.checked)}))}
            className="toggle"
          />
        </SettingField>
      );
    });

  const label = `Allowed Mutations: ${allowedCount} of ${totalMutations}`;

  return (
    <div className="grid grid-cols-subgrid gap-4 col-span-1 md:col-span-2 lg:col-span-3 border border-current pt-6 p-2">
      <div className="form-control absolute -mt-8">
        <label className="label">
          <span className="label-text">{label}</span>
        </label>
      </div>
      {AllowedMutationsCollection}
    </div>
  );
}

export default AllowedMutations;
