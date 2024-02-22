
#CMD ["gunicorn", "tmp.py:app", "-b", "0.0.0.0:5000"]
#CMD ["celery", "-A", "tasks", "worker", "--loglevel=info"]

# Base image
FROM python:3.10

# Set working directory
WORKDIR /AI

# Copy requirements.txt
COPY requirements.txt .

# Install dependencies
COPY requirements.txt /backend/
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install python-dotenv

# Copy the application code
COPY . .

# Expose Flask port
EXPOSE 5000

# Command to run the application
CMD ["python", "main.py"]