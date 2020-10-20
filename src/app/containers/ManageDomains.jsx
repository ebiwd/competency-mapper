import React from 'react';
import InlineEdit from '../../shared/components/edit-inline/EditInline';

import { withSnackbar } from 'notistack';
import CompetencyService from '../services/competency/competency';
import ActiveRequestsService from '../services/active-requests/active-requests';

import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import ManageCompetency from './ManageCompetency';

var placeholder = document.createElement('li');
placeholder.className = 'placeholder';

class ManageDomains extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();
  constructor(props) {
    super(props);
    this.state = {
      loadingError: false,
      editable: false,
      showModal: false,
      newDomains: '',
      showModalCompetency: false,
      newCompetencies: [{ competency: '', mapping: '' }],
      parentID: '',
      parentTitle: '',
      sorting: []
    };

    this.archiveDomain = this.archiveDomain.bind(this);
    this.OpenModalCompetency = this.OpenModalCompetency.bind(this);
    this.closeModalCompetency = this.closeModalCompetency.bind(this);

    this.handleRemoveCompetencies = this.handleRemoveCompetencies.bind(this);
    this.setCompetencies = this.setCompetencies.bind(this);

    this.OpenModalPosition = this.OpenModalPosition.bind(this);
    this.closeModalPosition = this.closeModalPosition.bind(this);
  }

  handleOpenModal() {
    this.setState({ showModal: true });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  OpenModalPosition(e) {
    this.setState({ showModalPosition: true });
    console.log('change positions');
  }

  closeModalPosition() {
    this.setState({ showModalPosition: false });
  }

  OpenModalCompetency(e) {
    this.setState({ parentID: e.target.dataset.domainid });
    this.setState({ parentTitle: e.target.dataset.domaintitle });
    this.setState({ showModalCompetency: true });
  }

  closeModalCompetency() {
    this.setState({ showModalCompetency: false });
  }

  handleAddMoreCompetencies(e) {
    this.setState({
      newCompetencies: [
        ...this.state.newCompetencies,
        { competency: '', mapping: '' }
      ]
    });
    e.preventDefault();
  }

  handleRemoveCompetencies(e, index) {
    this.state.newCompetencies.splice(index, 1);
    this.setState({ newCompetencies: this.state.newCompetencies });
    e.preventDefault();
  }

  setCompetencies(e, index, type) {
    let newData = this.state.newCompetencies;
    if (type === 'competency') {
      newData[index].competency = e.target.value;
    } else {
      newData[index].mapping = e.target.value;
    }
    this.setState({ newCompetencies: newData });
  }

  async saveCompetencies(e) {
    const { framework, frameworkData } = this.props;
    const { newCompetencies, parentID } = this.state;

    let versionID = frameworkData[0].version_id;
    let newData = newCompetencies;
    let type = 'competency';
    let addtional = '';
    e.preventDefault();

    console.log(this.state.newCompetencies);

    try {
      this.activeRequests.startRequest();
      await this.competencyService.createBulkData(
        parentID,
        versionID,
        newData,
        type,
        addtional
      );
      await this.props.loadData(framework);
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
      this.props.enqueueSnackbar('Competencies added successfully', {
        variant: 'success'
      });
    }
    this.setState({ newCompetencies: [{ competency: '', mapping: '' }] });
    this.closeModalCompetency();
  }

  async editDomain(domain, title) {
    const { framework } = this.props;
    try {
      this.activeRequests.startRequest();
      await this.competencyService.patchDomain(domain, 'title', title);
      await this.props.loadData(framework);
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
      this.props.enqueueSnackbar('Domain updated', {
        variant: 'success'
      });
    }
  }

  async archiveDomain(domain, isArchived) {
    const { framework } = this.props;
    try {
      //this.activeRequests.startRequest();
      await this.competencyService.toggleArchivingVersionedNode(
        framework,
        domain
      );
      this.props.loadData(framework);
      console.log('all good gg');
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      //this.activeRequests.finishRequest();
      this.props.enqueueSnackbar('Domain updated', {
        variant: 'success'
      });
    }
  }

  dragStart(e) {
    this.dragged = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.dragged);
  }
  dragEnd(e) {
    this.dragged.style.display = 'block';
    this.dragged.parentNode.removeChild(placeholder);
    console.log(this.dragged.parentNode);
    //update state and call api for PATCH request
    var data = this.props.frameworkData[0].domains;
    var from = Number(this.dragged.dataset.position);
    var to = Number(this.over.dataset.position);
    if (from < to) to--;
    data.splice(to, 0, data.splice(from, 1)[0]);
    this.setState({ sorting: data });
    console.log(data.map(d => d.nid));
  }
  dragOver(e) {
    e.preventDefault();
    this.dragged.style.display = 'none';
    if (e.target.className === 'placeholder') return;
    this.over = e.target;
    e.target.parentNode.insertBefore(placeholder, e.target);
  }

  saveSorting = async data => {
    const { framework } = this.props;
    const { sorting } = this.state;
    let items = sorting.map(d => d.nid);
    try {
      this.activeRequests.startRequest();
      await this.competencyService.saveSorting(items);
      await this.props.loadData(framework);
      this.props.enqueueSnackbar('Items updated', {
        variant: 'success'
      });
    } catch {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.setState({ sorting: undefined });
      this.closeModalPosition();
      //window.location.reload()
      this.activeRequests.finishRequest();
    }
  };

  render() {
    const {
      framework,
      frameworkData,
      frameworkDef,
      loadData,
      editableFrm
    } = this.props;
    const domains = frameworkData.map(item =>
      item.domains.map((domain, index) => (
        <li
          key={'li_' + index}
          id={domain.nid}
          className={domain.archived === '1' ? 'strikeout' : ''}
          style={{ listStyleType: 'none' }}
        >
          <div key={'div1_' + domain.nid} className="row domain_title">
            <hr />
            <div key={'div2_' + domain.nid} className="column medium-12">
              <h2 key={'h4_' + domain.nid}>
                <InlineEdit
                  style={{ display: 'inline' }}
                  text={domain.title}
                  change={newValue => this.editDomain(domain.nid, newValue)}
                  editable={
                    domain.archived === '1' || editableFrm === false
                      ? false
                      : true
                  }
                  key={'inline_edit_' + domain.nid}
                />
                {editableFrm !== false ? (
                  <>
                    <span key={'span_' + domain.nid} className="edit-indicator">
                      <button
                        key={domain.nid}
                        className="cursor"
                        onClick={() =>
                          this.archiveDomain(domain.nid, domain.archived)
                        }
                      >
                        {domain.archived === '1' ? (
                          <span className="fas fa-toggle-on icon-left-spacer">
                            <span>Archived</span>
                          </span>
                        ) : (
                          <span className="fas fa-toggle-off icon-left-spacer">
                            {' '}
                            <span> Archive</span>
                          </span>
                        )}
                      </button>
                    </span>
                    <span key={'span_' + domain.nid} className="edit-indicator">
                      <button
                        className="addButton"
                        onClick={this.OpenModalPosition}
                      >
                        {' '}
                        <i className="icon icon-common icon-sort icon-left-spacer" />{' '}
                        Change order{' '}
                      </button>
                    </span>
                    {domain.archived !== '1' ? (
                      <span
                        key={'span_' + domain.nid}
                        className="edit-indicator"
                      >
                        <button
                          className="addButton"
                          href="#"
                          data-domainid={domain.nid}
                          data-domaintitle={domain.title}
                          onClick={e => this.OpenModalCompetency(e)}
                        >
                          <i className="icon icon-common icon-plus-circle icon-left-spacer" />{' '}
                          Add competencies{' '}
                        </button>
                      </span>
                    ) : (
                      ''
                    )}
                  </>
                ) : (
                  ''
                )}
              </h2>
            </div>
          </div>
          <div key={'p_' + domain.nid}>
            <ManageCompetency
              framework={framework}
              frameworkData={frameworkData}
              frameworkDef={frameworkDef}
              loadData={loadData}
              domain={domain}
              editableFrm={editableFrm}
            />
          </div>
        </li>
      ))
    );

    return (
      <div key={'domains_list'}>
        {domains[0].length > 0 ? (
          <>
            <ul key={'ul_' + domains.count}>{domains}</ul>{' '}
            {console.log(domains)}{' '}
          </>
        ) : (
          <>
            <p className="callout">
              No data found. You may start by adding domains.
            </p>{' '}
            {console.log(domains)}
          </>
        )}

        {/* Modal for competencies */}

        <Modal
          open={this.state.showModalCompetency}
          onClose={this.closeModalCompetency}
          center
          classNames={{
            overlay: 'customOverlay',
            modal: 'customModal'
          }}
        >
          <h2>{this.state.parentTitle}</h2>
          <h3>Add competencies(s) </h3>

          <form onSubmit={e => this.saveCompetencies(e)}>
            {this.state.newCompetencies.map((item, index) => (
              <div key={'competency_' + index} className="row callout">
                <div className="column medium-9">
                  Competency
                  <input
                    key={index}
                    type="text"
                    onChange={e => this.setCompetencies(e, index, 'competency')}
                    value={item.competency}
                    required
                  />
                  This competency maps to:
                  <input
                    key={'mapsto_' + index}
                    type="text"
                    onChange={e => this.setCompetencies(e, index, 'mapping')}
                    value={item.mapping}
                  />
                </div>
                <div className="column medium-3" style={{ paddingTop: '1%' }}>
                  {index > 0 ? (
                    <button
                      className="button small"
                      onClick={e => this.handleRemoveCompetencies(e, index)}
                    >
                      <i className="icon icon-common icon-close" />{' '}
                    </button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ))}

            <div className="row">
              <div className="column medium-10">
                <button
                  className="button small"
                  onClick={e => this.handleAddMoreCompetencies(e)}
                >
                  <i className="icon icon-common icon-plus-circle" /> Add more
                </button>
              </div>
            </div>
            <input type="submit" className="button" value="Save" />
          </form>
        </Modal>

        {/* Modal for sorting domain positions */}

        <Modal
          open={this.state.showModalPosition}
          onClose={this.closeModalPosition}
          center
          classNames={{
            overlay: 'customOverlay',
            modal: 'customModal'
          }}
        >
          <h3>Change order</h3>
          <p>Please drag and drop items to change order</p>

          <ul onDragOver={this.dragOver.bind(this)}>
            {frameworkData.map(item =>
              item.domains.map((domain, i) => {
                return (
                  <li
                    style={{ listStyleType: 'none' }}
                    data-position={i}
                    key={item.position}
                    draggable="true"
                    onDragEnd={this.dragEnd.bind(this)}
                    onDragStart={this.dragStart.bind(this)}
                  >
                    <i className="icon icon-common icon-move" /> {domain.title}
                  </li>
                );
              })
            )}
          </ul>
          <button className="button primary" onClick={this.saveSorting}>
            Save
          </button>
        </Modal>
      </div>
    );
  }
}

export default withSnackbar(ManageDomains);
