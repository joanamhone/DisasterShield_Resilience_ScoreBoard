from flask import Flask, request, jsonify
import ee
ee.Authenticate()
# Authenticate and initialize Earth Engine
ee.Initialize(project='disastershield-466814')

app = Flask(__name__)

@app.route('/get_flood_risk_map', methods=['POST'])
def get_flood_risk_map():
    data = request.get_json()
    lat = data['latitude']
    lon = data['longitude']

    point = ee.Geometry.Point([lon, lat])
    image = ee.ImageCollection('MODIS/006/MOD13A2').select('NDVI').mean()
    vis_params = {"min": 0.0, "max": 9000.0, "palette": ['blue', 'white', 'green']}
    map_url = image.getMapId(vis_params)['tile_fetcher'].url_format

    return jsonify({'map_url': map_url})
