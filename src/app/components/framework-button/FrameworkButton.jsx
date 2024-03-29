import React from 'react';
import Parser from 'html-react-parser';

function FrameworkButton({ desc, sub_text, card_link }) {
  return (
    <article className="vf-card vf-card--brand vf-card--bordered">
      <div className="vf-card__content | vf-stack vf-stack--400">
        <h3 className="vf-card__heading">
          <a className="vf-card__link" href={card_link}>
            {' '}
            {desc}{' '}
            <svg
              aria-hidden="true"
              className="vf-card__heading__icon | vf-icon vf-icon-arrow--inline-end"
              width="1em"
              height="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0 12c0 6.627 5.373 12 12 12s12-5.373 12-12S18.627 0 12 0C5.376.008.008 5.376 0 12zm13.707-5.209l4.5 4.5a1 1 0 010 1.414l-4.5 4.5a1 1 0 01-1.414-1.414l2.366-2.367a.25.25 0 00-.177-.424H6a1 1 0 010-2h8.482a.25.25 0 00.177-.427l-2.366-2.368a1 1 0 011.414-1.414z"
                fill="currentColor"
                fillRule="nonzero"
              />
            </svg>
          </a>
        </h3>
        {sub_text ? Parser(sub_text) : ''}
      </div>
    </article>
  );
}

export default FrameworkButton;
