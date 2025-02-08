import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from "react-redux";
import { Toaster } from 'react-hot-toast';
import store from './Redux/store.js';
import App from './App.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <Provider store={store} >
    <BrowserRouter>
      <App />
      <Toaster />
    </BrowserRouter>
  </Provider>
)
