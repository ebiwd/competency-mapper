import React, { useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

export const ProfileEditForm = React.memo(
  ({ profile, onSubmit, clearPicture }) => {
    const {
      register,
      errors,
      setError,
      clearError,
      setValue,
      handleSubmit,
    } = useForm({
      mode: 'onBlur',
    });
    const [photo, setPhoto] = useState();

    useEffect(() => {
      register({ name: 'qualification_background' });
      register({ name: 'current_role' });
      register({ name: 'additional_information' });
      setValue('qualification_background', profile?.qualification_background);
      setValue('current_role', profile?.current_role);
      setValue('additional_information', profile?.additional_information);
      setPhoto(profile?.image?.[0]?.src ?? profile?.image?.[0]?.url);
    }, [register, setValue, profile]);

    const clearUploads = () => {
      setValue('uploads', null);
      setPhoto(undefined);
      // eslint-disable-next-line no-unused-expressions
      clearPicture?.();
    };

    const onSelectFile = ({ target }) => {
      clearError('uploads');

      const file = target.files[0];
      if (!file) {
        clearUploads();
        return;
      }

      if (file.size > 2097152) {
        clearUploads();
        setError('uploads', { tooBig: true });
        return;
      }

      if (!file.type.startsWith('image/')) {
        clearUploads();
        setError('uploads', { badFormat: true });
        return;
      }

      setPhoto(URL.createObjectURL(file));
    };

    const submit = (data, event) => {
      event.preventDefault();
      onSubmit(data);
    };

    return (
      <form className="row" onSubmit={handleSubmit(submit)}>
        <div className="column large-4">
          <div>
            <strong>
              Name
              <Mandatory />
            </strong>
            <input
              type="text"
              name="title"
              ref={register({ required: true })}
              defaultValue={profile?.title}
              placeholder="John Walter"
            />
            {errors.title && <Error>Name is required</Error>}
          </div>

          <div>
            <strong>Image</strong>
            <input
              type="file"
              name="uploads"
              ref={register}
              accept="image/*"
              onChange={onSelectFile}
            />
            <div>
              {photo && (
                <>
                  <img src={photo} alt="profile" />
                  <button
                    className="button small secondary margin-top-medium"
                    onClick={clearUploads}
                  >
                    <i className="icon icon-common icon-trash" /> Clear image
                  </button>
                </>
              )}

              {errors.uploads?.types?.tooBig && (
                <Error>Image size should not be more than 2 MB</Error>
              )}

              {errors.uploads?.types?.badFormat && (
                <Error>Only images are allowed</Error>
              )}
            </div>
          </div>

          <div>
            <strong>Age (in years)</strong>
            <input
              type="number"
              name="age"
              ref={register}
              defaultValue={profile?.age}
              placeholder="Age"
            />
          </div>

          <div>
            <strong>Gender</strong>
            <select name="gender" ref={register} defaultValue={profile?.gender}>
              <option value="-None-">None</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
        </div>

        <div className="column large-8">
          <div>
            <strong>
              Job title
              <Mandatory />
            </strong>
            <input
              type="text"
              name="job_title"
              ref={register({ required: true })}
              placeholder="Bioinformatician"
              defaultValue={profile?.job_title}
            />
            {errors.job_title && <Error>Job title is required</Error>}
          </div>

          <div className="margin-bottom-large">
            <strong>Qualification and background</strong>
            <CKEditor
              editor={ClassicEditor}
              data={profile?.qualification_background ?? undefined}
              onChange={(event, editor) => {
                setValue('qualification_background', editor.getData());
              }}
            />
          </div>

          <div className="margin-bottom-large">
            <strong>Activities of current role</strong>
            <CKEditor
              editor={ClassicEditor}
              data={profile?.current_role ?? undefined}
              onChange={(event, editor) => {
                setValue('current_role', editor.getData());
              }}
            />
          </div>

          <div className="margin-bottom-large">
            <strong>Additional information</strong>
            <CKEditor
              editor={ClassicEditor}
              data={profile?.additional_information ?? undefined}
              onChange={(event, editor) => {
                setValue('additional_information', editor.getData());
              }}
            />
          </div>
        </div>

        <div className="column">
          <button className="button float-right">Save and continue</button>
        </div>
      </form>
    );
  }
);

const Error = ({ children }) => {
  return <div className="callout alert">{children}</div>;
};

const Mandatory = () => <sup style={{ color: 'red' }}>*</sup>;

export default ProfileEditForm;
