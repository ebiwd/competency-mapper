import React from 'react';

import FrameworkButton from '../framework-button/FrameworkButton';

function FrameworkButtons({ frameworks }) {
  const selfRef = new React.createRef();

  const invokeFoundation = () => {
    // window.setTimeout(() => $(selfRef.current).foundation());
    return (
      <div className="vf-grid vf-grid__col-3">
        {' '}
        {frameworks.map(framework => (
          <FrameworkButton key={framework.nid} framework={framework} />
        ))}
      </div>
    );
  };

  return frameworks.length < 1 ? null : (
    <div className="row" data-equalizer ref={selfRef}>
      {invokeFoundation()}
    </div>
  );
}

export default FrameworkButtons;
