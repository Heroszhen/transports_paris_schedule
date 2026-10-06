import { useEffect } from 'react';
import { IActor } from '../../models/interfaces';
import { useForm } from 'react-hook-form';
import { useEditActor } from '../../stores/actorStore';

type IProps = {
  actor?: IActor;
};

export type IActorForm = {
  name?: string;
};

export const ActorForm = (props: IProps) => {
  const { mutate } = useEditActor(props.actor);
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>
        {!props.actor && `Ajouter un acteur`}
        {props.actor && `Modifier l'acteur ${props.actor.name}`}
      </h2>
      <div className="mb-3 mt-3">
        <label htmlFor="name" className="form-label">
          Nom
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
  );
};
