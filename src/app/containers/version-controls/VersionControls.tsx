import React, { FC, useState } from 'react';
import Modal from 'react-modal';

type Props = {
  release(version: string, notes: string): void;
};

const VersionControls: React.FC<Props> = ({ release }) => {
  const [version, setVersion] = useState('');
  const [pressedRelease, setPressedRelease] = useState(false);

  const reset = () => {
    setVersion('');
    setPressedRelease(false);
  };

  const publish = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pressedRelease && version) {
      // TODO: handle release notes
      release(version, 'dummy release notes');
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
              onChange={event => setVersion(event.currentTarget.value)}
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
