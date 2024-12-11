import React, { Component } from 'react';
import './Headingpara.css';

class Headingpara extends Component {
  render() {
    return (
      <div>
        <h1 className="heading">Welcome to My React App</h1>
        <p className="paragraph">
          Rendering heading and paragraph using React Class Component.
        </p>
      </div>
    );
  }
}

export default Headingpara;
