import { apiUrl } from '../http/http';

class BodyService {
  static createCompetency({
    description,
    domainId,
    domainUuid,
    mapping = '',
    draftId,
    draftUuid
  }) {
    return {
      _links: {
        type: {
          href: `${apiUrl}/rest/type/node/competency`
        },
        [`${apiUrl}/rest/relation/node/competency/field_domain`]: {
          href: `${apiUrl}/node/${domainId}?_format=hal_json`
        },
        [`${apiUrl}/rest/relation/node/competency/field_versions`]: [
          {
            href: `http://local.competency-mapper/taxonomy/term/${draftId}?_format=hal_json`
          }
        ]
      },
      title: [
        {
          value: description
        }
      ],
      type: [
        {
          target_id: 'competency'
        }
      ],
      field_map_other_competency: [
        {
          value: mapping
        }
      ],
      _embedded: {
        [`${apiUrl}/rest/relation/node/competency/field_versions`]: [
          {
            _links: {
              self: {
                href: `${apiUrl}/taxonomy/term/${draftId}?_format=hal_json`
              },
              type: {
                href: `${apiUrl}/rest/type/taxonomy_term/version`
              }
            },
            uuid: [
              {
                value: draftUuid
              }
            ]
          }
        ],
        [`${apiUrl}/rest/relation/node/competency/field_domain`]: [
          {
            _links: {
              self: {
                href: `${apiUrl}/node/${domainId}?_format=hal_json`
              },
              type: {
                href: `${apiUrl}/rest/type/node/domain`
              }
            },
            uuid: [
              {
                value: domainUuid
              }
            ],
            lang: 'en'
          }
        ]
      }
    };
  }

  static createAttribute({
    description,
    attributeTypeId,
    attributeTypeUuid,
    competencyId,
    competencyUuid,
    draftId,
    draftUuid
  }) {
    return {
      _links: {
        type: {
          href: `${apiUrl}/rest/type/node/attribute`
        },
        [`${apiUrl}/rest/relation/node/attribute/field_competency`]: {
          href: `${apiUrl}/node/${competencyId}?_format=hal_json`
        },
        [`${apiUrl}/rest/relation/node/attribute/field_attribute_type`]: {
          href: `${apiUrl}/node/${attributeTypeId}?_format=hal_json`
        },
        [`${apiUrl}/rest/relation/node/competency/field_versions`]: [
          {
            href: `http://local.competency-mapper/taxonomy/term/${draftId}?_format=hal_json`
          }
        ]
      },
      title: [
        {
          value: description
        }
      ],
      type: [
        {
          target_id: 'attribute'
        }
      ],

      _embedded: {
        [`${apiUrl}/rest/relation/node/competency/field_versions`]: [
          {
            _links: {
              self: {
                href: `${apiUrl}/taxonomy/term/${draftId}?_format=hal_json`
              },
              type: {
                href: `${apiUrl}/rest/type/taxonomy_term/version`
              }
            },
            uuid: [
              {
                value: draftUuid
              }
            ]
          }
        ],
        [`${apiUrl}/rest/relation/node/attribute/field_competency`]: [
          {
            _links: {
              self: {
                href: `${apiUrl}/node/${competencyId}?_format=hal_json`
              },
              type: {
                href: `${apiUrl}/rest/type/node/competency`
              }
            },
            uuid: [
              {
                value: competencyUuid
              }
            ],
            lang: 'en'
          }
        ],
        [`${apiUrl}/rest/relation/node/attribute/field_attribute_type`]: [
          {
            _links: {
              self: {
                href: `${apiUrl}/node/${attributeTypeId}?_format=hal_json`
              },
              type: {
                href: `${apiUrl}/rest/type/node/attribute_type`
              }
            },
            uuid: [
              {
                value: attributeTypeUuid
              }
            ],
            lang: 'en'
          }
        ]
      }
    };
  }

  static mutateCompetency(key, value) {
    return BodyService.mutate(key, value, 'competency');
  }

  static mutateAttribute(key, value) {
    return BodyService.mutate(key, value, 'attribute');
  }

  static mutate(key, value, target) {
    return {
      _links: {
        type: {
          href: `${apiUrl}/rest/type/node/${target}`
        }
      },
      [key]: [
        {
          value: value
        }
      ],
      type: [
        {
          target_id: target
        }
      ]
    };
  }

  static publishFramework(framework, version, releaseNotes) {
    return {
      type: [
        {
          target_id: 'article'
        }
      ],
      title: [
        {
          value: framework
        }
      ],
      field_parent: [
        {
          value: framework
        }
      ],
      field_release_notes: [
        {
          value: releaseNotes
        }
      ],
      field_item: [
        {
          value: version
        }
      ]
    };
  }

  static createDraftFramework(framework) {
    return {
      type: [
        {
          target_id: 'article'
        }
      ],
      title: [
        {
          value: 'draft'
        }
      ],
      field_parent: [
        {
          value: framework
        }
      ]
    };
  }

  static toggleArchivingVersionedNode(framework, nodeId) {
    return {
      type: [
        {
          target_id: 'article'
        }
      ],
      field_parent: [
        {
          value: framework
        }
      ],
      field_item: [
        {
          value: nodeId
        }
      ]
    };
  }

  static updateReleaseNotes(notes) {
    return {
      _links: {
        type: {
          href:
            'https://dev-competency-mapper.pantheonsite.io/rest/type/taxonomy_term/version'
        }
      },
      vid: [
        {
          value: 'version'
        }
      ],
      field_release_notes: [
        {
          value: notes
        }
      ]
    };
  }
}

export default BodyService;
