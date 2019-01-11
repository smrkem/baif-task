import React, { Component } from 'react';
import './App.css';
import ExperimentBlock from './components/ExperimentBlock/ExperimentBlock';


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-body">
          <ExperimentBlock />
        </div>
      </div>
    );
  }
}

export default App;
