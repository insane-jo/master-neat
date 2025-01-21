import React from 'react';
import RedrawRate from "../settings-components/RedrawRate";
import CostFunction from "../settings-components/CostFunction";
import MutationRate from "../settings-components/MutationRate";
import MutationAmount from "../settings-components/MutationAmount";
import SelectionFunction from "../settings-components/SelectionFunction";
import PopulationSize from "../settings-components/PopulationSize";
import Elitism from "../settings-components/Elitism";
import RateFunction from "../settings-components/RateFunction";
import Equal from "../settings-components/Equal";
import Clear from "../settings-components/Clear";
import AllowedMutations from "../settings-components/AllowedMutations";

const SettingsForm: React.FC = () => {
  return (
    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <RedrawRate />
      <CostFunction />
      <MutationRate />
      <MutationAmount />
      <SelectionFunction />
      <PopulationSize />
      <Elitism />
      <RateFunction />
      <Equal />
      <Clear />
      <AllowedMutations />
    </div>
  );
};

export default SettingsForm;
