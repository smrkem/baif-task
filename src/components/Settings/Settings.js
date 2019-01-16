import React from 'react'


class Settings extends React.Component {
  state = {
    num_reversals: 6,
    num_trials: 30,
    reference_duration: 5000,
    n_down: 3,
    initial_delta: 2000,
    max_delta: 2000
  }

  constructor(props) {
    super(props);

    this.onSubmit = this.onSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();

    this.props.submitSettings(this.state);
    this.props.finishStep();
  }

  handleFieldChange(e) {
    this.setState({[e.target.name]: parseInt(e.target.value)});
  }

  render() {
    return (
      <div className="vertical-center settings-page">
        <div className="container">
          <h1>Settings</h1>
          <form onSubmit={this.onSubmit}>
            <table>
              <tbody>
              <tr>
                <td>Max Number of Trials:</td>
                <td>
                  <input 
                    name="num_trials"
                    value={this.state.num_trials} 
                    onChange={this.handleFieldChange} 
                    type="number"
                  />
                </td>
                <td>Initial Delta (ms):</td>
                <td>
                  <input 
                    name="initial_delta"
                    value={this.state.initial_delta} 
                    onChange={this.handleFieldChange} 
                    type="number"
                    step={50}
                  />
                </td>
              </tr>
              
              <tr>
                <td>Number of Reversals:</td>
                <td>
                  <input 
                    name="num_reversals"
                    value={this.state.num_reversals} 
                    onChange={this.handleFieldChange} 
                    type="number"
                  />
                </td>
                <td>Max Delta (ms):</td>
                <td>
                  <input 
                    name="max_delta"
                    value={this.state.max_delta} 
                    onChange={this.handleFieldChange} 
                    type="number"
                    step={50}
                  />
                </td>
              </tr>
              
              <tr>
                <td>N-down:</td>
                <td>
                  <input 
                    name="n_down"
                    value={this.state.n_down} 
                    onChange={this.handleFieldChange} 
                    type="number"
                  />
                </td>
                <td>Reference Pulse Duration (ms):</td>
                <td>
                  <input 
                    name="reference_duration"
                    value={this.state.reference_duration} 
                    onChange={this.handleFieldChange} 
                    type="number"
                    step={100}
                  />
                </td>
              </tr>
              </tbody>
            </table>


            



            <div>
              <ul>
                <li>The experiment will end after <em>Number of Reversals</em> or <em>Max Number of Trials</em>, whichever comes first.</li>
                <li><em>Reference Pulse Duration</em> is total pulse duration including expansion, pause, contraction, pause.</li>
              </ul>
            </div>

            <button type="submit" className="btn btn-primary">Submit</button>
          </form>
        </div>
      </div>
    )
  }
}

export default Settings
