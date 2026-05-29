import json
import os

import pandas as pd


def save_json(data, filepath):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)

    with open(filepath, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=2)


def save_csv(data, filepath):
    rows = []

    for station in data:
        connections = station.get("connections") or []

        if not connections:
            row = {
                **station,
                "connection_type": None,
                "power_kw": None,
                "quantity": None,
                "voltage": None,
                "amps": None,
                "level": None,
                "current_type": None,
            }
            row.pop("connections", None)
            rows.append(row)
        else:
            for connection in connections:
                row = {
                    **{key: value for key, value in station.items() if key != "connections"},
                    **connection,
                }
                rows.append(row)

    df = pd.DataFrame(rows)
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    df.to_csv(filepath, index=False, encoding="utf-8")