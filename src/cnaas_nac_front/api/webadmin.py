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
    delete = SubmitField('Delete user(s)')
    enable = SubmitField('Enable user(s)')
    disable = SubmitField('Disable user(s)')
    set_vlan_btn = SubmitField('Set VLAN')
    set_vlan = StringField()
    set_comment_btn = SubmitField('Set comment')
    set_comment = StringField()
    bounce_btn = SubmitField('Bounce port(s)')


def get_users(api_url, username=''):
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

        res = requests.post(api_url, json=user,
                            verify=False)
        json = res.json()
    except Exception:
        return {}

    if 'data' in json:
        return json['data']
    return {}


def delete_user(api_url, username):
    try:
        res = requests.delete('{}/{}'.format(api_url, username),
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
        res = requests.put('{}/{}'.format(api_url, username), json=user,
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
        res = requests.put('{}/{}'.format(api_url, username), json=user,
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
        res = requests.put('{}/{}'.format(api_url, username), json=user,
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
        res = requests.put('{}/{}'.format(api_url, username), json=user,
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


def get_nms_url():
    try:
        url = os.environ['NMS_API_URL']
    except Exception:
        return None
    return url


def bounce_port(api_url, nms_url, token, username):
    user_data = get_users(api_url, token, username=username)

    if username not in user_data:
        return 'Invalid response from auth API'
    if 'nas_ip_address' not in user_data[username]:
        return 'Could not find switch IP address'
    if 'nas_port_id' not in user_data[username]:
        return 'Could not find switch port'

    nas_ip_address = user_data[username]['nas_ip_address']
    nas_port_id = user_data[username]['nas_port_id']

    try:
        url = nms_url
        url += 'devices?filter[management.ip]={}'.format(nas_ip_address)
        res = requests.get(url, headers={'Authorization': 'Bearer ' + token},
                           verify=False)
        json = res.json()

        if json['data']['devices'] == []:
            return 'Could not find switch management IP'
        if 'hostname' not in json['data']['devices'][0]:
            return 'Could not find switch hostname'

    except Exception as e:
        return 'Could not get management IP: ' + str(e)

    hostname = json['data']['devices'][0]['hostname']

    try:
        url = nms_url + 'device/{}/interface_status'.format(hostname)
        res = requests.put(url, headers={'Authorization': 'Bearer ' + token},
                           verify=False,
                           json={'bounce_interfaces': [nas_port_id]})
        json = res.json()

        if json['status'] == 'error':
            message = json['message']
        else:
            message = json['data']

        if res.status_code != 200:
            return 'Failed to bounce port: ' + message

    except Exception as e:
        return 'Failed to bounce port: ' + str(e)

    return 'Port bounced: ' + message


def get_jwt_token():
    try:
        token = os.environ['JWT_AUTH_TOKEN']
    except Exception:
        return None
    return token


class WebAdmin(Resource):
    @classmethod
    def index(cls):
        api_url = get_api_url()
        nms_url = get_nms_url()
        token = get_jwt_token()
        users = get_users(api_url)
        form = UserForm()

        if api_url is None:
            flash('Authentication API URL not configured')
        if nms_url is None:
            flash('NMS API URL not configured')
        if token is None:
            flash('NMS API token not configured')

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
                        message = bounce_port(api_url, nms_url, token, user)
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
