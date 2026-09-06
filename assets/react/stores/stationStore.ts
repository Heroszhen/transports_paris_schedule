import { create } from 'zustand';
import { getRequestHeaders } from '../services/data';
import { ApiPlatformContext, ILine, IScheldule, IStation, ITransportType } from '../models/interfaces';

interface StationState {
  transportTypes: ITransportType[];
  lines: ILine[];
  stations: IStation[];
  scheldules: IScheldule | null;
  setLines(lines: ILine[]): void;
  setStations(stations: IStation[]): void;
  resetScheldules(): void;
  getTransportTypes(): Promise<void>;
  getLinesByTransportTypeId(transportTypeId: number): Promise<void>;
  getStationsByLineId(lineId: number): Promise<void>;
  getStationScheldule(stationId: number): Promise<void>;
}

const useStationStore = create<StationState>((set) => ({
  transportTypes: [],
  lines: [],
  stations: [],
  scheldules: null,
  setLines: (lines: ILine[]) => {
    set(() => ({
      lines: lines,
    }));
  },
  setStations: (stations: IStation[]) => {
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
        const json: ApiPlatformContext<ITransportType> = await response.json();
        set(() => ({
          transportTypes: json.member ?? [],
        }));
      }
    } catch {}
  },
  getLinesByTransportTypeId: async (transportTypeId: number) => {
    try {
      const response = await fetch(`/api/lines?transportType=${transportTypeId}`, {
        method: 'GET',
        headers: getRequestHeaders(),
      });
      if (response.ok) {
        const json: ApiPlatformContext<ILine> = await response.json();
        set(() => ({
          lines: json.member ?? [],
        }));
      }
    } catch {}
  },
  getStationsByLineId: async (lineId: number) => {
    try {
      const response = await fetch(`/api/stations?line=${lineId}`, {
        method: 'GET',
        headers: getRequestHeaders(),
      });
      if (response.ok) {
        const json: ApiPlatformContext<IStation> = await response.json();
        set(() => ({
          stations: json.member ?? [],
        }));
      }
    } catch {}
  },
  getStationScheldule: async (stationId: number) => {
    try {
      const response = await fetch(`/api/station/${stationId}/scheldule`, {
        method: 'GET',
        headers: getRequestHeaders(),
      });
      if (response.ok) {
        const json: { data: IScheldule } = await response.json();
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
