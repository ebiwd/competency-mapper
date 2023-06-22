import React from 'react';
import FrameworkButton from '../framework-button/FrameworkButton';

function FrameworkButtons({ frameworkDetails }) {
  return (
    <section
      className="vf-card-container vf-card-container__col-3"
      style={{ margin: '0' }}
    >
      <div className="vf-card-container__inner">
        {frameworkDetails.map((framework, key) => (
          <FrameworkButton
            key={key}
            desc={framework.desc}
            sub_text={framework.sub_text}
            card_link={framework.card_link}
          />
        ))}
      </div>
    </section>
  );
}

export default FrameworkButtons;
