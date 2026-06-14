import os
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("OPENCHARGEMAP_API_KEY")
BASE_URL = os.getenv("OPENCHARGEMAP_BASE_URL")
COUNTRY_CODE = os.getenv("COUNTRY_CODE", "MA")
MAX_RESULTS = int(os.getenv("MAX_RESULTS", 100))