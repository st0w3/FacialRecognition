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

const initialState = {
  input: '',
  imageURL: '',
  boxes: [], 
  route: 'signin',
  isSignedIn: false,
  ip: '//localhost:8000',
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  }
}
class App extends Component {
  constructor()
  {
    super();
    this.state = {
      input: '',
      imageURL: '',
      boxes: [], 
      route: 'signin',
      isSignedIn: false,
      ip: '//localhost:8000',
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
    }})
  }

  calculateFaceLocations = (data) =>
  {
    return data.outputs[0].data.regions.map(face => {
      const clarifaiFace = face.region_info.bounding_box;
      const image = document.getElementById('inputImage');
      const width = image.width;
      const height = image.height;

      return {
        left: clarifaiFace.left_col * width,
        top: clarifaiFace.top_row * height,
        right: width - (clarifaiFace.right_col * width),
        bottom: height - (clarifaiFace.bottom_row * height)
      }
    });
    
  }

  displayFaceBoxes(boxes){
    console.log(boxes);
    this.setState({boxes: boxes});
  }

  onInputChange = (event) => {
    console.log(event.target.value);
    this.setState({input: event.target.value})
  }

  onSubmit = () => {
    this.setState({imageURL: this.state.input});
    fetch (this.state.ip +'/facedetection', {
          method: 'post',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            imageURL: this.state.input
          })
    })
    .then(response => response.json())
    .then(response => {
      console.log('client response', response);
      if (response) {
        fetch (this.state.ip + '/entries', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: this.state.user.id
          })
        })
        .catch(console.log)
        .then (response => response.json())
        .then (count => {
          this.setState(Object.assign(this.state.user, {entries:count}));
        })
      }
      this.displayFaceBoxes(this.calculateFaceLocations(response))
    })
    .catch(error => console.log('error', error));
  }

  onRouteChange = (route) => {
    if (route === 'signout'){
      this.setState(initialState);
    }
    else if (route === 'home'){
      this.setState({isSignedIn: true});
    }
    this.setState({route: route});
  }

  render() {
    const { isSignedIn, imageURL, route, boxes } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} color="#ffffff" />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home' 
          ?<div>
              <Logo /> 
              <Rank userName={this.state.user.name} userEntries={this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
              <FaceRecognition boxes={boxes} imageURL={imageURL}/>
          </div>
          : (route === 'signin')
          ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} ip={this.state.ip} />
          : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} ip={this.state.ip} />
        }
      </div>
    );
  }
}

export default App;
