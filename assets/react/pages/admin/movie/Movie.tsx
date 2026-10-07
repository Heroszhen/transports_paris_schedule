import { useState } from 'react';
import MainMenu from '../../../components/MainMenu/MainMenu';
import { Paginator } from '../../../components/paginator/Paginator';
import { useMovies } from '../../../stores/movieStore';

export const Movie = () => {
  const [filter, setFilter] = useState({ keywords: '', field: 'createdAt', order: 'desc' });
  const [page, setPage] = useState<number>(1);
  const { data: movies } = useMovies({
    page: page,
    title: filter.keywords,
    actor: filter.keywords,
    [`order[${filter.field}]`]: filter.order,
  });

  const searchMovies = (e: React.InputEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
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
              Films
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
                  onKeyUp={searchMovies}
                  onInput={searchMovies}
                />
              </div>
            </div>
            <div className="col-8 col-md-3 col-lg-3 mb-2">
              <select
                className="form-select"
                defaultValue={'createdAt'}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => updateFilter('field', e.currentTarget.value)}>
                <option value="">Par</option>
                <option value="title">Nom</option>
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
            {movies && movies.member && (
              <>
                {movies.member.map((movie, index) => {
                  return (
                    <div key={index} className="col-6 col-md-3 col-lg-2 mb-3">
                      <div className="card">
                        {movie.photo && (
                          <img
                            src={`${process.env.AWS_FILE_PREFIX_FRONT}${movie.photo.name}`}
                            className="card-img-top"
                            alt="..."
                          />
                        )}

                        <div className="card-body text-center">
                          <h5 className="card-title mb-3">{movie.title}</h5>
                          <div className="d-flex justify-content-between">
                            <button
                              className="btn btn-info btn-sm text-white"
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop">
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <button className="btn btn-danger btn-sm text-white"></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="col-12 mt-4">
                  <Paginator page={page} total={movies.totalItems ?? 0} onPageChange={setPage} />
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
