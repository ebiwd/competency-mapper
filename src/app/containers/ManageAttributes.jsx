import React from 'react';
import { Link } from 'react-router-dom';

import InlineEdit from '../../shared/components/edit-inline/EditInline';
import SimpleForm from '../containers/simple-form/SimpleForm';
import ErrorLoading from '../components/error-loading/ErrorLoading';

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
    attributeTypes: [], // defined at framework level

    // domain level
    domainId: '',
    domainName: '',

    // competency level
    competencyId: this.props.match.params.cid,
    competencyUuid: '',
    competencyName: '',
    competencyData: [],

    loadingError: false,
    editable: true
  };

  componentDidMount() {
    window.scroll(0, 0);
    this.fetchAllFrameworks();
    this.fetchCompetency();
  }

  async fetchAllFrameworks() {
    const { framework } = this.state;
    try {
      this.activeRequests.startRequest();
      const allFrameworks = await this.competencyService.getAllFrameworks();
      const frameworkMatch = allFrameworks.filter(
        item => item.name.toLowerCase() === framework
      );

      if (frameworkMatch.length) {
        const attributeTypes = frameworkMatch[0].attribute_types.map(
          attribute => ({ description: attribute.title, uuid: attribute.uuid })
        );
        this.setState({ attributeTypes });
      }
    } catch (error) {
      this.setState({ loadingError: true });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  async fetchCompetency() {
    const { framework } = this.state;

    try {
      this.activeRequests.startRequest();
      const frameworkData = await this.competencyService.getFramework(
        framework
      );
      const competencyMatch = this.filterByCompetencyId(
        frameworkData,
        this.state.competencyId
      );

      if (competencyMatch.length) {
        this.setState({
          frameworkName: frameworkData[0].title,
          domainName: competencyMatch[0].domainTitle,
          domainId: competencyMatch[0].domainId,
          competencyUuid: competencyMatch[0].uuid,
          competencyName: competencyMatch[0].title,
          competencyData: competencyMatch[0]
        });
      }
    } catch (error) {
      this.setState({ loadingError: true });
    } finally {
      this.activeRequests.finishRequest();
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

  createAttribute = async (description, attributeTypeUuid) => {
    const { competencyId, competencyUuid, attributeTypes } = this.state;

    try {
      this.activeRequests.startRequest();
      const attributeTypeId = attributeTypes.find(
        attribute => attribute.uuid === attributeTypeUuid
      ).id;
      await this.competencyService.createAttribute({
        description,
        competencyId,
        competencyUuid,
        attributeTypeId,
        attributeTypeUuid
      });

      this.fetchCompetency();
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
      this.fetchCompetency();
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
      this.fetchCompetency();
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
      .map((attribute, index) => {
        return (
          <tr key={attribute.uuid}>
            <td>
              <InlineEdit
                text={attribute.title}
                change={newValue => this.editAttribute(attribute.id, newValue)}
                editable={editable}
              />
            </td>
            {editable && (
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
            )}
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
        </tr>
        {this.getAttributeRows(attributeType)}
      </React.Fragment>
    ));
  }

  render() {
    const {
      framework,
      frameworkName,
      attributeTypes,
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
          <span className="tag">draft</span>
          <span className="tag secondary-background">editable</span>
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
      </div>
    );
  }
}

export default withSnackbar(ManageAttributes);
