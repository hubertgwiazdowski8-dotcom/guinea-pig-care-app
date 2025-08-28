import os
from flask import Flask, request, jsonify, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_cors import CORS

# Where uploaded photos will be stored
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), 'static', 'photos')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app = Flask(
    __name__,
    static_folder='frontend_build',  # for React build
    static_url_path='/'
)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///mydb.sqlite3"
db = SQLAlchemy(app)

# MODELS
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
        name = request.form.get('name')
        birthdate = request.form.get('birthdate')
        notes = request.form.get('notes')
        photo = request.files.get('photo')
        photo_url = None

        if photo:
            filename = f"{name}_{int(datetime.now().timestamp())}.jpg"
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            photo.save(filepath)
            photo_url = f"/static/photos/{filename}"

        pig = GuineaPig(
            name=name,
            birthdate=datetime.strptime(birthdate, '%Y-%m-%d') if birthdate else None,
            photo_url=photo_url,
            notes=notes
        )
        db.session.add(pig)
        db.session.commit()
        return jsonify({'id': pig.id, 'photo_url': photo_url}), 201
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

# ---- Serve uploaded photos ----
@app.route('/static/photos/<filename>')
def uploaded_file(filename):
    # This will serve files from UPLOAD_FOLDER when accessing /static/photos/<filename>
    return send_from_directory(UPLOAD_FOLDER, filename)

# ---- Serve React frontend (static files) ----
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=True, host='0.0.0.0', port=port)