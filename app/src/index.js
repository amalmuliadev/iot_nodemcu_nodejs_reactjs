import React from 'react';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';


const AppReact = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);

ReactDOM.render(<AppReact />, document.getElementById('root'));
registerServiceWorker();
