import os
import tornado.ioloop
import tornado.web
import pymysql
import json
from decimal import Decimal

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return str(obj)
        return super(DecimalEncoder, self).default(obj)

class BaseHandler(tornado.web.RequestHandler):
    def initialize(self, db):
        self.db = db

    def set_default_headers(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.set_header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS")
        self.set_header("Access-Control-Allow-Headers", "Content-Type, Authorization")

    def options(self):
        self.set_status(204)
        self.finish()

class GetProductsHandler(BaseHandler):
    def get(self):
        try:
            with self.db.cursor() as cursor:
                sql = "SELECT id, name, description, price, image FROM products"
                cursor.execute(sql)
                products = cursor.fetchall()
                print("Fetched products:", products)  # Debugging line
                self.write(json.dumps({"products": products}, cls=DecimalEncoder))
        except Exception as e:
            print("Error:", str(e))  # Debugging line
            self.write({"error": str(e)})

class AddProductsHandler(BaseHandler):
    def post(self):
        try:
            product_id = self.get_body_argument("id")
            name = self.get_body_argument("name")
            description = self.get_body_argument("description")
            price = self.get_body_argument("price")
            image_file = self.request.files.get("image", None)

            image_filename = None
            if image_file:
                image_file = image_file[0]
                image_filename = image_file['filename']
                assets_dir = os.path.join(os.path.dirname(__file__), 'src/assets')
                if not os.path.exists(assets_dir):
                    os.makedirs(assets_dir)
                with open(os.path.join(assets_dir, image_filename), 'wb') as f:
                    f.write(image_file['body'])

            with self.db.cursor() as cursor:
                # Check if product ID already exists
                cursor.execute("SELECT id FROM products WHERE id = %s", (product_id,))
                existing_product = cursor.fetchone()
                if existing_product:
                    self.set_status(400)
                    self.write(json.dumps({'error': 'Product already exists'}))
                    return

                sql = "INSERT INTO products (id, name, description, price, image) VALUES (%s, %s, %s, %s, %s)"
                cursor.execute(sql, (product_id, name, description, price, image_filename))
                self.db.commit()

            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps({'message': 'Product added successfully'}))
        except Exception as e:
            print("Error:", str(e))
            self.set_status(500)
            self.write(json.dumps({"error": str(e)}))
        
class DeleteProductsHandler(BaseHandler):
    def delete(self):
        try:
            data = json.loads(self.request.body)
            product_id = data.get("id")

            with self.db.cursor() as cursor:
                # Check if the product exists
                sql_check = "SELECT id FROM products WHERE id = %s"
                cursor.execute(sql_check, (product_id,))
                result = cursor.fetchone()
                if not result:
                    self.set_status(404)
                    self.write(json.dumps({'error': 'Product does not exist'}))
                    return

                # Delete the product
                sql = "DELETE FROM products WHERE id = %s"
                cursor.execute(sql, (product_id,))
                self.db.commit()

            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps({'message': 'Product deleted successfully'}))
        except Exception as e:
            print("Error:", str(e))  # Debugging line
            self.set_header('Content-Type', 'application/json')
            self.write(json.dumps({"error": str(e)}))


def make_app():
    # Database connection setup
    db = pymysql.connect(
        host='localhost',
        user='root',
        password='',
        db='ecommerce',
        charset='utf8mb4',
        cursorclass=pymysql.cursors.DictCursor
    )

    return tornado.web.Application([
        (r"/products", GetProductsHandler, dict(db=db)),
        (r"/products/add", AddProductsHandler, dict(db=db)),
        (r"/products/delete", DeleteProductsHandler, dict(db=db)),  

    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(8888)
    print("Server running on http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()
