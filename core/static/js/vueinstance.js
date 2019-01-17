var csrftoken = Cookies.get('csrftoken')
Vue.http.headers.common['X-CSRFTOKEN'] = csrftoken

const requestUserPk = parseInt(document.getElementById('request-user-pk').value) || -1
const requestUser = document.getElementById('request-user').value

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
    newVote: {},
    newPlaylist: {},
    currentDestination: {},
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
    voteToDeletePk: null,
  },
  mounted: function () {
    this.getCities()
    if (requestUserPk !== -1) {
      this.getUserVotes()
    }
  },
  methods: {
    getCities: function () {
      this.$http.get("/api/playlists/").then((response) => {
        this.playlists = response.data;
        for (let playlist of this.playlists) {
          let city = capitalize(playlist.city)
          if (!this.cities.includes(city)) {
            this.cities.push(city)
          }
        }
      })
        .catch((err) => {
          console.log(err);
        })
    },
    getCityPlaylists: function (city) {
      this.$http.get(`/api/playlists/?city=${city}`).then((response) => {
        this.cityPlaylists = response.data;
        this.currentCity = city
        document.getElementById('city-playlists-modal').classList.add('is-active')
        this.searchField = ''
      })
        .catch((err) => {
          console.log(err);
        })
    },
    openModal: function(id) {
      document.getElementById(id).classList.add('is-active')
    },
    closeModal: function(id) {
      document.getElementById(id).classList.remove('is-active')
    },
    voteExists: function() {
      if (this.userVotes.length > 0) {
        for (let vote of this.userVotes) {
          if (vote.playlist === this.currentPlaylist.pk) {
            this.voteToDeletePk = vote.pk
            return true
          }
        }
      }
      return false
    },
    getPlaylist: function (playlist) {
      this.$http.get(`/api/playlists/${playlist.pk}`).then((response) => {
        this.currentPlaylist = response.data;
        document.getElementById('active-playlists-modal').classList.remove('is-active')
        document.getElementById('playlist-detail-modal').classList.add('is-active')
        this.liked = (this.voteExists() ? "Unlike" : "Like")
      })
      .catch((err) => {
        console.log(err);
      })
    },
    isUniquePlaylist: function() {
      for (let playlist of this.playlists) {
        if (playlist.user === requestUser) {
          if (playlist.title === this.currentTitle) {
            document.getElementById('duplicate-playlist-modal').classList.add('is-active')
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
            this.newPlaylist = response.data
            this.currentPlaylist = this.newPlaylist
            this.currentPlaylist.pk = response.data.pk
            this.playlists.push(this.currentPlaylist)
            this.cityPlaylists.push(this.currentPlaylist)
            if (!this.cities.includes(this.currentPlaylist.city)) {
              this.cities.push(this.currentPlaylist.city)
            }
            // clear variables
            this.currentDestination = {'name': ''}
            this.destinationDescription = ''
            this.currentDescription = ''
            this.accessible = false
            document.getElementById('accessible').checked = false
            document.getElementById('create-playlist-modal').classList.remove('is-active')
            document.getElementById('playlist-detail-modal').classList.remove('is-active')
            document.getElementById('playlist-detail-modal').classList.add('is-active')
            document.getElementById('edit-playlist-modal').classList.add('is-active')
          })
          .catch((err) => {
            console.log(err);
          })
        }
      } else {
        this.openModal('login-required-modal')
      }
    },
    deletePlaylist: function() {
      if (requestUser === this.currentPlaylist.user) {
        this.$http.delete(`/api/playlists/${this.currentPlaylist.pk}`).then(() => {
          this.currentPlaylist = {};
          this.$http.get(`/api/playlists/?search=${this.currentCity}`).then((response) => {
            this.cityPlaylists = response.data;
            document.getElementById('playlist-detail-modal').classList.remove('is-active')
            document.getElementById('confirm-delete-playlist-modal').classList.remove('is-active')
          })
        });
      }
    },
    isUniqueDestination: function() {
      for (let destination of this.currentPlaylist.destinations) {
        if (destination.name === this.newDestination.name) {
          document.getElementById('duplicate-destination-modal').classList.add('is-active')
          return false
        }
      }
      return true
    },
    addDestination: function() {
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
          this.currentDestination = {'name': ''}
          this.destinationDescription = ''
          this.currentPlaylist.destinations[this.currentPlaylist.destinations.length - 1].pk = response.data.pk
        })
        .catch((err) => {
          console.log(err);
        })
      }
    },
    isActivePlaylist: function() {
      if (this.activePlaylists.length === 0) {
          return false
        }
      for (let playlist of this.activePlaylists) {
        if (playlist.title === this.currentPlaylist.title) {
          document.getElementById('playlist-already-applied-modal').classList.add('is-active')
          return true
        }
      }
      return false
    },
    applyGems: function() {
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
      this.currentPlaylist['markerList'] = (markerList);

      if (!this.isActivePlaylist()) {
        this.activePlaylists.push(this.currentPlaylist);
        document.getElementById('city-playlists-modal').classList.remove('is-active')
        document.getElementById('choose-city-modal').classList.remove('is-active')
        document.getElementById('playlist-detail-modal').classList.remove('is-active')
        document.getElementById('create-playlist-modal').classList.remove('is-active')
        document.getElementById('edit-playlist-modal').classList.remove('is-active')  
      }
    },
    deleteDestination: function(destinationPk) {
      if (requestUser === this.currentPlaylist.user) {
        this.$http.delete(`/api/destinations/${destinationPk}`).then((response) => {
          this.$http.get(`/api/playlists/${this.currentPlaylist.pk}`).then((response) => {
            this.currentPlaylist = response.data;
          })
        })
      }
    },
    userOwns: function() {
      return this.currentPlaylist.user == requestUser
    },
    editPlaylist: function() {
      document.getElementById('edit-playlist-modal').classList.add('is-active')
    },
    newPlaylistModal: function() {
      if (requestUserPk !== -1) {
        document.getElementById('create-playlist-modal').classList.add('is-active')
      } else {
        this.openModal('login-required-modal')
      }

    },
    closeModals: function() {
      document.getElementById('city-playlists-modal').classList.remove('is-active')
      document.getElementById('choose-city-modal').classList.remove('is-active')
      document.getElementById('playlist-detail-modal').classList.remove('is-active')
      document.getElementById('create-playlist-modal').classList.remove('is-active')
      document.getElementById('edit-playlist-modal').classList.remove('is-active')
      document.getElementById('duplicate-playlist-modal').classList.remove('is-active')
      document.getElementById('confirm-delete-playlist-modal').classList.remove('is-active')
      document.getElementById('duplicate-destination-modal').classList.remove('is-active')
      document.getElementById('active-playlists-modal').classList.remove('is-active')
      document.getElementById('playlist-already-applied-modal').classList.remove('is-active')
    },
    confirmDeletePlaylist: function() {
      document.getElementById('confirm-delete-playlist-modal').classList.add('is-active')
    },
    disablePlaylist: function(playlist) {
      for (let gem of playlist.markerList) {
        gem.setMap(null)
      }
      this.activePlaylists.splice(this.activePlaylists.indexOf(playlist), 1)
    },
    activePlaylistsModal: function() {
      document.getElementById('active-playlists-modal').classList.add('is-active')
    },
    searchPlaylists: function() {
      let isAccessible = document.getElementById('is-accessible').checked
      if (!isAccessible) {isAccessible = ''}
      this.$http.get(`/api/playlists/?city=${this.currentCity}&title=${this.searchField}&accessible=${isAccessible}`).then((response) => {
        this.cityPlaylists = response.data;
      })
        .catch((err) => {
          console.log(err);
      })
    },
    getUserVotes: function() {
      this.$http.get(`api/users/${requestUserPk}`).then((response) => {
        this.userVotes = response.data.votes
      })
    },
    toggleVote: function(playlist) {
      this.newVote = {
        "playlist": playlist.pk,
        "user": requestUserPk,
      }
      // delete vote if vote exists
      if (this.voteExists()) {
        this.$http.delete(`api/votes/${this.voteToDeletePk}`).then((response) => {
          this.liked = 'like'
          this.newVote.pk = response.data.pk
          this.currentPlaylist.playlist_votes.splice(this.currentPlaylist.playlist_votes.indexOf(this.newVote), 1)
          // this.cityPlaylists.indexOf(playlist).playlist_votes.splice(this.cityPlaylists.indexOf(playlist).playlist_votes.indexOf(this.newVote), 1)
          this.userVotes.splice(this.userVotes.indexOf(this.newVote), 1)
          delete this.newVote['pk']
          this.getCityPlaylists(this.currentCity) // Extra api hit - If performance unsatisfactory, will look for better solution.
        })
        .catch((err) => {
          console.log(err);
      })
      // create vote if it doesn't already exist
      } else {
        this.$http.post(`api/votes/`, this.newVote).then((response) => {
          this.liked = 'Unlike'
          this.newVote.pk = response.data.pk
          this.currentPlaylist.playlist_votes.push(this.newVote)
          // let playlistIndex = this.cityPlaylists.indexOf(playlist)
          // console.log('playlist index:', playlistIndex)
          // this.cityPlaylists[playlistIndex].playlist_votes.push(this.newVote)
          this.userVotes.push(this.newVote)
          this.voteToDeletePk = response.data.pk
          this.getCityPlaylists(this.currentCity) // Extra api hit - If performance unsatisfactory, will look for better solution.
        })
        .catch((err) => {
          console.log(err);
        })
      }
    },
    openAboutModal: function() {
      document.getElementById('about-modal').classList.add('is-active')
    },
  }, // close methods
}) // close vue instance