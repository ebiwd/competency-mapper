import React from 'react';
import Parser from 'html-react-parser';
import CCBY_IMG from '../components/assets/CC_BY.png';

const Copyright = framework => {
  return (
    <>
      <figure className="vf-figure vf-figure--align vf-figure--align-inline-start">
        <img
          alt=""
          style={{ width: '125px', marginTop: '5px' }}
          className="vf-figure__image"
          src={CCBY_IMG}
          width={'auto'}
          height={'auto'}
          loading="lazy"
        />
      </figure>
      <p>
        This competency framework is a free cultural work licensed under <br />{' '}
        a{' '}
        <a
          className="vf-link"
          href="https://creativecommons.org/licenses/by/4.0/"
        >
          Creative Commons Attribution 4.0 International (CC BY 4.0){' '}
        </a>
        license.
      </p>
    </>
  );
};

export default Copyright;
