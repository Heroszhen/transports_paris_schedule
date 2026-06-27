import React, { useEffect, useState, useContext } from 'react';
import useStationStore from '../../stores/stationStore.js';
import { useForm } from 'react-hook-form';
import './Scheldule.scss';
import { ToastContext } from '../../App.jsx';

const Scheldule = () => {
  const {
    transportTypes,
    getTransportTypes,
    lines,
    getLinesByTransportTypeId,
    setLines,
    setStations,
    stations,
    getStationsByLineId,
    getStationScheldule,
    scheldules,
    resetScheldules,
  } = useStationStore();
  const { register, handleSubmit, reset, watch } = useForm();
  const transportTypeWatch = watch('transportType');
  const lineWatch = watch('line');
  const stationWatch = watch('station');
  const [lineKeywords, setLineKeywords] = useState('');
  const [stationKeywords, setStationKeywords] = useState('');
  const { toast } = useContext(ToastContext);

  useEffect(() => {
    (async () => {
      await getTransportTypes();
    })();

    reset({
      transportType: null,
      line: null,
      station: null,
    });
  }, []);

  useEffect(() => {
    (async () => {
      if (transportTypeWatch) {
        setLines([]);
        setStations([]);
        setLineKeywords('');
        resetScheldules(null);
        await getLinesByTransportTypeId(transportTypeWatch);
      }
    })();
  }, [transportTypeWatch]);

  useEffect(() => {
    (async () => {
      if (lineWatch) {
        setStations([]);
        setStationKeywords('');
        resetScheldules(null);
        await getStationsByLineId(lineWatch);
      }
    })();
  }, [lineWatch]);

  useEffect(() => {
    (async () => {
      if (stationWatch) {
        resetScheldules(null);
        await getStationScheldule(stationWatch);
      }
    })();
  }, [stationWatch]);

  const removeDuplicatedStationsByLabel = () => {
    const labels = [];
    return stations.filter((station) => {
      if (labels.includes(station.label.trim())) return false;
      else {
        labels.push(station.label);
        return true;
      }
    });
  };

  const reloadScheldules = async () => {
    if (stationWatch !== null) {
      await getStationScheldule(stationWatch);
      toast.success('Actualisé/已更新', {
        autoClose: 1000,
        theme: 'light',
      });
    }
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <>
      <section id="scheldule">
        <div className="container mb-4">
          <div className="row">
            <h1 className="col-12 text-center">
              Horaires RER et Transilien
              <br />
              巴黎公车时刻表
            </h1>
          </div>
        </div>
        <section className="bg-[#ededed] pt-4 pb-4">
          <form className="container" onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
              <div className="col-12 bg-[#2f4e96] text-white pt-2 pb-2">
                <h3>
                  1.Choisis un moyen de transport
                  <br />
                  1.选择交通工具
                </h3>
                <div className="d-flex justify-content-between flex-wrap">
                  {transportTypes.map((type) => {
                    return (
                      <div key={type.id} className="mb-2 ms-1 me-1">
                        <label
                          htmlFor={`transport_type_` + type.id}
                          className={`transport-type-label ${transportTypeWatch === type.id.toString() ? 'actived' : ''}`}>
                          {type.label}
                        </label>
                        <input
                          {...register('transportType')}
                          type="radio"
                          value={type.id}
                          id={`transport_type_` + type.id}
                          name="transportType"
                          className="d-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="col-12 bg-white pt-4 pb-2">
                <h3>
                  2.Choisis une ligne
                  <br />
                  2.选择线路
                </h3>

                {lines.length > 0 && (
                  <>
                    <div className="mb-2">
                      <input
                        className="form-control"
                        type="text"
                        value={lineKeywords}
                        onChange={(e) => setLineKeywords(e.target.value)}
                      />
                    </div>
                    <div className="d-flex justify-content-start flex-wrap max-h-[200px] overflow-auto">
                      {lines
                        .filter((line) => line.label.toLowerCase().includes(lineKeywords.toLocaleLowerCase()))
                        .sort((prev, next) =>
                          prev.label.localeCompare(next.label, undefined, { numeric: true, sensitivity: 'base' })
                        )
                        .map((line) => {
                          return (
                            <div key={line.id} className="mb-2 ms-1 me-1">
                              <label
                                htmlFor={`line_` + line.id}
                                className={`line-label ${lineWatch === line.id.toString() ? 'actived' : ''}`}>
                                {line.label}
                              </label>
                              <input
                                {...register('line')}
                                type="radio"
                                value={line.id}
                                id={`line_` + line.id}
                                name="line"
                                className="d-none"
                              />
                            </div>
                          );
                        })}
                    </div>
                  </>
                )}
              </div>
              <div className="col-12 bg-[#00a994] text-white pt-4 pb-2">
                <h3>
                  3.Choisis une station
                  <br />
                  3.选择站名
                </h3>
                {stations.length > 0 && (
                  <>
                    <div className="mb-2">
                      <input
                        className="form-control"
                        type="text"
                        value={stationKeywords}
                        onChange={(e) => setStationKeywords(e.target.value)}
                      />
                    </div>
                    <div className="d-flex justify-content-start flex-wrap max-h-[200px] overflow-auto">
                      {removeDuplicatedStationsByLabel()
                        .filter((station) => station.label.toLowerCase().includes(stationKeywords.toLocaleLowerCase()))
                        .sort((prev, next) =>
                          prev.label.localeCompare(next.label, undefined, { numeric: true, sensitivity: 'base' })
                        )
                        .map((station) => {
                          return (
                            <div key={station.id} className="mb-2 ms-1 me-1">
                              <label
                                htmlFor={`station_` + station.id}
                                className={`station-label ${stationWatch === station.id.toString() ? 'actived' : ''}`}>
                                {station.label}
                              </label>
                              <input
                                {...register('station')}
                                type="radio"
                                value={station.id}
                                id={`station_` + station.id}
                                name="station"
                                className="d-none"
                              />
                            </div>
                          );
                        })}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="row mt-4 justify-content-between">
              {scheldules !== null && (
                <>
                  <div className="col-12 bg-white pt-2 pb-2">
                    <div className="d-flex justify-content-between">
                      <h3>
                        Horaires
                        <br />
                        时间表
                      </h3>
                      <i className="bi bi-arrow-clockwise cursor-pointer fs-1" onClick={() => reloadScheldules()}></i>
                    </div>
                  </div>
                  {Object.keys(scheldules).map((schelduleKey) => {
                    return (
                      <div className="col-md-6 mt-2" key={schelduleKey}>
                        <div className="ms-1 me-1 bg-white p-2">
                          <h5>{schelduleKey}</h5>
                          {scheldules[schelduleKey].map((scheldule, key) => {
                            return <div key={key}>{scheldule.time}</div>;
                          })}
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </form>
        </section>
      </section>
    </>
  );
};
export default Scheldule;
