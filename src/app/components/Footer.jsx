import React from 'react';
import EU from '../components/assets/european-union.png';
import PerMed from '../components/assets/PerMedCoE.jpg';
import BioExcel from '../components/assets/Bioexcel.png';

const Footer = () => {
  return (
    <div>
      <div className="vf-u-margin__top--1600" />
      <hr className="vf-divider" />
      <div className="vf-u-margin__top--1600" />
      <div>
        <div className="vf-grid">
          <p>
            The Competency Hub's web infrastructure is developed by the
            <a className="vf-link" href="http://www.ebi.ac.uk/training">
              {' '}
              EMBL-EBI Training Team
            </a>{' '}
            with support from the{' '}
            <a className="vf-link" href="https://bioexcel.eu/">
              BioExcel
            </a>{' '}
            and{' '}
            <a href="https://permedcoe.eu/" className="vf-link">
              PerMedCoE Centres of Excellence
            </a>
            . BioExcel and PerMedCoE are funded by the{' '}
            <a
              className="vf-link"
              href="https://ec.europa.eu/programmes/horizon2020/en"
            >
              {' '}
              European Union Horizon 2020 programme
            </a>{' '}
            under grant agreements 823830, 675728, 951773. Both projects are
            part of{' '}
            <a className="vf-link" href="https://www.hpccoe.eu/">
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
              height={'auto'}
              alt=""
            />
          </figure>
          <figure className="vf-figure" style={{ margin: '10px' }}>
            <img
              className="vf-figure__image"
              src={PerMed}
              loading="lazy"
              width="170px"
              height={'auto'}
              alt=""
            />
          </figure>
          <figure className="vf-figure" style={{ margin: '10px' }}>
            <img
              className="vf-figure__image"
              src={BioExcel}
              loading="lazy"
              width="180px"
              height={'auto'}
              style={{ backgroundColor: '#fff', padding: '7px' }}
              alt=""
            />
          </figure>
        </div>
        <p>
          <span>
            <a
              className="vf-link"
              href="https://www.ebi.ac.uk/data-protection/privacy-notice/competency-hub"
            >
              Privacy notice for the Competency Hub
            </a>
          </span>
        </p>
      </div>

      <div className="vf-u-margin__top--200" />
      <p>
        Contact us at competency [at] ebi.ac.uk if you have any questions,
        comments or suggestions.
      </p>
      <div className="vf-u-margin__top--1600" />
    </div>
  );
};

export default Footer;
