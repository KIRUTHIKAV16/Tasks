import React, { Component } from 'react';

class NameChanger extends Component {
  constructor(props) {
    super(props);
    // Initialize state
    this.state = {
      name: 'Anu',
      lname: 'Selvam',
      age: 25
    };
  }

  // Method to change state properties
  changeState = () => {
    this.setState({
      name: 'Keerthi',
      lname: 'Kumar',
      age: 22
    });
  }

  render() {
    return (
      <div>
        <h1>Person Info</h1>
        <p>Name: {this.state.name}</p>
        <p>Last Name: {this.state.lname}</p>
        <p>Age: {this.state.age}</p>
        <button onClick={this.changeState}>Change Name</button>
      </div>
    );
  }
}

export default NameChanger;
