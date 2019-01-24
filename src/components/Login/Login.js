import React, { Component } from 'react'
import axios from 'axios';

class Login extends Component {
  state = {
    token: 'mDn7CymhatBTyIlCDvshyA'
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
    const DATA_API_URL = "https://ljcs7k58sf.execute-api.us-east-1.amazonaws.com/dev/authorize/"

    axios.defaults.headers.common['Authorization'] = this.state.token;
    
    axios.post(DATA_API_URL, {}).then(response => {
      this.setState({message: null})
      this.props.finishLogin(response.data)
    }, error => {
      console.log('error.response: ', error.response)
      if (error.response.status === 403) {
        this.setState({
          message: "Token validation failed.",
          token: ""
        })
      }
    }) 
  }

  render() {
    return (
      <div className="vertical-center">
          <div className="container text-center">
            <p>Please enter your token:</p>
            <div className="form-group">
              <p>
                <input name="token" 
                  value={this.state.token}
                  onChange={this.handleFieldChange} />
              </p>

              { this.state.message && (
                <div>
                  <pre>{this.state.message}</pre>
                </div>
              )}
              
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
