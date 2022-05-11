import React from 'react';
import EU from '../components/assets/european-union.png';
import PerMed from '../components/assets/PerMedCoE.jpg';
import BioExcel from '../components/assets/Bioexcel.png';

const Footer = () => {
  return (
    <footer className="vf-footer">
      <div className="vf-footer__inner">
        <div className="vf-grid">
          <p className="vf-footer__notice">
            The Competency Hub's web infrastructure is developed by the
            <a className="vf-footer__link" href="http://www.ebi.ac.uk/training">
              {' '}
              EMBL-EBI Training Team
            </a>{' '}
            with support from the{' '}
            <a className="vf-footer__link" href="https://bioexcel.eu/">
              BioExcel
            </a>{' '}
            and{' '}
            <a href="https://permedcoe.eu/" className="vf-footer__link">
              PerMedCoE Centres of Excellence
            </a>
            . BioExcel and PerMedCoE are funded by the{' '}
            <a
              className="vf-footer__link"
              href="https://ec.europa.eu/programmes/horizon2020/en"
            >
              {' '}
              European Union Horizon 2020 programme
            </a>{' '}
            under grant agreements 823830, 675728, 951773. Both projects are
            part of{' '}
            <a className="vf-footer__link" href="https://www.hpccoe.eu/">
              {' '}
              the EU HPC CoE Initiative
            </a>
            .
          </p>

          <figure className="vf-figure" style={{ margin: '10px' }}>
            <img
              className="vf-figure__image"
              src={EU}
              loading="lazy"
              width="120px"
              alt=""
            />
          </figure>
          <figure className="vf-figure" style={{ margin: '10px' }}>
            <img
              className="vf-figure__image"
              src={PerMed}
              loading="lazy"
              width="170px"
              alt=""
            />
          </figure>
          <figure className="vf-figure" style={{ margin: '10px' }}>
            <img
              className="vf-figure__image"
              src={BioExcel}
              loading="lazy"
              width="180px"
              style={{ backgroundColor: '#fff', padding: '7px' }}
              alt=""
            />
          </figure>
        </div>
        <p className="vf-footer__legal">
          <span className="vf-footer__legal-text">Copyright © EMBL 2022</span>
          {/*<span className="vf-footer__legal-text">*/}
          {/*  EMBL-EBI is part of the*/}
          {/*  <a className="vf-footer__link" href="//www.embl.org">*/}
          {/*    European Molecular Biology Laboratory*/}
          {/*  </a>*/}
          {/*</span>*/}
          <span className="vf-footer__legal-text">
            <a
              className="vf-footer__link"
              href="//www.ebi.ac.uk/about/terms-of-use"
            >
              Terms of use
            </a>
          </span>
        </p>
      </div>
      <div>
        <a
          className="vf-footer__link"
          href="https://www.ebi.ac.uk/data-protection/privacy-notice/competency-hub"
        >
          Privacy notice
        </a>
      </div>
      <div className="vf-u-margin__top--200" />
      <p className="vf-footer__notice">
        Contact us at competency [at] ebi.ac.uk if you have any questions,
        comments or suggestions.
      </p>
    </footer>
  );
};

export default Footer;
