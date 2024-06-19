import os
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

DB = {
    'host': os.environ["DB_HOST"],
    'port': os.environ["DB_PORT"],
    'user': os.environ["DB_USER"],
    'password': os.environ["DB_PASSWORD"],
    'database': os.environ["DB_DATABASE"],
    'charset': 'utf8'
}