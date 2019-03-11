import React, { Component } from 'react';
import axios from 'axios';

class DataAPIOption extends Component {
  state = {
    dataAPIMessages: [],
    authToken: null
  }

  constructor(props) {
    super(props);

    this.sendData = this.sendData.bind(this);
    this.setAuthToken = this.setAuthToken.bind(this);
    this.addDataAPIMessage = this.addDataAPIMessage.bind(this);
  }

  setAuthToken() {
    const authToken = this.authTokenInput.value;

    this.setState({authToken});
  }

  addDataAPIMessage(message) {
    const dataAPIMessages = [...this.state.dataAPIMessages]
    dataAPIMessages.push(message)
    this.setState({dataAPIMessages})
  }

  sendData() {
    const DATA_API_URL = "https://6rn8zjuxgg.execute-api.us-east-1.amazonaws.com/dev/submit-data/"
    
    console.log(this.props.results)
    console.log("SENDING DATA with token: ", this.state.authToken);
    axios.defaults.headers.common['Authorization'] = this.state.authToken;
    
    const postData = {
      submission: {
        'participant_data': {
          'type': 'bucket',
          'filename': '{participantId}/participant-{participantId}.{timestamp}.json',
          'data': this.props.results.data
        },
        'experiment_data': {
          'type': 'db_table',
          'data': this.props.results.computed_data
        }
      } 
    }
    axios.post(DATA_API_URL, postData).then(response => {
      this.addDataAPIMessage(response)
    }, error => {
      const status = error.status || error.response.status || null;
      if (status === 403) {
        this.setState({authToken: ""});
      }

      const response = error.response || error;
      console.log("ERROR: ", response);
      this.addDataAPIMessage(response);
    })   

  }

  render() {
    return (
      <div className="results-api">
        <h3>Data API:</h3>

        {!this.state.authToken && (
          <div className="authToken-input">
            <input 
              ref={(e) => this.authTokenInput = e}
              type="text" 
              name="authToken" />
            <button
              onClick={this.setAuthToken}
              className="btn btn-primary">
              SET TOKEN</button>
          </div>
        )}
        {this.state.authToken && (
          <div className="submit-data-btn">
            <button
              onClick={this.sendData}
              className="btn btn-primary">
              SEND DATA</button>
          </div>
        )}

        

        <div className="api-messages">
          {this.state.dataAPIMessages.map((msg, ind) => {
            return (
              <pre key={ind}>{JSON.stringify({
                data: msg.data,
                status: msg.status
              }, null, 2)}</pre>
            )
          })}
        </div>
      </div>
    )
  }
}

export default DataAPIOption;