import React from 'react';
import RedrawRate from "../settings-components/RedrawRate";
import CostFunction from "../settings-components/CostFunction";
import MutationRate from "../settings-components/MutationRate";

const SettingsForm: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full">
      <RedrawRate />
      <CostFunction />
      <MutationRate />
    </div>
  );
};

export default SettingsForm;
