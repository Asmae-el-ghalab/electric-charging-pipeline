# Pipeline bornes électriques Maroc

## Description
Ce projet récupère les bornes de recharge électrique au Maroc depuis l'API OpenChargeMap, nettoie les données, les exporte en JSON/CSV et les insère dans une base MySQL.

## Installation

```bash
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Configuration
Créer un fichier .env à partir de .env.example.

Base de données
Importer le fichier SQL suivant dans phpMyAdmin :

database/ev_charging_morocco.sql
Exécution
python src\main.py