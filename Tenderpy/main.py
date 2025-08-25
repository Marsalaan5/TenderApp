# from flask import Flask, render_template
# import mysql.connector

# app = Flask(__name__)

# def get_tenders_from_db():
#     conn = mysql.connector.connect(
#         host="localhost",
#         user="root",
#         password="",
#         database="tendersdb",
#         charset='utf8mb4',
#         collation='utf8mb4_unicode_ci'
#     )
#     cursor = conn.cursor(dictionary=True)
#     cursor.execute("SELECT * FROM tenders ORDER BY due_date DESC")
#     tenders = cursor.fetchall()
#     cursor.close()
#     conn.close()
#     return tenders

# @app.route("/")
# def home():
#     tenders = get_tenders_from_db()
#     return render_template("index.html", tenders=tenders)

# if __name__ == "__main__":
#     app.run(debug=True)


# from flask import Flask, jsonify, request
# import mysql.connector

# app = Flask(__name__)

# # Function to fetch tenders from DB
# def get_tenders_from_db(filters=None, page=1, limit=10):
#     conn = mysql.connector.connect(
#         host="localhost",
#         user="root",
#         password="",
#         database="tendersdb",
#         charset='utf8mb4',
#         collation='utf8mb4_unicode_ci'
#     )
#     cursor = conn.cursor(dictionary=True)

#     # Optional: Add filters to the query
#     query = "SELECT * FROM tenders ORDER BY due_date DESC LIMIT %s OFFSET %s"
#     offset = (page - 1) * limit
    
#     cursor.execute(query, (limit, offset))
#     tenders = cursor.fetchall()
#     cursor.close()
#     conn.close()
#     return tenders

# # API Route to get tenders
# @app.route("/api/tenders", methods=["GET"])
# def get_tenders():
#     # Extract query parameters for filters and pagination
#     state = request.args.get('state', '')
#     sector = request.args.get('sector', '')
#     deadlineBefore = request.args.get('deadlineBefore', '')
#     page = int(request.args.get('page', 1))
#     limit = int(request.args.get('limit', 10))

#     filters = {
#         'state': state,
#         'sector': sector,
#         'deadlineBefore': deadlineBefore,
#     }

#     tenders = get_tenders_from_db(filters, page, limit)
#     return jsonify(tenders)

# # Home route that renders a template (for web users)
# @app.route("/")
# def home():
#     tenders = get_tenders_from_db()
#     return render_template("index.html", tenders=tenders)

# if __name__ == "__main__":
#     app.run(debug=True)
from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS
import mysql.connector

app = Flask(__name__)

# Allow CORS only from React app running on localhost:5174
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5174"}})

# Function to fetch tenders from DB
def get_tenders_from_db(filters=None, page=1, limit=10):
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="tendersdb",
        charset='utf8mb4',
        collation='utf8mb4_unicode_ci'
    )
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM tenders ORDER BY due_date DESC LIMIT %s OFFSET %s"
    offset = (page - 1) * limit

    cursor.execute(query, (limit, offset))
    tenders = cursor.fetchall()
    cursor.close()
    conn.close()
    return tenders

# API Route to get tenders
@app.route("/api/tenders", methods=["GET"])
def get_tenders():
    state = request.args.get('state', '')
    sector = request.args.get('sector', '')
    deadlineBefore = request.args.get('deadlineBefore', '')
    page = int(request.args.get('page', 1))
    limit = int(request.args.get('limit', 10))

    filters = {
        'state': state,
        'sector': sector,
        'deadlineBefore': deadlineBefore,
    }

    tenders = get_tenders_from_db(filters, page, limit)
    return jsonify(tenders)

if __name__ == "__main__":
    app.run(debug=True)
