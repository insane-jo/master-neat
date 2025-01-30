import React from 'react';
interface SettingFieldProps {
    label: string;
    description: string;
    children: React.ReactNode;
}
declare const SettingField: React.FC<SettingFieldProps>;
export default SettingField;
