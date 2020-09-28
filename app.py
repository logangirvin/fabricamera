from flask import Flask, Response
import qrcode
from qrcode.image.svg import SvgPathImage
import subprocess
import io
import os
app = Flask(__name__)

@app.route("/")
def root():
    return "Hello, World!"

@app.route('/request')
def request():
    request=subprocess.run('node dist/createrequest.js', capture_output=True, cwd='./sdk')
    if request.returncode == 0:
        print('successful request generated')
        return Response(request.stdout, status=200)
    else:
        print('unsuccessful request generation')
        print(request.stderr)
        return Response(status=500)

@app.route("/qr")
def qr():
    host = 'localhost'
    if host in os.environ:
        host = os.environ['host']
    url = 'openid://vc/?request_uri={0}/request'.format(host)
    f = io.BytesIO()
    factory = SvgPathImage
    qrcode.make(url, image_factory=factory).save(f)
    return Response(f.getvalue(), mimetype='image/svg+xml')