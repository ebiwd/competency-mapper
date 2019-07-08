import React from 'react';
import { Link } from 'react-router-dom';

import InlineEdit from '../../shared/components/edit-inline/EditInline';
import SimpleForm from '../containers/simple-form/SimpleForm';
import ErrorLoading from '../components/error-loading/ErrorLoading';
import FrameworkVersions from '../containers/framework-versions/FrameworkVersions';
import VersionControls from '../containers/version-controls/VersionControls';

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
    versions: [],
    loadingError: false,
    editable: true
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
    await Promise.all([
      this.fetchFramework(framework),
      this.fetchVersions(framework)
    ]);

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
      // const frameworkData = await this.competencyService.getFramework(
      //   framework
      // );

      const frameworkData = await this.competencyService.getVersionedDraftFramework(
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
    } catch (error) {
      this.setState({ loadingError: true });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  async fetchVersions(framework) {
    const allFrameworks = await this.competencyService.getAllVersionedFrameworks();
    const currentFramework = allFrameworks.filter(
      fw => fw.title.toLowerCase() === framework
    );
    if (currentFramework.length > 0) {
      this.setState({ versions: currentFramework[0].versions.reverse() });
    }
  }

  createCompetency = async (description, domainUuid, mapping) => {
    const { framework, frameworkData, versions } = this.state;
    const draftVersion = versions.filter(version => version.number === 'draft');

    try {
      this.activeRequests.startRequest();
      const domainId = frameworkData[0].domains.find(
        domain => domain.uuid === domainUuid
      ).nid;
      const draftId = draftVersion[0].id;
      const draftUuid = draftVersion[0].uuid;
      await this.competencyService.createCompetency({
        description,
        domainId,
        domainUuid,
        mapping,
        draftId,
        draftUuid
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
    const { framework } = this.state;
    try {
      this.activeRequests.startRequest();
      // const archive = isArchived ? false : true;
      // await this.competencyService.patchCompetency(
      //   cid,
      //   'field_archived',
      //   archive
      // );
      await this.competencyService.toggleArchivingVersionedNode(framework, cid);
      this.fetchFramework(framework);
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  releaseNewVersion = async (version, notes) => {
    const { framework } = this.state;
    try {
      this.activeRequests.startRequest();
      await this.competencyService.publishFramework(framework, version, notes);
      await this.competencyService.createDraftFramework(framework);
      this.props.history.push(`/framework/${framework}/${version}`);
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }
  };

  getCompetencyList() {
    const { frameworkData, editable } = this.state;
    return frameworkData[0].domains.map(domain => (
      <React.Fragment key={domain.nid}>
        <tr
          className="secondary-background-important white-color"
          ref={domain.nid}
        >
          <td>
            <h4>{domain.title}</h4>
          </td>
          {editable && <td className="small-1">Archive</td>}
          <td>Attributes</td>
        </tr>
        {this.getCompetencyRows(domain.competencies)}
      </React.Fragment>
    ));
  }

  getCompetencyRows(competencies) {
    const { framework, editable } = this.state;
    return competencies.map((competency, index) => (
      <tr key={competency.id}>
        <td className={competency.archived === '1' ? 'strikeout' : ''}>
          <InlineEdit
            text={competency.title}
            change={newValue => this.editCompetency(competency.id, newValue)}
            editable={competency.archived === '1' ? false : true}
          />
        </td>
        {editable && (
          <td>
            <button
              className="cursor"
              onClick={this.toggleArchive.bind(
                this,
                competency.id,
                competency.archived
              )}
            >
              {competency.archived === '1' ? (
                <span className="fas fa-toggle-on">
                  <span>Archived</span>
                </span>
              ) : (
                <span className="fas fa-toggle-off" />
              )}
            </button>
          </td>
        )}
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
      framework,
      frameworkName,
      frameworkData,
      competencyTypes,
      versions,
      loadingError,
      editable
    } = this.state;

    if (loadingError) {
      return <ErrorLoading />;
    }

    if (frameworkData.length === 0) {
      return null;
    }

    return (
      <div className="row">
        <h2>Manage framework</h2>
        <h4>{frameworkName}</h4>

        <p>
          <span className="tag">draft</span>
          <span className="tag secondary-background">editable</span>
        </p>

        <VersionControls release={this.releaseNewVersion} />

        {editable && (
          <SimpleForm
            title="Create new competency"
            placeholder="Competency description"
            options={competencyTypes}
            onCreate={this.createCompetency}
            showMappingField={true}
          />
        )}

        <table>
          <tbody>{this.getCompetencyList()}</tbody>
        </table>

        <FrameworkVersions framework={framework} versions={versions} />
      </div>
    );
  }
}

export default withSnackbar(ManageCompetencies);
