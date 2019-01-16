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
    currentHeading: null,
  },
  mounted: function () {
    this.getCities()
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
      this.$http.get(`/api/playlists/?search=${city}`).then((response) => {
        this.cityPlaylists = response.data;
        this.currentCity = city
        document.getElementById('city-playlists-modal').classList.add('is-active')
      })
        .catch((err) => {
          console.log(err);
        })
    },
    getPlaylist: function (playlist) {
      this.$http.get(`/api/playlists/${playlist.pk}`).then((response) => {
        this.currentPlaylist = response.data;
        document.getElementById('active-playlists-modal').classList.remove('is-active')
        document.getElementById('playlist-detail-modal').classList.add('is-active')
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
      this.newPlaylist = {
        "user": requestUser,
        "title": capitalize(this.currentTitle),
        "city": capitalize(this.currentCity),
        "description": this.currentDescription,
        "accessible": document.getElementById('accessible').checked,
        "destinations": []
      }
      if (this.isUniquePlaylist()) {
          this.$http.post(`api/playlists/`, this.newPlaylist).then((response) => {
          this.currentPlaylist = this.newPlaylist
          this.currentPlaylist.pk = response.data.pk
          this.playlists.push(this.currentPlaylist)
          if (!this.cities.includes(this.currentPlaylist.city)) {
            this.cities.push(this.currentPlaylist.city)
          }
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
    },
    deletePlaylist: function() {
      if (requestUser === this.currentPlaylist.user) {
        this.$http.delete(`/api/playlists/${this.currentPlaylist.pk}`).then((response) => {
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
      if (this.activePlaylists.length > 0) {
        if (this.activePlaylists.length === 1) {
          if (this.activePlaylists[0].title === this.currentPlaylist.title) {
            document.getElementById('playlist-already-applied-modal').classList.add('is-active')
            return true
          }
        }
        for (let playlist of this.ActivePlaylists) {
          if (playlist.title === this.currentPlaylist.title) {
            document.getElementById('playlist-already-applied-modal').classList.add('is-active')
            return true
          }
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
          icon: "https://img.icons8.com/color/48/000000/crystal.png",
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
      document.getElementById('create-playlist-modal').classList.add('is-active')
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
    openAboutModal: function() {
      document.getElementById('about-modal').classList.add('is-active')
    },
  }, // close methods
}) // close vue instance