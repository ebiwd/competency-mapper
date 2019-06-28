import React, { FC, useState } from 'react';
import Modal from 'react-modal';

type Props = {
  release(version: string, notes: string): void;
};

const VersionControls: React.FC<Props> = ({ release }) => {
  const [version, setVersion] = useState('');
  const [notes, setNotes] = useState('');
  const [pressedRelease, setPressedRelease] = useState(false);

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

  return (
    <div>
      <Modal isOpen={pressedRelease}>
        <form onSubmit={publish}>
          <label>
            Version
            <input
              type="text"
              placeholder="1.0.0"
              value={version}
              required
              onChange={event => setVersion(event.currentTarget.value.trim())}
            />
          </label>
          <label>
            Release notes
            <textarea
              placeholder="Notes are required"
              value={notes}
              required
              onChange={event => setNotes(event.currentTarget.value)}
            />
          </label>
          <span className="padding-right-small">
            <button className="button" type="submit">
              Publish
            </button>
          </span>
          <button className="button" onClick={reset}>
            Cancel
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
};

export default VersionControls;
