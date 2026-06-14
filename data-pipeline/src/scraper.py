import requests
from config import API_KEY, BASE_URL, COUNTRY_CODE, MAX_RESULTS


def fetch_charging_stations():
    params = {
        "countrycode": COUNTRY_CODE,
        "maxresults": MAX_RESULTS,
        "key": API_KEY,
        "output": "json",
        "verbose": "true",
    }

    try:
        response = requests.get(BASE_URL, params=params, timeout=30)
        response.raise_for_status()
        return response.json()

    except requests.exceptions.Timeout:
        print("Erreur : délai d'attente dépassé.")
        return []

    except requests.exceptions.ConnectionError:
        print("Erreur : problème de connexion internet.")
        return []

    except requests.exceptions.HTTPError as error:
        print(f"Erreur HTTP : {error}")
        return []

    except requests.exceptions.RequestException as error:
        print(f"Erreur pendant l'appel API : {error}")
        return []