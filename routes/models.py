from django.conf import settings
from django.db import models


class Bus(models.Model):
    """
    A bus line or service (e.g. '12 — Airport').
    RouteStop rows define which stops this line visits, in order.
    """

    number = models.CharField(max_length=20, help_text="Line number shown on the bus.")
    name = models.CharField(max_length=200, help_text="Short description of where it goes.")

    class Meta:
        ordering = ["number"]
        verbose_name_plural = "buses"

    def __str__(self):
        return f"{self.number} — {self.name}"


class Stop(models.Model):
    """A single bus stop passengers can board or leave at."""

    name = models.CharField(max_length=200)

    class Meta:
        ordering = ["name"]

    def __str__(self):
        return self.name


class RouteStop(models.Model):
    """
    One stop on a bus line's path, with a position in the sequence.
    First stop is order=1, next is 2, and so on.
    """

    bus = models.ForeignKey(
        Bus,
        on_delete=models.CASCADE,
        related_name="route_stops",
    )
    stop = models.ForeignKey(
        Stop,
        on_delete=models.CASCADE,
        related_name="route_stops",
    )
    order = models.PositiveIntegerField(
        help_text="1 = first stop on the line, 2 = second, etc.",
    )

    class Meta:
        ordering = ["bus", "order"]
        constraints = [
            models.UniqueConstraint(
                fields=["bus", "order"],
                name="routes_routestop_unique_bus_order",
            ),
            models.UniqueConstraint(
                fields=["bus", "stop"],
                name="routes_routestop_unique_bus_stop",
            ),
        ]

    def __str__(self):
        return f"{self.bus} @ {self.order}: {self.stop}"


class SavedRoute(models.Model):
    """A signed-in user bookmarking a bus line for quick access later."""

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_routes",
    )
    bus = models.ForeignKey(
        Bus,
        on_delete=models.CASCADE,
        related_name="saved_routes",
    )
    nickname = models.CharField(
        max_length=100,
        blank=True,
        help_text="Optional label (e.g. 'Work commute').",
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "bus"],
                name="routes_savedroute_unique_user_bus",
            ),
        ]

    def __str__(self):
        label = self.nickname or str(self.bus)
        return f"{self.user} → {label}"
