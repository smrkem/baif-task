import React, { Component } from 'react';
import ExperimentBlock from '../ExperimentBlock/ExperimentBlock';
import Results from '../Results/Results';
import Settings from '../Settings/Settings';
import Login from '../Login/Login';
import Intro from '../Intro/Intro';


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

    // for REACT_APP_AUTH_DATA=true
    this.onSubmitResults = this.onSubmitResults.bind(this);
    this.onSubmitSettings = this.onSubmitSettings.bind(this);
    this.onLogin = this.onLogin.bind(this);

    this.state.auth = (process.env.REACT_APP_REQUIRE_AUTH === 'false') ? {disabled: true} : {};
    

    if (this.state.auth.disabled) {
      const steps = [...this.state.steps];
      steps.splice( steps.indexOf('login'), 1);
      this.state.steps = steps;
    }
    this.state.showSettings = (process.env.REACT_APP_DISPLAY_SETTINGS === 'true');
    if (!this.state.showSettings) {
      const steps = [...this.state.steps];
      steps.splice( steps.indexOf('settings'), 1);
      this.state.steps = steps;
    }

    const n_down = parseInt(process.env.REACT_APP_STAIRCASE_N_DOWN) || 3;
    const initial_delta = process.env.REACT_APP_STAIRCASE_INITIAL_DELTA || 2000;
    const max_delta = process.env.REACT_APP_STAIRCASE_MAX_DELTA || 2000;
    const num_reversals = process.env.REACT_APP_STAIRCASE_MAX_REVERSALS || 6;
    const num_trials = process.env.REACT_APP_STAIRCASE_MAX_TRIALS || 30;
    const reference_duration = process.env.REACT_APP_STAIRCASE_REF_DURATION || 5000;
    const settings = {
      initial_delta: parseInt(initial_delta),
      max_delta: parseInt(max_delta),
      n_down,
      num_reversals,
      num_trials,
      reference_duration
    }

    if (this.state.showSettings) {
      settings.initial_delta = 1400;
      settings.num_trials = 3;
      settings.reference_duration = 3000;
    }
    this.state.settings = settings;

    

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
      console.log('// all done and finished');
      return; 
    }

    this.setState({stepIndex: this.state.stepIndex + 1});
  }

  onLogin(auth) {
    this.setState({auth});

    // if (ADMINS.includes(auth.participantId)) {
    //   this.setState({
    //     settings: {
    //       initial_delta: 1400,
    //       max_delta: 2000,
    //       n_down: 2,
    //       num_reversals: 6,
    //       num_trials: 3,
    //       reference_duration: 3000
    //     }
    //   })

      // DEBUGGING:
      // this.setState({
      //   stepIndex: this.state.steps.indexOf('results')
      // })
    // }
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
    console.log("env2", process.env);
    console.log("steps", this.state.steps);
    console.log("ndown", this.state);

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
      return (
        <Intro finishStep={this.advanceStep} />
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
        <Results 
          results={this.state.results}
          settings={this.state.settings} 
          auth={this.state.auth}
          dataAPIEnabled={process.env.REACT_APP_DATA_API_ENABLED === "true"}
          />
      )
    }
  }
}

export default TaskManager
