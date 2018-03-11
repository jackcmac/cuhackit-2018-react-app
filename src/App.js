import React, { Component } from 'react';
import logo from './scribble.png';
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
          <img src={logo} className="App-logo" alt="scribble" />
        </header>
        <div class="col-6 col-sm-offset-5">
          <p><input value="Upload File" type="file" id="inputFileToLoad" onChange={(e) => this.handleChange(e.target.files)} /></p>
        </div>

          <div id="imgTest">
  
          </div>
          <div class=".Process">
            <a type="button" onClick={this.recognize} className="btn btn-success">PROCESS</a>
          </div>
        </div>
    );
  }
}

export default App;
