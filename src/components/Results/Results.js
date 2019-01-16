import React, { Component } from 'react';
import axios from 'axios';
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

    this.sendData = this.sendData.bind(this)
  }

  componentDidMount() {
    // const points = [
    //   {x: 5.416, y: 350, markerColor: "red", markerType: "cross", markerSize: 10},
    //   {x: 9.631, y: 879.1602510283531, markerColor: "green", markerType: "triangle", markerSize: 10}
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

  sendData() {
    const DATA_API_URL = "https://ljcs7k58sf.execute-api.us-east-1.amazonaws.com/dev/study-data/"
    
    console.log("SENDING DATA")
    console.log(this.props.results)

    axios.post(DATA_API_URL, this.props.results).then(response => {
      console.log("SUCCESS")
      console.log('response', response)
    }).catch(error => {
      console.log("ERROR: ", error)
    })   

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
        <div className="results-api">
          <h3>Data API:</h3>
          <button
            onClick={this.sendData}
            className="btn btn-primary">
            SEND DATA</button>
          <pre>

          </pre>
        </div>
      </div>
    )
  }
}

export default Results
