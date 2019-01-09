from django.contrib import admin
from core.models import User, Destination, Playlist


class DestinationAdmin(admin.ModelAdmin):
    model = Destination
    list_display = (
        "playlist",
        "coordinates",
        "place_id",
        "description",
        "name",
    )


class PlaylistAdmin(admin.ModelAdmin):
    model = Playlist
    list_display = (
        "user",
        "title",
        "city",
    )


admin.site.register(Destination, DestinationAdmin)
admin.site.register(Playlist, PlaylistAdmin)
