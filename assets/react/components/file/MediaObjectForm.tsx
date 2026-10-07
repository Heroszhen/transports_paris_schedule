import React, { useState } from 'react';
import { readFile } from '../../services/data';
import { useAddfile } from '../../stores/fileStore';
import { IMediaObject } from '../../models/interfaces';

type IProps = {
  accept?: string;
  type?: string;
  getNewFile?: (file: IMediaObject) => void;
};

export const MediaObjectForm = ({ accept, type, getNewFile }: IProps) => {
  const { mutate } = useAddfile();
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileUrl(null);
    const file = e.currentTarget.files?.item(0);
    if (!file) return;
    if (type && !file.type.toLowerCase().includes(type.toLowerCase())) return;

    const url = await readFile(file);
    setFileUrl(url);
    setFile(file);
  };

  const addFile = () => {
    if (!file) return;

    // mutateAsync
    mutate(file, {
      onSuccess: (mediaObject) => {
        if (getNewFile) getNewFile(mediaObject);
        setFile(null);
        setFileUrl(null);
      },
    });
  };

  return (
    <section>
      <div className="mb-3">
        <input
          className="form-control form-control-sm"
          type="file"
          id="formFile"
          accept={accept}
          onChange={handleFile}
        />
      </div>
      {fileUrl && (
        <>
          <img src={fileUrl} alt="" />
          <div className="mt-3">
            <button type="button" className="btn btn-primary btn-sm" onClick={addFile}>
              Envoyer
            </button>
          </div>
        </>
      )}
    </section>
  );
};
