from django.contrib import admin
from core.models import User, Destination, Playlist, Vote


class DestinationAdmin(admin.ModelAdmin):
    model = Destination
    list_display = (
        "playlist",
        "lat",
        "lng",
        "place_id",
        "description",
        "name",
        "pk",
    )


class PlaylistAdmin(admin.ModelAdmin):
    model = Playlist
    list_display = (
        "user",
        "city",
        "title",
        "description",
        "accessible",
        "pk",
    )

class VoteAdmin(admin.ModelAdmin):
    model = Vote
    list_display = (
        "user",
        "playlist",
        "pk",
    )

admin.site.register(Destination, DestinationAdmin)
admin.site.register(Playlist, PlaylistAdmin)
admin.site.register(Vote, VoteAdmin)