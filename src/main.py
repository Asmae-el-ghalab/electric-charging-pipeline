from scraper import fetch_charging_stations
from transformer import transform_stations, remove_duplicates
from storage import save_json, save_csv
from quality_report import generate_quality_report
from load_to_mysql import insert_stations_to_mysql

def main():
    raw_data = fetch_charging_stations()

    print(f"Nombre de bornes récupérées : {len(raw_data)}")

    clean_data = transform_stations(raw_data)
    clean_data = remove_duplicates(clean_data)
    generate_quality_report(clean_data)
    save_json(raw_data, "data/raw/openchargemap_ma_raw.json")
    save_json(clean_data, "data/processed/openchargemap_ma_clean.json")
    save_csv(clean_data, "data/processed/openchargemap_ma_clean.csv")

    print("Fichiers créés avec succès :")
    print("- data/raw/openchargemap_ma_raw.json")
    print("- data/processed/openchargemap_ma_clean.json")
    print("- data/processed/openchargemap_ma_clean.csv")
    insert_stations_to_mysql(clean_data)
    print("Données insérées dans MySQL avec succès.")

if __name__ == "__main__":
    main()