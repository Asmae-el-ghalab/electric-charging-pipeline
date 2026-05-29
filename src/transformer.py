def transform_station(station):
    address = station.get("AddressInfo") or {}
    operator = station.get("OperatorInfo") or {}
    status = station.get("StatusType") or {}
    connections = station.get("Connections") or []

    clean_connections = []

    for connection in connections:
        connection_type = connection.get("ConnectionType") or {}
        level = connection.get("Level") or {}
        current_type = connection.get("CurrentType") or {}

        clean_connections.append({
            "connection_type": connection_type.get("Title"),
            "power_kw": connection.get("PowerKW"),
            "quantity": connection.get("Quantity"),
            "voltage": connection.get("Voltage"),
            "amps": connection.get("Amps"),
            "level": level.get("Title"),
            "current_type": current_type.get("Title"),
        })

    return {
        "id": station.get("ID"),
        "uuid": station.get("UUID"),
        "title": address.get("Title"),
        "address": address.get("AddressLine1"),
        "city": address.get("Town"),
        "province": address.get("StateOrProvince"),
        "postcode": address.get("Postcode"),
        "latitude": address.get("Latitude"),
        "longitude": address.get("Longitude"),
        "operator": operator.get("Title"),
        "operator_website": operator.get("WebsiteURL"),
        "status": status.get("Title"),
        "is_operational": status.get("IsOperational"),                                                                                                  
        "usage_cost": station.get("UsageCost") or "Non disponible",
        "connections": clean_connections,
    }


def transform_stations(stations):
    return [transform_station(station) for station in stations]
def remove_duplicates(stations):
    seen_ids = set()
    unique_stations = []

    for station in stations:
        station_id = station.get("id")

        if station_id not in seen_ids:
            seen_ids.add(station_id)
            unique_stations.append(station)

    return unique_stations