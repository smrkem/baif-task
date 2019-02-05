import React from 'react';


const Intro = (props) => {
  return (
    <div className="vertical-center">
      <div className="container text-center">
        <h2>Welcome to the BAIF task!</h2>
        <p>BAIF intro and instructions placeholder.</p>
        <button
          className="btn btn-primary btn-lg"
          onClick={props.finishStep}
          >Begin</button>
      </div>
    </div>
  )
}

export default Intro;