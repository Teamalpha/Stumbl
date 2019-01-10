from django.db import models
from django.contrib.auth.models import User

# Create your models here.

class TimeStamp(models.Model):
    created = models.DateTimeField(auto_now_add=True, null=True)
    updated = models.DateTimeField(auto_now=True, null=True)

    class Meta:
        abstract = True


class Playlist(TimeStamp):
    title = models.CharField(max_length=50, null=False)
    city = models.CharField(max_length=50, null=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name="playlists")
    
    class Meta:
        unique_together = ('user', 'title',)

    def __str__(self):
        return self.title


class Destination(TimeStamp):
    name = models.CharField(max_length=50, null=False)
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name="destinations")
    coordinates = models.TextField(null=False)
    place_id = models.CharField(max_length=50, null=True)
    description = models.TextField(null=True)

    def __str__(self):
        return self.name

