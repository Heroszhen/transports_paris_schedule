import { useState } from 'react';
import { useActors } from '../../../stores/actorStore';

export const Actor = () => {
  const { data: actors } = useActors();
  const [page, setPage] = useState<number>(1);
  const [section, setSection] = useState<number>(1);

  return (
    <>
      <section className="movie-section">
        <div className="container">
          <div className="row">
            <h1 className="col-12 mb-5">Acteurs</h1>
            {section === 1 && actors && actors.member && (
              <>
                {actors.member.map((actor, index) => {
                  return (
                    <div key={index} className="col-md-4 col-lg-3 mb-3">
                      <div className="card">
                        <img src="..." className="card-img-top" alt="..." />
                        <div className="card-body text-center">
                          <h5 className="card-title">{actor.name}</h5>
                          <button className="btn btn-info text-white">Go somewhere</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
};
