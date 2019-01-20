from .settings import *
import django_heroku

PREPEND_WWW = True
BASE_URL = "https://www.localgems.io"

django_heroku.settings(locals)