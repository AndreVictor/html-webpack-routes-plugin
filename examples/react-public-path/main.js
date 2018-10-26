import React from 'react';
import ReactDOM from 'react-dom';
import { currentRoute, canUseDOM } from './lib/util';

const App = ({ route }) => <h1>Hello, { route }!</h1>;

if ( canUseDOM() ) {
  ReactDOM.hydrate( <App route={currentRoute()} />, window.document.getElementById( 'root' ) );
}

if ( typeof module !== 'undefined' && typeof module.exports !== 'undefined' ) {
  module.exports.application = App;
}