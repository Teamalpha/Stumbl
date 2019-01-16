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
    description = models.TextField(blank=True, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, related_name="playlists")
    accessible = models.BooleanField(default=False)

    class Meta:
        unique_together = ('user', 'title',)

    def __str__(self):
        return self.title


class Destination(TimeStamp):
    name = models.CharField(max_length=50, null=False)
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name="destinations")
    place_id = models.CharField(max_length=500, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    lat = models.DecimalField(max_digits=20, decimal_places=18, null=True)
    lng = models.DecimalField(max_digits=20, decimal_places=18, null=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True)

    class Meta:
        unique_together = ('user', 'name', 'playlist')

    def __str__(self):
        return self.name

class Vote(TimeStamp):
    playlist = models.ForeignKey(Playlist, on_delete=models.CASCADE, related_name="votes")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="voted_users")

    class Meta:
        unique_together = ('playlist', 'user',)

    def __str__(self):
        return f"User: {self.user}, Playlist: {self.playlist}"