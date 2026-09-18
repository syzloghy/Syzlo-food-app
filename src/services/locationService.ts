import { RESTAURANT_LOCATION } from '../data/mockData';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface GeocodeResult {
  address: string;
  area: string;
  pinCode: string;
  coordinates: Coordinates;
}

class LocationService {
  /**
   * Request device GPS coordinates using standard HTML5 Geolocation API
   */
  public async getCurrentPosition(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          // If denied or fails, fallback to realistic default near SYZLO Hub
          console.warn('Geolocation failed or denied, using simulated nearby coordinate:', error.message);
          resolve({
            lat: RESTAURANT_LOCATION.lat + 0.008,
            lng: RESTAURANT_LOCATION.lng - 0.003,
          });
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    });
  }

  /**
   * Calculate distance between two coordinates in Kilometers (Haversine formula)
   */
  public calculateDistance(from: Coordinates, to: Coordinates): number {
    const R = 6371; // Earth radius in km
    const dLat = this.deg2rad(to.lat - from.lat);
    const dLng = this.deg2rad(to.lng - from.lng);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(from.lat)) *
        Math.cos(this.deg2rad(to.lat)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.round(d * 10) / 10; // 1 decimal point
  }

  /**
   * Calculate dynamic delivery fee based on distance
   */
  public calculateDeliveryFee(distanceKm: number): number {
    if (distanceKm <= 2) return 30;
    if (distanceKm <= 5) return 45;
    if (distanceKm <= 10) return 60;
    return 80;
  }

  /**
   * Calculate estimated delivery arrival time in minutes
   */
  public calculateETA(distanceKm: number): number {
    // 15 mins base kitchen prep + 4 mins per km travel
    return Math.round(15 + distanceKm * 3.5);
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}

export const locationService = new LocationService();
