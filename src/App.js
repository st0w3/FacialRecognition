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
  box: {}, 
  route: 'signin',
  isSignedIn: false,
  ip: 'https://api.stowe.com',
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
      box: {}, 
      route: 'signin',
      isSignedIn: false,
      ip: 'https://api.stowe.com',
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

  calculateFaceLocation = (data) =>
  {
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
      this.displayFaceBox(this.calculateFaceLocation(response))
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
    const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} color="#ffffff" />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn}/>
        { route === 'home' 
          ?<div>
              <Logo /> 
              <Rank userName={this.state.user.name} userEntries={this.state.user.entries} />
              <ImageLinkForm onInputChange={this.onInputChange} onSubmit={this.onSubmit}/>
              <FaceRecognition box={box} imageURL={imageURL}/>
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
