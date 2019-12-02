import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import Parser from 'html-react-parser';

import { Version } from '../../../models/version';

type Props = {
  versions: Version[];
  framework: string;
  style: string;
};

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

export const FrameworkVersion: React.FC<Props> = ({ versions, framework }) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  let versionNumber = '';

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
            setNotes('Version: ' + version.number + version.release_notes);
            setShowNotes(true);
          }}
        >
          (release notes)
        </button>
      </li>
    ));

  return (
    <>
      <Modal isOpen={showNotes} style={customStyles}>
        <h4>Release notes for {framework} </h4>
        {Parser(notes)}
        {versionItems}
        <div className="padding-top-large">
          <button
            className="button"
            onClick={() => {
              setNotes('');
              setShowNotes(false);
            }}
          >
            Close
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
