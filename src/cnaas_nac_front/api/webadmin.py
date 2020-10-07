#
# Fugly UI, should at some point be replaced with a proper UI written
# in React and some other facy JS techniques.
#
#

import os
import requests

from flask import flash
from flask import request
from flask import redirect
from flask import render_template
from flask_restful import Resource

from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, BooleanField, SubmitField
from wtforms.validators import DataRequired


class UserForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    vlan = StringField('VLAN',  validators=[DataRequired()])
    selected = BooleanField('selectfield', default=False)
    submit = SubmitField('Add user')
    delete = SubmitField('Delete')
    enable = SubmitField('Enable')
    disable = SubmitField('Disable')
    set_vlan_btn = SubmitField('Set VLAN')
    set_vlan = StringField()
    set_comment_btn = SubmitField('Set comment')
    set_comment = StringField()
    bounce_btn = SubmitField('Bounce port(s)')
    replication_btn = SubmitField('Replication')


def get_users(api_url, username=''):
    api_url += '/auth'

    if username != '':
        api_url += '/{}'.format(username)
    try:
        res = requests.get(api_url,
                           verify=False)
        json = res.json()
    except Exception as e:
        print(str(e))
        return {}

    if 'data' in json:
        return json['data']
    return {}


def add_user(api_url, username, password, vlan):
    try:
        user = {
            'username': username,
            'password': password,
            'vlan': vlan
        }

        res = requests.post(api_url + '/auth', json=user,
                            verify=False)
        json = res.json()
    except Exception:
        return {}

    if 'data' in json:
        return json['data']
    return {}


def delete_user(api_url, username):
    try:
        res = requests.delete('{}/auth/{}'.format(api_url, username),
                              verify=False)
        json = res.json()
    except Exception:
        return {}

    if 'data' in json:
        return json['data']
    return {}


def enable_user(api_url, username):
    try:
        user = {'enabled': True}
        res = requests.put('{}/auth/{}'.format(api_url, username), json=user,
                           verify=False)
        json = res.json()
    except Exception:
        return {}

    if 'data' in json:
        return json['data']
    return {}


def disable_user(api_url, username):
    try:
        user = {'enabled': False}
        res = requests.put('{}/auth/{}'.format(api_url, username), json=user,
                           verify=False)
        json = res.json()
    except Exception:
        return {}

    if 'data' in json:
        return json['data']
    return {}


def vlan_user(api_url, username, vlan):
    try:
        user = {'vlan': vlan}
        res = requests.put('{}/auth/{}'.format(api_url, username), json=user,
                           verify=False)
        json = res.json()
    except Exception:
        return {}

    if 'data' in json:
        return json['data']
    return {}


def comment_user(api_url, username, comment):
    print(comment)
    try:
        user = {'comment': comment}
        res = requests.put('{}/auth/{}'.format(api_url, username), json=user,
                           verify=False)
        json = res.json()
    except Exception:
        return {}

    if 'data' in json:
        return json['data']
    return {}


def get_api_url():
    try:
        url = os.environ['AUTH_API_URL']
    except Exception:
        return None
    return url


def get_coa_secret():
    try:
        secret = os.environ['AUTH_COA_SECRET']
    except Exception:
        return None
    return secret


def bounce_port(api_url, username):
    nas_port_id = None
    nas_ip_address = None
    secret = get_coa_secret()

    if secret is None:
        return 'Could not find CoA secret'

    res = requests.get(api_url + '/auth/' + username,
                       verify=False)

    json_data = res.json()

    if 'data' not in json_data:
        return 'Bounce: Could not find user'

    if len(json_data['data']) > 1:
        return 'Bounce: Returned more than one user, this is impossible!'

    for user in json_data['data']:
        if 'nas_ip_address' in user and user['nas_ip_address']:
            nas_ip_address = user['nas_ip_address']
        if 'nas_port_id' in user and user['nas_port_id']:
            nas_port_id = user['nas_port_id']

    coa_json = {
        'nas_ip_address': nas_ip_address,
        'nas_port_id': nas_port_id,
        'secret': secret
    }

    res = requests.post(api_url + '/coa', json=coa_json,
                        verify=False)

    json_data = res.json()

    if 'data' in json_data:
        data = json_data['data']
    elif 'error' in json_data:
        data = json_data['error']
    else:
        data = 'Unknown port bounce result'

    return data


class WebAdmin(Resource):
    @classmethod
    def index(cls):
        api_url = get_api_url()
        users = get_users(api_url)
        form = UserForm()

        if api_url is None:
            flash('Authentication API URL not configured')

        if request.method == 'POST':
            result = request.form

            if 'submit' in result:
                username = result['username']
                password = result['password']
                vlan = result['vlan']

                add_user(api_url, username, password, vlan)
            elif 'delete' in result:
                selected = request.form.getlist('selected')
                for user in selected:
                    delete_user(api_url, user)
            elif 'enable' in result:
                selected = request.form.getlist('selected')
                for user in selected:
                    enable_user(api_url, user)
            elif 'disable' in result:
                selected = request.form.getlist('selected')
                for user in selected:
                    disable_user(api_url, user)
            elif 'bounce_btn' in result:
                selected = request.form.getlist('selected')

                if len(selected) > 1:
                    flash('You can only bounce one port.')
                elif len(selected) == 0:
                    flash('Please select a port to bounce.')
                else:
                    for user in selected:
                        message = bounce_port(api_url, user)
                        flash('Port bounce: ' + message)
            elif 'set_vlan_btn' in result:
                set_vlan = result['set_vlan']
                if set_vlan != "" and set_vlan:
                    selected = request.form.getlist('selected')
                    for user in selected:
                        vlan_user(api_url, user, set_vlan)
            elif 'set_comment_btn' in result:
                set_comment = result['set_comment']
                selected = request.form.getlist('selected')
                for user in selected:
                    comment_user(api_url, user, set_comment)

            return redirect('/admin')

        return render_template('index.html', users=users,
                               form=form)
