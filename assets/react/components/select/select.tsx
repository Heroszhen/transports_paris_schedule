import { FieldPath, FieldPathValue, FieldValues, UseFormSetValue } from 'react-hook-form';

type IProps<T, TForm extends FieldValues, TName extends FieldPath<TForm>> = {
  htmlFor: string;
  labelText: string;
  list: T[];
  optionValue: keyof T;
  optionText: keyof T;
  activatedValues: T[keyof T][];
  searchKeys: string;
  setValue: UseFormSetValue<TForm>;
  fieldName: TName;
};

export const Select = <T, TForm extends FieldValues, TName extends FieldPath<TForm>>(
  props: IProps<T, TForm, TName>
) => {
  const selectValue = (value: T[keyof T]) => {
    let newActivatedValues = [...props.activatedValues];
    if (props.activatedValues.includes(value)) {
      newActivatedValues = props.activatedValues.filter((elm) => elm !== value);
    } else {
      newActivatedValues.push(value);
    }
    props.setValue(props.fieldName, newActivatedValues as FieldPathValue<TForm, TName>);
  };
  return (
    <>
      <label htmlFor={props.htmlFor} className="form-label">
        {props.labelText}
      </label>
      <input className="form-control form-control-sm mb-1" type="search" />
      <div className="border border-dark-subtle rounded p-3 max-h-[200px] overflow-y-auto">
        <div className="list-group">
          {props.list.map((elm, index) => (
            <div
              key={index}
              className={`list-group-item cursor-pointer ${props.activatedValues.includes(elm[props.optionValue]) ? 'active' : ''}`}
              onClick={() => selectValue(elm[props.optionValue] as T[keyof T])}>
              {elm[props.optionText] as string}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
