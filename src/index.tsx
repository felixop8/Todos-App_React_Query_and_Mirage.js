import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { makeServer } from "./server"

if (process.env.NODE_ENV === "development") {
  makeServer({ environment: "development" })
} else {
  // Todo: Once we have a real server remove this flag.
  makeServer({ environment: "production" })
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
