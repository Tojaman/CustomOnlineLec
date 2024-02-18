FROM python:3.10

WORKDIR /AI

COPY requirements.txt .


COPY requirements.txt /backend/
RUN pip install -r requirements.txt
RUN pip install python-dotenv



COPY . /AI/

# Django 프로젝트 실행
EXPOSE 5000

#CMD ["gunicorn", "tmp.py:app", "-b", "0.0.0.0:5000"]
#CMD ["celery", "-A", "tasks", "worker", "--loglevel=info"]