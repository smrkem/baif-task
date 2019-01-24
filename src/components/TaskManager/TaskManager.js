import React, { Component } from 'react';
import ExperimentBlock from '../ExperimentBlock/ExperimentBlock';
import Results from '../Results/Results';
import Settings from '../Settings/Settings';
import Login from '../Login/Login';

const ADMINS = [
  "matt",
  "norm"
]

class TaskManager extends Component {
  state = {
    settings: null,
    steps: [
      'login',
      'settings',
      'intro',
      'experiment',
      'results'
    ],
    auth: {},
    stepIndex: 0,
    results: {}
  }

  constructor(props) {
    super(props);
    this.advanceStep = this.advanceStep.bind(this);
    this.onSubmitResults = this.onSubmitResults.bind(this);
    this.onSubmitSettings = this.onSubmitSettings.bind(this);
    this.onLogin = this.onLogin.bind(this);

    this.state.settings = {
      initial_delta: 2000,
      max_delta: 2000,
      n_down: 3,
      num_reversals: 6,
      num_trials: 40,
      reference_duration: 5000
    }

    // id 3266 : wkBcF5KiVqc1aeva9XVnBg
    // matt : mDn7CymhatBTyIlCDvshyA

    // Debugging:
    // this.state.results = {
    //   "data": [
    //     {
    //       "index": 1,
    //       "fixation_time_elapsed": 507,
    //       "referencePulse_time_elapsed": 3522,
    //       "targetPulse_time_elapsed": 5143,
    //       "pulse_duration_delta": 1400,
    //       "correct_answer": "faster",
    //       "forcedChoice_time_elapsed": 7312,
    //       "response": "1",
    //       "responded_correctly": true
    //     },
    //     {
    //       "index": 2,
    //       "fixation_time_elapsed": 7816,
    //       "referencePulse_time_elapsed": 10824,
    //       "targetPulse_time_elapsed": 15245,
    //       "pulse_duration_delta": 1400,
    //       "correct_answer": "slower",
    //       "forcedChoice_time_elapsed": 16016,
    //       "response": "1",
    //       "responded_correctly": false
    //     },
    //     {
    //       "index": 3,
    //       "fixation_time_elapsed": 16519,
    //       "referencePulse_time_elapsed": 19521,
    //       "targetPulse_time_elapsed": 24541,
    //       "pulse_duration_delta": 2000,
    //       "correct_answer": "slower",
    //       "forcedChoice_time_elapsed": 25622,
    //       "response": "2",
    //       "responded_correctly": true
    //     }
    //   ],
    //   "reversalIndices": []
    // }
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

  onLogin(auth) {
    this.setState({auth})

    if (ADMINS.includes(auth.participantId)) {
      this.setState({
        settings: {
          initial_delta: 1400,
          max_delta: 2000,
          n_down: 2,
          num_reversals: 6,
          num_trials: 3,
          reference_duration: 3000
        },
        stepIndex: this.state.steps.indexOf('settings')
      })

      // DEBUGGING:
      // this.setState({
      //   stepIndex: this.state.steps.indexOf('results')
      // })
    }
    else {
      this.setState({stepIndex: this.state.steps.indexOf('intro')})
    }
  }

  onSubmitResults(results) {
    this.setState({ results });
  }

  onSubmitSettings(settings) {
    if (this.state.debug) {
      return;
    }
    this.setState({ settings });
  }

  render() {
    console.log('showing: ', this.showing());

    if (this.showing() === 'login') {
      return (
        <Login finishLogin={this.onLogin} />
      )
    }

    if (this.showing() === 'settings') {
      return (
        <Settings 
          defaults={this.state.settings}
          submitSettings={this.onSubmitSettings}
          finishStep={this.advanceStep}
        />
      )
    }

    if (this.showing() === 'intro') {
      console.log('settings auth: ', this.state.auth)
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
        <Results results={this.state.results} settings={this.state.settings} />
      )
    }
  }
}

export default TaskManager
