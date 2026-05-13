from django.contrib import admin
from django.db.models import Count

from .models import Bus, RouteStop, SavedRoute, Stop


@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ("number", "name", "route_stop_count")
    list_display_links = ("number", "name")
    search_fields = ("number", "name")
    ordering = ("number", "name")

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(_route_stop_count=Count("route_stops", distinct=True))

    @admin.display(description="Stops on route", ordering="_route_stop_count")
    def route_stop_count(self, obj):
        return obj._route_stop_count


@admin.register(Stop)
class StopAdmin(admin.ModelAdmin):
    list_display = ("name", "lines_serving_count")
    list_display_links = ("name",)
    search_fields = ("name",)
    ordering = ("name",)
    list_filter = (("route_stops__bus", admin.RelatedOnlyFieldListFilter),)

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        return qs.annotate(
            _lines=Count("route_stops__bus", distinct=True),
        )

    @admin.display(description="Bus lines", ordering="_lines")
    def lines_serving_count(self, obj):
        return obj._lines


@admin.register(RouteStop)
class RouteStopAdmin(admin.ModelAdmin):
    list_display = ("bus", "order", "stop")
    list_display_links = ("bus",)
    list_filter = (
        "bus",
        ("stop", admin.RelatedOnlyFieldListFilter),
    )
    search_fields = (
        "bus__number",
        "bus__name",
        "stop__name",
    )
    ordering = ("bus__number", "order", "stop__name")
    autocomplete_fields = ("bus", "stop")
    list_select_related = ("bus", "stop")


@admin.register(SavedRoute)
class SavedRouteAdmin(admin.ModelAdmin):
    list_display = ("user", "bus", "nickname")
    list_display_links = ("user", "bus")
    list_filter = (
        "bus",
        ("user", admin.RelatedOnlyFieldListFilter),
    )
    search_fields = (
        "nickname",
        "user__username",
        "user__email",
        "user__first_name",
        "user__last_name",
        "bus__number",
        "bus__name",
    )
    ordering = ("user__username", "bus__number", "bus__name")
    autocomplete_fields = ("user", "bus")
    list_select_related = ("user", "bus")
