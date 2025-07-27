import { useState, useEffect } from "react";
import { fetchFloodRiskMap } from "../lib/gee-api";
import FloodRiskLeafletMap from "../components/FloodRiskLeafletMap"; // ✅ Normal import


// export default function FloodRiskMap() {
//   const [coords, setCoords] = useState({ lat: -13.9626, lon: 33.7741 });
//   const [mapUrl, setMapUrl] = useState('');
//   const [loading, setLoading] = useState(false);

//   const handleFetchMap = async () => {
//     try {
//       setLoading(true);
//       const url = await fetchFloodRiskMap(coords.lat, coords.lon);
//       setMapUrl(url);
//     } catch (err) {
//       alert('Error fetching map: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 max-w-xl mx-auto">
//       {/* <h1 className="text-2xl font-bold mb-4">Flood Risk Map Viewer</h1> */}
//       <div className="mb-4">
//         <label className="block">Latitude</label>
//         <input
//           type="number"
//           value={coords.lat}
//           onChange={(e) => setCoords({ ...coords, lat: parseFloat(e.target.value) })}
//           className="border p-2 w-full"
//         />
//         <label className="block mt-2">Longitude</label>
//         <input
//           type="number"
//           value={coords.lon}
//           onChange={(e) => setCoords({ ...coords, lon: parseFloat(e.target.value) })}
//           className="border p-2 w-full"
//         />
//         <button
//           onClick={handleFetchMap}
//           className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
//         >
//           {loading ? 'Loading...' : 'Get Flood Map'}
//         </button>
//       </div>
//   {mapUrl && (
//   <div className="bg-white shadow-md p-4 rounded border">
//   <h2 className="text-lg font-semibold mt-4">Flood Risk Map</h2>
//   <FloodRiskLeafletMap tileUrl={mapUrl} center={coords} />
// </div>

// )}

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
      alert('Error fetching map: ' + err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col h-screen pt-[60px]"> {/* pushes below header */}
      {/* <div className="p-4 bg-white shadow z-10 w-full max-w-md absolute top-[60px] left-4 rounded border">
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
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          {loading ? 'Loading...' : 'Get Flood Map'}
        </button>
      </div> */}
{/* <div
  className="absolute top-[80px] left-[280px] bg-white shadow-lg p-4 rounded-md w-[300px] z-20 max-w-[90%] sm:left-4"
> */}
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

   


// Once the map is displayed, allow certain roles (disaster_coordinator, etc.) to create alerts.

// Add a simple form below the map or a button like:

// {mapUrl && (
//   <button
//     onClick={() => createSupabaseAlert(coords.lat, coords.lon)}
//     className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
//   >
//     Create Flood Alert Here
//   </button>
// )}

// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_KEY!);

// export const createSupabaseAlert = async (lat: number, lon: number) => {
//   const user = (await supabase.auth.getUser()).data.user;

//   if (!user) throw new Error('You must be logged in');

//   const { error } = await supabase.from('emergency_alerts').insert({
//     title: 'Flood Risk Detected',
//     message: 'Flood risk has been detected at this location. Please take precautions.',
//     severity: 'high',
//     type: 'flood',
//     target_audience: 'all',
//     location: `${lat}, ${lon}`,
//     created_by: user.id,
//     expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // expires in 3 days
//   });

//   if (error) throw error;
// };




// ✅ BONUS: Role-based UI Control
// You can restrict who sees the "Create Alert" button like this:

// tsx
// Copy code
// const userType = session?.user?.user_metadata?.user_type;
// {mapUrl && userType === 'disaster_coordinator' && (
//   <button onClick={...}>Create Alert</button>
// )}