import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import '../styles/leaflet-custom.css';

interface Props {
  tileUrl: string;
  center: { lat: number; lon: number };
}

export default function FloodRiskLeafletMap({ tileUrl, center }: Props) {
  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={[center.lat, center.lon]}
        zoom={10}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer url={tileUrl} attribution="Map data from Google Earth Engine" />
      </MapContainer>
    </div>
  );
}

