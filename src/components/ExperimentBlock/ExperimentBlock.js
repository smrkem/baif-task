import React, { Component } from 'react';
import 'jspsych/jspsych'
import 'jspsych/css/jspsych.css'
import 'jspsych/plugins/jspsych-html-keyboard-response'
import './jsPsychPlugins/ms-html-animated-circle'
import 'jspsych/plugins/jspsych-fullscreen'
import './ExperimentBlock.css';
import { Staircase } from './staircase';
import { randomFromInterval } from '../../utils';


const jsPsych = window.jsPsych;

let staircase = null;
let REFERENCE_DURATION = null;
let NUM_REVERSALS = null;
let NUM_TRIALS = null;

class ExperimentBlock extends Component {
  experiment = null;

  constructor(props) {
    super(props);

    const { settings } = props;
    console.log('settings: ', settings);
    REFERENCE_DURATION = settings.reference_duration;
    NUM_TRIALS = settings.num_trials;
    NUM_REVERSALS = settings.num_reversals;

    staircase = new Staircase({
      firstVal: settings.initial_delta,
      down: settings.n_down,
      stepSizes: settings.stepsizes,
      maxValue: settings.max_delta,
      verbosity: 1
    });
  }

  instructions = {
    type: "html-keyboard-response",
    data: { instructions: true},
    stimulus: () => {
      return (
        `<div class="instructions">` + 
          `<div class="icon"></div>` +
          `<div class="copy">This is my exp copy :)</div>` +
        `</div>` +
        `<div class="instructions-response">` +
          `<p class="continue-btn">Press any key to continue.</p>` +
        "</div>"
      )
    }
  }

  referencePulse = {
    type: "ms-animated-circle",
    data: {referencePulse: true},
    duration: function() { return REFERENCE_DURATION; }
  }

  targetPulse = {
    type: "ms-animated-circle",
    data: {targetPulse: true},
    duration: function() {
      const delta = staircase.getValue();
      let sign = !!randomFromInterval(0,2) ? 1 : -1;
      if ((delta + 1200) > REFERENCE_DURATION) {
        sign = 1;
      }
      return REFERENCE_DURATION + (sign * delta);
    },
    on_finish: function(data) {
      data.pulse_duration_delta = staircase.getValue();
      data.pulse_duration = this.duration;
      data.correct_answer = this.duration < REFERENCE_DURATION ? 'faster' : 'slower';
    }
  }

  forcedChoice = {
    type: "html-keyboard-response",
    data: {forcedChoice: true},
    stimulus: () => {
      return (
        `<div class="forcedChoice">` +
          `<p>Was the second pulse faster (1) or slower (2) than the first pulse?</p>` +
          `<p>Press keys 1 or 2 to respond.</p>` +
        `</div>`
      )
    },
    choices: ['1', '2'],
    on_finish: function(data) {
      const response = String.fromCharCode(data.key_press);
      const targetData = JSON.parse(
        jsPsych.data.getLastTimelineData().filter({targetPulse: true}).json()
      ).pop();
      data.response = response;
      if (targetData.correct_answer === 'faster') {
        data.responded_correctly = (response === '1');
      }
      else {
        data.responded_correctly = (response === '2');
      }

      staircase.addResponse(data.responded_correctly);
      data.reversal_index = staircase.reversal_indexes.length;
      
      if (staircase.reversal_indexes.length >= NUM_REVERSALS) {
        jsPsych.endExperiment();
      }
    }

    
  }

  feedback = {
    type: "html-keyboard-response",
    stimulus: () => {
      const trialData = JSON.parse(
        jsPsych.data.getLastTimelineData().filter({forcedChoice: true}).json()
      ).pop();
      const msg = trialData.responded_correctly ? "Correct" : "Incorrect";

      return (
        `<div class="trialFeedback">${msg}</div>`
      )
    },
    response_ends_trial: false,
    data: {feedback: true},
    trial_duration: 500
  }


  fixation = {
    type: "html-keyboard-response",
    stimulus: '<div style="font-size: 60px;">+</div>',
    response_ends_trial: false,
    data: {fixation: true},
    trial_duration: 500
  }

  
  getTimeline() {
    const timeline = [];

    // const test_procedure = {
    //   timeline: [
    //     this.fixation,
    //     this.forcedChoice
    //   ],
    //   repetitions: 2
    // }

    this.fixation.data.beginTrial = true;

    const test_procedure = {
      timeline: [
        this.fixation,
        this.referencePulse,
        this.targetPulse,
        this.forcedChoice,
        this.feedback
      ],
      repetitions: NUM_TRIALS
    }
    
    timeline.push(test_procedure);

    return timeline;
  }

  initExperiment() {
    jsPsych.init({
      timeline: this.getTimeline(),
      on_finish: this.onExperimentFinish.bind(this),
      display_element: 'jspsych-experiment'
    })
    this.experiment.focus()
  }

  onExperimentFinish() {
    // console.log('done');
    const trialData = JSON.parse(
      jsPsych.data.get().json()
    );
    console.log('done data: ', trialData);
    console.log('staircase:', staircase);

    let data = this.collectTrials(trialData);
    // data.trialData = trialData;

    // gather results
    this.props.submitResults({
      data: data,
      reversalIndices: staircase.reversal_indexes
    });
    this.props.finishStep();
  }

  collectTrials(trialData) {
    const trials = [];
    let currentTrial = null
    let trialIndex = 1
    trialData.forEach( (trialPart) => {
        // delete trialPart.stimulus

        if (trialPart.beginTrial) {
            if (currentTrial) {
                trials.push(currentTrial);
            }
            currentTrial = {index: trialIndex++};
        }

        [
          'fixation',
          'referencePulse',
          'targetPulse',
          'forcedChoice',
          'feedback'
        ].forEach((n) => {
          if (trialPart[n]) {
            currentTrial[`${n}_time_elapsed`] = trialPart.time_elapsed;
          }
        });

        if (trialPart.targetPulse) {
          currentTrial.pulse_duration_delta = trialPart.pulse_duration_delta;
          currentTrial.correct_answer = trialPart.correct_answer;
        }

        if (trialPart.forcedChoice) {
          currentTrial.response = trialPart.response;
          currentTrial.responded_correctly = trialPart.responded_correctly;
          currentTrial.reversal_index = trialPart.reversal_index;
        }
    });
    trials.push(currentTrial);

    return trials;
  }

  componentDidMount() {
      this.initExperiment()
  }

  render() {
    return (
      <div id="jspsych-experiment"
          ref={(exp) => { this.experiment = exp }}
        >
          Experiment here
        </div>
    )
  }
}

export default ExperimentBlock;