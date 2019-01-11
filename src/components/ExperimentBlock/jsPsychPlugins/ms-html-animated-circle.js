const jsPsych = window.jsPsych;
const minRadius = 50;
const maxRadius = 150;
const pauseTime = 200;
const radiusRange = maxRadius - minRadius;

jsPsych.plugins['ms-animated-circle'] = (function(){

  var plugin = {};

  plugin.info = {
    name: 'ms-animated-circle',
    parameters: {
      stimulus: {
        type: jsPsych.plugins.parameterType.HTML_STRING,
        pretty_name: 'Stimulus',
        default: '<canvas id="ms-animated-circle" width="400" height="400"></canvas>',
        description: 'The HTML string to be displayed'
      },
      duration: {
        type: jsPsych.plugins.parameterType.INT,
        pretty_name: 'Animation Duration',
        default: null,
        description: 'Number of milliseconds for the animation to occurr'
      }
    }
  }

  plugin.trial = function(display_element, trial){
    console.log('trial: ', trial.duration);

    // Check for params:
    if (trial.duration === null) {
      throw new Error("No animation duration specified");
    }

    var new_html = '<div id="ms-animated-circle-stimulus">'+trial.stimulus+'</div>';
    display_element.innerHTML = new_html;

    var circleCanvas = document.getElementById("ms-animated-circle");
    if (!circleCanvas || !circleCanvas.getContext("2d")) {
      throw new Error("Invalid html or browser does not support canvas.");
    }
    var ctx = circleCanvas.getContext("2d");

    const width = circleCanvas.width;
    const height = circleCanvas.height;
    const hCenter = Math.floor(width/2);
    const vCenter = Math.floor(height/2);
    const expStartTime = new Date(jsPsych.startTime()).getTime();
    const startTime = new Date().getTime();
    const halfTime = Math.round(trial.duration / 2);
    const expandTimeMax = halfTime - pauseTime;
    const contractTimeStart = halfTime;
    const contractTimeMax = trial.duration - pauseTime;

    var data = {
      expansion_start_time_elapsed: startTime - expStartTime,
      expansion_stop_time_elapsed: null,
      contraction_start_time_elapsed: null,
      contraction_stop_time_elapsed: null
    }

    var drawCircle = function() {
      const timeElapsed = new Date().getTime() - startTime;

      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, width, height);

      let newRadius = null;
      if (timeElapsed < expandTimeMax) {
        const percentTimeElapsed = timeElapsed / expandTimeMax;
        const radiusDelta = percentTimeElapsed * radiusRange;
        newRadius = Math.min(minRadius + radiusDelta, maxRadius);
      }
      else if (timeElapsed < contractTimeStart) {
        if (!data.expansion_stop_time_elapsed) {
          data.expansion_stop_time_elapsed = new Date().getTime() - expStartTime;
        }
        newRadius = maxRadius;
      }
      else if (timeElapsed < contractTimeMax) {
        if (!data.contraction_start_time_elapsed) {
          data.contraction_start_time_elapsed = new Date().getTime() - expStartTime;
        }
        const percentTimeElapsed = (timeElapsed - halfTime) / expandTimeMax;
        const radiusDelta = percentTimeElapsed * radiusRange;
        newRadius = Math.max(maxRadius - radiusDelta, minRadius);
      }
      else {
        if (!data.contraction_stop_time_elapsed) {
          data.contraction_stop_time_elapsed = new Date().getTime() - expStartTime;
        }
        newRadius = minRadius;
      }
      
      ctx.beginPath();
      ctx.fillStyle = "#bada55";
      ctx.arc(hCenter, vCenter, newRadius, 0, 2 * Math.PI);
      ctx.fill();

      if (timeElapsed >= trial.duration) {
        end_trial();
      }
      else {
        jsPsych.pluginAPI.setTimeout(drawCircle, 20);
      }
    }



    
    

    
    // function to end trial when it is time
    var end_trial = function() {
      // kill any remaining setTimeout handlers
      jsPsych.pluginAPI.clearAllTimeouts();

      // gather the data to store for the trial
      var trial_data = data;

      // clear the display
      display_element.innerHTML = '';

      
      // move on to the next trial
      jsPsych.finishTrial(trial_data);
    };

    drawCircle();

  }

  return plugin;

})();