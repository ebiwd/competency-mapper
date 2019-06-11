import React from 'react';

const About = () => (
  <React.Fragment>
    <h2>About competency mapper</h2>
    <p className="lead">
      Competency mapper is a web-based tool to support the creation and
      management of competency frameworks for professionals working in the
      biomolecular sciences.
    </p>
    <h3>Anyone can..</h3>
    <p>
      <ul>
        <li>
          Explore the five competency frameworks that we currently have in the
          system
        </li>
        <li>
          Click on any competency to find the knowledge, skills and attitudes
          (KSAs) associated with it
        </li>
        <li>
          See the relationships between different competency frameworks; for
          example, if a competency in framework 2 is derived from one in
          framework 1, this information is captured
        </li>
        <li>
          Access a list of courses that have been mapped to a particular
          competency
        </li>
        <li>
          View summary information on each of these courses, including a link
          through to the course website
        </li>
      </ul>
    </p>
    <h3>In addition to the above, content editors can...</h3>
    <ul>
      <li>Map courses to any competency in the mapper</li>
      <li>Map courses to any combination of knowledge, skills and attitudes</li>
    </ul>
    <h3>In addition to the above, administrators can...</h3>
    <ul>
      <li>Build a completely new competency framework from a blank template</li>
      <li>Make minor updates to an existing competency framework</li>
      <li>
        If a competency framework has undergone major updates such as merging,
        splitting or deprecation of competencies, create and publish a new
        version of the framework without overwriting the previous version, and
        without losing links to pre-existing mappings
      </li>
      <li>
        Create and edit multiple personas or roles associated with a competency
        framework
      </li>
      <li>
        For each competency in an associated framework, define the level of
        competency required by any of the personas/roles associated with it,
        using an administrator-defined list of variables.
      </li>
    </ul>

    <h3>What is competency?</h3>
    <p>
      By definition, competency is an observable ability of any professional,
      integrating multiple components such as knowledge, skills, values and
      attitudes. It is observable, so its acquisition can be validated
      objectively.
    </p>
    <h4>Why is it relevant?</h4>
    <p>
      Competency provides a shared ‘currency’ applicable to learning of all
      types and at all career stages.
    </p>
    <ul>
      <li>
        Individual professionals can use competency as a career development
        tool: by documenting the competencies that you have gained, and the
        evidence that you have gained them, in a competency portfolio you can
        seek further training to fill gaps in your portfolio, or map your
        existing portfolio to roles that you might not previously have
        considered.
      </li>
      <li>
        Professional bodies and employers can use competency to define
        competency frameworks for different roles or professions. These provide
        useful guidance when hiring and promoting individuals, and can also
        provide the basis for professional recognition in regulated professions.
      </li>
      <li>
        Course providers can use competency to develop training (by asking what
        competencies their trainees need to gain) and, where appropriate, to
        assess whether training has been effective.
      </li>
    </ul>

    <h3>What is a competency framework?</h3>
    <p>
      A competency framework defines the competencies required to fulfil a
      particular role. competency frameworks are typically defined by
      professional bodies or learned societies in collaboration with employers.
      Several projects under the EU’s Horizon 2020 framework have developed
      competency frameworks to support emerging professions.
    </p>

    <h3>Who is developing the competency mapper?</h3>
    <p>
      The competency mapper is being developed by the{' '}
      <a
        href={'https://www.ebi.ac.uk/about/people/cath-brooksbank'}
        target={'_blank'}
      >
        {' '}
        EMBL-EBI training team{' '}
      </a>{' '}
      with the{' '}
      <a href={'https://bioexcel.eu/'} target={'_blank'}>
        {' '}
        BioExcel{' '}
      </a>{' '}
      competency framework as its primary use case.{' '}
    </p>
    <p>
      EMBL-EBI’s Training programme uses a competency-based approach to
      developing new courses: put simply, we ask ourselves ‘What competency or
      competencies does our audience for this course need to develop?’ before we
      create the programme and content for a new course, and before we make a
      significant update to an existing course.
    </p>
    <p>
      The team has contributed to, and helped to steer, a number of initiatives
      to develop new training programmes by defining competency requirements in
      relation to a specific target audience and building a competency framework
      for that audience. Competency-based projects that we have been involved in
      include:
    </p>
    <ul>
      <li>
        The ISCB education committee’s{' '}
        <a href={'https://europepmc.org/articles/PMC5794068'} target={'_blank'}>
          {' '}
          competency framework for bioinformatics professionals{' '}
        </a>{' '}
      </li>
      <li>
        A clinical bioinformatics competency framework to support Health
        Education England to prepare clinical practitioners for the application
        of genomics in the healthcare service
      </li>
      <li>
        The{' '}
        <a
          href={
            'https://drive.google.com/file/d/0B3BA3KSKGOoQb0hvUkx3a3lMS00/view'
          }
          target={'_blank'}
        >
          {' '}
          RItrain competency framework{' '}
        </a>{' '}
        for managers and leaders of research infrastructure
      </li>
      <li>
        The{' '}
        <a
          href={'https://zenodo.org/record/154085#.WbUNUhNSwUE'}
          target={'_blank'}
        >
          {' '}
          CORBEL competency framework{' '}
        </a>{' '}
        for technical operators of research infrastructure
      </li>
      <li>
        The{' '}
        <a
          href={'https://zenodo.org/record/264231#.WbUNoRNSwUE'}
          target={'_blank'}
        >
          {' '}
          BioExcel competency framework{' '}
        </a>
        for scientists working on biomolecular modelling and simulation
      </li>
      <p />
      <p>
        These competency frameworks were designed to be used by the training
        communities who developed them, and openly available to anyone who might
        find them useful, yet all too often they end up buried in a PDF file as
        part of a project deliverable. This made us long for a web-based tool
        that would make these frameworks,and the training associated with them,
        readily discoverable. We therefore decided to build that tool, and
        although it’s still in the early stages of development we’ve decided to
        make it openly available now so that we can seek broad input to improve
        it and make it as useful as possible to the education and training
        community at large. If you have comments or suggestions, please{' '}
        <a href={'mailto:competency@ebi.ac.uk'}> contact us </a>.
      </p>
    </ul>
  </React.Fragment>
);

export default About;
