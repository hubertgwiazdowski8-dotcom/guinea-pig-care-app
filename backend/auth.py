from flask import request, jsonify
from functools import wraps
from firebase_admin import auth as firebase_auth

def firebase_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)
        if not auth_header or not auth_header.startswith("Bearer "):
            return jsonify({"msg": "Missing or invalid Authorization Header"}), 401
        id_token = auth_header.split(" ")[1]
        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            request.user = decoded_token
        except Exception as e:
            return jsonify({"msg": "Invalid or expired token"}), 401
        return f(*args, **kwargs)
    return decorated_function