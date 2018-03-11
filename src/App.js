import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import creds from './awsConfig.json';

var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.update(creds);

class App extends Component {
  constructor(props) {
    super(props);

    this.reader = new FileReader();
    this.recognize = this.recognize.bind(this);
    this.getBinary = this.getBinary.bind(this);
  }

  recognize() {
    let rekognition = new AWS.Rekognition();
    let textDetectionPromise = rekognition.detectText(
      {
        Image: {
          Bytes: this.getBinary(this.reader.result)
        }
      }
    ).promise()

    textDetectionPromise
      .then((data) => {
        var newData = [];
        var finalStr = "";
        data.TextDetections.forEach(function (entry) {
          if (entry.Type === "LINE") {
            newData.push(entry.DetectedText);
            finalStr += entry.DetectedText + " \n";
          }
        })
        console.log(newData);

        /*
          newData is the list of strings separated by lines
        */

        alert(finalStr);

      }).catch((error) => {
        console.log(error);
      });
  }

  getBinary(encodedFile) {
    var base64Image = encodedFile.split("data:image/jpeg;base64,")[1];
    var binaryImg = atob(base64Image);
    var length = binaryImg.length;
    var ab = new ArrayBuffer(length);
    var ua = new Uint8Array(ab);
    for (var i = 0; i < length; i++) {
      ua[i] = binaryImg.charCodeAt(i);
    }

    return ab;
  }

  handleChange(selectorFiles) {
    let file = selectorFiles[0];

    this.reader.readAsDataURL(file);
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
        <input type="file" id="inputFileToLoad" onChange={(e) => this.handleChange(e.target.files)} />
        <div id="imgTest"></div>
        <a type="button" onClick={this.recognize} className="btn btn-success btn-block">PROCESS</a>
      </div>
    );
  }
}

export default App;
