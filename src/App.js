import React, { Component } from 'react'
import Webcam from 'react-webcam'
import Countdown from 'react-countdown-now'
import 'whatwg-fetch'
import './App.css'

import depositImage1 from './images/DepositNow-1.png'
import depositImage2 from './images/DepositNow-2.png'
import tissue from './images/Tissue.png'

const Step = {
  WELCOME: 'welcome',
  PREVIEW: 'preview',
  IDENTIFY: 'identify',
  REPORT: 'report',
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

const depositToTerminal = async (list) => {
  await fetch('/terminal/3/deposit', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(list),
  })
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
      case Step.REPORT:
        ComponentForRender = Report
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
  constructor (props) {
    super(props)

    this.state = {
      processing: false
    }
  }

  capture = async () => {
    this.setState({processing: true})

    try {
      const imageBase64 = this.webcam.getScreenshot().split(',')[1]
      const detectedResult = await detectObject(imageBase64)
      this.props.setPrediction(imageBase64, detectedResult.prediction)
    } catch (ex) {
      console.log(ex)
    }

    this.props.gotoStep(Step.IDENTIFY)
  }

  render () {
    return (
      <div className="Preview">
        <Webcam
          className="Webcam"
          audio={false}
          ref={webcam => this.webcam = webcam}
          screenshotFormat="image/jpeg"
        />
        <button onClick={this.capture} className="ScanButton">
          {this.state.processing ?  "Processing..." : "SCAN!"}
        </button>
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

  submit = async (next, confirmed) => {

    const list = [
      {
        prediction: this.props.prediction,
        confirmed: confirmed,
        image: this.props.image
      }
    ]

    await depositToTerminal(list)

    this.props.gotoStep(next)
  }

  render () {
    return (
      <div className="Identity">
        <div className="CapturedImage">
          <img src={'data:image/jpeg;base64,' + this.props.image} alt="prediction" />
        </div>

        <div className="IdentifyResult">
          {this.renderPrediction()}
        </div>
        <div className="IdentifyButtonGroup">

          <button style={{color: "red"}} onClick={async () => await this.submit(Step.REPORT, 0)}>
            Report Error
          </button>

          <button onClick={async () => await this.submit(Step.PREVIEW, 1)}>
            ＋ Add More
          </button>

          <button onClick={async () => await this.submit(Step.FINISH, 1)}>
            ✓ Done
          </button>
        </div>
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
      return <span className="Countdown">Take you back to welcome page in {parseInt(seconds, 10)}s.</span>
    }
  }

  render () {
    return (
      <div className="Finish">
        <h1>
          Thank you!
          <br />
          Dispensing Tissue for you!
        </h1>
        <div className="TissueBox">
          <img src={tissue} alt="tissue" />
        </div>
        <Countdown
          date={Date.now() + 10000}
          renderer={this.countdown}
        />
      </div>
    )
  }
}

class Report extends Component {
  countdown = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      setTimeout(() => this.props.gotoStep(Step.PREVIEW), 0)
      return <div />
    } else {
      return <span className="Countdown">Take you back to scanning page in {parseInt(seconds, 10)}s.</span>
    }
  }

  render () {
    return (
      <div className="Finish">
        <h1>
          Thanks for reporting!
        </h1>
        <Countdown
          date={Date.now() + 5000}
          renderer={this.countdown}
        />
      </div>
    )
  }
}

export default App
