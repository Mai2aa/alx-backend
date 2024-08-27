#!/usr/bin/env python3
'''Basic Flask App'''
from flask import Flask, render_template

app = Flask(__name__, template_folder='templates')


@app.route("/", methods=['GET'], strict_slashes=False)
def hello() -> str:
    '''render template'''
    return render_template('0-index.html')


if __name__ == '__main__':
    app.run()