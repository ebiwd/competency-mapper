import React from 'react';
import { Link } from 'react-router-dom';

import InlineEdit from '../../shared/components/edit-inline/EditInline';
import ErrorLoading from '../components/error-loading/ErrorLoading';

import { withSnackbar } from 'notistack';
import CompetencyService from '../services/competency/competency';
import ActiveRequestsService from '../services/active-requests/active-requests';

import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';

var placeholder = document.createElement('li');
placeholder.className = 'placeholder';

class ManageAttribute extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();
  constructor(props) {
    super(props);
    this.state = {
      loadingError: false,
      editable: false,
      showModal: false,
      parentID: '',
      parentTitle: '',
      showAttributeModal: '',
      attributeType: '',
      attributeTypeTitle: '',
      newAttributes: '',
      competency: [],
      typetitle: ''
    };
    this.handleOpenAttributeModal = this.handleOpenAttributeModal.bind(this);
    this.handleCloseAttributeModal = this.handleCloseAttributeModal.bind(this);
    this.OpenModalPosition = this.OpenModalPosition.bind(this);
    this.closeModalPosition = this.closeModalPosition.bind(this);
    //this.archiveAttribute = this.archiveAttribute.bind(this);
  }

  OpenModalPosition(e, competency) {
    this.setState({ showModalPosition: true });
    this.setState({ competency: competency });
    this.setState({ typetitle: e.target.dataset.typetitle });
    console.log(e.target.dataset.typetitle);
  }

  closeModalPosition() {
    this.setState({ showModalPosition: false });
  }

  handleOpenAttributeModal(e) {
    this.setState({ showAttributeModal: true });
    this.setState({ parentID: e.target.dataset.competencyid });
    this.setState({ parentTitle: e.target.dataset.competencytitle });
    this.setState({ attributeType: e.target.dataset.attributetype });
    this.setState({ attributeTypeTitle: e.target.dataset.typetitle });

    e.preventDefault();
  }

  handleCloseAttributeModal() {
    this.setState({ showAttributeModal: false });
  }

  async editAttribute(aid, title) {
    const { framework, loadData } = this.props;
    try {
      this.activeRequests.startRequest();
      await this.competencyService.patchCompetency(aid, 'title', title);
      await loadData(framework);
      this.props.enqueueSnackbar('Attribute updated', {
        variant: 'success'
      });
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
    }
  }

  setAttributes(e) {
    this.setState({ newAttributes: e.target.value });
    console.log(e.target.value);
  }

  async saveAttributes(e) {
    const { frameworkData, framework, loadData } = this.props;
    const { newAttributes, attributeType, parentID } = this.state;

    let versionID = frameworkData[0].version_id;
    let newData = newAttributes;
    let type = 'attribute';
    let addtional = attributeType;
    let response = '';
    try {
      //this.activeRequests.startRequest();
      response = this.competencyService.createBulkData(
        parentID,
        versionID,
        newData,
        type,
        addtional
      );
      console.log(response);
      loadData(framework);
      this.props.enqueueSnackbar('Attributes created', {
        variant: 'success'
      });
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      //this.activeRequests.finishRequest();
    }
    e.preventDefault();
    this.handleCloseAttributeModal();
  }

  async archiveAttribute(attribute, isArchived) {
    const { framework, loadData } = this.props;

    try {
      //this.activeRequests.startRequest();
      await this.competencyService.toggleArchivingVersionedNode(
        framework,
        attribute
      );
      loadData(framework);
      this.props.enqueueSnackbar('Attribute status updated', {
        variant: 'success'
      });
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      //this.activeRequests.finishRequest();
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
    //var data = this.props.frameworkData[0].domains;
    var data = this.state.competency.attributes;
    var from = Number(this.dragged.dataset.position);
    var to = Number(this.over.dataset.position);
    if (from < to) to--;
    data.splice(to, 0, data.splice(from, 1)[0]);
    this.setState({ sorting: data });
    console.log(data.map(d => d.id));
  }
  dragOver(e) {
    e.preventDefault();
    this.dragged.style.display = 'none';
    if (e.target.className === 'placeholder') return;
    this.over = e.target;
    e.target.parentNode.insertBefore(placeholder, e.target);
  }

  saveSorting = async data => {
    const { framework, frameworkData } = this.props;
    const { sorting } = this.state;
    let items = sorting.map(d => d.id);
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

  getAttributes(frameworkDef, frameworkData, competency, domain, editableFrm) {
    return frameworkDef.map(def => (
      <div className="row">
        <div className="column medium-12">
          <li className="attribute_type">
            <em>{def.title}</em>
            <span style={{ display: 'flex' }}>
              {editableFrm === true ? (
                <button
                  className="ch_link addButton icon icon-common icon-plus-circle icon-custom "
                  data-competencyid={competency.id}
                  data-competencytitle={competency.title}
                  data-typetitle={def.title}
                  data-attributetype={def.id}
                  title="Add attributes"
                  onClick={e => this.handleOpenAttributeModal(e)}
                >
                  Add {def.title}{' '}
                </button>
              ) : (
                ''
              )}
            </span>

            <ul>
              {competency.attributes.map(attr => {
                if (attr.type === def.title)
                  return (
                    <li
                      key={attr.id}
                      className={attr.archived === '1' ? 'strikeout' : ''}
                    >
                      <div className="attribute_title">
                        <InlineEdit
                          style={{ display: 'inline' }}
                          text={attr.title}
                          change={newValue =>
                            this.editAttribute(attr.id, newValue)
                          }
                          editable={
                            attr.archived === '1' || editableFrm === false
                              ? false
                              : true
                          }
                        />
                        {editableFrm === true ? (
                          <>
                            <span className="edit-indicator">
                              <button
                                className="ch_link"
                                onClick={() =>
                                  this.archiveAttribute(attr.id, attr.archived)
                                }
                              >
                                {attr.archived === '1' ? (
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
                            <span className="edit-indicator">
                              <button
                                className="ch_link addButton icon icon-common icon-sort"
                                title="Change order"
                                data-typetitle={def.title}
                                onClick={e =>
                                  this.OpenModalPosition(e, competency)
                                }
                              >
                                Change order{' '}
                              </button>
                            </span>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    </li>
                  );
              })}
            </ul>

            <hr />
          </li>
        </div>
        {/*<div className="column medium-4" style={{ display: 'flex' }}>
          <button
            className="addButton"
            data-competencyid={competency.id}
            data-competencytitle={competency.title}
            data-typetitle={def.title}
            data-attributetype={def.id}
            title="Add attributes"
            onClick={e => this.handleOpenAttributeModal(e)}
          >
            Add {def.title} <i className="icon icon-common icon-plus-circle" />
          </button>
          <button
            className="addButton"
            title="Change order"
            data-typetitle={def.title}
            onClick={e => this.OpenModalPosition(e, competency)}
          >
            Change order <i className="icon icon-common icon-sort" />
          </button>
            </div>*/}
      </div>
    ));
  }

  render() {
    const {
      frameworkDef,
      frameworkData,
      competency,
      domain,
      editableFrm
    } = this.props;
    const {
      parentID,
      parentTitle,
      attributeType,
      attributeTypeTitle
    } = this.state;
    return (
      <div>
        {this.getAttributes(
          frameworkDef,
          frameworkData,
          competency,
          domain,
          editableFrm
        )}
        {/* Modal for adding attributes */}
        <Modal
          open={this.state.showAttributeModal}
          onClose={this.handleCloseAttributeModal}
          center
          classNames={{
            overlay: 'customOverlay',
            modal: 'customModal'
          }}
        >
          <h3>Add {attributeTypeTitle} attributes</h3>
          <h4>{parentTitle} </h4>
          <h5>Please enter one {attributeTypeTitle} attribute per line</h5>
          <form className="vf-form">
            <textarea
              id="attribute_txt"
              rows="5"
              onChange={e => this.setAttributes(e)}
              required
              className="vf-form__input"
            />
            <button
              className="vf-button vf-button--primary vf-button--sm"
              onClick={e => this.saveAttributes(e)}
            >
              Save
            </button>
          </form>
        </Modal>

        {/* Modal for sorting attribute positions */}

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
          {this.state.competency.id ? (
            <>
              <h4>{this.state.competency.title}</h4>
              <ul onDragOver={this.dragOver.bind(this)}>
                {this.state.competency.attributes.map((attribute, i) => {
                  if (attribute.type === this.state.typetitle) {
                    return (
                      <li
                        style={{ listStyleType: 'none' }}
                        data-position={i}
                        key={attribute.position}
                        draggable="true"
                        onDragEnd={this.dragEnd.bind(this)}
                        onDragStart={this.dragStart.bind(this)}
                      >
                        <i class="icon icon-common icon-move" />{' '}
                        {attribute.title}
                      </li>
                    );
                  }
                })}
              </ul>
            </>
          ) : (
            ''
          )}

          <button
            className="vf-button vf-button--primary vf-button--sm"
            onClick={this.saveSorting}
          >
            Save
          </button>
        </Modal>
      </div>
    );
  }
}

export default withSnackbar(ManageAttribute);
