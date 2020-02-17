import os

from flask import Flask
from cnaas_nac_front.api.webadmin import WebAdmin


app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(128)


@app.route('/admin', methods=['GET', 'POST'])
def index():
    return WebAdmin.index()
