import React from 'react';
import RedrawRate from "../settings-components/RedrawRate";
import CostFunction from "../settings-components/CostFunction";

const SettingsForm: React.FC = () => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <RedrawRate />
      <CostFunction />
    </div>
  );
};

export default SettingsForm;
