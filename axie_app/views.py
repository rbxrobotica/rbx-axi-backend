import requests
from django.shortcuts import render
from .models import Axie
from .forms import AxieFilterForm
from django.conf import settings

from django.http import JsonResponse

import json
from django.views.decorators.csrf import csrf_exempt

API_KEY = settings.API_KEY
API_URL = settings.API_URL

def fetch_api(query):
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY
    }
    response = requests.post(API_URL, headers=headers, data=json.dumps({"query": query}))
    return response.json()

@csrf_exempt
def get_axie_name(request):
    if request.method == "POST":
        body = json.loads(request.body)
        axie_id = body.get('axieId')
        query = f'{{ axie(axieId: "{axie_id}") {{ name }} }}'
        data = fetch_api(query)
        print(data)
        axie_name = data['data']['axie']['name']
        return JsonResponse({"axie_name": axie_name})

def home(request):
    data = {
        'message': 'Hello from Django!'
    }
    return JsonResponse(data)


def find_axies(request):

    form = AxieFilterForm(request.POST or None)
    if form.is_valid():
        max_level = form.cleaned_data['max_level']
        query = """
        query getAxies($maxLevel: Int) {
            axies(where: { level: { _lte: $maxLevel } }) {
                id
                name
                level
            }
        }
        """
        variables = {'maxLevel': max_level}
        response = requests.post('https://api.axieinfinity.com/graphql',
                            headers={'x-api-key': API_KEY},
                            json={'query': query, 'variables': variables})
        data = response.json()['data']['axies']
        for axie_data in data:
            Axie.objects.create(**axie_data)
    axies = Axie.objects.all()
    return render(request, 'axie_app/axie_list.html', {'axies': axies, 'form': form})
