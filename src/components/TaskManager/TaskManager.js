import React, { Component } from 'react';
import ExperimentBlock from '../ExperimentBlock/ExperimentBlock';
import Results from '../Results/Results';


class TaskManager extends Component {
  state = {
    steps: [
      // 'intro',
      'experiment',
      'results'
    ],
    stepIndex: 0,
    results: {}
  }

  showing() {
    return this.state.steps[this.state.stepIndex];
  }

  advanceStep() {
    if (this.state.stepIndex === this.state.steps.length - 1) {
      // all done and finished
      return; 
    }

    this.setState({stepIndex: this.state.stepIndex + 1});
  }

  onSubmitResults(results) {
    this.setState({ results });
  }

  render() {
    if (this.showing() === 'intro') {
      return (
        <div>
          <p>BAIF intro</p>
        </div>
      )
    }

    if (this.showing() === 'experiment') {
      return (
        <ExperimentBlock 
          submitResults={this.onSubmitResults.bind(this)} 
          finishStep={this.advanceStep.bind(this)}
          />
      )
    }

    if (this.showing() === 'results') {
      return (
        <Results results={this.state.results} />
      )
    }
  }
}

export default TaskManager
