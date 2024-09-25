import requests
import json

# Substitua pelo seu API key
api_key = 'UrHLGOLkTTpTRUwvWiEFKtRRP8up37Ud'
api_url = 'https://api-gateway.skymavis.com/graphql/marketplace'

def fetch_api(query):
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": api_key
    }
    payload = {
        "query": query
    }
    response = requests.post(api_url, headers=headers, json=payload)
    return response.json()

def get_axie_name(axie_id):
    query = f'{{ axie(axieId: "{axie_id}") {{ name }} }}'
    data = fetch_api(query)
    return data['data']['axie']['name']

# Substitua pelo ID do Axie que você deseja consultar
axie_id = '1234'
name = get_axie_name(axie_id)
print(f'Nome do Axie: {name}')