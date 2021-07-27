import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Breadcrumbs = () => {
  let location = useLocation();
  let pathname = location.pathname;
  let URL = pathname.split('/');
  let frameworkName = URL[2];
  let frameworkVersion = URL[3];

  const convertFrameworkName = name => {
    if (name === 'bioexcel') {
      return 'BioExcel';
    }

    if (name === 'corbel') {
      return 'CORBEL';
    }

    if (name === 'iscb') {
      return 'ISCB';
    }

    if (name === 'ritrain') {
      return 'RItrain';
    }

    if (name === 'cineca') {
      return 'CINECA';
    }

    if (name === 'nhs') {
      return 'NHS';
    }

    if (name === 'datasteward') {
      return 'Data steward';
    }
  };

  const getBreadcrumbs = () => {
    if (pathname.includes('compare')) {
      return (
        <>
          <li className="vf-breadcrumbs__item">
            <Link to={`/framework/${frameworkName}/${frameworkVersion}`}>
              {convertFrameworkName(frameworkName)} {frameworkVersion}
            </Link>
          </li>
          <li className="vf-breadcrumbs__item" aria-current="location">
            Compare career profiles
          </li>
        </>
      );
    } else if (pathname.includes('profile')) {
      return (
        <>
          <li className="vf-breadcrumbs__item">
            <Link to={`/framework/${frameworkName}/${frameworkVersion}`}>
              {convertFrameworkName(frameworkName)} {frameworkVersion}
            </Link>
          </li>
          <li className="vf-breadcrumbs__item" aria-current="location">
            View career profile
          </li>
        </>
      );
    } else if (pathname.includes('competency')) {
      return (
        <>
          <li className="vf-breadcrumbs__item">
            <Link to={`/framework/${frameworkName}/${frameworkVersion}`}>
              {convertFrameworkName(frameworkName)} {frameworkVersion}
            </Link>
          </li>
          <li className="vf-breadcrumbs__item" aria-current="location">
            Competency details
          </li>
        </>
      );
    } else if (pathname.includes('framework')) {
      return (
        <>
          <li className="vf-breadcrumbs__item" aria-current="location">
            {convertFrameworkName(frameworkName)} {frameworkVersion}
          </li>
        </>
      );
    } else if (pathname.includes('all-training-resources')) {
      return (
        <>
          <li className="vf-breadcrumbs__item" aria-current="location">
            Manage training resources
          </li>
        </>
      );
    } else if (pathname.includes('resource')) {
      return (
        <>
          <li className="vf-breadcrumbs__item" aria-current="location">
            Training resource
          </li>
        </>
      );
    } else if (pathname.includes('documentation')) {
      return (
        <>
          <li className="vf-breadcrumbs__item" aria-current="location">
            API documentation
          </li>
        </>
      );
    } else if (pathname.includes('about')) {
      return (
        <>
          <li className="vf-breadcrumbs__item" aria-current="location">
            About
          </li>
        </>
      );
    }
  };

  return URL[0] === '' && URL[1] === '' ? (
    <span />
  ) : (
    <nav className="vf-breadcrumbs" aria-label="Breadcrumb">
      <ul className="vf-breadcrumbs__list | vf-list vf-list--inline">
        <li className="vf-breadcrumbs__item">
          <Link to={`/`}>Home</Link>
        </li>
        {getBreadcrumbs()}
      </ul>
    </nav>
  );
};

export default Breadcrumbs;
