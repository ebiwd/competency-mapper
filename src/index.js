import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import Root from './app/containers/Root';

ReactDOM.render(
  // <BrowserRouter basename={process.env.PUBLIC_URL}>
  <BrowserRouter>
    <Root />
  </BrowserRouter>,
  document.getElementById('root')
);
