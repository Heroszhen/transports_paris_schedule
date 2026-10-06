import { useActors } from '../../../stores/actorStore';
import { Paginator } from '../../../components/paginator/Paginator';
import React, { useState } from 'react';
import { ActorForm } from '../../../components/actor/ActorForm';
import MainMenu from '../../../components/MainMenu/MainMenu';

export const Actor = () => {
  const [filter, setFilter] = useState({ keywords: '', field: 'createdAt', order: 'desc' });
  const [page, setPage] = useState(1);
  const { data: actors } = useActors({ page: page, name: filter.keywords, [`order[${filter.field}]`]: filter.order });
  const [actorIndex, setActorIndex] = useState<number | null>(null);

  const searchActors = (e: React.InputEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.currentTarget?.value ?? '';
    if (e.type === 'keyup' && 'key' in e && e.key === 'Enter') {
      updateFilter('keywords', value);
    } else if (e.type === 'input' && value === '') {
      updateFilter('keywords', '');
    }
  };

  const updateFilter = (key: keyof typeof filter, value: string) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <>
      <section className="movie-section">
        <div className="container">
          <div className="row mb-3">
            <div className="col-12 text-end mb-5">
              <MainMenu />
            </div>
            <h1 className="col-12 mb-5">
              Acteurs
              <i
                className="bi bi-plus-circle fs-3 cursor-pointer ml-2"
                data-bs-toggle="modal"
                data-bs-target="#staticBackdrop"></i>
            </h1>
            <div className="col-12 col-md-7 mb-2">
              <div className="d-flex justify-content-between">
                <input
                  type="search"
                  className="form-control form-sm"
                  id="search-bar"
                  placeholder="Nom"
                  onKeyUp={searchActors}
                  onInput={searchActors}
                />
              </div>
            </div>
            <div className="col-8 col-md-3 col-lg-3 mb-2">
              <select
                className="form-select"
                defaultValue={'createdAt'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFilter('field', e.currentTarget.value)}>
                <option value="">Par</option>
                <option value="name">Nom</option>
                <option value="createdAt">Date de création</option>
              </select>
            </div>
            <div className="col-4 col-md-2 mb-2">
              <select
                className="form-select"
                defaultValue={'desc'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFilter('order', e.currentTarget.value)}>
                <option value="">Ordre</option>
                <option value="asc">Croissant</option>
                <option value="desc">Décroissant</option>
              </select>
            </div>
          </div>
          <div className="row">
            {actors && actors.member && (
              <>
                {actors.member.map((actor, index) => {
                  return (
                    <div key={index} className="col-6 col-md-3 col-lg-2 mb-3">
                      <div className="card">
                        <img src="..." className="card-img-top" alt="..." />
                        <div className="card-body text-center">
                          <h5 className="card-title mb-3">{actor.name}</h5>
                          <div className="d-flex justify-content-between">
                            <button
                              className="btn btn-info btn-sm text-white"
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop"
                              onClick={() => setActorIndex(index)}>
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button className="btn btn-dark btn-sm text-white">
                              <i className="bi bi-eye-fill"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="col-12 mt-4">
                  <Paginator page={page} total={actors.totalItems ?? 0} onPageChange={setPage} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => setActorIndex(null)}></button>
            </div>
            <div className="modal-body">
              <ActorForm actor={actorIndex !== null && actors?.member ? actors.member[actorIndex] : undefined} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
