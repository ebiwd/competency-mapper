import React from 'react';

import FrameworkButton from '../framework-button/FrameworkButton';

const $ = window.$;

function FrameworkButtons({ frameworks }) {
  const selfRef = new React.createRef();

  const invokeFoundation = () => {
    window.setTimeout(() => $(selfRef.current).foundation());
    return frameworks.map(framework => (
      <FrameworkButton key={framework.nid} framework={framework} />
    ));
  };

  return frameworks.length < 1 ? null : (
    <div className="row" data-equalizer ref={selfRef}>
      {invokeFoundation()}
    </div>
  );
}

export default FrameworkButtons;
