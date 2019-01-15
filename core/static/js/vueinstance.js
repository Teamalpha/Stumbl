var csrftoken = Cookies.get('csrftoken')
Vue.http.headers.common['X-CSRFTOKEN'] = csrftoken

const requestUserPk = parseInt(document.getElementById('request-user-pk').value) || -1
const requestUser = document.getElementById('request-user').value

const vm = new Vue({
  el: '#vue-instance',
  delimiters: ['${', '}'],
  data: {
    playlist: [],
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
        document.getElementById('playlist-detail-modal').classList.add('is-active')
      })
      .catch((err) => {
        console.log(err);
      })
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
    },
    deletePlaylist: function() {
      if (requestUser === this.currentPlaylist.user) {
        this.$http.delete(`/api/playlists/${this.currentPlaylist.pk}`).then((response) => {
          this.currentPlaylist = {};
          this.$http.get(`/api/playlists/?search=${this.currentCity}`).then((response) => {
            this.cityPlaylists = response.data;
            $('#playlist-detail-modal').removeClass('is-active');
          })
        });
      }
    },
    addDestination: function() {
      this.newDestination = {
        "playlist": this.currentPlaylist.pk,
        "lat": this.currentDestination.geometry.location.lat(),
        "lng": this.currentDestination.geometry.location.lng(),
        "place_id": this.currentDestination.place_id,
        "description": this.destinationDescription,
        "name": this.currentDestination.name,
        "user": requestUserPk
      }
      this.currentPlaylist.destinations.push(this.newDestination)
      this.$http.post(`api/destinations/`, this.newDestination).then(() => {
        document.getElementById('modal-autocomplete').value = ''
        this.currentDestination = {'name': ''}
        this.destinationDescription = ''
      })
      .catch((err) => {
        console.log(err);
      })
    },
    applyGems: function() {
      for (let gem of this.currentPlaylist.destinations) {
        let coords = { "lat": +gem.lat, "lng": +gem.lng }
        var marker = new google.maps.Marker({
          position: coords,
          map: map,
          icon: "https://img.icons8.com/color/48/000000/crystal.png",
        });
        let contentString = `${gem.name} - ${gem.description}`;
        google.maps.event.addListener(marker, 'click', function () {
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });
          infowindow.open(map, this);
        });
      }
      $('#city-playlists-modal').removeClass('is-active')
      $('#choose-city-modal').removeClass('is-active')
      $('#playlist-detail-modal').removeClass('is-active')
      $('#create-playlist-modal').removeClass('is-active')
      $('#edit-playlist-modal').removeClass('is-active')  
    },
    userOwns: function() {
      return this.currentPlaylist.user == requestUser
    },
    editPlaylist: function() {
      $('#edit-playlist-modal').addClass('is-active')  
    },
  }, // close methods
}) // close vue instance