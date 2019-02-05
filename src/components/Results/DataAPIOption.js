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
    console.log('auth token:', authToken);

    this.setState({authToken});
  }

  addDataAPIMessage(message) {
    const dataAPIMessages = [...this.state.dataAPIMessages]
    dataAPIMessages.push(message)
    this.setState({dataAPIMessages})
  }

  sendData() {
    const DATA_API_URL = "https://ljcs7k58sf.execute-api.us-east-1.amazonaws.com/dev/study-data/"
    
    console.log(this.props.results)
    console.log("SENDING DATA with token: ", this.state.authToken);
    axios.defaults.headers.common['Authorization'] = this.state.authToken;
    

    axios.post(DATA_API_URL, this.props.results).then(response => {
      this.addDataAPIMessage(response)
    }, error => {
      console.log("ERROR: ", error.response)
      if (error.response.status === 403) {
        this.setState({authToken: ""});
      }
      this.addDataAPIMessage(error.response)
    })   

  }

  render() {
    console.log('auth:', this.props.auth);
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
        {
          this.state.authToken && (
            <div className="submit-data-btn">
              <button
                onClick={this.sendData}
                className="btn btn-primary">
                SEND DATA</button>
            </div>
          )
        }

        

        <div>
          {this.state.dataAPIMessages.map((msg, ind) => {
            return (
              <pre key={ind}>{JSON.stringify({
                data: msg.data,
                status: msg.status
              }, null, 2)}</pre>
            )
          })}
        </div>
        
        <pre>
          
        </pre>
      </div>
    )
  }
}

export default DataAPIOption;