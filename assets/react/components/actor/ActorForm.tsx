import React, { useEffect, useState } from 'react';
import { IActor, IMediaObject } from '../../models/interfaces';
import { useForm } from 'react-hook-form';
import { useEditActor } from '../../stores/actorStore';
import { MediaObjectForm } from '../file/MediaObjectForm';
import { useDeleteFile } from '../../stores/fileStore';

type IProps = {
  actor?: IActor;
  modalBtn?: React.RefObject<HTMLElement | null>;
};

export type IActorForm = {
  name?: string;
  photo?: string;
};

export const ActorForm = (props: IProps) => {
  const [actor, setActor] = useState<IActor | null>(props.actor ?? null);
  const { mutate, mutateAsync } = useEditActor(actor);
  const { mutate: mutateDelteFile } = useDeleteFile();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IActorForm>();

  useEffect(() => {
    reset({
      name: actor?.name ?? '',
    });
  }, [actor?.name]);

  const onSubmit = async (data: IActorForm) => {
    mutate(data, {
      onSuccess: (editedActor) => {
        setActor(editedActor);
      },
    });
  };

  const addPhoto = async (newPhoto: IMediaObject) => {
    if (!actor) return;

    if (newPhoto['@id']) {
      try {
        const oldFileId = actor.photo?.id;

        const result = await mutateAsync({ photo: newPhoto['@id'] });
        setActor(result);

        if (oldFileId) mutateDelteFile(oldFileId);
      } catch {}
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>
          {!actor && `Ajouter un acteur`}
          {actor && `Modifier l'acteur ${actor.name}`}
        </h2>
        <div className="mb-3 mt-3">
          <label htmlFor="name" className="form-label">
            Nom*
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            {...register('name', {
              required: { value: true, message: 'Le champ est obligatoire' },
            })}
          />
          {errors.name?.type === 'required' && <div className="alert alert-danger mt-2">{errors.name?.message}</div>}
        </div>
        <button type="submit" className="btn btn-primary mt-2">
          Envoyer
        </button>
      </form>
      {actor && (
        <section className="d-flex mt-5">
          <div className="p-1 w-[50%]">
            <MediaObjectForm
              accept={'image/*'}
              type={'image/'}
              getNewFile={addPhoto}
              title={"<h5 className='mb-[0px]'>Nouvelle actuelle</h5>"}
            />
          </div>
          <div className="p-1 w-[50%]">
            <h5 className="mb-3">Photo actuelle</h5>
            {actor.photo && (
              <img src={`${process.env.AWS_FILE_PREFIX_FRONT}${actor.photo.name}`} className="card-img-top" alt="..." />
            )}
          </div>
        </section>
      )}
    </>
  );
};
