from django.shortcuts import render

from .forms import RouteSearchForm
from .models import Bus, RouteStop


def route_search(request):
    """
    Beginner-friendly route search.

    User picks a pickup stop and a drop stop.
    We return buses where:
      - the bus has BOTH stops in RouteStop
      - pickup appears BEFORE drop (pickup.order < drop.order)
    """

    form = RouteSearchForm(request.GET or None)
    results = []

    if form.is_valid():
        pickup = form.cleaned_data["pickup"]
        drop = form.cleaned_data["drop"]

        # RouteStop has uniqueness constraints per (bus, stop), so each bus will have
        # at most one "order" value for a given stop.
        pickup_rows = RouteStop.objects.filter(stop=pickup).values_list("bus_id", "order")
        drop_rows = RouteStop.objects.filter(stop=drop).values_list("bus_id", "order")

        pickup_order_by_bus_id = dict(pickup_rows)
        drop_order_by_bus_id = dict(drop_rows)

        matching_bus_ids = [
            bus_id
            for bus_id, pickup_order in pickup_order_by_bus_id.items()
            if (bus_id in drop_order_by_bus_id) and (pickup_order < drop_order_by_bus_id[bus_id])
        ]

        buses = Bus.objects.filter(id__in=matching_bus_ids).order_by("number", "name")
        results = [
            {
                "bus": bus,
                "pickup_order": pickup_order_by_bus_id.get(bus.id),
                "drop_order": drop_order_by_bus_id.get(bus.id),
            }
            for bus in buses
        ]

    return render(
        request,
        "routes/route_search.html",
        {
            "form": form,
            "results": results,
        },
    )
