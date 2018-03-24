import React, { Component } from 'react';
import './App.css';
import { Navbar, Jumbotron, Button } from 'react-bootstrap';
import Webcam from 'react-webcam';

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
    constructor(props) {
        super(props);
        this.state = {
            step: null
        };
    }

    handleClick() {
        this.setState({step: "preview"});
    }

    toIdentify() {
        this.setState({step: "identify"});
    }

    toFinish() {
        this.setState({step: "finish"});
    }

    render () {
        if (this.state.step == "preview" ) {
            return <WebcamCapture onClick={() => this.toIdentify()}/>;
        }
        if (this.state.step == "identify" ) {
            return <Identify onClick={() => this.toFinish()} />;
        }
        if (this.state.step == "finish" ) {
            return <Finish />;
        }
        return <Welcome onClick={() => this.handleClick()}/>;
    }
}

class Identify extends React.Component {
    render () {
        return  (
            <div>
            <h1>Identify result:</h1>
            <h2>One water bottle is received!</h2>

            <Button bsStyle="success" > Report Error </Button>
            <Button bsStyle="success" > Add More</Button>
            <Button bsStyle="success" onClick={() => this.props.onClick()}> Done </Button>
            </div>
        );
    }
}


class Welcome extends React.Component {
    render () {
        return (
            <div>
                <h1>Welcome to Restro!</h1>
                <h3>Please place the recyclable in the container and click "Scan"</h3>
                <Button bsStyle="success" onClick={() => this.props.onClick()}> Scan </Button>
            </div>
        );
    }
}


class WebcamCapture extends React.Component {
  setRef = (webcam) => {
    this.webcam = webcam;
  }

  capture = () => {
    const imageSrc = this.webcam.getScreenshot();
    alert("sending identify");
    this.props.onClick();
  };

  render() {
    return (
      <div>
        <Webcam
          audio={false}
          height={350}
          ref={this.setRef}
          screenshotFormat="image/jpeg"
          width={350}
        />
        <button onClick={this.capture}>scan!</button>
      </div>
    );
  }
}

class Finish extends React.Component {
    render () {
        return (
            <h1>Thank you! Dispensing Tissue for you!</h1>
        );
    }
}

export default App;
