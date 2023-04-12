import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MetaTags from 'react-meta-tags';
import { Helmet } from 'react-helmet';

const About = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <>
        <MetaTags>
          <title>About competency hub</title>
          <meta property="og:title" content="About competency hub" />
          <meta property="og:type" content="website" />
          <meta
            property="og:url"
            content={`https://competency.ebi.ac.uk/about`}
          />
          <meta
            property="og:image"
            content="https://acxngcvroo.cloudimg.io/v7/https://cms.competency.ebi.ac.uk/themes/custom/ebi_academy/images/mastheads/CH_Jigsaw.jpg"
          />
          <meta
            property="og:description"
            content="The Competency Hub is a repository of competency frameworks that define the abilities required by professionals in a specific field and relate them to training resources and career profiles"
          />
          <meta
            name="description"
            content="The Competency Hub is a repository of competency frameworks that define the abilities required by professionals in a specific field and relate them to training resources and career profiles"
          />
          <meta
            property="keywords"
            content="competency, life sciences, career development, computational biology, bioinformatics"
          />
        </MetaTags>
        <Helmet>
          <link rel="canonical" href="https://www.competency.ebi.ac.uk/about" />
        </Helmet>
      </>
      <h2>About the Competency Hub</h2>
      <h3>Competency</h3>
      <p>
        A competency is an observable ability of any professional. A competency
        can be defined as a combination of knowledge, skills and attitudes. It
        is observable, so its acquisition can be validated objectively.
      </p>

      <h3>Competency framework</h3>
      <p>
        A competency framework defines a core set of competencies required by
        professionals working in a specific field.
      </p>

      <p>
        A competency framework can specify which competencies are especially
        relevant for professionals in different roles or at different career
        stages.
      </p>

      <h3>Competency Hub</h3>
      <p className="lead">
        The Competency Hub is a repository of competency frameworks that define
        the abilities required by professionals in a specific field and relate
        them to training resources and career profiles, so that you can:
      </p>
      <ul>
        <li>
          Assess your competency abilities against a professional standard and
          check example career profiles
        </li>
        <li>
          Find training resources to develop specific competencies and progress
          in your career
        </li>
        <li>
          Design training courses and programmes that help learners develop
          specific competencies
        </li>
      </ul>

      <h3>Career profiles</h3>
      <p>
        In this section, you will find a series of career profiles, which are
        example descriptions of professional roles.
      </p>
      <p>Each profile shows:</p>
      <ul>
        <li>
          The level at which each competency is required to fulfil that role
        </li>
        <li>Qualifications and background</li>
        <li>Activities of the role</li>
      </ul>

      <p>
        You can create your own profile by assessing yourself against the list
        of competencies, and then compare your profile to the existing ones.
        This allows you to see which competencies you need to develop further to
        perform that role.
      </p>

      <p>The profile that you create is saved on your own browser.</p>

      <p>
        Not all the competency frameworks on the site contain career profiles.
      </p>

      <h3>Find training resources</h3>
      <p>
        Training resources are linked to the competencies that they support
        trainees to gain. You can find this information on:
      </p>
      <ul>
        <li>
          The page for each training resource, which shows a list of related
          competencies
        </li>
        <li>
          The page for each competency, which shows a list of related training
          resources
        </li>
      </ul>

      <p>
        Not all the competency frameworks on the site contain training
        resources.
      </p>

      <h3>Develop courses</h3>
      <p>
        <Link to="/develop-your-courses">Develop your courses</Link> using the
        Competency Hub to design competency-based courses and course programmes.
      </p>

      <h3>Additional documentation</h3>
      <p>
        The following are documents that explain how some of the competency
        frameworks on this site have been developed and used:{' '}
      </p>
      <ul>
        <li>
          <a href="https://zenodo.org/record/5418103#.YhiW3ZPP30o">
            Guidelines for developing and updating short courses and course
            programs using the ISCB competency framework
          </a>
        </li>
        <li>
          <a href="https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1005772">
            The development and application of bioinformatics core competencies
            to improve bioinformatics training and education
          </a>
        </li>
        <li>
          <a href="https://zenodo.org/record/4623713#.YiCrSxPP30o">
            Professionalising data stewardship in the Netherlands. Competences,
            training and education. Dutch roadmap towards national
            implementation of FAIR data stewardship
          </a>
        </li>
        <li>
          <a href="https://zenodo.org/record/264231#.YiCtoxPP30o">
            BioExcel Deliverable 4.2 - Competency framework, mapping to current
            training & initial training plan
          </a>
        </li>
        <li>
          <a href="https://zenodo.org/record/4301475#.YiCtzxPP30o">
            BioExcel-2 Deliverable D4.2 - Training Plan
          </a>
        </li>
      </ul>
    </>
  );
};

export default About;
