from flask import Flask, request, jsonify
from flask_cors import CORS
import ee
import json

ee.Authenticate()
ee.Initialize(project='disastershield-466814')

# credentials = ee.ServiceAccountCredentials('resiliencescore@disastershield-466814.iam.gserviceaccount.com', 'disastershield-466814-700e259bbf56.json')
# ee.Initialize(credentials)

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

#     image = ee.ImageCollection('JRC/GSW1_3/MonthlyHistory') \
#                 .filterDate('2023-01-01', '2023-12-31') \
#                 .select('water') \
#                 .mean() \
                    
if __name__ == '__main__':
    app.run(debug=True)
