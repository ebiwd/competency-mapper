import React, { Component } from 'react';

type Props = {
  title: string;
  placeholder: string;
  options: Record<'description' | 'uuid', string>[];
  onCreate(newValue: string, uuid: string): any;
};

const defaultState = {
  value: '',
  uuid: ''
};

type State = Readonly<typeof defaultState>;

export default class SimpleForm extends Component<Props, State> {
  readonly state = defaultState;

  componentDidMount() {
    const { options } = this.props;
    if (options.length) {
      const { uuid } = options[0];
      this.setState({ uuid });
    }
  }

  onChange = (event: React.FormEvent<HTMLInputElement | HTMLSelectElement>) => {
    event.preventDefault();
    const { value } = event.currentTarget;
    const name = event.currentTarget.name;
    // https://github.com/Microsoft/TypeScript/issues/13948
    if (name === 'uuid') {
      this.setState({ [name]: value });
    }
    if (name === 'value') {
      this.setState({ [name]: value });
    }
  };

  onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { onCreate } = this.props;
    const { value, uuid } = this.state;
    if (value.trim() && uuid) {
      onCreate(value, uuid);
    }
  };

  render() {
    const { title, placeholder, options } = this.props;
    const { value, uuid } = this.state;

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
              name="value"
              value={value}
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
        </div>
      </form>
    );
  }
}
