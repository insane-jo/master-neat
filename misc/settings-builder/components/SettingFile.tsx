import React from 'react';

interface SettingFieldProps {
  label: string;
  description: string;
  children: React.ReactNode;
}

const SettingField: React.FC<SettingFieldProps> = ({ label, description, children }) => (
  <div className="form-control">
    <label className="label">
      <span className="label-text">{label}</span>
    </label>
    {children}
    <label className="label">
      <span className="label-text-alt">{description}</span>
    </label>
  </div>
);

export default SettingField;
