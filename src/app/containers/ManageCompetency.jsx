import React from 'react';
import CKEditor from 'react-ckeditor-component';
import InlineEdit from '../../shared/components/edit-inline/EditInline';
//import ErrorLoading from '../components/error-loading/ErrorLoading';
import Parser from 'html-react-parser';
import { withSnackbar } from 'notistack';
import CompetencyService from '../services/competency/competency';
import ActiveRequestsService from '../services/active-requests/active-requests';

import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import ManageAttribute from './ManageAttribute';

import Collapsible from 'react-collapsible';

var placeholder = document.createElement('li');
placeholder.className = 'placeholder';

class ManageCompetency extends React.Component {
  activeRequests = new ActiveRequestsService();
  competencyService = new CompetencyService();
  constructor(props) {
    super(props);
    this.state = {
      loadingError: false,
      editable: false,
      domain: [],
      comp: '',
      mapping: ''
    };
    this.OpenModalPosition = this.OpenModalPosition.bind(this);
    this.closeModalPosition = this.closeModalPosition.bind(this);
    this.OpenModalMapping = this.OpenModalMapping.bind(this);
    this.CloseModalMapping = this.CloseModalMapping.bind(this);
  }

  OpenModalPosition(e, domain) {
    this.setState({ showModalPosition: true });
    this.setState({ domain: domain });
  }

  closeModalPosition() {
    this.setState({ showModalPosition: false });
  }

  OpenModalMapping(e, competency) {
    this.setState({ showModalMapping: true });
    this.setState({ comp: competency });
    this.setState({ mapping: competency.mapped_other_competency });
  }

  CloseModalMapping() {
    this.setState({ showModalMapping: false });
  }

  async editCompetency(competency, title) {
    const { framework } = this.props;
    try {
      this.activeRequests.startRequest();
      await this.competencyService.patchCompetency(competency, 'title', title);
      await this.props.loadData(framework);
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
      this.props.enqueueSnackbar('Competency updated', {
        variant: 'success'
      });
    }
  }

  async editMapping(e, competency, mapping) {
    console.log(competency);
    e.preventDefault();
    const { framework } = this.props;
    try {
      this.activeRequests.startRequest();
      await this.competencyService.patchCompetency(
        competency,
        'field_map_other_competency',
        mapping
      );
      await this.props.loadData(framework);
      this.CloseModalMapping();
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
    } finally {
      this.activeRequests.finishRequest();
      this.props.enqueueSnackbar('Record updated', {
        variant: 'success'
      });
    }
  }

