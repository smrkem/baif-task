import React, { Component } from 'react';
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
    this.state = { points };
  }

  componentDidMount() {
    // const points = [
    //   {x: 5.416, y: 350, markerColor: "red", markerType: "cross", markerSize: 10},
    //   {x: 9.631, y: 879.1602510283531, markerColor: "green", markerType: "triangle", markerSize: 10},
    //   {x: 13.84, y: 879.1602510283531, markerColor: "green", markerType: "triangle", markerSize: 10},
    //   {x: 19.228, y: 879.1602510283531, markerColor: "red", markerType: "cross", markerSize: 10},
    //   {x: 22.951, y: 2208.3507056806766, markerColor: "red", markerType: "cross", markerSize: 10},
    //   {x: 26.215, y: 2547.126173613898, markerColor: "#bada55", markerType: "circle", markerSize: 30}
    // ];
    // const ctx = document.getElementById('theGraph').getContext('2d');
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
2
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
