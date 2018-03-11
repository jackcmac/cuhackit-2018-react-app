import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
//var creds = new AWS.FileSystemCredentials('./configuration.json');
AWS.config.update({
  "accessKeyId": "AKIAJZPFBAC6NYBKXALA",
  "secretAccessKey": "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",
  "region": "us-east-1"
});
AWS.config.update({ region: 'us-east-1' });

class App extends Component {
  constructor(props) {
    super(props);
    this.fileName;
    this.recognize = this.recognize.bind(this);
    this.getBinary = this.getBinary.bind(this);
    this.encodeImageFileAsURL = this.encodeImageFileAsURL.bind(this);
  }

  recognize(reader) {
    console.log('print dum dum');
    console.log(this.fileName);

    let rekognition = new AWS.Rekognition();
    let textDetectionPromise = rekognition.detectText(
      {
        Image: {
          Bytes: this.getBinary(reader.result)
        }
      }
    ).promise()

    textDetectionPromise
      .then((data) => {
        console.log(data);
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

    var blob = new Blob([ab], {
      type: "image/jpeg"
    });

    return ab;
  }

  encodeImageFileAsURL() {
    //console.log(selectorFiles);
    //this.fileName = selectorFiles[0];

    var filesSelected = document.getElementById("inputFileToLoad").files;
    if (filesSelected.length > 0) {
      var fileToLoad = filesSelected[0];

      var fileReader = new FileReader();

      fileReader.onload = function (fileLoadedEvent) {
        var srcData = fileLoadedEvent.target.result; // <--- data: base64

        var newImage = document.createElement('img');
        newImage.src = srcData;

        document.getElementById("imgTest").innerHTML = newImage.outerHTML;
        //alert("Converted Base64 version is " + document.getElementById("imgTest").innerHTML);
        //console.log("Converted Base64 version is " + document.getElementById("imgTest").innerHTML);
      }
      fileReader.readAsDataURL(fileToLoad);
      this.fileName = fileReader.result;
    }
  }

  handleChange(selectorFiles) {
    let file = selectorFiles[0];
    let reader = new FileReader();

    reader.readAsDataURL(file);
    this.recognize(reader);
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
        <input type="file" id="inputFileToLoad" onChange={(e) => this.handleChange(e.target.files)} />
        <input id="inputFileToLoad" type="file" />
        <div id="imgTest"></div>
        <a type="button" onClick={this.recognize} className="btn btn-success btn-block">PROCESS</a>
      </div>
    );
  }
}

export default App;
