import React from 'react';

import FrameworkButton from '../framework-button/FrameworkButton';

const $ = window.$;

function FrameworkButtons({ data }) {
  const selfRef = new React.createRef();

  const invokeFoundation = () => {
    window.setTimeout(() => $(selfRef.current).foundation());
    return data.map(item => <FrameworkButton key={item.nid} item={item} />);
  };

  return data.length < 1 ? null : (
    <div className="row" data-equalizer ref={selfRef}>
      {invokeFoundation()}
    </div>
  );
}

export default FrameworkButtons;
