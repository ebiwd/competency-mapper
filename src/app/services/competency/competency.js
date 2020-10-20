import HttpService from '../http/http';
import Body from './body';

class CompetencyService {
  static instance;
  http = new HttpService();

  constructor() {
    if (CompetencyService.instance) {
      return this.instance;
    }

    CompetencyService.instance = this;
  }

  async getFramework(framework) {
    const response = await this.http.get(
      `/api/v1/framework/${framework}?_format=json`
    );
    return response.data;
  }

  // TODO: change name
  async getVersionedDraftFramework(framework, version) {
    const response = await this.http.get(
      `/api/${framework}/edit?_format=json&timestamp=${Date.now()}`,
      'json'
    );
    return response.data;
  }

  // TODO: change name
  async getVersionedFramework(framework, version) {
    const response = await this.http.get(
      `/api/${framework}/${version}?_format=json&timestamp=${Date.now()}`
    );
    return response.data;
  }

  async getAllFrameworks() {
    const response = await this.http.get(`/api/v1/framework?_format=json`);
    return response.data;
  }

  // TODO: change name
  async getAllVersionedFrameworks() {
    const response = await this.http.get(
      `/api/version_manager?_format=json&timestamp=${Date.now()}`
    );
    return response.data;
  }

  async createAttribute(options) {
    const response = await this.http.post(
      `/node?_format=hal_json`,
      Body.createAttribute(options)
    );

    return response.data;
  }

  async createCompetency(options) {
    const response = await this.http.post(
      `/node?_format=hal_json`,
      Body.createCompetency(options)
    );

    return response.data;
  }

  async patchCompetency(competencyId, key, value) {
    const response = await this.http.patch(
      `/node/${competencyId}?_format=hal_json`,
      Body.mutateCompetency(key, value)
    );

    return response.data;
  }

  async patchDomain(domainId, key, value) {
    const response = await this.http.patch(
      `/node/${domainId}?_format=hal_json`,
      Body.mutateDomain(key, value)
    );

    return response.data;
  }

  async patchCompetencyPosition(competencyId, key, value) {
    const response = await this.http.patch(
      `/node/${competencyId}?_format=hal_json`,
      Body.mutateCompetencyPosition(key, value)
    );

    return response.data;
  }

  // TODO: change name
  async toggleArchivingVersionedNode(framework, nodeId) {
    const response = await this.http.patch(
      `/api/${framework}/edit?_format=json`,
      Body.toggleArchivingVersionedNode(framework, nodeId),
      'json'
    );

    return response.data;
  }

  async patchAttribute(attributeId, key, value) {
    const response = await this.http.patch(
      `/node/${attributeId}?_format=hal_json`,
      Body.mutateAttribute(key, value)
    );

    return response.data;
  }

  async patchAttributePosition(attributeId, key, value) {
    const response = await this.http.patch(
      `/node/${attributeId}?_format=hal_json`,
      Body.mutateAttribute(key, value)
    );

    return response.data;
  }

  async publishFramework(framework, version, releaseNotes) {
    const response = await this.http.patch(
      '/api/version_manager?_format=json',
      Body.publishFramework(framework, version, releaseNotes),
      'json'
    );
    return response.data;
  }

  async createDraftFramework(framework) {
    const response = await this.http.post(
      '/api/version_manager?_format=json',
      Body.createDraftFramework(framework),
      'json'
    );
    return response.data;
  }

  async updateReleaseNotes(notes, versionId) {
    const response = await this.http.patch(
      `/taxonomy/term/${versionId}?_format=hal_json`,
      Body.updateReleaseNotes(notes)
    );
    return response.data;
  }

  async changeDomain(competencyId, domainId, domainUuid, mapping) {
    const response = await this.http.patch(
      `/node/${competencyId}?_format=hal_json`,
      Body.changeDomain(competencyId, domainId, domainUuid, mapping)
    );
    return response.data;
  }

  async editResource(
    resourceID,
    title,
    dates,
    dates2,
    type,
    description,
    location,
    url,
    target_audience,
    learning_outcomes,
    keywords,
    organisers,
    trainers
  ) {
    const response = await this.http.patch(
      `/node/${resourceID}?_format=hal_json`,
      Body.editResource(
        resourceID,
        title,
        dates,
        dates2,
        type,
        description,
        location,
        url,
        target_audience,
        learning_outcomes,
        keywords,
        organisers,
        trainers
      )
    );
    return response.data;
  }

  async changeAttributeSettings(
    attribiuteId,
    competencyId,
    competencyUuid,
    attributeTypeId,
    attributeTypeUuid
  ) {
    const response = await this.http.patch(
      `/node/${attribiuteId}?_format=hal_json`,
      Body.changeAttributeSettings(
        attribiuteId,
        competencyId,
        competencyUuid,
        attributeTypeId,
        attributeTypeUuid
      )
    );
    return response.data;
  }

  async demap(resource, items) {
    const response = await this.http.get(
      `/api/mapping?_format=hal_json&resource=` +
        resource +
        `&items=` +
        items +
        `&timestamp=${Date.now()}`
    );
    return response.data;
  }

  async attrmap(resource, attributes) {
    const response = await this.http.get(
      `/api/mapping?_format=hal_json&resource=` +
        resource +
        `&attributes=` +
        attributes +
        `&timestamp=${Date.now()}`
    );
    return response.data;
  }

  async createBulkData(parentID, versionID, newData, type, addtional) {
    const response = await this.http.post(
      '/api/data_manager?_format=json',
      Body.createBulkData(parentID, versionID, newData, type, addtional),
      'json'
    );
    return response.data;
  }

  async saveSorting(items) {
    const response = await this.http.patch(
      '/api/data_manager?_format=json',
      Body.saveSorting(items),
      'json'
    );
    return response.data;
  }
}

export default CompetencyService;
