import React, { Component } from 'react'
import axios from 'axios';

class Login extends Component {
  state = {
    token: null
  }

  constructor(props) {
    super(props);

    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleFieldChange(e) {
    this.setState({[e.target.name]: e.target.value});
  }

  onSubmit() {
    console.log('submitting token: ', this.state.token);

    const DATA_API_URL = "https://ljcs7k58sf.execute-api.us-east-1.amazonaws.com/dev/study-data/"

    axios.defaults.headers.common['Authorization'] = this.state.token;
    
    axios.get(DATA_API_URL).then(response => {
      console.log("SUCCESS")
      console.log('response', response)
    }).catch(error => {
      console.log("ERROR: ", error)
    })   
  }

  render() {
    return (
      <div className="vertical-center">
          <div className="container text-center">
            <p>Please enter your token:</p>
            <div className="form-group">
              <p>
                <input name="token" onChange={this.handleFieldChange} />
              </p>
              
              <button 
                onClick={this.onSubmit}
                className="btn btn-primary">
                Submit
              </button>
            </div>
          </div>
      </div>
    )
  }
}

export default Login
