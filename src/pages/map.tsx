import React, { useState, useEffect } from "react";
import { fetchFloodRiskMap } from "../lib/gee-api";
import FloodRiskLeafletMap from "../components/FloodRiskLeafletMap";

export default function FloodRiskMap() {
  const [position, setPosition] = useState({ x: 280, y: 80 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [coords, setCoords] = useState({ lat: -13.9626, lon: 33.7741 });
  const [mapUrl, setMapUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    } else {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  const handleFetchMap = async () => {
    try {
      setLoading(true);
      const url = await fetchFloodRiskMap(coords.lat, coords.lon);
      setMapUrl(url);
    } catch (err) {
      // **THE FIX: Check if 'err' is an instance of Error before accessing .message**
      if (err instanceof Error) {
        alert('Error fetching map: ' + err.message);
      } else {
        alert('An unknown error occurred while fetching the map.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen pt-[60px]">
      <div
        className="absolute bg-white shadow-lg p-4 rounded-md w-[300px] z-20 cursor-move"
        style={{
          left: position.x,
          top: position.y,
        }}
        onMouseDown={handleMouseDown}
      >
        <label className="block text-sm font-medium">Latitude</label>
        <input
          type="number"
          value={coords.lat}
          onChange={(e) => setCoords({ ...coords, lat: parseFloat(e.target.value) })}
          className="border p-2 w-full rounded"
        />

        <label className="block mt-2 text-sm font-medium">Longitude</label>
        <input
          type="number"
          value={coords.lon}
          onChange={(e) => setCoords({ ...coords, lon: parseFloat(e.target.value) })}
          className="border p-2 w-full rounded"
        />

        <button
          onClick={handleFetchMap}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'Loading...' : 'Get Flood Map'}
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {mapUrl && <FloodRiskLeafletMap tileUrl={mapUrl} center={coords} />}
      </div>
    </div>
  );
}
