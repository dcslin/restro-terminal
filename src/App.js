import React, { Component } from 'react'
import Webcam from 'react-webcam'
import Countdown from 'react-countdown-now'
import 'whatwg-fetch'
import './App.css'

import depositImage1 from './images/DepositNow-1.png'
import depositImage2 from './images/DepositNow-2.png'

const Step = {
  WELCOME: 'welcome',
  PREVIEW: 'preview',
  IDENTIFY: 'identify',
  FINISH: 'finish',
}

const detectObject = async (image) => {
  const response = await fetch('http://167.99.64.250:5000/identify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({image}),
  })
  return response.json()
}

class App extends Component {
  render () {
    return (
      <div>
        <MainBody/>
      </div>
    )
  }
}

class MainBody extends Component {
  constructor (props) {
    super(props)
    this.state = {
      step: null,
      prediction: null,
      image: null,
    }
  }

  gotoStep = (step) => {
    this.setState({step})
  }

  setPrediction = (image, prediction) => {
    this.setState({image, prediction})
  }

  render () {
    let ComponentForRender

    switch (this.state.step) {
      case Step.PREVIEW:
        ComponentForRender = Preview
        break;
      case Step.IDENTIFY:
        ComponentForRender = Identify
        break;
      case Step.FINISH:
        ComponentForRender = Finish
        break
      default:
        ComponentForRender = Welcome
    }
    return <ComponentForRender
      prediction={this.state.prediction}
      image={this.state.image}
      gotoStep={this.gotoStep}
      setPrediction={this.setPrediction}
    />
  }
}

class Welcome extends Component {
  render () {
    return (
      <div className="Welcome">
        <h1 className="Logo">Welcome to Restro!</h1>
        <button
          className="DepositNow"
          onClick={() => this.props.gotoStep(Step.PREVIEW)}
        >
          <img src={depositImage1} alt="deposit-now-1"/>
          <img src={depositImage2} alt="deposit-now-2"/>
        </button>
      </div>
    )
  }
}

class Preview extends Component {
  capture = async () => {
    const imageBase64 = this.webcam.getScreenshot().split(',')[1]
    const detectedResult = await detectObject(imageBase64)
    this.props.setPrediction(imageBase64, detectedResult.prediction)
    this.props.gotoStep(Step.IDENTIFY)
  }

  render () {
    return (
      <div>
        <Webcam
          audio={false}
          height={350}
          ref={webcam => this.webcam = webcam}
          screenshotFormat="image/jpeg"
          width={350}
        />
        <button onClick={this.capture}>scan!</button>
      </div>
    )
  }
}

class Identify extends Component {


  renderPrediction() {

    const { prediction } = this.props

    if (! prediction) {
      const message = ">.< Sorry no object is detected."
      return <div>
        {message}
      </div>
    } else {
      return <div>
        Identify Result: {prediction}
      </div>
    }
  }

  render () {
    return (
      <div>
        <div>
          <img src={'data:image/jpeg;base64,' + this.props.image} alt="prediction" />
        </div>

        <div>
          {this.renderPrediction()}
        </div>

        <button>
          Report Error
        </button>

        <button onClick={() => this.props.gotoStep(Step.PREVIEW)}>
          Add More
        </button>

        <button onClick={() => this.props.gotoStep(Step.FINISH)}>
          Done
        </button>
      </div>
    )
  }
}

class Finish extends Component {
  countdown = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      setTimeout(() => this.props.gotoStep(Step.WELCOME), 0)
      return <div />
    } else {
      return <span>Take you back to welcome page in {parseInt(seconds, 10)}s.</span>
    }
  }

  render () {
    return (
      <div>
        <h1>Thank you! Dispensing Tissue for you!</h1>
        <Countdown
          date={Date.now() + 5000}
          renderer={this.countdown}
        />
      </div>
    )
  }
}

export default App
