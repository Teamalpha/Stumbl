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
    currentTitle: null,
    currentCity: null,
    newDestination: null,
    destinationDescription: null,
    newPlaylistPk: null,
  },
  mounted: function () {
    this.getCities()
  },
  methods: {
    getCities: function () {
      this.$http.get("/api/playlists/").then((response) => {
        this.playlists = response.data;
        for (let playlist of this.playlists) {
          if (!this.cities.includes(playlist.city)) {
            this.cities.push(playlist.city)
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
        console.log(this.cityPlaylists)
      })
        .catch((err) => {
          console.log(err);
        })
    },
    getPlaylist: function (playlist) {
      this.$http.get(`/api/playlists/${playlist.pk}`).then((response) => {
        this.currentPlaylist = response.data;
        document.getElementById('playlist-detail-modal').classList.add('is-active')
        console.log(this.currentPlaylist)
      })
      .catch((err) => {
        console.log(err);
      })
    },
    addPlaylist: function () {
      console.log(this.newPlaylist)
      this.newPlaylist = {
        "user": requestUser,
        "title": this.currentTitle,
        "city": this.currentCity
      }
      this.$http.post(`api/playlists/`, this.newPlaylist).then((response) => {
        this.playlists.push(this.newPlaylist)
        this.currentPlaylist = this.newPlaylist
        this.currentDestination = {'name': ''}
        this.destinationDescription = ''
        console.log('response, looking for pk', response)
        this.newPlaylistPk = response.data.pk
        document.getElementById('edit-playlist-modal').classList.add('is-active')
      })
      .catch((err) => {
        console.log(err);
      })
    },
    addDestination: function() {
      console.log(this.currentDestination)
      this.newDestination = {
        "playlist": this.newPlaylistPk,
        "lat": this.currentDestination.geometry.location.lat(),
        "lng": this.currentDestination.geometry.location.lng(),
        "place_id": this.currentDestination.place_id,
        "description": this.destinationDescription,
        "name": this.currentDestination.name
      }
      this.$http.post(`api/destinations/`, this.newDestination).then(() => {
        this.currentPlaylistDestinations.push(this.newDestination)
        this.currentDestination = {'name': ''}
        this.destinationDescription = ''
      })
      .catch((err) => {
        console.log(err);
      })
    }
  }, // close methods
}) // close vue instance

function getCities() {

  return cities
}