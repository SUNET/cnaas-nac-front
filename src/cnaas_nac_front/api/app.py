from flask import Flask
from cnaas_nac.api.webadmin import WebAdmin


app = Flask(__name__)


@app.route('/admin', methods=['GET', 'POST'])
def index():
    return WebAdmin.index()
