from django.shortcuts import render
from rest_framework import viewsets, mixins, generics, filters
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from api.serializers import UserSerializer, DestinationSerializer, PlaylistSerializer
from core.models import User, Destination, Playlist
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('username', )

class PlaylistViewSet(viewsets.ModelViewSet):
    queryset = Playlist.objects.all().order_by('-created')
    serializer_class = PlaylistSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('city', )

class DestinationViewSet(viewsets.ModelViewSet):
    queryset = Destination.objects.all().order_by('-created')
    serializer_class = DestinationSerializer
    filter_backends = (filters.SearchFilter, )
    search_fields = ('name', )
