import React, { Component } from 'react';
import ExperimentBlock from '../ExperimentBlock/ExperimentBlock';
import Results from '../Results/Results';
import Settings from '../Settings/Settings';


class TaskManager extends Component {
  state = {
    settings: null,
    steps: [
      'settings',
      'intro',
      'experiment',
      'results'
    ],
    stepIndex: 0,
    results: {}
  }

  constructor(props) {
    super(props);
    this.advanceStep = this.advanceStep.bind(this);
    this.onSubmitResults = this.onSubmitResults.bind(this);
    this.onSubmitSettings = this.onSubmitSettings.bind(this);
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

  onSubmitSettings(settings) {
    this.setState({ settings });
  }

  render() {
    if (this.showing() === 'settings') {
      return (
        <Settings 
          submitSettings={this.onSubmitSettings}
          finishStep={this.advanceStep}
        />
      )
    }

    if (this.showing() === 'intro') {
      return (
        <div className="vertical-center">
          <div className="container text-center">
            <h2>Welcome to the BAIF task!</h2>
            <p>BAIF intro and instructions placeholder.</p>
            <button
              className="btn btn-primary btn-lg"
              onClick={this.advanceStep}
              >Begin</button>
          </div>
        </div>
      )
    }

    if (this.showing() === 'experiment') {
      return (
        <ExperimentBlock 
          settings={this.state.settings}
          submitResults={this.onSubmitResults} 
          finishStep={this.advanceStep}
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
