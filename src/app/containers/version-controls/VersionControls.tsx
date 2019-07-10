import React, { FC, useState } from 'react';

import Modal from 'react-modal';
import CKEditor from 'react-ckeditor-component';

import { Version } from '../../../models/version';

type Props = {
  release(version: string, notes: string): void;
  createDraft(): void;
  versions: Version[];
  editable: false;
};

export const VersionControls: React.FC<Props> = ({
  release,
  createDraft,
  versions,
  editable
}) => {
  const [version, setVersion] = useState('');
  const [notes, setNotes] = useState('');
  const [pressedRelease, setPressedRelease] = useState(false);
  const liveVersion = versions.reduce((prev, curr) => {
    if (curr.status === 'live') {
      return curr.number;
    }
    return prev;
  }, '');

  const reset = () => {
    setVersion('');
    setPressedRelease(false);
  };

  const publish = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const cleanNotes = notes.trim();
    if (pressedRelease && version && cleanNotes) {
      release(version, cleanNotes);
      reset();
    }
  };

  if (editable) {
    return (
      <div>
        <Modal isOpen={pressedRelease}>
          <form onSubmit={publish}>
            <label>
              Version{' '}
              {liveVersion
                ? `(live version ${liveVersion})`
                : '(no live version)'}
              <input
                type="text"
                placeholder="1.0.0"
                value={version}
                required
                onChange={event => setVersion(event.currentTarget.value.trim())}
              />
            </label>
            <div className="padding-bottom-medium">
              <CKEditor
                content={notes}
                events={{
                  change: (event: any) => setNotes(event.editor.getData())
                }}
                required
              />
            </div>
            <span className="padding-right-small">
              <button className="button" onClick={reset}>
                Cancel
              </button>
            </span>
            <button className="button" type="submit">
              Publish
            </button>
          </form>
        </Modal>
        <span className="padding-right-small">
          <button className="button" onClick={() => setPressedRelease(true)}>
            Release new version
          </button>
        </span>
        <button className="button">Update release notes</button>
      </div>
    );
  }

  return (
    <div>
      <span className="padding-right-small">
        <button className="button" onClick={() => createDraft()}>
          Create draft
        </button>
      </span>
    </div>
  );
};

export default VersionControls;
