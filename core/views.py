from django.shortcuts import render
from django.conf import settings
from core.models import User, Playlist, Destination


def index(request):
    playlists = Playlist.objects.all()
    return render(request, 'index.html', 
        { 
            'google_api_key': settings.GOOGLE_MAPS_API_KEY,
            'playlists': playlists
        }
    )

def shared(request, sharedPlaylistPk):
    playlists = Playlist.objects.all()
    return render(request, 'index.html', 
        { 
            'google_api_key': settings.GOOGLE_MAPS_API_KEY,
            'playlists': playlists,
            'sharedPlaylistPk': sharedPlaylistPk
        }
    )

def about(request):
    return render(request, 'about.html')
