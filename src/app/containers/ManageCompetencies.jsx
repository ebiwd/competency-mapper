import React from 'react';
import { Link } from 'react-router-dom';

import InlineEdit from '../../shared/components/edit-inline/EditInline';
import SimpleForm from '../containers/simple-form/SimpleForm';

import { withSnackbar } from 'notistack';
import CompetencyService from '../services/competency/competency';
import ActiveRequestsService from '../services/active-requests/active-requests';

class ManageCompetencies extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();

  state = {
    framework: '',
    frameworkName: '',
    frameworkData: [],
    competencyTypes: [],
    loadingError: false
  };

  static getDerivedStateFromProps(props, state) {
    const { framework } = props.match.params;
    if (framework !== state.framework) {
      return {
        framework,
        frameworkData: [],
        loadingError: false
      };
    }

    // No state update necessary
    return null;
  }

  async componentDidMount() {
    const { framework, domainId } = this.props.match.params;
    await this.fetchFramework(framework);

    if (domainId) {
      setTimeout(() => {
        const ref = this.refs[domainId];
        if (ref) {
          ref.scrollIntoView();
        }
      }, 100);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { framework, frameworkData, loadingError } = this.state;
    if (framework !== prevState.framework) {
      if (frameworkData.length === 0 && !loadingError) {
        this.fetchFramework(framework);
      }
    }
  }

  async fetchFramework(framework) {
    try {
      this.activeRequests.startRequest();
      const frameworkData = await this.competencyService.getFramework(
        framework
      );

      if (frameworkData.length) {
        const competencyTypes = frameworkData[0].domains.map(domain => ({
          description: domain.title,
          uuid: domain.uuid
        }));
        this.setState({
          frameworkName: frameworkData[0].title,
          frameworkData,
          competencyTypes
        });
      }
    } catch (e) {
      this.setState({ loadingError: true });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  createCompetency = async (description, domainUuid) => {
    const { framework, frameworkData } = this.state;

    try {
      this.activeRequests.startRequest();
      const domainId = frameworkData[0].domains.find(
        domain => domain.uuid === domainUuid
      ).nid;
      await this.competencyService.createCompetency({
        description,
        domainId,
        domainUuid
      });
      this.fetchFramework(framework);
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }
  };

  async editCompetency(cid, title) {
    try {
      this.activeRequests.startRequest();
      await this.competencyService.patchCompetency(cid, 'title', title);
      const { framework } = this.state;
      this.fetchFramework(framework);
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  async toggleArchive(cid, isArchived) {
    try {
      this.activeRequests.startRequest();
      const archive = isArchived ? false : true;
      await this.competencyService.patchCompetency(
        cid,
        'field_archived',
        archive
      );
      const { framework } = this.state;
      this.fetchFramework(framework);
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  getCompetencyList() {
    const { frameworkData } = this.state;
    return frameworkData[0].domains.map((domain, parentIndex) => (
      <React.Fragment key={domain.nid}>
        <tr
          className="secondary-background-important white-color"
          ref={domain.nid}
        >
          <td>{parentIndex + 1}</td>
          <td>
            <h4>{domain.title}</h4>
          </td>
          <td className="small-1">Archive</td>
          <td>Manage attributes</td>
        </tr>
        {this.getCompetencyRows(domain.competencies, parentIndex)}
      </React.Fragment>
    ));
  }

  getCompetencyRows(competencies, parentIndex) {
    const { framework } = this.state;
    return competencies.map((competency, index) => (
      <tr key={competency.id}>
        <td>
          {parentIndex + 1}.{index + 1}
        </td>
        <td>
          <InlineEdit
            text={competency.title}
            change={newValue => this.editCompetency(competency.id, newValue)}
          />
        </td>
        <td>
          <button
            className="cursor"
            onClick={this.toggleArchive.bind(
              this,
              competency.id,
              competency.archived
            )}
          >
            {competency.archived === 1 ? (
              <span className="fas fa-toggle-on">
                <span>Archived</span>
              </span>
            ) : (
              <span className="fas fa-toggle-off" />
            )}
          </button>
        </td>
        <td>
          <Link
            to={`/framework/${framework}/manage/competencies/${
              competency.id
            }/manage-attributes`}
          >
            <i className="fas fa-sitemap" />
          </Link>
        </td>
      </tr>
    ));
  }

  render() {
    const {
      frameworkName,
      frameworkData,
      competencyTypes,
      loadingError
    } = this.state;

    if (loadingError) {
      return (
        <div className="margin-top-large callout alert">
          Sorry, there was a problem when fetching the data!
        </div>
      );
    }

    if (frameworkData.length === 0) {
      return null;
    }

    return (
      <div className="row">
        <h2>Manage framework</h2>
        <h4>{frameworkName}</h4>

        <SimpleForm
          title="Create new competency"
          placeholder="Competency description"
          options={competencyTypes}
          onCreate={this.createCompetency}
        />

        <table>
          <tbody>{this.getCompetencyList()}</tbody>
        </table>
      </div>
    );
  }
}

export default withSnackbar(ManageCompetencies);
