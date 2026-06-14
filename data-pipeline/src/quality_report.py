def generate_quality_report(stations):
    total = len(stations)

    missing_city = sum(1 for station in stations if not station.get("city"))
    missing_operator = sum(1 for station in stations if not station.get("operator"))
    missing_status = sum(1 for station in stations if not station.get("status"))

    missing_power = 0
    operational = sum(1 for station in stations if station.get("is_operational") is True)

    for station in stations:
        connections = station.get("connections") or []
        if not connections or all(conn.get("power_kw") is None for conn in connections):
            missing_power += 1

    print("\nRapport qualité des données")
    print("---------------------------")
    print(f"Nombre total de bornes : {total}")
    print(f"Bornes sans ville : {missing_city}")
    print(f"Bornes sans opérateur : {missing_operator}")
    print(f"Bornes sans statut : {missing_status}")
    print(f"Bornes sans puissance : {missing_power}")
    print(f"Bornes opérationnelles : {operational}")