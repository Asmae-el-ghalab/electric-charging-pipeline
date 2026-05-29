from database import get_connection


def insert_stations_to_mysql(stations):
    connection = get_connection()
    cursor = connection.cursor()

    for station in stations:
        cursor.execute(
            """
            INSERT INTO stations (
                id, uuid, title, address, city, province, postcode,
                latitude, longitude, operator, operator_website,
                status, is_operational, usage_cost
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON DUPLICATE KEY UPDATE
                uuid = VALUES(uuid),
                title = VALUES(title),
                address = VALUES(address),
                city = VALUES(city),
                province = VALUES(province),
                postcode = VALUES(postcode),
                latitude = VALUES(latitude),
                longitude = VALUES(longitude),
                operator = VALUES(operator),
                operator_website = VALUES(operator_website),
                status = VALUES(status),
                is_operational = VALUES(is_operational),     
                usage_cost = VALUES(usage_cost)                                      
            """,
            (
                station.get("id"),
                station.get("uuid"),
                station.get("title"),
                station.get("address"),
                station.get("city"),
                station.get("province"),
                station.get("postcode"),
                station.get("latitude"),
                station.get("longitude"),
                station.get("operator"),
                station.get("operator_website"),
                station.get("status"),
                station.get("is_operational"),  
                station.get("usage_cost"),
            ),
        )

        cursor.execute(
            "DELETE FROM connections WHERE station_id = %s",
            (station.get("id"),),
        )

        for conn in station.get("connections") or []:
            cursor.execute(
                """
                INSERT INTO connections (
                    station_id, connection_type, power_kw, quantity,
                    voltage, amps, level, current_type
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    station.get("id"),
                    conn.get("connection_type"),
                    conn.get("power_kw"),
                    conn.get("quantity"),
                    conn.get("voltage"),
                    conn.get("amps"),
                    conn.get("level"),
                    conn.get("current_type"),
                ),
            )

    connection.commit()
    cursor.close()
    connection.close()