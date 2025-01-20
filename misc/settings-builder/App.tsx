import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import SettingsForm from './components/SettingsForm';

const App: React.FC = () => (
  <Provider store={store}>
    <div id="settings-controller" className="p-4">
      <SettingsForm />
    </div>
  </Provider>
);

export default App;
