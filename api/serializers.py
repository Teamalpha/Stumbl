from rest_framework import serializers
from core.models import User, Destination, Playlist


class DestinationSerializer(serializers.ModelSerializer):
   
    class Meta:
        model = Destination
        fields = ('playlist', 'lat', 'lng', 'place_id', 'description', 'name', 'created', 'updated',)


class PlaylistSerializer(serializers.ModelSerializer):
    user = serializers.SlugRelatedField(slug_field="username", queryset=User.objects.all())
    destinations = DestinationSerializer(read_only=True, many=True)

    class Meta:
        model = Playlist
        fields = ('user', 'title', 'city', 'created', 'destinations', 'pk',)


class UserSerializer(serializers.ModelSerializer):
    playlists = PlaylistSerializer(read_only=True, many=True)

    class Meta:
        model = User
        fields = ('username', 'playlists', 'pk',)