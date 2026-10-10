import { useParams } from 'react-router-dom';
import MainMenu from '../../../components/MainMenu/MainMenu';
import { getMovie } from '../../../stores/movieStore';
import { useEffect, useState } from 'react';
import { IActor, IMovie } from '../../../models/interfaces';
import parse from 'html-react-parser';

export const Play = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState<IMovie | null>(null);

  useEffect(() => {
    (async () => {
      if (id) {
        setMovie(await getMovie(id));
      }
    })();
  }, [id]);

  return (
    <>
      <section id="movie-play" className="movie-section">
        <div className="container">
          <div className="row mb-3">
            <div className="col-12 text-end mb-5">
              <MainMenu />
            </div>
          </div>
          {movie && (
            <div className="row mb-3">
              <div className="col-md-4 mb-5">
                {movie.photo && (
                  <img
                    src={`${process.env.AWS_FILE_PREFIX_FRONT}${movie.photo.name}`}
                    className="card-img-top"
                    alt="..."
                  />
                )}
              </div>
              <div className="col-md-8 mb-5">
                <h2 className="mb-2">{movie.title}</h2>
                <div className="mb-4">
                  {movie.releaseDate && new Date(movie.releaseDate).toLocaleDateString('fr-FR')}
                </div>
                <h5 className="mb-2">Synopsis</h5>
                {movie.description && <div> {parse(movie.description)}</div>}
              </div>
              {movie.actors.length > 0 && (
                <div className="col-12 mb-5">
                  <div className="w-full overflow-x-auto flex">
                    {movie.actors.map((actor: IActor) => (
                      <div className="card w-[140px] me-2 shrink-0" key={actor['@id']}>
                        {actor.photo && (
                          <img
                            src={`${process.env.AWS_FILE_PREFIX_FRONT}${actor.photo.name}`}
                            className="card-img-top"
                            alt="..."
                          />
                        )}
                        <div className="card-body">
                          <h5 className="card-title">{actor.name}</h5>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {movie.links.length > 0 && (
                <div className="w-full flex flex-wrap">
                  {movie.links.map((link, index) => (
                    <a key={index} className="block me-3 mb-3 fs-5" href={link} target="_blank" rel="noreferrer">
                      lien {index + 1}
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
