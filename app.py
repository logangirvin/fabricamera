from flask import Flask, Response
import qrcode
import subprocess
import io
app = Flask(__name__)


@app.route("/")
def root():
    return "Hello, World!"

@app.route("/request")
def request():
    request=subprocess.run('node dist/createrequest.js', capture_output=True, cwd='./sdk')
    if request.returncode == 0:
        print('successful request generated')
        f = io.BytesIO()
        qrlib = qrcode.QRCode(
            version=40,
            error_correction=qrcode.ERROR_CORRECT_L
        )
        qrlib.add_data(request.stdout)
        try:
            qrlib.make()
        except qrcode.exceptions.DataOverflowError as err:
            return Response('qr too big!', status=500)
        print('qr created')
        qrlib.make_image().save(f)
        return Response(f.getvalue(), mimetype='image/png')
    else:
        print('unsuccessful request generation')
        print(request.stderr)
        return Response('could not form request', status=500)