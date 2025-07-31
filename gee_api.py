from flask import Flask, request, jsonify
from flask_cors import CORS
import ee
import json
import base64
import os

# Decode Base64 string and write it to a file
service_account_base64 = os.environ.get('GOOGLE_SERVICE_ACCOUNT_KEY')

if service_account_base64:
    with open('service_account.json', 'wb') as f:
        f.write(base64.b64decode(service_account_base64))
else:
    print("GOOGLE_SERVICE_ACCOUNT_KEY exists:", service_account_base64 is not None)
    raise Exception("Service account key not found in environment variables")
credentials = ee.ServiceAccountCredentials(
    'disasteresilience@disastershield-v2.iam.gserviceaccount.com',
    'service_account.json'
)

ee.Initialize(credentials)

app = Flask(__name__)
CORS(app) 

@app.route('/get_flood_risk_map', methods=['POST'])
def get_flood_risk_map():
    data = request.get_json()
    lat = data['latitude']
    lon = data['longitude']

    point = ee.Geometry.Point([lon, lat])

    image = ee.Image('JRC/GSW1_4/GlobalSurfaceWater').select('occurrence')

    vis_params = {
        "min": 0,
        "max": 100,
        "palette": ['white', 'lightblue', 'blue', 'darkblue']
    }

    map_url = image.getMapId(vis_params)['tile_fetcher'].url_format

    return jsonify({'map_url': map_url})


if __name__ == '__main__':
   app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)

