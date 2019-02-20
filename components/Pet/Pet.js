import React  from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ImageBackground, Image, ActivityIndicator, ScrollView } from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import APIkey from '../apiKey';
import Loading from '../Loading/Loading';
import { cleanShelters } from '../helpers/helpers';
import { Icon } from 'react-native-elements';

export default class Pet extends React.Component {
  constructor(props) {
    super(props) 
    this.state = {
      gestureName: '',
      distance: ''
    }
  }

  componentDidMount = () => {
    // this.findDistance()
  }

  componentWillUnmount = () => {
    this.setState({
      distance: ''
    })
  }

  onSwipe = (gestureName, gestureState) => {
    const { SWIPE_RIGHT, SWIPE_LEFT } = swipeDirections;
    this.setState({
      gestureName
    })
    this.findDistance()
    switch (gestureName) {
      case SWIPE_LEFT:
        this.props.changePet()
        break;
      case SWIPE_RIGHT:
        this.props.changePet()
        break;
    }
  }

  onSwipeLeft = () => {
    const { addToFavorites, userAPIToken, fetchShelter, pet  } = this.props;
    fetchShelter()
    addToFavorites(pet.id)
  }

  onSwipeRight = () => {
    console.log('swiping right!')
  }

  findDistance = () => {
    const {latitude, longitude} = this.props.shelter;
    const {userLocation} = this.props;
    const url = `https://adoptr-be.herokuapp.com/api/v1/distances?user_lat=${userLocation.latitude}&user_long=${userLocation.longitude}&shelter_lat=${latitude}&shelter_long=${longitude}`
    fetch(url)
      .then(response => response.json())
      .then(result => this.setState({distance: result.distance}))
      .then(error => console.log(error))
  }

  emailShelter = () => {
    const {name} = this.props.pet;
    let message = `I am hoping to schedule a meet and greet with ${name} and would love to get in contact with you to schedule a time to do that. I look forward to hearing from you!`
    const shelterEmail = this.props.shelter.email
    let postBody = {
      api_token: this.props.userAPIToken,
      shelter_email: 'colevanacore@gmail.com',
      pet_name: name,
      message: message
    }
    fetch('https://adoptr-be.herokuapp.com/api/v1/shelter_notifier', {
      method: 'POST',
      body: JSON.stringify(postBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(result => console.log('result',result))
      .then(error => console.log('error',error))
  }

  render() {
    if (this.props.loading) {
      return <Loading />
    } else {
      const { name, breed, age, description, photos, shelterId } = this.props.pet;
      const { shelter } = this.props;
      let image = photos[2]
      if (this.props.showInfo) {
        return (
          <View>
            <ImageBackground source = {{uri: image}} style={styles.moreInfoImage}
          imageStyle={styles.borderRad}>
              <Text style={styles.petName}>{name} </Text>
              <View style={styles.petBreedAge}>
                <Text style={{color:'white'}}>{breed}</Text>
                <Text style={{color:'white'}}>{age}</Text>
              </View>
            </ImageBackground>
            <ScrollView style={styles.scroll}>
              <Text style={styles.description}>{description}</Text>
              <Text style={styles.canBeFound}>{name} can be found at {shelter.name}</Text>
            <View style={styles.shelterInfo}>
              <Text style={styles.phone}>{shelter.phone}</Text>
              <Text style={styles.cityStateZip}>{shelter.city}{shelter.state}{shelter.zip}</Text>
            </View>
            </ScrollView>
            <TouchableOpacity
            style={styles.contactButton}
            onPress={this.emailShelter}>
              <Text style={styles.contactButtonText}> Contact {shelter.name} </Text>
            </TouchableOpacity>
          </View>
        )
      } else {
        return (
          <GestureRecognizer 
            style={styles.swiper}
            onSwipe={(direction, state) => this.onSwipe(direction, state)}
            onSwipeLeft={(state) => this.onSwipeLeft(state)}
            config={config}
          >
          <View style={styles.navContainer}>
            <TouchableOpacity  onPress={this.props.showFilter}
            style={styles.hamburgerContainer}>
            <Icon
              name='cog'
              type='font-awesome'
              color='#F49D37'
              size={48}
              iconStyle={styles.cog}/>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.showFavorites} style={styles.hamburgerContainer}>
              <Icon
              name='heart'
              type='font-awesome'
              color='#D90368'
              size={48}
              iconStyle={styles.heart}/>
            </TouchableOpacity>
            </View> 
            <ImageBackground source = {{uri: image}} style={styles.image}
            imageStyle={styles.borderRad}>
                <Text style={styles.petName}>{name}</Text>
                <View style={styles.shelterContainer}>
                  <Icon
                name='home'
                type='font-awesome'
                color='white'
                size={16}
                iconStyle={styles.home}/>
                  <Text style={styles.shelterName}>{shelter.name} - {this.state.distance} miles </Text>
                </View>
            </ImageBackground>
        </GestureRecognizer>
        )
      }
    } 
  } 
}
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80
  };

const styles = StyleSheet.create({
  petName: {
    fontSize: 40,
    color: 'white',
    position: 'absolute',
    bottom: 60,
    left: 20
  },
  swiper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 500,
    marginBottom: 40,
  },
  image: {
    height: 600,
    width: 400,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
  moreInfoImage: {
    marginTop: 5
  },
  borderRad: {
    borderRadius: 30,
  },
  contactButton: {
    backgroundColor: 'white',
    borderColor: 'black',
    borderRadius: 24,
    borderStyle: 'solid',
    borderWidth: 2,
    fontSize: 20,
    height: 30,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    textAlign: 'center',
    width: 300,
    marginBottom: 35,
    marginLeft: 23,
    marginTop: 10
  },
  contactButtonText: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 3
  },
  home: {
    marginRight: 4,
  },
  navContainer: {
    flex: 1,
    flexDirection: 'row',
    top: 80,
    justifyContent: 'space-between',
    width: 360,
    height: 100
  },
  hamburgerIcon: {
    height: 50,
    width: 50,
    // marginBottom: 40
  },
  hamburgerContainer: {
    // height: 50,
    // width: 50,
    // position: 'relative',
    padding: 10,
    // right: 120,
    // top: 40,
    // marginBottom: 40
    borderRadius: 50,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    height: 70,
    borderColor: 'white',
    backgroundColor: 'white',
  },
  description: {
    height: 200,
    width: 300,
    flex: 1,
    textAlign: 'center',
    marginTop: 10,
    fontSize: 15
  },
  canBeFound: {
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 0,
    fontSize: 15
  },
  shelterName: {
    color: 'white',
    fontSize: 16,
    position: 'absolute',
    zIndex: 2,
    left: 20,
    textShadowColor: 'black'
  },
  shelterInfo: {
    marginTop: 0,
    fontSize: 10,
    textAlign: 'center'
  },
  phone: {
    textAlign: 'center'
  },
  cityStateZip: {
    textAlign: 'center'
  },
  shelterContainer: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    marginTop: 20,
    flex: 1,
    flexDirection: 'row',
    color: 'white'
  },
  petBreedAge: {
    position: 'absolute',
    top: 240,
    left: 20
  },
  moreInfoImage: {
    height: 300,
    width: 350,
    marginTop: 10  
  },
  scroll: {
    width: 300,
    height: 80,
    marginLeft: 30,
    marginRight: 10
  },
  // cog: {
  //   position: 'absolute',
  //   top: -10
  // },
  // heart: {
  //   position: 'absolute',
  //   top: -58, 
  //   left: 100
  // }
})


