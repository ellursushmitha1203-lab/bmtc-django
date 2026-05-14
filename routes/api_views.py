"""
JSON API for bus search between two stops by name.

Uses the same matching rules as route_search (pickup before drop on RouteStop),
without modifying views.route_search.
"""

from django.http import JsonResponse
from django.views.decorators.http import require_GET

from .models import Bus, RouteStop, Stop


@require_GET
def api_buses(request):
    from_name = (request.GET.get("from") or "").strip()
    to_name = (request.GET.get("to") or "").strip()

    if not from_name or not to_name:
        return JsonResponse({"buses": []})

    if from_name.lower() == to_name.lower():
        return JsonResponse({"buses": []})

    pickup = Stop.objects.filter(name__iexact=from_name).first()
    drop = Stop.objects.filter(name__iexact=to_name).first()
    if pickup is None or drop is None:
        return JsonResponse({"buses": []})

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
    payload = [{"number": bus.number, "name": bus.name} for bus in buses]
    return JsonResponse({"buses": payload})


def root_status(request):
    """Lightweight root for Django when the SPA is hosted elsewhere."""
    return JsonResponse({"status": "ok"})
