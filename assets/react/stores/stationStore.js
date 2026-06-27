import { create } from 'zustand';
import { getRequestHeaders } from '../services/data';

const useStationStore = create((set) => ({
  transportTypes: [],
  lines: [],
  stations: [],
  scheldules: null,
  setLines: (lines) => {
    set(() => ({
      lines: lines,
    }));
  },
  setStations: (stations) => {
    set(() => ({
      stations: stations,
    }));
  },
  resetScheldules: () => {
    set(() => ({
      scheldules: null,
    }));
  },
  getTransportTypes: async () => {
    try {
      const response = await fetch(`/api/transport_types`, {
        method: 'GET',
        headers: getRequestHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        set(() => ({
          transportTypes: json['member'],
        }));
      }
    } catch {}
  },
  getLinesByTransportTypeId: async (transportTypeId) => {
    try {
      const response = await fetch(`/api/lines?transportType=${transportTypeId}`, {
        method: 'GET',
        headers: getRequestHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        set(() => ({
          lines: json['member'],
        }));
      }
    } catch {}
  },
  getStationsByLineId: async (lineId) => {
    try {
      const response = await fetch(`/api/stations?line=${lineId}`, {
        method: 'GET',
        headers: getRequestHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        set(() => ({
          stations: json['member'],
        }));
      }
    } catch {}
  },
  getStationScheldule: async (stationId) => {
    try {
      const response = await fetch(`/api/station/${stationId}/scheldule`, {
        method: 'GET',
        headers: getRequestHeaders(),
      });
      if (response.ok) {
        const json = await response.json();
        if (json.data) {
          set(() => ({
            scheldules: json.data,
          }));
        }
      }
    } catch {}
  },
}));
export default useStationStore;
