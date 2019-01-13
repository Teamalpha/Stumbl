from django.shortcuts import render
from django.conf import settings
from core.models import User, Playlist, Destination
# Create your views here.

def index(request):
    return render(request, 'index.html', { 'google_api_key': settings.GOOGLE_MAPS_API_KEY})

def about(request):
    return render(request, 'about.html')
    
def destinations(request):
    destinations: Destination.objects.all()
    return render(request, 'destination.html',{'destinations.html': destinations, "pk": pk})

def playlist(request):
    playlists = Playlist.objects.all()
    return render(request, 'playlist.html', {'playlists': playlists})

def profile(request):
    return render(request, 'profile.html')

def playlist_detail(request, pk):
    playlist = Playlist.objects.get(pk=pk)
    destinations = playlist.destinations
    return render(request, 'playlist_detail.html', {'destinations': destinations, "pk": pk})