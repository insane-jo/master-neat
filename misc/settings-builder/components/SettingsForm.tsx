import React from 'react';
import RedrawRate from "../settings-components/RedrawRate";
import CostFunction from "../settings-components/CostFunction";
import MutationRate from "../settings-components/MutationRate";
import MutationAmount from "../settings-components/MutationAmount";
import SelectionFunction from "../settings-components/SelectionFunction";
import PopulationSize from "../settings-components/PopulationSize";

const SettingsForm: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <RedrawRate />
      <CostFunction />
      <MutationRate />
      <MutationAmount />
      <SelectionFunction />
      <PopulationSize />
    </div>
  );
};

export default SettingsForm;
