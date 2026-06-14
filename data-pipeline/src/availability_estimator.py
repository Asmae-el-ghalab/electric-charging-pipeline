import random
from datetime import datetime


def estimate_availability(station):
    """
    Estime la disponibilité d'une borne selon l'heure et son type.
    Approche heuristique basée sur des patterns d'usage réalistes.
    """
    now = datetime.now()
    hour = now.hour

    # Heures de pointe : plus de probabilité d'être occupé
    if 7 <= hour <= 9 or 17 <= hour <= 20:
        proba_occupe = 0.55
    elif 22 <= hour or hour <= 5:
        proba_occupe = 0.10
    else:
        proba_occupe = 0.30

    # Bornes "Free" généralement plus demandées
    if station.get("usage_cost") == "Free":
        proba_occupe += 0.15

    rand = random.random()
    if rand < proba_occupe:
        return "Occupé"
    elif rand < proba_occupe + 0.10:
        return "Hors service"
    else:
        return "Disponible"


def apply_availability_estimation(stations):
    for station in stations:
        station["disponibilite_temps_reel"] = estimate_availability(station)
        station["derniere_maj_disponibilite"] = datetime.now().isoformat()
        station["source_data"] = "Estimation"
    return stations