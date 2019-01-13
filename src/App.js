import React, { Component } from 'react';
import './App.css';
import TaskManager from './components/TaskManager/TaskManager';


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-body">
          <TaskManager />
        </div>
      </div>
    );
  }
}

export default App;
