import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, ImageBackground, Image, ScrollView } from 'react-native';
import { Icon } from 'react-native-elements';
import APIkey from '../apiKey';
import { cleanPets } from '../helpers/helpers';
import FavesInfo from '../FavesInfo/FavesInfo';
import { cleanPet } from '../helpers/helpers';
import { cleanShelters } from '../helpers/helpers'

export default class Favorites extends React.Component {
  constructor(props) {
    super(props)
    this.state = ({
      favorites: [],
      currentPet: {},
      showInfo: false,
      shelter: {}
    })
  }

  getPet = (petId) => {
    // const { currentPet } = this.state;
    console.log('petId', petId)
    console.log('getting pet!')
    fetch(`http://api.petfinder.com/pet.get?format=json&key=${APIkey}&id=${petId}`)
    .then(response => response.json())
    .then(pet => cleanPet(pet.petfinder.pet))
    .then(cleanPet => this.setState({currentPet: cleanPet}))
    .then(currentPet => this.fetchShelter(this.state.currentPet.shelterId))
    .then(currentPet => this.setState({showInfo: true}))
    .then(error => console.log(error))
  }

  fetchShelter = (shelterId) => {
    console.log('id in favorites fetch shelter', shelterId)
    fetch(`http://api.petfinder.com/shelter.get?format=json&key=${APIkey}&id=${shelterId}`)
    .then(response => response.json()) 
    .then(shelter => cleanShelters(shelter.petfinder.shelter))
    .then(cleanShelter => this.setState({shelter: cleanShelter}))
    .catch(error => this.setState({error}))
  }

  deleteFavorite = (petId, userToken) => {
    const { userAPIToken } = this.props;
    const postBody = {
      api_token: userToken,
      favorite_id: petId
    }
    fetch(`https://adoptr-be.herokuapp.com/api/v1/favorites?api_token=${userAPIToken}`, {
      method: 'DELETE',
      body: JSON.stringify(postBody),
      headers:{
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(result => this.reRenderFavorites())
    .catch(error => console.log(error))
  }

  reRenderFavorites = () => {
    this.props.fetchFavorites()
    this.props.displayFaves();
  }

  goBack = () => {
    this.setState({
      showInfo: false
    })
  }
  
  render() {
    const { cleanedFaves } = this.props;
    const { showInfo, currentPet, shelter } = this.state;
    let display;
    if (showInfo) {
      return (
        <View style={styles.homeContainer}>
          <FavesInfo currentPet={currentPet} shelter={shelter} />
          <TouchableOpacity onPress={this.goBack}>
            <Icon
              name='arrow-circle-left'
              type='font-awesome'
              color='#F49D37'
              size={50}
              iconStyles={styles.backButton}/>
          </TouchableOpacity>
        </View>
      )

    } else if (cleanedFaves.length === 0) {
      display = <Text style={styles.noFavesMessage}>You don't have any favorites!</Text>
    } else {
      display = cleanedFaves.map((favoritePet) => {
         return (
           <View key={favoritePet.id.$t} style={styles.favoritePetContainer}>
            <TouchableOpacity onPress={() => this.deleteFavorite(favoritePet.id.$t)}>
              <Icon
                name='minus-circle'
                type='font-awesome'
                color='#E74544'
                style={styles.delete}
                />
            </TouchableOpacity>
            <Text style={styles.name}>{favoritePet.name.$t}</Text>
            <TouchableOpacity onPress={() => this.getPet(favoritePet.id.$t)}
    style={styles.arrowRight}>
              <Icon
                name='angle-right'
                type='font-awesome'
                color='#F49D37'
                />
            </TouchableOpacity>
           </View>
         ) 
       })
    }
    return(
      <View style={styles.favoritesContainer}>
            <ScrollView>
              {display}
            </ScrollView>
        <TouchableOpacity onPress={this.props.returnHome} style={styles.backButton}>
              <Icon
                name='arrow-circle-left'
                type='font-awesome'
                color='#F49D37'
                size={48}
                style={styles.arrowLeft}
                />
            </TouchableOpacity>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  favoritesContainer: {
    backgroundColor: '#E5E5E5',
  },
  homeContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    top: 60,
    paddingBottom: 80,
    paddingTop: 80,
  },
  favoritePetContainer: {
    backgroundColor: 'white',
    borderBottomColor: '#E5E5E5',
    borderBottomWidth: 5,
    width: 370,
    height: 50,
    textAlign: 'left',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10
  },
  arrowLeft: {
    // position: 'absolute',
    // left: 0,
    // top: 100,
    // marginTop: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#048BA8',
    marginLeft: 20,
    // marginRight: 230
  },
  arrowRight: {
    position: 'absolute',
    right: 10
  },
  delete: {
    marginLeft: 10
  },
  noFavesMessage: {
    fontSize: 40,
    textAlign: 'center'
  },
  backButton: {
    // backgroundColor: 'white',
    // position: 'absolute',
    // top: 200,
    // height: 40,
    // left: 10,
    textAlign: 'center',
    zIndex: 4,
    // marginLeft: 10,
    marginBottom: 80,
  },
  icon: {
    backgroundColor: '#048BA8',
    position: 'absolute',
    // bottom: -250, 
  },
});
