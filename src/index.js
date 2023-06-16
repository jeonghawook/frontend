import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import store from './store';
import { Provider } from 'react-redux'
//import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'

export let persistor = persistStore(store)
const root = createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
  
    <App />
 
</Provider>
);

reportWebVitals();
