from django.core.management.base import BaseCommand
from django.db import transaction

from routes.models import Bus, RouteStop, Stop


class Command(BaseCommand):
    help = "Seed free ordinary buses only (get_or_create). Use --clear to wipe first."

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Delete all RouteStop, Bus, and Stop rows before seeding.",
        )

    def handle(self, *args, **options):
        if options.get("clear"):
            RouteStop.objects.all().delete()
            Bus.objects.all().delete()
            Stop.objects.all().delete()

        stop_names = [
            "Majestic",
            "Electronic City",
            "Whitefield",
            "Marathahalli",
            "Hebbal",
            "Banashankari",
            "Jayanagar",
            "Yeshwanthpur",
            "Koramangala",
            "BTM Layout",
            "Shivajinagar",
            "Silk Board",
            "Indiranagar",
            "MG Road",
            "Lalbagh",
            "KR Market",
        ]

        # Free ordinary buses only (no V-prefix, no KBS, no AC). (number, route_name, stops_in_order)
        buses_data = [
            ("360K", "Majestic to Electronic City", ["Majestic", "Lalbagh", "Jayanagar", "Silk Board", "Electronic City"]),
            ("356", "Electronic City to Majestic", ["Electronic City", "Silk Board", "Jayanagar", "Lalbagh", "Majestic"]),
            ("360B", "Electronic City to Majestic", ["Electronic City", "Silk Board", "Jayanagar", "Lalbagh", "Majestic"]),
            ("333R", "Majestic to Marathahalli", ["Majestic", "MG Road", "Indiranagar", "Marathahalli"]),
            ("335A", "Majestic to Marathahalli", ["Majestic", "MG Road", "Indiranagar", "Marathahalli"]),
            ("333RR", "Marathahalli to Majestic", ["Marathahalli", "Indiranagar", "MG Road", "Majestic"]),
            ("284", "Majestic to Hebbal", ["Majestic", "Shivajinagar", "Hebbal"]),
            ("285M", "Majestic to Hebbal", ["Majestic", "Shivajinagar", "Hebbal"]),
            ("288", "Majestic to Hebbal", ["Majestic", "Shivajinagar", "Hebbal"]),
            ("284R", "Hebbal to Majestic", ["Hebbal", "Shivajinagar", "Majestic"]),
            ("43B", "Majestic to Banashankari", ["Majestic", "Lalbagh", "Jayanagar", "Banashankari"]),
            ("45D", "Majestic to Banashankari", ["Majestic", "Lalbagh", "Jayanagar", "Banashankari"]),
            ("45E", "Majestic to Banashankari", ["Majestic", "Lalbagh", "Jayanagar", "Banashankari"]),
            ("45F", "Majestic to Banashankari", ["Majestic", "Lalbagh", "Jayanagar", "Banashankari"]),
            ("43BR", "Banashankari to Majestic", ["Banashankari", "Jayanagar", "Lalbagh", "Majestic"]),
            ("2", "Majestic to Jayanagar", ["Majestic", "Lalbagh", "Jayanagar"]),
            ("18", "Majestic to Jayanagar", ["Majestic", "Lalbagh", "Jayanagar"]),
            ("25A", "Majestic to Jayanagar", ["Majestic", "Lalbagh", "Jayanagar"]),
            ("25E", "Majestic to Jayanagar", ["Majestic", "Lalbagh", "Jayanagar"]),
            ("215H", "Majestic to Jayanagar", ["Majestic", "Lalbagh", "Jayanagar"]),
            ("215M", "Majestic to Jayanagar", ["Majestic", "Lalbagh", "Jayanagar"]),
            ("2R", "Jayanagar to Majestic", ["Jayanagar", "Lalbagh", "Majestic"]),
            ("25AR", "Jayanagar to Majestic", ["Jayanagar", "Lalbagh", "Majestic"]),
            ("82", "Majestic to Yeshwanthpur", ["Majestic", "Shivajinagar", "Yeshwanthpur"]),
            ("82A", "Majestic to Yeshwanthpur", ["Majestic", "Shivajinagar", "Yeshwanthpur"]),
            ("252", "Majestic to Yeshwanthpur", ["Majestic", "Shivajinagar", "Yeshwanthpur"]),
            ("265", "Majestic to Yeshwanthpur", ["Majestic", "Shivajinagar", "Yeshwanthpur"]),
            ("82R", "Yeshwanthpur to Majestic", ["Yeshwanthpur", "Shivajinagar", "Majestic"]),
            ("171", "Majestic to Koramangala", ["Majestic", "Lalbagh", "Jayanagar", "Koramangala"]),
            ("340A", "Majestic to Koramangala", ["Majestic", "Lalbagh", "Jayanagar", "Koramangala"]),
            ("342F", "Majestic to Koramangala", ["Majestic", "Lalbagh", "Jayanagar", "Koramangala"]),
            ("171R", "Koramangala to Majestic", ["Koramangala", "Jayanagar", "Lalbagh", "Majestic"]),
            ("171-G", "Koramangala to Majestic", ["Koramangala", "Jayanagar", "Lalbagh", "Majestic"]),
            ("27", "BTM Layout to Shivajinagar", ["BTM Layout", "Jayanagar", "Lalbagh", "Majestic", "Shivajinagar"]),
            ("27R", "Shivajinagar to BTM Layout", ["Shivajinagar", "Majestic", "Lalbagh", "Jayanagar", "BTM Layout"]),
            ("600D", "BTM Layout to Electronic City", ["BTM Layout", "Silk Board", "Electronic City"]),
            ("600F", "BTM Layout to Electronic City", ["BTM Layout", "Silk Board", "Electronic City"]),
            ("600G", "BTM Layout to Electronic City", ["BTM Layout", "Silk Board", "Electronic City"]),
            ("600DR", "Electronic City to BTM Layout", ["Electronic City", "Silk Board", "BTM Layout"]),
            ("600D2", "Banashankari to Electronic City", ["Banashankari", "BTM Layout", "Silk Board", "Electronic City"]),
            ("600F2", "Banashankari to Electronic City", ["Banashankari", "BTM Layout", "Silk Board", "Electronic City"]),
        ]

        with transaction.atomic():
            stops_by_name = {}
            for name in stop_names:
                stop, _ = Stop.objects.get_or_create(name=name)
                stops_by_name[name] = stop

            for number, route_name, stops_in_order in buses_data:
                bus, _ = Bus.objects.get_or_create(number=number, defaults={"name": route_name})
                if bus.name != route_name:
                    bus.name = route_name
                    bus.save(update_fields=["name"])

                for order, stop_name in enumerate(stops_in_order, start=1):
                    stop = stops_by_name[stop_name]
                    route_stop, created = RouteStop.objects.get_or_create(
                        bus=bus,
                        stop=stop,
                        defaults={"order": order},
                    )
                    if not created and route_stop.order != order:
                        route_stop.order = order
                        route_stop.save(update_fields=["order"])

        x = Stop.objects.count()
        y = Bus.objects.count()
        z = RouteStop.objects.count()
        self.stdout.write(self.style.SUCCESS(f"Stops: {x} | Buses: {y} | RouteStops: {z}"))
