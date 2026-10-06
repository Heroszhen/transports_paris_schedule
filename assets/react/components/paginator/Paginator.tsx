import { useRef } from 'react';
import ResponsivePagination from 'react-responsive-pagination';

type IProps = {
  page: number;
  total: number;
  onPageChange: (page: number) => void;
};

export const Paginator = (props: IProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const setPage = (e: React.KeyboardEvent<HTMLInputElement> | React.MouseEvent<HTMLElement>) => {
    const value = inputRef.current?.value;
    if (!value) return;

    if (e && e.type === 'keyup') {
      if ('key' in e && e.code === 'Enter') props.onPageChange(parseInt(value));
      return;
    }

    if (value !== '') props.onPageChange(parseInt(value));
  };

  return (
    <section>
      <div>
        <div className="wrap-paginator">
          <ResponsivePagination
            current={props.page}
            total={Math.ceil(props.total / 20)}
            onPageChange={props.onPageChange}
            maxWidth={400}
          />
        </div>
      </div>
      <div className="d-flex justify-content-center mt-2">
        <div className="d-flex justify-content-between align-items-center rounded border !border-blue w-[90px] p-1">
          <input
            className="w-[60px] border-none focus:outline-none"
            defaultValue={props.page}
            ref={inputRef}
            onKeyUp={setPage}
          />
          <div>
            <i className="bi bi-search cursor-pointer" onClick={(e) => setPage(e)}></i>
          </div>
        </div>
      </div>
    </section>
  );
};
