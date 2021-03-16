import React, { FC, useState } from 'react';

import Modal from 'react-modal';
import CKEditor from 'react-ckeditor-component';

import { Version } from '../../../models/version';

type Props = {
  release(version: string, notes: string): void;
  updateNotes(notes: string): void;
  createDraft(): void;
  versions: Version[];
  editable: false;
};

export const VersionControls: React.FC<Props> = ({
  release,
  updateNotes,
  createDraft,
  versions,
  editable
}) => {
  const liveVersion = versions.reduce((prev, curr) => {
    if (curr.status === 'live') {
      return curr.number;
    }
    return prev;
  }, '');

  const originalNotes = versions.reduce((prev, curr) => {
    if (curr.number === 'draft') {
      return curr.release_notes;
    }
    return prev;
  }, '');

  const [version, setVersion] = useState('');
  const [notes, setNotes] = useState(originalNotes);
  const [pressedRelease, setPressedRelease] = useState(false);
  const [pressedNotes, setPressedNotes] = useState(false);

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
        <Modal isOpen={pressedNotes}>
          <CKEditor
            content={notes}
            events={{
              change: (event: any) => setNotes(event.editor.getData())
            }}
          />
          <div className="padding-top-large">
            <span className="padding-right-small">
              <button
                className="button"
                onClick={() => {
                  setNotes(originalNotes);
                  setPressedNotes(false);
                }}
              >
                Close
              </button>
            </span>
            <button
              className="button"
              onClick={() => {
                updateNotes(notes);
                setPressedNotes(false);
              }}
            >
              Save
            </button>
          </div>
        </Modal>
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
            <CKEditor
              content={notes}
              events={{
                change: (event: any) => setNotes(event.editor.getData())
              }}
            />
            <div className="padding-top-large">
              <span className="padding-right-small">
                <button className="button" onClick={reset}>
                  Cancel
                </button>
              </span>
              <button className="button" type="submit">
                Publish
              </button>
            </div>
          </form>
        </Modal>
        <span className="padding-right-small">
          <button
            className="vf-button vf-button--tertiary vf-button--sm"
            onClick={() => setPressedRelease(true)}
          >
            Release new version <i className="icon icon-common icon-send" />
          </button>
        </span>
        <button
          className="vf-button vf-button--tertiary vf-button--sm"
          onClick={() => setPressedNotes(true)}
        >
          Update release notes <i className="icon icon-common icon-edit" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <span className="padding-right-small">
        <button
          className="vf-button vf-button--tertiary vf-button--sm"
          onClick={() => createDraft()}
        >
          Create draft
        </button>
      </span>
    </div>
  );
};

export default VersionControls;
