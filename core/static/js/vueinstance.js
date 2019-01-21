var csrftoken = Cookies.get('csrftoken')
Vue.http.headers.common['X-CSRFTOKEN'] = csrftoken
Vue.http.options.root = '/';

const requestUserPk = parseInt(document.getElementById('request-user-pk').value)
const requestUser = document.getElementById('request-user').value
const sharedPlaylistPk = document.querySelector('#shared-playlist-pk').value

const vm = new Vue({
  el: '#vue-instance',
  delimiters: ['${', '}'],
  data: {
    playlist: [],
    activePlaylists: [],
    cityPlaylists: [],
    cities: [],
    currentPlaylist: {},
    currentPlaylistDestinations: [],
    playlists: [],
    userVotes: [],
    userPlaylists: [],
    newPlaylist: {},
    currentDestination: {},
    voteToDelete: {},
    destinationToUpdate: {},
    accessible: false,
    currentTitle: null,
    currentCity: null,
    currentDescription: null,
    newDestination: null,
    destinationDescription: null,
    newPlaylistPk: null,
    autocompleteText: '',
    distance: null,
    searchField: '',
    currentHeading: null,
    liked: 'Like',
    requestUserPk: requestUserPk,
    requestUser: requestUser,
  },
  mounted: function () {
    this.getCities()
    if (requestUserPk !== -1) {
      this.getUserVotes()
    }
    this.openSharedPlaylist()
  },
  methods: {
    openModal: function (id) {
      document.getElementById(id).classList.add('is-active')
    },
    closeModal: function (id) {
      document.getElementById(id).classList.remove('is-active')
    },
    getUniqueCities: function () {
      this.cities = []
      if (this.playlists.length > 0) {
        for (let playlist of this.playlists) {
          let city = capitalize(playlist.city)
          if (!this.cities.includes(city)) {
            this.cities.push(city)
          }
        }
      }
    },
    getCities: function () {
      this.$http.get("/api/playlists/").then((response) => {
        this.playlists = response.data;
        this.getUniqueCities()
      }).catch((err) => {
        console.log(err);
      })
    },
    getCityPlaylists: function (city) {
      this.$http.get(`/api/playlists/?city=${city}`).then((response) => {
        this.cityPlaylists = response.data;
        this.currentCity = city
        this.openModal('city-playlists-modal')
        this.searchField = ''
      }).catch((err) => {
        console.log(err);
      })
    },
    voteExists: function () {
      if (this.userVotes.length > 0) {
        for (let vote of this.userVotes) {
          if (vote.playlist === this.currentPlaylist.pk) {
            this.voteToDelete = vote
            return true
          }
        }
      }
      return false
    },
    // Two similar objects with different memory addresses are not considered equal if one of the values is a nested list. This function finds the exact nested object by comparing the nested objects title key and then returns its index.
    getPlaylistIndex: function (playlistArray) {
      if (playlistArray.length > 0) {
        for (let playlist of playlistArray) {
          if (playlist.pk === this.currentPlaylist.pk) {
            return playlistArray.indexOf(playlist)
          }
        }
      }
    },
    getDestinationIndex: function() {
      for (let destination of this.currentPlaylist.destinations) {
        if (destination.pk === this.destinationToUpdate.pk)
        return this.currentPlaylist.destinations.indexOf(destination)
      }
      
    },
    getPlaylist: function (playlist) {
      this.$http.get(`/api/playlists/${playlist.pk}`).then((response) => {
        this.currentPlaylist = response.data;
        this.currentCity = playlist.city
        this.closeModal('active-playlists-modal')
        this.closeModal('user-playlists-modal')
        this.openModal('playlist-detail-modal')
        this.liked = (this.voteExists() ? "Unlike" : "Like")

        let shareChar = (/Android/i.test(navigator.userAgent) ? '?' : '&')

        document.getElementById('share-link').href = `sms:${shareChar}body=Check%20out%20this%20LocalGems%20playlist%20*${playlist.title}*%20for%20${playlist.city}%20at https://www.localgems.io/shared_playlist/${playlist.pk}`
      }).catch((err) => {
        console.log(err);
      })
    },
    isUniquePlaylist: function () {
      for (let playlist of this.playlists) {
        if (playlist.user === requestUser) {
          if (playlist.title === this.currentTitle) {
            this.openModal('duplicate-playlist-modal')
            return false
          }
        }
      }
      return true
    },
    addPlaylist: function () {
      if (requestUserPk !== -1) {
        this.newPlaylist = {
          "user": requestUser,
          "title": capitalize(this.currentTitle),
          "city": capitalize(this.currentCity),
          "description": this.currentDescription,
          "accessible": document.getElementById('accessible').checked,
        }
        if (this.isUniquePlaylist()) {
          this.$http.post(`api/playlists/`, this.newPlaylist).then((response) => {
            this.currentPlaylist = response.data
            this.playlists.push(this.currentPlaylist)
            this.cityPlaylists.push(this.currentPlaylist)
            this.userPlaylists.push(this.currentPlaylist)
            if (!this.cities.includes(this.currentPlaylist.city)) {
              this.cities.push(this.currentPlaylist.city)
            }        
            
            let shareChar = (/Android/i.test(navigator.userAgent) ? '?' : '&')
            document.getElementById('share-link').href = `sms:${shareChar}body=Check%20out%20this%20LocalGems%20playlist%20*${this.currentPlaylist.title}*%20for%20${this.currentPlaylist.city}%20at https://www.localgems.io/shared_playlist/${this.currentPlaylist.pk}`
    
            // clear variables
            this.currentDestination = { 'name': '' }
            this.destinationDescription = ''
            this.currentDescription = ''
            this.currentTitle = ''
            this.accessible = false
            document.getElementById('accessible').checked = false
            this.closeModal('create-playlist-modal')
            this.closeModal('playlist-detail-modal')
            this.openModal('playlist-detail-modal')
            this.openModal('edit-playlist-modal')
          }).catch((err) => {
            console.log(err);
          })
        }
      } else {
        this.openModal('login-required-modal')
      }
    },
    deletePlaylist: function () {
      if (requestUser === this.currentPlaylist.user) {
        this.cityPlaylists.splice(this.getPlaylistIndex(this.cityPlaylists), 1)
        this.userPlaylists.splice(this.getPlaylistIndex(this.userPlaylists), 1)
        this.playlists.splice(this.getPlaylistIndex(this.playlists), 1)
        
        this.$http.delete(`/api/playlists/${this.currentPlaylist.pk}`).then(() => {
          this.getUniqueCities()
          this.currentPlaylist = {};
          this.closeModal('confirm-delete-playlist-modal')
          this.closeModal('playlist-detail-modal')
        }).catch((err) => {
          console.log(err);
        })
      }
    },
    isUniqueDestination: function () {
      for (let destination of this.currentPlaylist.destinations) {
        if (destination.name === this.newDestination.name) {
          this.openModal('duplicate-destination-modal')
          return false
        }
      }
      return true
    },
    addDestination: function () {
      this.newDestination = {
        "playlist": this.currentPlaylist.pk,
        "lat": this.currentDestination.geometry.location.lat(),
        "lng": this.currentDestination.geometry.location.lng(),
        "place_id": this.currentDestination.place_id,
        "description": this.destinationDescription,
        "name": this.currentDestination.name,
        "user": requestUserPk,
        "pk": null
      }
      if (this.isUniqueDestination()) {
        this.currentPlaylist.destinations.push(this.newDestination)
        this.$http.post(`api/destinations/`, this.newDestination).then((response) => {
          document.getElementById('modal-autocomplete').value = ''
          this.currentDestination = { 'name': '' }
          this.destinationDescription = ''
          this.currentPlaylist.destinations[this.currentPlaylist.destinations.length - 1].pk = response.data.pk
        }).catch((err) => {
          console.log(err);
        })
      }
    },
    isActivePlaylist: function () {
      if (this.activePlaylists.length === 0) {
        return false
      }
      for (let playlist of this.activePlaylists) {
        if (playlist.title === this.currentPlaylist.title) {
          this.openModal('playlist-already-applied-modal')
          return true
        }
      }
      return false
    },
    applyGems: function () {
      var markerList = [];
      for (let gem of this.currentPlaylist.destinations) {
        let coords = { "lat": +gem.lat, "lng": +gem.lng }
        var marker = new google.maps.Marker({
          position: coords,
          map: map,
          icon: "https://images2.imgbox.com/cd/70/ochtsykD_o.png",
        });
        markerList.push(marker)
        let contentString = `${gem.name} - ${gem.description}`;
        google.maps.event.addListener(marker, 'click', function () {
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
          infowindow.open(map, this);
        });
      }
      this.currentPlaylist['markerList'] = markerList;
      if (!this.isActivePlaylist()) {
        this.activePlaylists.push(this.currentPlaylist);
        this.closeModal('city-playlists-modal')
        this.closeModal('choose-city-modal')
        this.closeModal('playlist-detail-modal')
        this.closeModal('create-playlist-modal')
        this.closeModal('edit-playlist-modal')
        this.closeModal('playlist-main-menu')
      }
    },
    deleteDestination: function (destination) {
      if (requestUser === this.currentPlaylist.user) {
        let destinationToUpdate = destination
        this.$http.delete(`/api/destinations/${destination.pk}`).then(() => {
          this.currentPlaylist.destinations.splice(this.currentPlaylist.destinations.indexOf(destinationToUpdate), 1)
        }).catch((err) => {
          console.log(err);
        })
      }
    },
    userOwns: function () {
      return this.currentPlaylist.user == requestUser
    },
    newPlaylistModal: function () {
      if (requestUserPk !== -1) {
        this.openModal('create-playlist-modal')
      } else {
        this.openModal('login-required-modal')
      }
    },
    disablePlaylist: function (playlist) {
      for (let gem of playlist.markerList) {
        gem.setMap(null)
      }
      this.activePlaylists.splice(this.activePlaylists.indexOf(playlist), 1)
    },
    searchPlaylists: function () {
      let isAccessible = document.getElementById('is-accessible').checked
      if (!isAccessible) { isAccessible = '' }
      this.$http.get(`/api/playlists/?city=${this.currentCity}&title=${this.searchField}&accessible=${isAccessible}`).then((response) => {
        this.cityPlaylists = response.data;
      }).catch((err) => {
        console.log(err);
      })
    },
    getUserVotes: function () {
      this.$http.get(`api/users/${requestUserPk}`).then((response) => {
        this.userVotes = response.data.votes
        this.userPlaylists = response.data.playlists
      }).catch((err) => {
        console.log(err);
      })
    },
    toggleVote: function (playlist) {
      if (requestUserPk !== -1) {
        let newVote = {
          "playlist": playlist.pk,
          "user": requestUserPk,
        }
        // delete vote if vote exists
        if (this.voteExists()) {
          this.$http.delete(`api/votes/${this.voteToDelete.pk}`).then(() => {
            this.liked = 'like'
            newVote.pk = this.voteToDelete.pk

            // find the index of the playlist in cityPlaylists, then remove the vote
            this.cityPlaylists[this.getPlaylistIndex(this.cityPlaylists)].playlist_votes.splice(this.cityPlaylists[this.getPlaylistIndex(this.cityPlaylists)].playlist_votes.indexOf(newVote), 1)

            // remove the vote from currentPlaylist
            this.currentPlaylist.playlist_votes.splice(this.currentPlaylist.playlist_votes.indexOf(newVote), 1)
            this.userVotes.splice(this.userVotes.indexOf(newVote), 1)
          }).catch((err) => {
            console.log(err);
          })
          // create vote if vote doesn't exist
        } else {
          this.$http.post(`api/votes/`, newVote).then((response) => {
            this.liked = 'Unlike'
            newVote.pk = response.data.pk

            // push the new vote into currentPlaylist, cityPlaylists, and userVotes
            this.currentPlaylist.playlist_votes.push(newVote)
            this.cityPlaylists[this.getPlaylistIndex(this.cityPlaylists)].playlist_votes.push(newVote)
            this.userVotes.push(newVote)
          }).catch((err) => {
            console.log(err);
          })
        }
      } else {
        this.openModal('login-required-modal')
      }
    },
    openSharedPlaylist: function () {
      if (sharedPlaylistPk !== '') {
        let sharedPlaylist = {
          pk: parseInt(sharedPlaylistPk)
        }
        this.getPlaylist(sharedPlaylist)
      }
    },
    updatePlaylistVariables: function(playlists) {
      let playlistIndex = this.getPlaylistIndex(playlists)
        playlists[playlistIndex].title = this.currentTitle
        playlists[playlistIndex].city = this.currentCity
        playlists[playlistIndex].description = this.currentDescription
        playlists[playlistIndex].accessible = document.getElementById('accessible-edit').checked
    },
    updatePlaylist: function() {
      let updatedPlaylist = {
        "title": capitalize(this.currentTitle),
        "city": capitalize(this.currentCity),
        "description": this.currentDescription,
        "accessible": document.getElementById('accessible-edit').checked,
      }
      this.$http.patch(`api/playlists/${this.currentPlaylist.pk}/`, updatedPlaylist).then(() => {
        this.updatePlaylistVariables(this.cityPlaylists)
        this.updatePlaylistVariables(this.userPlaylists)
        this.updatePlaylistVariables(this.playlists)
        this.currentPlaylist.title = capitalize(this.currentTitle)
        this.currentPlaylist.city = capitalize(this.currentCity)
        this.currentPlaylist.description = this.currentDescription
        this.currentPlaylist.accessible = document.getElementById('accessible-edit').checked
        this.getUniqueCities()
        this.closeModal('edit-playlist-details-modal')
      })
    },
    updateDestination: function() {
      let updatedDestination = {
        "description": this.destinationDescription,
        "name": this.currentDestination.name,
      }
      this.$http.patch(`api/destinations/${this.destinationToUpdate.pk}/`, updatedDestination).then(() => {
        this.currentPlaylist.destinations[this.getDestinationIndex()].description = this.destinationDescription
        this.currentPlaylist.destinations[this.getDestinationIndex()].name = this.currentDestination.name
        this.destinationDescription = ''
        this.currentDestination.name = ''
        this.closeModal('edit-destination-details-modal')
      })
    },
    setPlaylistFields: function() {
      this.getCityPlaylists(this.currentCity)
      this.currentDescription = this.currentPlaylist.description
      this.currentTitle = this.currentPlaylist.title
      if (this.currentPlaylist.accessible) {
        document.getElementById('accessible-edit').checked = true
      } else {
        document.getElementById('accessible-edit').checked = false
      } 
    },
    setDestinationFields: function(destination) {
      this.currentDestination.name = destination.name
      this.destinationDescription = destination.description
      this.destinationToUpdate = destination
    },
    closeModals: function () {
      this.closeModal('city-playlists-modal')
      this.closeModal('choose-city-modal')
      this.closeModal('playlist-detail-modal')
      this.closeModal('create-playlist-modal')
      this.closeModal('edit-playlist-modal')
      this.closeModal('duplicate-playlist-modal')
      this.closeModal('confirm-delete-playlist-modal')
      this.closeModal('duplicate-destination-modal')
      this.closeModal('active-playlists-modal')
      this.closeModal('playlist-already-applied-modal')
      this.closeModal('login-required-modal')
      this.closeModal('playlist-main-menu')
      this.closeModal('user-playlists-modal')
    },
  }, // close methods
}) // close vue instance