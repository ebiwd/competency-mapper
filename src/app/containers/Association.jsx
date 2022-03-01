import React from 'react';

const Association = framework => {
  let data = framework.framework;
  return (
    <div style={{ textAlign: '-webkit-center' }}>
      <a href={data.link ? data.link : '#'}>
        <figure className="vf-figure">
          <img
            className="vf-figure__image"
            src={data.src}
            alt={data.alt}
            loading="lazy"
          />
        </figure>
      </a>
    </div>
  );
};

export default Association;
