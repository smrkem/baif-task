import React, { Component } from 'react';

import DataAPIOption from './DataAPIOption';

const CanvasJS = window.CanvasJS;


class Results extends Component {

  constructor(props) {
    super(props);
    const points = [];

    let i = 1;
    props.results.data.forEach(r => {
      const point = {
        x: r.forcedChoice_time_elapsed / 1000,
        y: r.pulse_duration_delta,
        markerColor: r.responded_correctly ? "green" : "red",
        markerType: r.responded_correctly ? "triangle" : "cross",
        markerSize: 10
      }
      if (props.results.reversalIndices.includes(i)) {
        point.markerColor = "#bada55";
        point.markerType = "circle";
        point.markerSize = 20;
      }
      points.push(point);
      i++;
    });
    this.state = { 
      points
    };

  }

  componentDidMount() {
    const chart = new CanvasJS.Chart("graph", {
      animationEnabled: true,
      theme: "light2",
      title:{
        text: "Response Staircase"
      },
      axisY:{
        includeZero: true,
        title: "Target Pulse Delta (ms)"
      },
      axisX: {
        title: "Experimental Time (s)"
      },
      data: [{        
        type: "line",       
        dataPoints: this.state.points
      }]
    });

    chart.render();
  }

  render() {
    let { results, settings } = this.props;
    console.log('results with', this.props.results);

    return (
      <div id="results-wr" className="container">
        <h1>Results</h1>
        <hr />
        <div id="graph">
          <canvas id="theGraph" width="800" height="500"></canvas>
        </div>
        <div className="results-settings">
          <h3>With Settings:</h3>
          <pre>
            {JSON.stringify(settings, null, 2)}
          </pre>
        </div>

        {this.props.dataAPIEnabled && (
          <DataAPIOption 
            results={this.props.results}
            auth={this.props.auth}
          />
        )}
        
        <div className="results-data">
          <h3>Results:</h3>
          <pre>
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
        
        
      </div>
    )
  }
}

export default Results
