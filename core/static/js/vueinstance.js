// var csrftoken = Cookies.get('csrftoken')
// Vue.http.headers.common['X-CSRFTOKEN'] = csrftoken

// const requestUserPk = parseInt(document.getElementById('request-user-pk').value) || -1
// const requestUser = document.getElementById('request-user').value

const vm = new VTTCue({
    el: '#modalDiv',
    delimiters: ['${', '}'],
    data: {
      playlists = [],
      cityPlaylists: [],
      cities: [],
      loggedInUser: { 'followers': [], 'pk': -1, 'url': null, 'username': requestUser, 'users_followed': [] },
      newResponse: { 'text': null, 'post': null, 'user': requestUser },
      currentPost: {},
      newPost: { 'text': null },
      newFollow: { 'following_user': requestUserPk, 'followed_user': null },
    },
    mounted: function () {
    //   if (requestUserPk !== -1) {
    //     this.getLoggedInUser();
    //   } else {
    //     this.showFeedNotAll = false;
    //   }
    //   this.getPosts();
    },
    methods: {
      getCities: function () {
        displayedItems = 0
        this.$http.get("/api/playlists/").then((response) => {
          
          this.cityPlaylists = response.data;
          this.showPostsNotUsers = true;
        })
          .catch((err) => {
            console.log(err);
          })
      },
    }
  
})

function getCities() {
  for (let playlist of playlists) {
    if (!cities.includes(playlist.city)) {
      cities.push(playlist.city)
    }
  }
  return cities
}