import React, { Component } from 'react';

const defaultProps = {
  showMappingField: false
};

type Props = {
  title: string;
  placeholder: string;
  options: Record<'description' | 'uuid', string>[];
  onCreate(newValue: string, uuid: string, mapping: string): any;
} & Partial<typeof defaultProps>;

const defaultState = {
  description: '',
  uuid: '',
  mapping: ''
};

type State = Readonly<typeof defaultState>;

export default class SimpleForm extends Component<Props, State> {
  static defaultProps = defaultProps;
  readonly state = defaultState;

  componentDidMount() {
    this.setDefaultOption();
  }

  setDefaultOption() {
    const { options } = this.props;
    if (options.length) {
      const { uuid } = options[0];
      this.setState({ uuid });
    }
  }

  reset() {
    this.setState(defaultState);
    this.setDefaultOption();
  }

  onChange = (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    event.preventDefault();
    const { value } = event.currentTarget;
    const name = event.currentTarget.name;
    // https://github.com/Microsoft/TypeScript/issues/13948
    if (name === 'uuid') {
      this.setState({ [name]: value });
    }
    if (name === 'description') {
      this.setState({ [name]: value });
    }
    if (name === 'mapping') {
      this.setState({ [name]: value });
    }
  };

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { onCreate } = this.props;
    const { description, uuid, mapping } = this.state;

    if (description.trim() && uuid) {
      onCreate(description, uuid, mapping);
      this.reset();
    }
  };

  render() {
    const { title, placeholder, options, showMappingField } = this.props;
    const { description, uuid, mapping } = this.state;

    const selectOptions = options.map(({ description, uuid }) => (
      <option key={uuid} value={uuid}>
        {description}
      </option>
    ));

    return (
      <form onSubmit={this.onSubmit} className="callout">
        <h4>{title}</h4>
        <div className="row">
          <div className="column large-7">
            <input
              type="text"
              placeholder={placeholder}
              name="description"
              value={description}
              required
              onChange={this.onChange}
            />
          </div>
          <div className="column large-3">
            <select name="uuid" value={uuid} required onChange={this.onChange}>
              {selectOptions}
            </select>
          </div>
          <div className="column large-2">
            <input type="submit" className="button" value="Create" />
          </div>
          {showMappingField ? (
            <div className="column">
              <label>
                Maps to competency/attribute from other framework
                <input
                  type="text"
                  placeholder="Framework (version), competency or attribute"
                  name="mapping"
                  value={mapping}
                  onChange={this.onChange}
                />
              </label>
            </div>
          ) : null}
        </div>
      </form>
    );
  }
}
