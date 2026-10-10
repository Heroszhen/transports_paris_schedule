import { useRef, useState } from 'react';
import MainMenu from '../../../components/MainMenu/MainMenu';
import { Paginator } from '../../../components/paginator/Paginator';
import { getMovie, useDeleteMovie, useEditMovie, useMovies } from '../../../stores/movieStore';
import { useForm } from 'react-hook-form';
import { IActor, IMediaObject } from '../../../models/interfaces';
import { useActorsName } from '../../../stores/actorStore';
import { MediaObjectForm } from '../../../components/file/MediaObjectForm';
import { useDeleteFile } from '../../../stores/fileStore';
import { Select } from '../../../components/select/select';

export type IMovieForm = {
  title?: string;
  actors?: string[];
  releaseDate?: string;
  description?: string;
  links?: string[];
  newLinks?: string;
  photo?: string;
};

enum FormTypeEnum {
  ADD_MOVIE,
  MODIFY_MOVIE,
}

export const Movie = () => {
  const [filter, setFilter] = useState({ keywords: '', field: 'createdAt', order: 'desc' });
  const [page, setPage] = useState<number>(1);
  const { data: movies } = useMovies({
    page: page,
    title: filter.keywords,
    actor: filter.keywords,
    [`order[${filter.field}]`]: filter.order,
  });
  const { data: actorsNames } = useActorsName();
  const [movieIndex, setMovieIndex] = useState<number | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<IMovieForm>();
  const [formType, setFormType] = useState<FormTypeEnum | null>(null);
  const { mutate, mutateAsync } = useEditMovie();
  const { mutate: mutateDelteFile } = useDeleteFile();
  const modalBtnRef = useRef<HTMLButtonElement | null>(null);
  const { mutate: mutateDeleteMovie } = useDeleteMovie();

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

  const createMovieForm = async (type: FormTypeEnum | null = null, index: number | null = null) => {
    setFormType(type);
    setMovieIndex(index);

    let movie = null;
    const actorsId: string[] = [];
    if (index !== null) {
      if (movies?.member?.[index].id === undefined) {
        setFormType(null);
        return;
      }

      movie = await getMovie(movies.member[index].id);
      if (!movie) {
        setFormType(null);
        return;
      }

      movie.actors.forEach((actor: IActor) => actorsId.push(actor['@id'] ?? ''));
    }

    reset({
      title: index === null ? '' : (movie?.title ?? ''),
      actors: actorsId,
      releaseDate: index === null ? '' : (movie?.releaseDate?.slice(0, 10) ?? ''),
      description: index === null ? '' : (movie?.description ?? ''),
      links: index === null ? [] : (movie?.links ?? []),
      newLinks: index === null ? '' : (movie?.links?.join('\n') ?? ''),
    });
  };

  const onSubmit = async (data: IMovieForm) => {
    data.links =
      data.newLinks
        ?.split('\n')
        .map((link) => link.trim())
        .filter((link) => link !== '') ?? [];
    delete data.newLinks;
    mutate(
      { movie: data, movieId: movieIndex === null ? null : (movies?.member?.[movieIndex].id ?? null) },
      {
        onSuccess: () => {
          if (movieIndex === null) modalBtnRef?.current?.click();
        },
      }
    );
  };

  const addPhoto = async (newPhoto: IMediaObject) => {
    const movieId = movieIndex === null ? null : (movies?.member?.[movieIndex].id ?? null);
    if (movieId === null) return;

    if (newPhoto['@id']) {
      try {
        const oldFileId = movieIndex === null ? null : (movies?.member?.[movieIndex].photo?.id ?? null);
        await mutateAsync({ movie: { photo: newPhoto['@id'] }, movieId: movieId });
        if (oldFileId) mutateDelteFile(oldFileId);
      } catch {}
    }
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
                data-bs-target="#staticBackdrop"
                onClick={() => createMovieForm(FormTypeEnum.ADD_MOVIE)}></i>
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
                              data-bs-target="#staticBackdrop"
                              onClick={() => createMovieForm(FormTypeEnum.MODIFY_MOVIE, index)}>
                              <i className="bi bi-pencil-fill"></i>
                            </button>
                            <div className="btn btn-light btn-sm text-dark">
                              <i className="bi bi-eye"></i>
                            </div>
                            <button
                              className="btn btn-danger btn-sm text-white"
                              onClick={() => mutateDeleteMovie(movie.id)}>
                              <i className="bi bi-trash3"></i>
                            </button>
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

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setMovieIndex(null);
                  setFormType(null);
                }}
                ref={modalBtnRef}></button>
            </div>
            {formType !== null && (
              <div className="modal-body">
                <h2 className="mb-3">
                  {formType === FormTypeEnum.ADD_MOVIE && `Ajouter un film`}
                  {movieIndex !== null && `Modifier l'acteur ${movies?.member?.[movieIndex].title}`}
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="container-fluid">
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label htmlFor="title" className="form-label">
                        Titre*
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        {...register('title', {
                          required: { value: true, message: 'Le champ est obligatoire' },
                          maxLength: { value: 50, message: 'Au plus 50 caractères' },
                        })}
                      />
                      {errors.title && <div className="alert alert-danger mt-2">{errors.title?.message}</div>}
                    </div>
                    <div className="col-md-12 mb-3">
                      <label htmlFor="releaseDate" className="form-label">
                        Date de sortie*
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="releaseDate"
                        {...register('releaseDate', {
                          required: { value: true, message: 'Le champ est obligatoire' },
                        })}
                      />
                      {errors.releaseDate && (
                        <div className="alert alert-danger mt-2">{errors.releaseDate?.message}</div>
                      )}
                    </div>
                    <div className="col-md-12 mb-3">
                      {/* <label htmlFor="actors" className="form-label">
                        Actor*
                      </label>
                      <select
                        className="form-select"
                        id="actors"
                        multiple
                        {...register('actors', {
                          required: { value: true, message: 'Le champ est obligatoire' },
                        })}>
                        {actorsNames?.member?.map((actor: IActor) => (
                          <option key={actor['@id']} value={actor['@id']}>
                            {actor.name}
                          </option>
                        ))}
                      </select>
                      {errors.actors && <div className="alert alert-danger mt-2">{errors.actors?.message}</div>} */}
                      <Select
                        htmlFor="actors"
                        labelText="Actors*"
                        list={actorsNames?.member ?? []}
                        optionValue={'@id'}
                        optionText={'name'}
                        activatedValues={watch('actors') ?? []}
                        searchByField={'name'}
                        setValue={setValue}
                        fieldName={'actors'}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="description" className="form-label">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        id="description"
                        rows={3}
                        {...register('description')}></textarea>
                    </div>
                    <div className="mb-3">
                      <label htmlFor="links" className="form-label">
                        Liens(un par ligne)
                      </label>
                      <textarea className="form-control" id="links" rows={3} {...register('newLinks')}></textarea>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">
                        Envoyer
                      </button>
                    </div>
                  </div>
                </form>
                {movieIndex !== null && movies?.member?.[movieIndex] && (
                  <section className="d-flex mt-5">
                    <div className="p-1 w-[50%]">
                      <h5 className="mb-3">Nouvelle actuelle</h5>
                      <MediaObjectForm accept={'image/*'} type={'image/'} getNewFile={addPhoto} />
                    </div>
                    <div className="p-1 w-[50%]">
                      <h5 className="mb-3">Photo actuelle</h5>
                      {movies.member[movieIndex].photo && (
                        <img
                          src={`${process.env.AWS_FILE_PREFIX_FRONT}${movies.member[movieIndex].photo.name}`}
                          className="card-img-top"
                          alt="..."
                        />
                      )}
                    </div>
                  </section>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
