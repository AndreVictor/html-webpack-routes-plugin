import React from 'react';
import ReactDOM from 'react-dom';
import { currentRoute, canUseDOM } from './lib/util';

const DangerousSpan = ({}) => {
  return (
    <span dangerouslySetInnerHTML={{
      __html: 'test "asdf" test'
    }} />
  );
}

const App = ({ route }) => <h1>Hello, { route }! <DangerousSpan /></h1>;

if ( canUseDOM() ) {
  ReactDOM.hydrate( <App route={currentRoute()} />, window.document.getElementById( 'custom-app-root-id' ) );
}

if ( typeof module !== 'undefined' && typeof module.exports !== 'undefined' ) {
  module.exports.application = App;
}