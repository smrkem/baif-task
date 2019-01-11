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
const refDuration = 5000;

let staircase = null;

class ExperimentBlock extends Component {
  experiment = null;

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
    duration: refDuration,
  }

  targetPulse = {
    type: "ms-animated-circle",
    data: {targetPulse: true},
    duration: function() {
      const delta = staircase.getValue();
      let sign = 1;
      if ((delta + 1200) < refDuration) {
        sign = !!randomFromInterval(0,2) ? 1 : -1;
      }
      return refDuration + (sign * delta);
    },
    on_finish: function(data) {
      data.presentation_duration = this.duration;
      data.correct_answer = this.duration < refDuration ? 'faster' : 'slower';
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
    }
  }

  fixation = {
    type: "html-keyboard-response",
    stimulus: '<div style="font-size: 60px;">+</div>',
    response_ends_trial: false,
    data: {fixation: true},
    trial_duration: 500
  }

  constructor(props) {
    super(props);

    staircase = new Staircase({
      firstVal: 2000,
      down: 3,
      stepSizes: [8, 4, 4, 2, 2]
    });
  }
  
  getTimeline() {
    const timeline = [];

    const test_procedure = {
      timeline: [
        this.fixation,
        this.referencePulse,
        this.targetPulse,
        this.forcedChoice
      ],
      repetitions: 3
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