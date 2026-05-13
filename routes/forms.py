from django import forms

from .models import Stop


class RouteSearchForm(forms.Form):
    pickup = forms.ModelChoiceField(
        queryset=Stop.objects.all().order_by("name"),
        empty_label="Select pickup stop",
    )
    drop = forms.ModelChoiceField(
        queryset=Stop.objects.all().order_by("name"),
        empty_label="Select drop stop",
    )

    def clean(self):
        cleaned = super().clean()
        pickup = cleaned.get("pickup")
        drop = cleaned.get("drop")
        if pickup and drop and pickup == drop:
            raise forms.ValidationError("Pickup and drop stops must be different.")
        return cleaned

