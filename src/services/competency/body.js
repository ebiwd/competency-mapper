import CompetencyService, { apiUrl } from './compentency';

class Body {
  static mutateCompetencyName(
    competencyID,
    attributeTypeID,
    title,
    competecyUUID,
    attributeTypeUUID
  ) {
    return JSON.stringify({
      _links: {
        type: {
          href: `${apiUrl}/rest/type/node/attribute`
        },
        [`${apiUrl}/rest/relation/node/attribute/field_competency`]: {
          href: `${apiUrl}/node/${competencyID}?_format=hal_json`
        },
        [`${apiUrl}/rest/relation/node/attribute/field_attribute_type`]: {
          href: `${apiUrl}/node/${attributeTypeID}?_format=hal_json`
        }
      },
      title: [
        {
          value: title
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
                href: `${apiUrl}/node/${competencyID}?_format=hal_json`
              },
              type: {
                href: `${apiUrl}/rest/type/node/competency`
              }
            },
            uuid: [
              {
                value: competecyUUID // "b20064ef-5cbf-4147-90f8-08e7a6693e17"
              }
            ],
            lang: 'en'
          }
        ],

        [`${apiUrl}/rest/relation/node/attribute/field_attribute_type`]: [
          {
            _links: {
              self: {
                href: `${apiUrl}/node/${attributeTypeID}?_format=hal_json`
              },
              type: {
                href: `${apiUrl}/rest/type/node/attribute_type`
              }
            },
            uuid: [
              {
                value: attributeTypeUUID
              }
            ],
            lang: 'en'
          }
        ]
      }
    });
  }

  static mutateAttribute(key, value) {
    return JSON.stringify({
      _links: {
        type: {
          href: `${apiUrl}/rest/type/node/attribute`
        }
      },
      [key]: [
        {
          value: value
        }
      ],
      type: [
        {
          target_id: 'attribute'
        }
      ]
    });
  }
}

export default Body;
