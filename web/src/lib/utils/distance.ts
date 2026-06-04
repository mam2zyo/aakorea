const EARTH_RADIUS_KM = 6371.01;

export function calculateDistanceKm(
  lat1: number | undefined | null,
  lon1: number | undefined | null,
  lat2: number | undefined | null,
  lon2: number | undefined | null
): number | null {
  if (
    lat1 == null ||
    lon1 == null ||
    lat2 == null ||
    lon2 == null ||
    !Number.isFinite(lat1) ||
    !Number.isFinite(lon1) ||
    !Number.isFinite(lat2) ||
    !Number.isFinite(lon2)
  ) {
    return null;
  }

  const toRad = (value: number) => (value * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_KM * c;
}

export function roundDistanceKm(distanceKm: number | null): number | null {
  if (distanceKm == null || !Number.isFinite(distanceKm)) {
    return null;
  }
  return Math.round(distanceKm * 10) / 10;
}
