import { API_KEY } from "../Utils/API_KEY.js";
const sendLocation = async (state, district) => {
  const locationName = district.trim() ? `${district}, ${state}, India` : `${state}, India`;
  const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
    locationName
  )}&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const result = await response.json();

    if (result.features && result.features.length > 0) {
      const { lat, lon } = result.features[0].properties;
      return [lat, lon];
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export default sendLocation;
