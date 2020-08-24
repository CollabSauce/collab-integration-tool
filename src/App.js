import React from 'react';

import './App.css';

import 'react-app-polyfill/ie11';
// DO I NEED THESE?
import 'core-js/features/array/find';
import 'core-js/features/array/includes';
import 'core-js/features/number/is-nan';
import 'core-js/features/url/index';
import 'core-js/features/url/to-json';
import 'core-js/features/url-search-params/index';
import "core-js/modules/es.object.from-entries";

import { Toolbar } from 'src/components/Toolbar';

function App() {
  return (
    <Toolbar />
  );
}

export default App;
