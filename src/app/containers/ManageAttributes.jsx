import React from 'react';
import { Link } from 'react-router-dom';

import InlineEdit from '../../shared/components/edit-inline/EditInline';
import SimpleForm from '../containers/simple-form/SimpleForm';
import ErrorLoading from '../components/error-loading/ErrorLoading';
import FrameworkVersions from '../containers/framework-versions/FrameworkVersions';

import { withSnackbar } from 'notistack';
import CompetencyService from '../services/competency/competency';
import ActiveRequestsService from '../services/active-requests/active-requests';
import { safeFlat } from '../services/util/util';

class ManageAttributes extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();

  state = {
    // framework level
    framework: this.props.match.params.framework,
    frameworkName: '',
    frameworkVersion: '',
    frameworStatus: '',
    attributeTypes: [], // defined at framework level
    versions: [],

    // domain level
    domainId: '',
    domainName: '',

    // competency level
    competencyId: this.props.match.params.cid,
    competencyUuid: '',
    competencyName: '',
    competencyData: [],

    path: this.props.location.pathname.split('/'),

    loadingError: false,
    editable: false
  };

  componentDidMount() {
    window.scroll(0, 0);
    this.loadData();
  }

  async loadData(framework) {
    try {
      this.activeRequests.startRequest();
      await this.fetchVersions(framework);
      await this.fetchFramework(framework);
    } catch (error) {
      this.setState({ loadingError: true });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  async fetchVersions() {
    const { framework } = this.state;
    const allFrameworks = await this.competencyService.getAllVersionedFrameworks();
    const currentFramework = allFrameworks.filter(
      fw => fw.title.toLowerCase() === framework
    );
    if (currentFramework.length > 0) {
      const attributeTypes = currentFramework[0].attribute_types.map(
        attribute => ({ description: attribute.title, uuid: attribute.uuid })
      );
      this.setState({
        versions: currentFramework[0].versions.reverse(),
        attributeTypes
      });
    }
  }

  async fetchFramework() {
    const { framework, versions, competencyId } = this.state;
    const liveVersion = versions.filter(version => version.status === 'live');
    const draftVersion = versions.filter(version => version.status === 'draft');
    let frameworkData = [];
    let editable = false;

    if (draftVersion.length) {
      frameworkData = await this.competencyService.getVersionedDraftFramework(
        framework
      );
      editable = true;
    } else {
      if (liveVersion.length) {
        frameworkData = await this.competencyService.getVersionedFramework(
          framework,
          liveVersion[0].number
        );
      }
    }

    const competencyMatch = this.filterByCompetencyId(
      frameworkData,
      competencyId
    );

    if (competencyMatch.length) {
      this.setState({
        frameworkName: frameworkData[0].title,
        frameworkVersion: frameworkData[0].version,
        frameworkStatus: frameworkData[0].status,
        domainName: competencyMatch[0].domainTitle,
        domainId: competencyMatch[0].domainId,
        competencyUuid: competencyMatch[0].uuid,
        competencyName: competencyMatch[0].title,
        competencyData: competencyMatch[0],
        editable
      });
    }
  }

  filterByCompetencyId(data, id) {
    return safeFlat(
      data.map(item =>
        safeFlat(
          item.domains.map(domain =>
            domain.competencies
              .filter(competency => competency.id === id)
              .map(competency => {
                competency.domainTitle = domain.title;
                competency.domainId = domain.nid;
                return competency;
              })
          )
        )
      )
    );
  }

  createAttribute = async (description, attributeTypeUuid, mapping) => {
    const {
      competencyId,
      competencyUuid,
      attributeTypes,
      versions
    } = this.state;
    const draftVersion = versions.filter(version => version.number === 'draft');

    try {
      this.activeRequests.startRequest();
      const attributeTypeId = attributeTypes.find(
        attribute => attribute.uuid === attributeTypeUuid
      ).id;
      const draftId = draftVersion[0].id;
      const draftUuid = draftVersion[0].uuid;
      await this.competencyService.createAttribute({
        description,
        competencyId,
        competencyUuid,
        attributeTypeId,
        attributeTypeUuid,
        draftId,
        draftUuid
      });

      await this.fetchFramework();
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }
  };

  async editAttribute(attributeId, title) {
    try {
      this.activeRequests.startRequest();
      await this.competencyService.patchAttribute(attributeId, 'title', title);
      await this.fetchFramework();
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  async toggleArchive(attributeId, isArchived) {
    try {
      this.activeRequests.startRequest();
      await this.competencyService.patchAttribute(
        attributeId,
        'field_archived',
        isArchived === '1' ? false : true
      );
      await this.fetchFramework();
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  getAttributeRows(attributeType) {
    const { competencyData, editable } = this.state;

    return competencyData.attributes
      .filter(attribute => attribute.type === attributeType.description)
      .map(attribute => {
        if (editable) {
          return (
            <tr key={attribute.uuid}>
              <td className={attribute.archived === '1' ? 'strikeout' : ''}>
                <InlineEdit
                  text={attribute.title}
                  change={newValue =>
                    this.editAttribute(attribute.id, newValue)
                  }
                  editable={attribute.archived === '1' ? false : true}
                />
              </td>

              <td>
                <button
                  className="cursor"
                  onClick={() =>
                    this.toggleArchive(attribute.id, attribute.archived)
                  }
                >
                  {attribute.archived === '1' ? (
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
                  to={`/framework/${this.state.framework}/competency/${
                    this.state.competencyId
                  }/attribute/${attribute.id}/settings`}
                >
                  <i class="fas fa-cog" />
                </Link>
              </td>
            </tr>
          );
        }

        if (attribute.archived === '1') {
          return null;
        }
        return (
          <tr key={attribute.uuid}>
            <td className={attribute.archived === '1' ? 'strikeout' : ''}>
              <InlineEdit
                text={attribute.title}
                change={newValue => this.editAttribute(attribute.id, newValue)}
                editable={editable}
              />
            </td>
          </tr>
        );
      });
  }

  getAttributeList() {
    const { attributeTypes, editable } = this.state;
    return attributeTypes.map(attributeType => (
      <React.Fragment key={attributeType.uuid}>
        <tr className="secondary-background-important white-color">
          <td>
            <strong>
              <em>{attributeType.description}</em>
            </strong>
          </td>
          {editable && <td className="small-1">Archive</td>}
          {editable && <td className="small-1">Settings</td>}
        </tr>
        {this.getAttributeRows(attributeType)}
      </React.Fragment>
    ));
  }

  render() {
    const {
      framework,
      frameworkName,
      frameworkVersion,
      frameworkStatus,
      attributeTypes,
      versions,
      domainId,
      domainName,
      competencyName,
      competencyData,
      loadingError,
      editable
    } = this.state;

    if (loadingError) {
      return <ErrorLoading />;
    }

    if (competencyData.length === 0) {
      return null;
    }

    return (
      <div className="row">
        <h2>Manage attributes</h2>
        <h4>
          <Link to={`/framework/${framework}/manage/competencies`}>
            {frameworkName}
          </Link>
          {' / '}
          <Link to={`/framework/${framework}/manage/competencies/${domainId}`}>
            {domainName}
          </Link>
          {' / '}
          {competencyName}
        </h4>

        <p>
          <span className="tag">{frameworkVersion}</span>
          <span className="tag secondary-background">
            {frameworkStatus === '' ? 'draft' : frameworkStatus}
          </span>
        </p>

        {editable && (
          <SimpleForm
            title="Create new attribute"
            placeholder="Attribute description"
            options={attributeTypes}
            onCreate={this.createAttribute}
          />
        )}

        <table>
          <tbody>{this.getAttributeList()}</tbody>
        </table>

        <FrameworkVersions framework={framework} versions={versions} />
      </div>
    );
  }
}

export default withSnackbar(ManageAttributes);
