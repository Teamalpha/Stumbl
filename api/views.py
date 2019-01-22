from rest_framework import viewsets, filters
from api.serializers import UserSerializer, DestinationSerializer, PlaylistSerializer, VoteSerializer
from core.models import User, Destination, Playlist, Vote
from django_filters import rest_framework as djangofilters
from django.db.models import Count

class PlaylistFilter(djangofilters.FilterSet):
    city = djangofilters.CharFilter(lookup_expr='icontains')
    title = djangofilters.CharFilter(lookup_expr='icontains')

    class Meta:
        model = Playlist
        fields = ['city', 'title', 'accessible', ]

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all().annotate(num_likes=Count('playlist_votes')).order_by('-default', '-num_likes', '-created')
    serializer_class = PlaylistSerializer
    filter_backends = (djangofilters.DjangoFilterBackend, )
    filterset_class = (PlaylistFilter)

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all().order_by('-created')
    serializer_class = DestinationSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('name', )

class VoteViewSet(viewsets.ModelViewSet):
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('user', )