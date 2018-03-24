import React, { Component } from 'react';
import webcamgirl from './webcam.jpg';
import './App.css';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';


//class App extends Component {
//  render() {
//    return (
//      <div className="App">
//        <header className="App-header">
//          <img src={logo} className="App-logo" alt="logo" />
//          <h1 className="App-title">Welcome to React</h1>
//        </header>
//        <p className="App-intro">
//          To get started, edit <code>src/App.js</code> and save to reload.
//        </p>
//      </div>
//    );
//  }
//}

class App extends Component {
    render() {
        return (
            <div>
                <MainBody />
            </div>
        );
    }
}

class MainBody extends React.Component {
    render () {
        return (
            <div>
                <Welcome />
                <WebcamCapture />
            </div>
        );
    }
}

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: "welcome"
        };
    }

    render () {
        return (
            <div>
                <h1>Welcome to Restro!</h1>
                <h3>Please place the recyclable in the container and click "Scan"</h3>
                <Button bsStyle="success" onClick={() => this.setState({step: 'preview'})}> Scan </Button>
                <br />
            </div>
        );
    }
}

class WebcamCapture extends React.Component {
  render() {
    return (
      <div>
        <img src={webcamgirl} alt="logo" />
        <br />
        <Button onClick={this.capture}>Scan!</Button>
      </div>
    );
  }
}

export default App;
