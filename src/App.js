import './App.css';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Rank from './Components/Rank/Rank';
import ParticlesBg from 'particles-bg'
import { Component } from 'react';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';

const returnClarifaiJSONRequest = (imageURL) => {
  const PAT = 'b8ff20a063114b7faef50ce138ccaf19';
  const USER_ID = 'st0w3';       
  const APP_ID = 'FacialRecognition';
  const IMAGE_URL = imageURL;

  const raw = JSON.stringify({
      "user_app_id": {
          "user_id": USER_ID,
          "app_id": APP_ID
      },
      "inputs": [
          {
              "data": {
                  "image": {
                      "url": IMAGE_URL
                  }
              }
          }
      ]
});

console.log(raw);

  return {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Authorization': 'Key ' + PAT
    },
    body: raw
};
}

class App extends Component {
  constructor()
  {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {}, 
      route: 'signin',
      isSignedIn: false
    }
  }

  calculateFaceLocation = (data) =>
  {
    console.log(data);
    const boundingBox = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = image.width;
    const height = image.height;

    return {
      left: boundingBox.left_col * width,
      top: boundingBox.top_row * height,
      right: width - (boundingBox.right_col * width),
      bottom: height - (boundingBox.bottom_row * height)
    }
  }

  displayFaceBox(box){
    console.log(box);
    this.setState({box});
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value})
  }

  onSubmit = () => {
    this.setState({imageURL: this.state.input});
    console.log('url',this.state.imageURL);
    fetch('https://api.clarifai.com/v2/models/' + 'face-detection' + '/outputs', returnClarifaiJSONRequest(this.state.input))
    .then(response => response.json())
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .then(response => {
      if (response) {
        fetch ('http://localhost:3000/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
      }
    })
    .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState({isSignedIn: false});
    }
    else if (route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} color="#ffffff" />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home' 
          ?<div>
              <Logo /> 
              <Rank />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
              <FaceRecognition box={box} imageURL={imageURL}/>
          </div>
          : (route === 'signin')
          ? <SignIn onRouteChange={this.onRouteChange}/>
          : <Register onRouteChange={this.onRouteChange} />
        }
      </div>
    );
  }
}

export default App;
