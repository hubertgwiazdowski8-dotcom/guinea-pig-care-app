from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from dotenv import load_dotenv
load_dotenv()
import os

app = Flask(
    __name__,
    static_folder='frontend_build',  # This is where the React build will be copied in Dockerfile
    static_url_path='/'
)
app.config["SQLALCHEMY_DATABASE_URI"] = os.environ.get("DATABASE_URL")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # Optional, silences warnings
db = SQLAlchemy(app)

print(os.environ["DATABASE_URL"])

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

# Serve static files and index.html for React router
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