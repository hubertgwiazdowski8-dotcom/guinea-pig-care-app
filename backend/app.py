import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from dotenv import load_dotenv

# Cloud SQL Python Connector
from google.cloud.sql.connector import Connector
import pg8000.native

# Wczytaj zmienne środowiskowe z .env
load_dotenv()

app = Flask(
    __name__,
    static_folder='frontend_build',  # Tu będzie build z Reacta (jeśli używasz frontendu)
    static_url_path='/'
)

# Konfiguracja połączenia z Cloud SQL przy użyciu Cloud SQL Python Connector
INSTANCE_CONNECTION_NAME = os.environ.get("INSTANCE_CONNECTION_NAME")  # np. "my-project:region:instance-name"
DB_USER = os.environ.get("DB_USER", "quickstart-user")
DB_PASS = os.environ.get("DB_PASS", "Postgres123!")
DB_NAME = os.environ.get("DB_NAME", "quickstart-instance")

# Inicjalizacja connectora
connector = Connector()

def getconn():
    return connector.connect(
        INSTANCE_CONNECTION_NAME,
        "pg8000",
        user=DB_USER,
        password=DB_PASS,
        db=DB_NAME,
    )

app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"postgresql+pg8000://{DB_USER}:{DB_PASS}@/{DB_NAME}"
)
app.config["SQLALCHEMY_ENGINE_OPTIONS"] = {
    "creator": getconn
}
db = SQLAlchemy(app)

# MODELE
class GuineaPig(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    birthdate = db.Column(db.Date, nullable=True)
    photo_url = db.Column(db.String(200), nullable=True)
    notes = db.Column(db.String(300), nullable=True)

class CareLog(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    pig_id = db.Column(db.Integer, db.ForeignKey('guinea_pig.id'), nullable=False)
    date = db.Column(db.Date, default=datetime.utcnow)
    weight = db.Column(db.Float, nullable=True)
    notes = db.Column(db.String(300), nullable=True)
    pig = db.relationship('GuineaPig', backref=db.backref('logs', lazy=True))

# ROUTES

@app.route("/")
def home():
    return "Backend działa!"

@app.route('/api/pigs', methods=['GET', 'POST'])
def pigs():
    if request.method == 'POST':
        data = request.json
        pig = GuineaPig(
            name=data['name'],
            birthdate=datetime.strptime(data['birthdate'], '%Y-%m-%d') if 'birthdate' in data and data['birthdate'] else None,
            photo_url=data.get('photo_url'),
            notes=data.get('notes', '')
        )
        db.session.add(pig)
        db.session.commit()
        return jsonify({'id': pig.id}), 201
    else:
        pigs = GuineaPig.query.all()
        return jsonify([{
            'id': pig.id,
            'name': pig.name,
            'birthdate': pig.birthdate.isoformat() if pig.birthdate else None,
            'photo_url': pig.photo_url,
            'notes': pig.notes
        } for pig in pigs])

@app.route('/api/pigs/<int:pig_id>', methods=['PUT'])
def update_pig(pig_id):
    pig = GuineaPig.query.get_or_404(pig_id)
    data = request.json
    pig.name = data.get('name', pig.name)
    if 'birthdate' in data:
        pig.birthdate = datetime.strptime(data['birthdate'], '%Y-%m-%d') if data['birthdate'] else None
    pig.photo_url = data.get('photo_url', pig.photo_url)
    pig.notes = data.get('notes', pig.notes)
    db.session.commit()
    return jsonify({
        'id': pig.id,
        'name': pig.name,
        'birthdate': pig.birthdate.isoformat() if pig.birthdate else None,
        'photo_url': pig.photo_url,
        'notes': pig.notes
    }), 200

@app.route('/api/pigs/<int:pig_id>/logs', methods=['GET', 'POST'])
def pig_logs(pig_id):
    if request.method == 'POST':
        data = request.json
        log = CareLog(
            pig_id=pig_id,
            date=datetime.strptime(data['date'], '%Y-%m-%d'),
            weight=data.get('weight'),
            notes=data.get('notes', '')
        )
        db.session.add(log)
        db.session.commit()
        return jsonify({'id': log.id}), 201
    else:
        logs = CareLog.query.filter_by(pig_id=pig_id).all()
        return jsonify([{
            'id': log.id,
            'date': log.date.isoformat(),
            'weight': log.weight,
            'notes': log.notes
        } for log in logs])

# ---- Serve React frontend (static files) ----

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        # For all other routes, serve index.html (React SPA)
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=True, host='0.0.0.0', port=port)