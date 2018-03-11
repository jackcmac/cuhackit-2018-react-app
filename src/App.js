import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
var AWS = require('aws-sdk');

class App extends Component {
  constructor(props) {
    super(props);
    this.fileName = "";
    this.recognize = this.recognize.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  recognize() {
    console.log('print dum dum');
    console.log(this.fileName);
    let rekognition = new AWS.Rekognition();
    rekognition.DetectText(
      {
        Bytes: this.fileName,
        /*Image: {
          S3Object: {
            Bucket: "rekognitionnn",
            Name: "nuclear-codes/source.jpg"
          }
        }*/
      }
    )
  }

  handleChange(selectorFiles) {
    console.log(selectorFiles);
    this.fileName = selectorFiles[0];
  }

  performClick(elemId) {
    var elem = document.getElementById(elemId);
    this.fileName = elem.value
    if (elem && document.createEvent) {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, false);
      elem.dispatchEvent(evt);
    }
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        {/*<a type="button" onClick={this.performClick('theFile')} className="btn btn-danger btn-block">UPLOAD</a>
        <a type="file" ></a> */}
        <input type="file" id="theFile" onChange={(e) => this.handleChange(e.target.files)} />
        <a type="button" onClick={this.recognize} className="btn btn-success btn-block">PROCESS</a>
      </div>
    );
  }
}

export default App;
