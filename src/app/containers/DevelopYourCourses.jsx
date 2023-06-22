import React, { useEffect } from 'react';

const DevelopYourCourses = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="vf-intro">
      <div />
      <div>
        <h2>Develop your courses</h2>
        <p>
          Competencies can be used to develop training or other learning
          interventions, by asking what competencies the learners need to gain.{' '}
        </p>
        <p>
          The Competency Hub can help you at different stages of the process of
          designing your training:{' '}
        </p>

        <ul>
          <li>Define your audience:</li>
          <ul>
            <li>
              Find the competency framework appropriate for your audience on our
              home page
            </li>
            <li>
              If career profiles are available, check the roles of your audience
              and the levels at which competencies are expected for those roles
            </li>
          </ul>
          <li>
            Define the competencies to cover:
            <ul>
              <li>Find the competencies that you need to focus on</li>
              <li>
                Find knowledge, skills or attitudes within the competencies that
                your learners need to achieve
              </li>
              <li>
                Use career profiles to decide the level of competence to be
                achieved in the course, depending on the audience and their goal
              </li>
            </ul>
          </li>
          <li>Develop content to cover the selected competencies</li>
          <li>
            Assessment:
            <ul>
              <li>
                Check that the target competencies at the specified level have
                been achieved{' '}
              </li>
            </ul>
          </li>
        </ul>

        <div className="vf-u-padding__top--400">
          <p>
            EMBL-EBI provides{' '}
            <a href="https://www.ebi.ac.uk/training/trainer-support">
              additional support for trainers
            </a>{' '}
            with openly accessible resources and opportunities for skills
            development.
          </p>
          <p>
            The{' '}
            <a href="https://zenodo.org/record/5418103#.YhiW3ZPP30o">
              ISCB guidelines
            </a>{' '}
            provide information on how the ISCB competency framework can be used
            to develop courses and courses programmes
          </p>
        </div>
      </div>
    </section>
  );
};

export default DevelopYourCourses;
