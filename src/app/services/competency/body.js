import { apiUrl } from './competency';

class BodyService {
  static createCompetency({
    description,
    attributeTypeId,
    attributeTypeUuid,
    competencyId,
    competencyUuid
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
        }
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
}

export default BodyService;
