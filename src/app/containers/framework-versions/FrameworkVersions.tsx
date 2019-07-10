import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Parser from 'html-react-parser';

import { Version } from '../../../models/version';

type Props = {
  versions: Version[];
  framework: string;
};

export const FrameworkVersion: React.FC<Props> = ({ versions, framework }) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  const versionItems = versions
    .filter(version => version.number !== 'draft')
    .map(version => (
      <li key={version.id}>
        <Link to={`/framework/${framework}/${version.number}`}>
          {version.number}
        </Link>{' '}
        <button
          className="anchor-like"
          onClick={() => {
            setNotes(version.release_notes);
            setShowNotes(true);
          }}
        >
          (release notes)
        </button>
      </li>
    ));

  return (
    <>
      <Modal isOpen={showNotes}>
        {Parser(notes)}
        <div className="padding-top-large">
          <button
            className="button"
            onClick={() => {
              setNotes('');
              setShowNotes(false);
            }}
          >
            Dismish
          </button>
        </div>
      </Modal>
      <div className="callout">
        <h5>Framework versions</h5>
        {versions.length === 0 ? (
          'No previous versions'
        ) : (
          <ul>{versionItems}</ul>
        )}
      </div>
    </>
  );
};

export default FrameworkVersion;
