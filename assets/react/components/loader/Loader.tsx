export const Loader = () => {
  return (
    <div className="position-fixed top-0 start-0 w-screen h-screen z-9999 transparent text-end pt-5 pe-5">
      <span className="bg-white fs-3 p-3">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </span>
    </div>
  );
};