  async archiveCompetency(competency, isArchived) {
    const { framework, loadData } = this.props;
    try {
      this.activeRequests.startRequest();
      await this.competencyService.toggleArchivingVersionedNode(
        framework,
        competency
      );
      loadData(framework);
      this.props.enqueueSnackbar('Competency status updated', {
        variant: 'success'
      });
    } catch (e) {
      this.props.enqueueSnackbar('Unable to perform the request', {
        variant: 'error'
      });
      console.log(e);
    } finally {
      this.activeRequests.finishRequest();
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

    //update state and call api for PATCH request
    //var data = this.props.frameworkData[0].domains;
    var data = this.state.domain.competencies;
    var from = Number(this.dragged.dataset.position);
    var to = Number(this.over.dataset.position);
    if (from < to) to--;
    data.splice(to, 0, data.splice(from, 1)[0]);
    this.setState({ sorting: data });
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

  getCompetencies(competencies) {
    const {
      frameworkData,
      domain,
      frameworkDef,
      framework,
      loadData,
      editableFrm
    } = this.props;
    return competencies.map(competency => (
      <li
        id={competency.id}
        key={competency.id}
        style={{ listStyleType: 'none' }}
      >
        <div className="row competency_title">
          <h3 className={competency.archived === '1' ? 'strikeout' : ''}>
            <InlineEdit
              style={{ display: 'inline' }}
              text={competency.title}
              change={newValue => this.editCompetency(competency.id, newValue)}
              editable={
                competency.archived === '1' || editableFrm === false
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
                      this.archiveCompetency(competency.id, competency.archived)
                    }
                  >
                    {competency.archived === '1' ? (
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
                    className="ch_link"
                    onClick={e => this.OpenModalPosition(e, domain)}
                  >
                    <span className="fas fa-sort icon-left-spacer">
                      <span>Change order</span>
                    </span>
                  </button>
                </span>
              </>
            ) : (
              ''
            )}
          </h3>
        </div>

        <Collapsible
          trigger={
            <div className="open-close-title collapsible-arrows">
              <span className="icon icon-common icon-angle-right icon-custom" />
            </div>
          }
          triggerWhenOpen={
            <div className="open-close-title collapsible-arrows">
              <span className="icon icon-common icon-angle-down icon-custom" />
            </div>
          }
        >
          <em>
            {competency.mapped_other_competency ? (
              <span>
                This competency maps to:
                {Parser(competency.mapped_other_competency)}
                <button
                  className="ch_link"
                  onClick={e => this.OpenModalMapping(e, competency)}
                >
                  <span className="fas fa-edit icon-left-spacer" />
                </button>
              </span>
            ) : (
              ''
            )}
          </em>
          <ul>
            <ManageAttribute
              framework={framework}
              frameworkData={frameworkData}
              domain={domain}
              competency={competency}
              frameworkDef={frameworkDef}
              loadData={loadData}
              editableFrm={editableFrm}
            />
          </ul>
        </Collapsible>
      </li>
    ));
  }

  render() {
    const { frameworkData, domain } = this.props;
    const competencies = frameworkData.map(item =>
      item.domains.map(item => {
        if (item.nid == domain.nid)
          return <ul>{this.getCompetencies(item.competencies)}</ul>;
      })
    );
    return (
      <>
        <div key={'domainlist'}>
          {competencies
            ? competencies
            : 'No competencies found. Add new competencies to start.'}
        </div>
        <Modal
          open={this.state.showModalMapping}
          onClose={this.CloseModalMapping}
          center
          classNames={{
            overlay: 'customOverlay',
            modal: 'customModal'
          }}
        >
          <form
            onSubmit={e =>
              this.editMapping(e, this.state.comp.id, this.state.mapping)
            }
          >
            <div className="column medium-9">
              <h3>{this.state.comp.title}</h3>
              <h4>This competency maps to:</h4>
              {console.log(this.state.comp.id)}
              <CKEditor
                key={'mapsto_'}
                content={this.state.mapping}
                events={{
                  change: e => this.setState({ mapping: e.editor.getData() }) //this.editMapping(this.state.comp.id, "This info")
                }}
                activeClass="p10"
                config={{
                  toolbarGroups: [
                    {
                      name: 'document',
                      groups: ['mode', 'document', 'doctools']
                    },
                    {
                      name: 'paragraph',
                      groups: [
                        'list',
                        'indent',
                        'blocks',
                        'align',
                        'bidi',
                        'paragraph'
                      ]
                    },
                    { name: 'links', groups: ['links'] }
                  ]
                }}
              />
              <input type="submit" className="button" value="Save" />
            </div>
          </form>
        </Modal>

        {/* Modal for sorting competency positions */}

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
          {this.state.domain.nid ? <h4>{this.state.domain.title}</h4> : ''}

          <ul onDragOver={this.dragOver.bind(this)}>
            {frameworkData.map(item =>
              item.domains.map(domain => {
                if (domain.nid === this.state.domain.nid) {
                  return domain.competencies.map((competency, i) => {
                    return (
                      <li
                        style={{ listStyleType: 'none' }}
                        data-position={i}
                        key={competency.position}
                        draggable="true"
                        onDragEnd={this.dragEnd.bind(this)}
                        onDragStart={this.dragStart.bind(this)}
                      >
                        <i class="icon icon-common icon-move" />{' '}
                        {competency.title}
                      </li>
                    );
                  });
                }
              })
            )}
          </ul>
          <button
            className="vf-button vf-button--primary vf-button--sm"
            onClick={this.saveSorting}
          >
            Save
          </button>
        </Modal>
      </>
    );
  }
}

export default withSnackbar(ManageCompetency);
