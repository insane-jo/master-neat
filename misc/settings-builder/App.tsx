import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store/store';
import SettingsForm from './components/SettingsForm';

const App: React.FC = () => (
  <Provider store={store}>
    <div className="w-full">
      <SettingsForm />
    </div>
  </Provider>
);

export default App;
