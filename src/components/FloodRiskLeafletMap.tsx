import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Props {
  tileUrl: string;
  center: { lat: number; lon: number };
}

export default function FloodRiskLeafletMap({ tileUrl, center }: Props) {
  return (
    <div className="mt-6 h-[500px] w-full border">
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url={tileUrl}
          attribution="Map data from Google Earth Engine"
        />
      </MapContainer>
    </div>
  );
}
