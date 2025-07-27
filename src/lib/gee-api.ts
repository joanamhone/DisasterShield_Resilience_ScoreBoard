export const fetchFloodRiskMap = async (latitude: number, longitude: number) => {
  const response = await fetch('http://localhost:5000/get_flood_risk_map', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ latitude, longitude }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch flood risk map');
  }

  const data = await response.json();
  return data.map_url as string;
};
