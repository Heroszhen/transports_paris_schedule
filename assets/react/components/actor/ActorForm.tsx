import { useEffect } from 'react';
import { IActor, IMediaObject } from '../../models/interfaces';
import { useForm } from 'react-hook-form';
import { useEditActor } from '../../stores/actorStore';
import { MediaObjectForm } from '../file/MediaObjectForm';
import { useDeleteFile } from '../../stores/fileStore';

type IProps = {
  actor?: IActor;
};

export type IActorForm = {
  name?: string;
  photo?: string;
};

export const ActorForm = (props: IProps) => {
  const { mutate, mutateAsync } = useEditActor(props.actor);
  const { mutate: mutateDelteFile } = useDeleteFile();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IActorForm>();

  useEffect(() => {
    reset({
      name: props.actor?.name ?? '',
    });
  }, [props.actor?.name]);

  const onSubmit = async (data: IActorForm) => {
    mutate(data);
  };

  const addPhoto = async (newPhoto: IMediaObject) => {
    if (!props.actor) return;

    if (newPhoto['@id']) {
      try {
        const oldFileId = props.actor.photo?.id;
        await mutateAsync({ photo: newPhoto['@id'] });
        if (oldFileId) mutateDelteFile(oldFileId);
      } catch {}
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-5">
        <h2>
          {!props.actor && `Ajouter un acteur`}
          {props.actor && `Modifier l'acteur ${props.actor.name}`}
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
          <button type="submit" className="btn btn-primary mt-3">
            Envoyer
          </button>
        </div>
      </form>
      {props.actor && (
        <section className="d-flex">
          <div className="p-1 w-[50%]">
            <h5 className="mb-3">Nouvelle actuelle</h5>
            <MediaObjectForm accept={'image/*'} type={'image/'} getNewFile={addPhoto} />
          </div>
          <div className="p-1 w-[50%]">
            <h5 className="mb-3">Photo actuelle</h5>
            {props.actor.photo && (
              <img
                src={`${process.env.AWS_FILE_PREFIX_FRONT}${props.actor.photo.name}`}
                className="card-img-top"
                alt="..."
              />
            )}
          </div>
        </section>
      )}
    </>
  );
};
