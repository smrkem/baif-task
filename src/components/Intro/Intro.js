import React from 'react';


const Intro = (props) => {
  return (
    <div className="vertical-center">
      <div className="container text-center">
        <h2>Welcome to the change detection task!</h2>
        <p>You will see a circle pulse (grow and then shrink) twice.</p>
        <p>Your task is to determine if the second pulse is faster or slower than the first pulse.</p>
        <p>Please press any key to continue...</p>
        <button
          className="btn btn-primary btn-lg"
          onClick={props.finishStep}
          >Begin</button>
      </div>
    </div>
  )
}

export default Intro;