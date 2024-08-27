#!/usr/bin/env python3
'''Basic Flask App'''
from flask_babel import Babel
from flask import Flask, render_template

app = Flask(__name__, template_folder='templates')
babel = Babel(app)


class Config(object):
    '''class of babel configuration'''
    languages = ['en', 'fr']
    default_lang = 'en'
    default_time = 'UTC'


app.config.from_object(Config)


@app.route("/", methods=['GET'], strict_slashes=False)
def hello() -> str:
    '''render template'''
    return render_template('1-index.html')


if __name__ == '__main__':
    app.run()
