import os
import sqlite3
import uuid
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "krishi.db")

app = Flask(__name__)
CORS(app)

# ---------------- DATABASE ----------------

def dict_factory(cursor, row):
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}


def open_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = dict_factory
    return conn


def now_iso():
    return datetime.utcnow().isoformat() + "Z"


def init_db():
    conn = open_db()
    cur = conn.cursor()

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS users(
            id TEXT PRIMARY KEY,
            role TEXT NOT NULL,
            name TEXT NOT NULL,
            phone TEXT UNIQUE NOT NULL,
            aadhaar TEXT UNIQUE,
            pmKisanId TEXT,
            village TEXT,
            district TEXT,
            state TEXT,
            landAcres REAL,
            landPhoto TEXT,
            location TEXT,
            verified INTEGER NOT NULL DEFAULT 0,
            createdAt TEXT NOT NULL
        )
        """
    )

    # Add landPhoto column for farmer verification if it is missing in an existing database.
    cur.execute("PRAGMA table_info(users)")
    existing_columns = [row["name"] for row in cur.fetchall()]
    if "landPhoto" not in existing_columns:
        cur.execute("ALTER TABLE users ADD COLUMN landPhoto TEXT")

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS products(
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            image TEXT,
            price REAL NOT NULL,
            fairPrice REAL NOT NULL,
            unit TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            farmerId TEXT NOT NULL,
            farmerName TEXT NOT NULL,
            village TEXT,
            district TEXT,
            state TEXT,
            distanceKm REAL,
            rating REAL,
            reviews INTEGER,
            harvestedDaysAgo INTEGER,
            description TEXT,
            createdAt TEXT NOT NULL
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS orders(
            id TEXT PRIMARY KEY,
            consumerId TEXT NOT NULL,
            productId TEXT NOT NULL,
            qty INTEGER NOT NULL,
            totalAmount REAL NOT NULL,
            deliveryLocation TEXT,
            status TEXT NOT NULL,
            createdAt TEXT NOT NULL,
            updatedAt TEXT NOT NULL
        )
        """
    )

    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS chats(
            id TEXT PRIMARY KEY,
            userId TEXT,
            role TEXT,
            message TEXT NOT NULL,
            reply TEXT NOT NULL,
            createdAt TEXT NOT NULL
        )
        """
    )

    conn.commit()
    conn.close()


def seed_data():
    conn = open_db()
    cur = conn.cursor()

    cur.execute("SELECT COUNT(*) as count FROM users")
    if cur.fetchone()["count"] == 0:
        sample_users = [
            {
                "id": "f1",
                "role": "farmer",
                "name": "Ramesh Kumar",
                "phone": "9876501234",
                "aadhaar": "123412341234",
                "pmKisanId": "PMK-001",
                "village": "Bhondsi",
                "district": "Gurugram",
                "state": "Haryana",
                "landAcres": 2.5,
                "location": None,
                "verified": 1,
                "createdAt": now_iso(),
            },
            {
                "id": "f2",
                "role": "farmer",
                "name": "Sunita Devi",
                "phone": "9876501235",
                "aadhaar": "123412341235",
                "pmKisanId": "PMK-002",
                "village": "Kanpur Dehat",
                "district": "Kanpur",
                "state": "Uttar Pradesh",
                "landAcres": 3.0,
                "location": None,
                "verified": 1,
                "createdAt": now_iso(),
            },
            {
                "id": "f3",
                "role": "farmer",
                "name": "Rajesh Sharma",
                "phone": "9876501236",
                "aadhaar": "123412341236",
                "pmKisanId": "PMK-003",
                "village": "Hisar",
                "district": "Hisar",
                "state": "Haryana",
                "landAcres": 5.0,
                "location": None,
                "verified": 1,
                "createdAt": now_iso(),
            },
            {
                "id": "f4",
                "role": "farmer",
                "name": "Amit Singh",
                "phone": "9876501237",
                "aadhaar": "123412341237",
                "pmKisanId": "PMK-004",
                "village": "Amritsar",
                "district": "Amritsar",
                "state": "Punjab",
                "landAcres": 4.5,
                "location": None,
                "verified": 1,
                "createdAt": now_iso(),
            },
            {
                "id": "f5",
                "role": "farmer",
                "name": "Vijay Patel",
                "phone": "9876501238",
                "aadhaar": "123412341238",
                "pmKisanId": "PMK-005",
                "village": "Ahmedabad Rural",
                "district": "Ahmedabad",
                "state": "Gujarat",
                "landAcres": 3.5,
                "location": None,
                "verified": 1,
                "createdAt": now_iso(),
            },
            {
                "id": "f6",
                "role": "farmer",
                "name": "Priya Gupta",
                "phone": "9876501239",
                "aadhaar": "123412341239",
                "pmKisanId": "PMK-006",
                "village": "Jaipur Rural",
                "district": "Jaipur",
                "state": "Rajasthan",
                "landAcres": 2.8,
                "location": None,
                "verified": 1,
                "createdAt": now_iso(),
            },
            {
                "id": "f7",
                "role": "farmer",
                "name": "Suresh Reddy",
                "phone": "9876501240",
                "aadhaar": "123412341240",
                "pmKisanId": "PMK-007",
                "village": "Hyderabad Rural",
                "district": "Hyderabad",
                "state": "Telangana",
                "landAcres": 4.0,
                "location": None,
                "verified": 1,
                "createdAt": now_iso(),
            },
            {
                "id": "f8",
                "role": "farmer",
                "name": "Anita Jain",
                "phone": "9876501241",
                "aadhaar": "123412341241",
                "pmKisanId": "PMK-008",
                "village": "Indore Rural",
                "district": "Indore",
                "state": "Madhya Pradesh",
                "landAcres": 3.2,
                "location": None,
                "verified": 1,
                "createdAt": now_iso(),
            },
            {
                "id": str(uuid.uuid4()),
                "role": "consumer",
                "name": "Pooja Sharma",
                "phone": "9810012345",
                "aadhaar": None,
                "pmKisanId": None,
                "village": None,
                "district": None,
                "state": None,
                "landAcres": None,
                "location": "Gurugram, 122001",
                "verified": 0,
                "createdAt": now_iso(),
            },
        ]
        for user in sample_users:
            cur.execute(
                "INSERT INTO users (id, role, name, phone, aadhaar, pmKisanId, village, district, state, landAcres, location, verified, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    user["id"],
                    user["role"],
                    user["name"],
                    user["phone"],
                    user["aadhaar"],
                    user["pmKisanId"],
                    user["village"],
                    user["district"],
                    user["state"],
                    user["landAcres"],
                    user["location"],
                    user["verified"],
                    user["createdAt"],
                ],
            )

    cur.execute("SELECT COUNT(*) as count FROM products")
    if cur.fetchone()["count"] == 0:
        sample_products = [
            {
                "id": "p1",
                "name": "Vine-Ripened Tomatoes",
                "category": "Vegetables",
                "image": "produce-tomato.jpg",
                "price": 28,
                "fairPrice": 32,
                "unit": "kg",
                "quantity": 120,
                "farmerId": "f1",
                "farmerName": "Ramesh Kumar",
                "village": "Bhondsi",
                "district": "Gurugram",
                "state": "Haryana",
                "distanceKm": 12,
                "rating": 4.7,
                "reviews": 38,
                "harvestedDaysAgo": 1,
                "description": "Fresh, naturally ripened tomatoes harvested from open farmland.",
                "createdAt": now_iso(),
            },
            {
                "id": "p2",
                "name": "Fresh Palak (Spinach)",
                "category": "Leafy Greens",
                "image": "produce-spinach.jpg",
                "price": 22,
                "fairPrice": 25,
                "unit": "bunch",
                "quantity": 60,
                "farmerId": "f2",
                "farmerName": "Sunita Devi",
                "village": "Kanpur Dehat",
                "district": "Kanpur",
                "state": "Uttar Pradesh",
                "distanceKm": 8,
                "rating": 4.9,
                "reviews": 64,
                "harvestedDaysAgo": 0,
                "description": "Tender spinach leaves harvested this morning. Pesticide free.",
                "createdAt": now_iso(),
            },
            {
                "id": "p3",
                "name": "Organic Carrots",
                "category": "Vegetables",
                "image": "produce-carrot.jpg",
                "price": 35,
                "fairPrice": 38,
                "unit": "kg",
                "quantity": 80,
                "farmerId": "f1",
                "farmerName": "Ramesh Kumar",
                "village": "Bhondsi",
                "district": "Gurugram",
                "state": "Haryana",
                "distanceKm": 12,
                "rating": 4.6,
                "reviews": 21,
                "harvestedDaysAgo": 2,
                "description": "Sweet, juicy carrots with green tops. Grown without chemical fertilizers.",
                "createdAt": now_iso(),
            },
            {
                "id": "p4",
                "name": "Premium Wheat",
                "category": "Grains",
                "image": "produce-wheat.jpg",
                "price": 28,
                "fairPrice": 32,
                "unit": "kg",
                "quantity": 500,
                "farmerId": "f3",
                "farmerName": "Rajesh Sharma",
                "village": "Hisar",
                "district": "Hisar",
                "state": "Haryana",
                "distanceKm": 15,
                "rating": 4.8,
                "reviews": 45,
                "harvestedDaysAgo": 30,
                "description": "High-quality wheat grains, perfect for making chapatis and bread.",
                "createdAt": now_iso(),
            },
            {
                "id": "p5",
                "name": "Basmati Rice",
                "category": "Grains",
                "image": "produce-rice.jpg",
                "price": 95,
                "fairPrice": 98,
                "unit": "kg",
                "quantity": 200,
                "farmerId": "f4",
                "farmerName": "Amit Singh",
                "village": "Amritsar",
                "district": "Amritsar",
                "state": "Punjab",
                "distanceKm": 25,
                "rating": 4.9,
                "reviews": 78,
                "harvestedDaysAgo": 45,
                "description": "Premium basmati rice, long grains with aromatic flavor.",
                "createdAt": now_iso(),
            },
            {
                "id": "p6",
                "name": "Black Chana",
                "category": "Pulses",
                "image": "produce-chana.jpg",
                "price": 85,
                "fairPrice": 88,
                "unit": "kg",
                "quantity": 150,
                "farmerId": "f5",
                "farmerName": "Vijay Patel",
                "village": "Ahmedabad Rural",
                "district": "Ahmedabad",
                "state": "Gujarat",
                "distanceKm": 18,
                "rating": 4.7,
                "reviews": 52,
                "harvestedDaysAgo": 60,
                "description": "Nutritious black chickpeas, rich in protein and fiber.",
                "createdAt": now_iso(),
            },
            {
                "id": "p7",
                "name": "White Chole",
                "category": "Pulses",
                "image": "produce-chole.jpg",
                "price": 75,
                "fairPrice": 78,
                "unit": "kg",
                "quantity": 120,
                "farmerId": "f6",
                "farmerName": "Priya Gupta",
                "village": "Jaipur Rural",
                "district": "Jaipur",
                "state": "Rajasthan",
                "distanceKm": 22,
                "rating": 4.6,
                "reviews": 34,
                "harvestedDaysAgo": 55,
                "description": "Premium white chickpeas, perfect for making chana masala.",
                "createdAt": now_iso(),
            },
            {
                "id": "p8",
                "name": "Toor Dal",
                "category": "Pulses",
                "image": "produce-toor-dal.jpg",
                "price": 165,
                "fairPrice": 170,
                "unit": "kg",
                "quantity": 100,
                "farmerId": "f7",
                "farmerName": "Suresh Reddy",
                "village": "Hyderabad Rural",
                "district": "Hyderabad",
                "state": "Telangana",
                "distanceKm": 30,
                "rating": 4.8,
                "reviews": 67,
                "harvestedDaysAgo": 40,
                "description": "High-quality toor dal, essential for South Indian cuisine.",
                "createdAt": now_iso(),
            },
            {
                "id": "p9",
                "name": "Moong Dal",
                "category": "Pulses",
                "image": "produce-moong-dal.jpg",
                "price": 140,
                "fairPrice": 145,
                "unit": "kg",
                "quantity": 80,
                "farmerId": "f8",
                "farmerName": "Anita Jain",
                "village": "Indore Rural",
                "district": "Indore",
                "state": "Madhya Pradesh",
                "distanceKm": 20,
                "rating": 4.7,
                "reviews": 41,
                "harvestedDaysAgo": 35,
                "description": "Split yellow moong dal, easy to cook and highly nutritious.",
                "createdAt": now_iso(),
            },
            {
                "id": "p10",
                "name": "Whole Wheat Grains",
                "category": "Grains",
                "image": "produce-wheat.jpg",
                "price": 30,
                "fairPrice": 34,
                "unit": "kg",
                "quantity": 300,
                "farmerId": "f3",
                "farmerName": "Rajesh Sharma",
                "village": "Hisar",
                "district": "Hisar",
                "state": "Haryana",
                "distanceKm": 15,
                "rating": 4.7,
                "reviews": 25,
                "harvestedDaysAgo": 25,
                "description": "High quality whole wheat grains for daily use.",
                "createdAt": now_iso(),
            },
            {
                "id": "p11",
                "name": "Premium Basmati Rice",
                "category": "Grains",
                "image": "produce-rice.jpg",
                "price": 100,
                "fairPrice": 105,
                "unit": "kg",
                "quantity": 250,
                "farmerId": "f4",
                "farmerName": "Amit Singh",
                "village": "Amritsar",
                "district": "Amritsar",
                "state": "Punjab",
                "distanceKm": 25,
                "rating": 4.9,
                "reviews": 60,
                "harvestedDaysAgo": 40,
                "description": "Long grain aromatic basmati rice.",
                "createdAt": now_iso(),
            },
            {
                "id": "p12",
                "name": "Desi Chana (Brown Chickpeas)",
                "category": "Pulses",
                "image": "produce-chana.jpg",
                "price": 90,
                "fairPrice": 95,
                "unit": "kg",
                "quantity": 180,
                "farmerId": "f5",
                "farmerName": "Vijay Patel",
                "village": "Ahmedabad Rural",
                "district": "Ahmedabad",
                "state": "Gujarat",
                "distanceKm": 18,
                "rating": 4.6,
                "reviews": 40,
                "harvestedDaysAgo": 50,
                "description": "Healthy desi chana rich in protein.",
                "createdAt": now_iso(),
            },
            {
                "id": "p13",
                "name": "Rajma (Kidney Beans)",
                "category": "Pulses",
                "image": "produce-rajma.jpg",
                "price": 130,
                "fairPrice": 135,
                "unit": "kg",
                "quantity": 140,
                "farmerId": "f6",
                "farmerName": "Priya Gupta",
                "village": "Jaipur Rural",
                "district": "Jaipur",
                "state": "Rajasthan",
                "distanceKm": 22,
                "rating": 4.7,
                "reviews": 30,
                "harvestedDaysAgo": 45,
                "description": "Premium quality rajma, perfect for rajma chawal.",
                "createdAt": now_iso(),
            },
            {
                "id": "p14",
                "name": "Masoor Dal",
                "category": "Pulses",
                "image": "produce-masoor-dal.jpg",
                "price": 110,
                "fairPrice": 115,
                "unit": "kg",
                "quantity": 160,
                "farmerId": "f7",
                "farmerName": "Suresh Reddy",
                "village": "Hyderabad Rural",
                "district": "Hyderabad",
                "state": "Telangana",
                "distanceKm": 30,
                "rating": 4.8,
                "reviews": 35,
                "harvestedDaysAgo": 35,
                "description": "Nutritious masoor dal, easy to cook.",
                "createdAt": now_iso(),
            },
            {
                "id": "p15",
                "name": "Urad Dal",
                "category": "Pulses",
                "image": "produce-urad-dal.jpg",
                "price": 150,
                "fairPrice": 155,
                "unit": "kg",
                "quantity": 120,
                "farmerId": "f8",
                "farmerName": "Anita Jain",
                "village": "Indore Rural",
                "district": "Indore",
                "state": "Madhya Pradesh",
                "distanceKm": 20,
                "rating": 4.7,
                "reviews": 28,
                "harvestedDaysAgo": 30,
                "description": "Premium urad dal used in many Indian dishes.",
                "createdAt": now_iso(),
}
        ]
        for product in sample_products:
            cur.execute(
                "INSERT INTO products (id, name, category, image, price, fairPrice, unit, quantity, farmerId, farmerName, village, district, state, distanceKm, rating, reviews, harvestedDaysAgo, description, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [
                    product["id"],
                    product["name"],
                    product["category"],
                    product["image"],
                    product["price"],
                    product["fairPrice"],
                    product["unit"],
                    product["quantity"],
                    product["farmerId"],
                    product["farmerName"],
                    product["village"],
                    product["district"],
                    product["state"],
                    product["distanceKm"],
                    product["rating"],
                    product["reviews"],
                    product["harvestedDaysAgo"],
                    product["description"],
                    product["createdAt"],
                ],
            )

    conn.commit()
    conn.close()


init_db()
seed_data()

# ---------------- HELPERS ----------------

def response_ok(data=None, message="ok"):
    payload = {"status": "success", "message": message}
    if data is not None:
        payload["data"] = data
    return jsonify(payload)


def response_error(message, status_code=400):
    return jsonify({"status": "error", "message": message}), status_code


def get_json_body(required=None):
    data = request.get_json(silent=True) or {}
    missing = [field for field in (required or []) if not data.get(field)]
    return data, missing


# ---------------- ROUTES ----------------

@app.route("/api/health", methods=["GET"])
def health():
    return response_ok({"backend": "KrishiConnect", "time": now_iso()})


@app.route("/api/auth/farmer/register", methods=["POST"])
def farmer_register():
    data, missing = get_json_body(["name", "phone", "aadhaar", "pmKisanId", "landPhoto"])
    if missing:
        return response_error(f"Missing required fields: {', '.join(missing)}")

    conn = open_db()
    cur = conn.cursor()
    user_id = str(uuid.uuid4())
    try:
        cur.execute(
            "INSERT INTO users (id, role, name, phone, aadhaar, pmKisanId, village, district, state, landAcres, landPhoto, verified, createdAt) VALUES (?, 'farmer', ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)",
            [
                user_id,
                data["name"],
                data["phone"],
                data["aadhaar"],
                data["pmKisanId"],
                data.get("village"),
                data.get("district"),
                data.get("state"),
                float(data.get("landAcres") or 0),
                data.get("landPhoto"),
                now_iso(),
            ],
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return response_error("A user with that phone or Aadhaar already exists.")

    conn.close()
    return response_ok(
        {
            "userId": user_id,
            "user": {
                "id": user_id,
                "role": "farmer",
                "name": data["name"],
                "phone": data["phone"],
                "aadhaar": data["aadhaar"],
                "pmKisanId": data["pmKisanId"],
                "village": data.get("village"),
                "district": data.get("district"),
                "state": data.get("state"),
                "landPhoto": data.get("landPhoto"),
                "verified": 1,
                "createdAt": now_iso(),
            },
        },
        "Farmer registered successfully",
    )


@app.route("/api/auth/consumer/register", methods=["POST"])
def consumer_register():
    data, missing = get_json_body(["name", "phone"])
    if missing:
        return response_error(f"Missing required fields: {', '.join(missing)}")

    name = str(data.get("name", "")).strip()
    phone = str(data.get("phone", "")).strip()
    location = str(data.get("location", "") or "").strip() or None

    if not name:
        return response_error("Name cannot be empty")
    if not phone.isdigit() or len(phone) != 10:
        return response_error("Enter a valid 10-digit mobile number")

    conn = open_db()
    cur = conn.cursor()
    user_id = str(uuid.uuid4())
    try:
        cur.execute(
            "INSERT INTO users (id, role, name, phone, location, verified, createdAt) VALUES (?, 'consumer', ?, ?, ?, 0, ?)",
            [user_id, name, phone, location, now_iso()],
        )
        conn.commit()
    except sqlite3.IntegrityError:
        conn.close()
        return response_error("A user with that phone already exists.")

    conn.close()
    return response_ok(
        {
            "userId": user_id,
            "user": {
                "id": user_id,
                "role": "consumer",
                "name": name,
                "phone": phone,
                "location": location,
                "verified": 0,
                "createdAt": now_iso(),
            },
        },
        "Consumer registered successfully",
    )


@app.route("/api/auth/login", methods=["POST"])
def login():
    data, missing = get_json_body(["phone"])
    if missing:
        return response_error(f"Missing required fields: {', '.join(missing)}")

    conn = open_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM users WHERE phone = ?", [data["phone"]])
    user = cur.fetchone()
    conn.close()

    if not user:
        return response_error("User not found", 404)

    return response_ok(user, "Logged in successfully")


@app.route("/api/users", methods=["GET"])
def list_users():
    role = request.args.get("role")
    query = "SELECT * FROM users"
    params = []
    if role:
        query += " WHERE role = ?"
        params.append(role)

    conn = open_db()
    cur = conn.cursor()
    cur.execute(query, params)
    data = cur.fetchall()
    conn.close()
    return response_ok(data)


@app.route("/api/products", methods=["GET"])
def get_products():
    category = request.args.get("category")
    search = request.args.get("search")
    farmer_id = request.args.get("farmerId")

    query = "SELECT * FROM products"
    filters = []
    params = []

    if category:
        filters.append("category = ?")
        params.append(category)
    if farmer_id:
        filters.append("farmerId = ?")
        params.append(farmer_id)
    if search:
        filters.append("(name LIKE ? OR description LIKE ?)")
        params.extend([f"%{search}%", f"%{search}%"])

    if filters:
        query += " WHERE " + " AND ".join(filters)

    conn = open_db()
    cur = conn.cursor()
    cur.execute(query, params)
    data = cur.fetchall()
    conn.close()
    return response_ok(data)


@app.route("/api/products/<product_id>", methods=["GET"])
def get_product(product_id):
    conn = open_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM products WHERE id = ?", [product_id])
    product = cur.fetchone()
    conn.close()
    if not product:
        return response_error("Product not found", 404)
    return response_ok(product)


@app.route("/api/products", methods=["POST"])
def create_product():
    data, missing = get_json_body(["name", "category", "price", "fairPrice", "unit", "quantity", "farmerId", "farmerName"])
    if missing:
        return response_error(f"Missing required fields: {', '.join(missing)}")

    product_id = str(uuid.uuid4())
    conn = open_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO products (id, name, category, image, price, fairPrice, unit, quantity, farmerId, farmerName, village, district, state, distanceKm, rating, reviews, harvestedDaysAgo, description, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
            product_id,
            data["name"],
            data["category"],
            data.get("image"),
            float(data["price"]),
            float(data["fairPrice"]),
            data["unit"],
            int(data["quantity"]),
            data["farmerId"],
            data["farmerName"],
            data.get("village"),
            data.get("district"),
            data.get("state"),
            float(data.get("distanceKm") or 0),
            float(data.get("rating") or 0),
            int(data.get("reviews") or 0),
            int(data.get("harvestedDaysAgo") or 0),
            data.get("description"),
            now_iso(),
        ],
    )
    conn.commit()
    conn.close()

    return response_ok({"productId": product_id}, "Product created successfully")


@app.route("/api/orders", methods=["GET"])
def list_orders():
    consumer_id = request.args.get("consumerId")
    query = "SELECT * FROM orders"
    params = []
    if consumer_id:
        query += " WHERE consumerId = ?"
        params.append(consumer_id)

    conn = open_db()
    cur = conn.cursor()
    cur.execute(query, params)
    data = cur.fetchall()
    conn.close()
    return response_ok(data)


@app.route("/api/orders", methods=["POST"])
def create_order():
    data, missing = get_json_body(["consumerId", "productId", "qty", "deliveryLocation"])
    if missing:
        return response_error(f"Missing required fields: {', '.join(missing)}")

    qty = int(data["qty"])
    if qty <= 0:
        return response_error("Quantity must be greater than zero")

    conn = open_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM products WHERE id = ?", [data["productId"]])
    product = cur.fetchone()
    if not product:
        conn.close()
        return response_error("Product not found", 404)
    if product["quantity"] < qty:
        conn.close()
        return response_error("Not enough product quantity available")

    total_amount = qty * product["price"]
    order_id = str(uuid.uuid4())
    now = now_iso()

    cur.execute(
        "INSERT INTO orders (id, consumerId, productId, qty, totalAmount, deliveryLocation, status, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [order_id, data["consumerId"], data["productId"], qty, total_amount, data["deliveryLocation"], "confirmed", now, now],
    )
    cur.execute("UPDATE products SET quantity = quantity - ? WHERE id = ?", [qty, data["productId"]])
    conn.commit()
    conn.close()

    return response_ok({"orderId": order_id}, "Order created successfully")


@app.route("/api/track/<order_id>", methods=["GET"])
def track_order(order_id):
    conn = open_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM orders WHERE id = ?", [order_id])
    order = cur.fetchone()
    conn.close()
    if not order:
        return response_error("Order not found", 404)
    return response_ok(order)


@app.route("/api/chat", methods=["POST"])
def chat():
    data, missing = get_json_body(["message"])
    if missing:
        return response_error(f"Missing required fields: {', '.join(missing)}")

    message = data["message"].strip()
    if not message:
        return response_error("Message cannot be empty")

    reply = "I can help you with farming queries!"
    lower = message.lower()
    if "price" in lower or "fair" in lower:
        reply = "Our AI price engine suggests a fair rate using mandi data, season, and local demand."
    elif "register" in lower or "signup" in lower or "login" in lower:
        reply = "Farmers register with Aadhaar + PM-Kisan ID. Consumers register with phone and location."
    elif "order" in lower or "buy" in lower:
        reply = "You can place an order for fresh produce from our marketplace. I can help you find the right product."

    conn = open_db()
    cur = conn.cursor()
    cur.execute(
        "INSERT INTO chats (id, userId, role, message, reply, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
        [str(uuid.uuid4()), data.get("userId"), data.get("role"), message, reply, now_iso()],
    )
    conn.commit()
    conn.close()

    return response_ok({"reply": reply})


@app.route("/api/price", methods=["POST"])
def price_intelligence():
    data = request.get_json(silent=True) or {}
    product = (data.get("product") or "").lower()
    category = (data.get("category") or "").lower()
    quantity = float(data.get("quantity") or 1)

    base_price = 25
    if "rice" in product or category == "grains":
        base_price = 95
    elif "mango" in product or category == "fruits":
        base_price = 320
    elif category == "vegetables":
        base_price = 28
    elif category == "leafy greens":
        base_price = 22

    adjustment = 1 + min(quantity / 100, 0.15)
    recommended = round(base_price * adjustment, 2)
    low = round(recommended * 0.9, 2)
    high = round(recommended * 1.1, 2)

    return response_ok(
        {
            "suggestedPrice": recommended,
            "range": f"₹{low} - ₹{high}",
            "unit": data.get("unit", "kg"),
            "basis": "Local mandi rates, category, and quantity",
        }
    )


@app.route("/api/seed", methods=["POST"])
def api_seed():
    init_db()
    seed_data()
    return response_ok(None, "Database seeded successfully")


@app.route("/api/orders/<order_id>", methods=["PUT"])
def update_order_status(order_id):
    data, missing = get_json_body(["status"])
    if missing:
        return response_error(f"Missing required fields: {', '.join(missing)}")

    status = data["status"]
    valid_statuses = ["Placed", "Confirmed by Farmer", "Picked up by Agent", "Out for Delivery", "Delivered"]
    if status not in valid_statuses:
        return response_error("Invalid status")

    conn = open_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM orders WHERE id = ?", [order_id])
    order = cur.fetchone()
    if not order:
        conn.close()
        return response_error("Order not found", 404)

    cur.execute("UPDATE orders SET status = ?, updatedAt = ? WHERE id = ?", [status, now_iso(), order_id])
    conn.commit()
    conn.close()

    return response_ok({"orderId": order_id, "status": status}, "Order status updated")


@app.route("/api/orders/<order_id>/payment", methods=["POST"])
def process_payment(order_id):
    data, missing = get_json_body(["method", "amount"])
    if missing:
        return response_error(f"Missing required fields: {', '.join(missing)}")

    method = data["method"]
    amount = float(data["amount"])

    # In a real app, this would integrate with payment gateways
    # For demo, we just simulate payment processing
    import time
    time.sleep(1)  # Simulate processing delay

    # Generate a mock transaction ID
    txn_id = f"TXN{int(time.time() * 1000)}"

    conn = open_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM orders WHERE id = ?", [order_id])
    order = cur.fetchone()
    if not order:
        conn.close()
        return response_error("Order not found", 404)

    # Update order with payment info (in a real app, this would be in a payments table)
    cur.execute(
        "UPDATE orders SET status = 'Confirmed by Farmer' WHERE id = ?",
        [order_id]
    )
    conn.commit()
    conn.close()

    return response_ok({
        "orderId": order_id,
        "txnId": txn_id,
        "method": method,
        "amount": amount,
        "status": "Paid"
    }, "Payment processed successfully")


@app.route("/api/farmer/products", methods=["GET"])
def get_farmer_products():
    farmer_id = request.args.get("farmerId")
    if not farmer_id:
        return response_error("farmerId parameter required")

    conn = open_db()
    cur = conn.cursor()
    cur.execute("SELECT * FROM products WHERE farmerId = ?", [farmer_id])
    data = cur.fetchall()
    conn.close()
    return response_ok(data)


@app.route("/api/farmer/orders", methods=["GET"])
def get_farmer_orders():
    farmer_id = request.args.get("farmerId")
    if not farmer_id:
        return response_error("farmerId parameter required")

    conn = open_db()
    cur = conn.cursor()
    # Get orders for products belonging to this farmer
    cur.execute("""
        SELECT o.* FROM orders o
        JOIN products p ON o.productId = p.id
        WHERE p.farmerId = ?
        ORDER BY o.createdAt DESC
    """, [farmer_id])
    data = cur.fetchall()
    conn.close()
    return response_ok(data)


@app.route("/api/farmer/stats", methods=["GET"])
def get_farmer_stats():
    farmer_id = request.args.get("farmerId")
    if not farmer_id:
        return response_error("farmerId parameter required")

    conn = open_db()
    cur = conn.cursor()

    # Total products
    cur.execute("SELECT COUNT(*) as count FROM products WHERE farmerId = ?", [farmer_id])
    products_count = cur.fetchone()["count"]

    # Total orders
    cur.execute("""
        SELECT COUNT(*) as count FROM orders o
        JOIN products p ON o.productId = p.id
        WHERE p.farmerId = ?
    """, [farmer_id])
    orders_count = cur.fetchone()["count"]

    # Pending orders
    cur.execute("""
        SELECT COUNT(*) as count FROM orders o
        JOIN products p ON o.productId = p.id
        WHERE p.farmerId = ? AND o.status != 'Delivered'
    """, [farmer_id])
    pending_orders = cur.fetchone()["count"]

    # Total revenue
    cur.execute("""
        SELECT SUM(o.totalAmount) as revenue FROM orders o
        JOIN products p ON o.productId = p.id
        WHERE p.farmerId = ?
    """, [farmer_id])
    revenue = cur.fetchone()["revenue"] or 0

    conn.close()

    return response_ok({
        "productsCount": products_count,
        "ordersCount": orders_count,
        "pendingOrders": pending_orders,
        "totalRevenue": revenue
    })


@app.route("/api/analytics/price-trends", methods=["GET"])
def get_price_trends():
    # Mock price trend data - in a real app this would come from a data source
    import random
    import datetime

    commodity = request.args.get("commodity", "tomato")
    days = int(request.args.get("days", "30"))

    base_prices = {
        "tomato": 32,
        "onion": 28,
        "potato": 22,
        "carrot": 38,
        "spinach": 18,
        "mango": 320,
        "rice": 95
    }

    base_price = base_prices.get(commodity.lower(), 30)
    data = []

    for i in range(days):
        date = (datetime.datetime.now() - datetime.timedelta(days=days-i-1)).strftime("%Y-%m-%d")
        # Add some random variation
        price = base_price + random.randint(-5, 5)
        data.append({
            "date": date,
            "price": max(1, price),
            "volume": random.randint(1000, 5000)
        })

    return response_ok(data)


@app.route("/api/analytics/market-insights", methods=["GET"])
def get_market_insights():
    # Mock market insights
    insights = [
        {
            "commodity": "Tomato",
            "trend": "up",
            "change": "+12%",
            "reason": "Increased demand due to festival season",
            "recommendation": "Consider increasing prices by ₹2-3/kg"
        },
        {
            "commodity": "Onion",
            "trend": "down",
            "change": "-8%",
            "reason": "Good harvest in major producing states",
            "recommendation": "Monitor prices closely, potential for recovery"
        },
        {
            "commodity": "Spinach",
            "trend": "stable",
            "change": "+2%",
            "reason": "Balanced supply and demand",
            "recommendation": "Maintain current pricing strategy"
        }
    ]

    return response_ok(insights)


@app.route("/api/chat/history", methods=["GET"])
def get_chat_history():
    user_id = request.args.get("userId")
    limit = int(request.args.get("limit", "50"))

    conn = open_db()
    cur = conn.cursor()
    query = "SELECT * FROM chats"
    params = []
    if user_id:
        query += " WHERE userId = ?"
        params.append(user_id)
    query += " ORDER BY createdAt DESC LIMIT ?"
    params.append(limit)

    cur.execute(query, params)
    data = cur.fetchall()
    conn.close()

    # Reverse to get chronological order
    return response_ok(list(reversed(data)))


@app.route("/api/notifications", methods=["GET"])
def get_notifications():
    user_id = request.args.get("userId")
    if not user_id:
        return response_error("userId parameter required")

    # Mock notifications - in a real app this would be stored in DB
    notifications = [
        {
            "id": "1",
            "type": "order",
            "title": "New Order Received",
            "message": "You have a new order for 50kg of tomatoes",
            "timestamp": now_iso(),
            "read": False
        },
        {
            "id": "2",
            "type": "price",
            "title": "Price Alert",
            "message": "Tomato prices have increased by 15% in your area",
            "timestamp": now_iso(),
            "read": False
        }
    ]

    return response_ok(notifications)


@app.route("/api/farmer/boost", methods=["POST"])
def boost_farmer():
    data, missing = get_json_body(["farmerId", "plan", "price"])
    if missing:
        return response_error(f"Missing required fields: {', '.join(missing)}")

    farmer_id = data["farmerId"]
    plan = data["plan"]
    price = float(data["price"])

    # In a real app, this would integrate with payment gateway
    # For demo, we just return success

    return response_ok({
        "farmerId": farmer_id,
        "plan": plan,
        "price": price,
        "activatedAt": now_iso()
    }, "Farmer boost activated successfully")


@app.route("/api/search", methods=["GET"])
def search():
    query = request.args.get("q", "").strip()
    category = request.args.get("category")
    location = request.args.get("location")

    if not query:
        return response_ok([])

    conn = open_db()
    cur = conn.cursor()

    # Search products
    search_query = """
        SELECT * FROM products
        WHERE (name LIKE ? OR description LIKE ?)
    """
    params = [f"%{query}%", f"%{query}%"]

    if category:
        search_query += " AND category = ?"
        params.append(category)

    if location:
        search_query += " AND (village LIKE ? OR district LIKE ? OR state LIKE ?)"
        params.extend([f"%{location}%", f"%{location}%", f"%{location}%"])

    cur.execute(search_query, params)
    products = cur.fetchall()

    conn.close()

    return response_ok(products)


@app.route("/api/generate-image", methods=["POST"])
def generate_image():
    import base64
    from PIL import Image, ImageDraw, ImageFont
    from io import BytesIO
    
    data, missing = get_json_body(["productName", "category"])
    if missing:
        return response_error(f"Missing required fields: {', '.join(missing)}")
    
    product_name = data.get("productName", "Product").strip()
    category = data.get("category", "Vegetables").strip()
    
    # Define category colors
    category_colors = {
        "Vegetables": (34, 139, 34, 255),  # Forest Green
        "Leafy Greens": (50, 205, 50, 255),  # Lime Green
        "Fruits": (255, 69, 0, 255),  # Orange Red
        "Grains": (184, 134, 11, 255),  # Dark Goldenrod
        "Pulses": (139, 69, 19, 255),  # Saddle Brown
        "Spices": (205, 92, 92, 255),  # Indian Red
    }
    
    # Get color for category
    bg_color = category_colors.get(category, (34, 139, 34, 255))
    
    # Create image
    width, height = 500, 500
    image = Image.new("RGB", (width, height), bg_color[:3])
    draw = ImageDraw.Draw(image)
    
    # Add a subtle pattern/texture effect
    for i in range(0, width, 50):
        for j in range(0, height, 50):
            opacity = 50 if (i + j) % 100 == 0 else 20
            alpha = opacity
            overlay = Image.new("RGB", (50, 50), (255, 255, 255))
            draw.rectangle([i, j, i + 50, j + 50], outline=(255, 255, 255), width=2)
    
    # Add product emoji/icon based on category
    emojis = {
        "Vegetables": "🥕",
        "Leafy Greens": "🥬",
        "Fruits": "🥭",
        "Grains": "🌾",
        "Pulses": "🫘",
        "Spices": "🌶️",
    }
    
    emoji = emojis.get(category, "🌾")
    
    # Try to add text - use default font if system font not available
    try:
        # Try to use a nice font if available
        title_font = ImageFont.truetype("arial.ttf", 60)
        text_font = ImageFont.truetype("arial.ttf", 40)
    except:
        # Fall back to default font
        title_font = ImageFont.load_default()
        text_font = ImageFont.load_default()
    
    # Draw emoji in the middle
    emoji_position = (width // 2 - 60, height // 2 - 100)
    draw.text(emoji_position, emoji, fill=(255, 255, 255), font=title_font)
    
    # Draw product name
    # Wrap text if needed
    words = product_name.split()
    lines = []
    current_line = ""
    
    for word in words:
        test_line = current_line + " " + word if current_line else word
        bbox = draw.textbbox((0, 0), test_line, font=text_font)
        text_width = bbox[2] - bbox[0]
        
        if text_width > width - 40:
            if current_line:
                lines.append(current_line)
            current_line = word
        else:
            current_line = test_line
    
    if current_line:
        lines.append(current_line)
    
    # Draw wrapped text centered
    total_text_height = len(lines) * 60
    start_y = height // 2 + 50
    
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=text_font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        y = start_y + (i * 60)
        draw.text((x, y), line, fill=(255, 255, 255), font=text_font)
    
    # Convert to base64
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_base64 = base64.b64encode(buffered.getvalue()).decode()
    
    return response_ok({
        "imageBase64": f"data:image/png;base64,{img_base64}",
        "productName": product_name,
        "category": category
    }, "Image generated successfully")


@app.errorhandler(404)
def not_found(error):
    return response_error("Endpoint not found", 404)


@app.errorhandler(500)
def internal_error(error):
    return response_error("Internal server error", 500)


if __name__ == "__main__":
    app.run(debug=True, port=5000)