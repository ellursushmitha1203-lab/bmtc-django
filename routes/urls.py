from django.urls import path

from . import api_views

app_name = "routes"

urlpatterns = [
    path("api/buses/", api_views.api_buses, name="api_buses"),
    path("", api_views.root_status, name="root_status"),
]

