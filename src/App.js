import React, { Component } from 'react';
import './App.css';
import Uploader from './upload-redux/containers/app'

class App extends Component {
  render() {
    console.log(this.props);
    return (
      <div className="App">
          <Uploader />
      </div>
    );
  }
}

export default App;
