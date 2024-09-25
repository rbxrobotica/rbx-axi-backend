from django import forms

class AxieFilterForm(forms.Form):
    max_level = forms.IntegerField(label='Nível Máximo', required=False)
