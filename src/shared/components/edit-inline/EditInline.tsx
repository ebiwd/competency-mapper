import React, { Component } from 'react';

import './EditInline.css';

const defaultProps = {
  style: {} as Record<string, string | number>,
  text: '',
  change: (newValue: Record<string, string>) => {},
  staticElement: 'div',
  paramName: 'content',

  // Below prop is *not* currently used, but are kept for backward
  // compatibility with original react-edit-inline element.
  'data-id': ''
};

type Props = Partial<typeof defaultProps>;

const defaultState = {
  oriValue: '',
  value: '',
  active: false
};

type State = Readonly<typeof defaultState>;

export default class EditInline extends Component<Props, State> {
  static defaultProps = defaultProps; // No idea why the props are marked as optional (see '!' in the code below)
  readonly state: State = defaultState;
  selfRef = React.createRef<HTMLElement>();
  inputRef = React.createRef<HTMLInputElement>();

  componentWillMount() {
    const { text } = this.props;
    this.setState({ value: text!, oriValue: text! });
    document.addEventListener('mousedown', this.toggleActive);
  }

  componentWillUnMount() {
    document.removeEventListener('mousedown', this.toggleActive);
  }

  // It doesn't work to focus on the input element.
  // componentDidUpdate() {
  //   const { active } = this.state;
  //   if (active) {
  //     this.inputRef.current && this.inputRef.current.focus();
  //   }
  // }

  toggleActive = (event: MouseEvent) => {
    if (
      this.selfRef.current &&
      this.selfRef.current.contains(event.target as Node)
    ) {
      this.setState({ active: true });
      setTimeout(
        () => this.inputRef.current && this.inputRef.current.focus(),
        0
      ); // Dirty: The only way I was able to focus on the input element.
      return;
    }
    this.reset();
  };

  onChange(value: string) {
    this.setState({ value });
  }

  reset = () => {
    const { oriValue } = this.state;
    this.setState({ active: false, value: oriValue });
  };

  submit = () => {
    const { text, change, paramName } = this.props;
    const { value } = this.state;
    change!({ [paramName!]: value });
    this.setState({ active: false, oriValue: value });
  };

  render = () => {
    const { style, staticElement } = this.props;
    const { value, active } = this.state;

    if (!active) {
      return React.createElement(staticElement!, { style, ref: this.selfRef }, [
        value,
        <i
          key="dummy"
          className="icon icon-common icon-edit icon-left-spacer"
        />
      ]);
    }

    return (
      <span className="edit-inline-container" ref={this.selfRef}>
        <input
          type="text"
          style={style}
          value={value}
          onChange={event => this.onChange(event.target.value)}
          ref={this.inputRef}
          // autoFocus={true} // It only works when it is rendered after mounting
        />
        <span className="edit-inline-controls">
          <button className="button" type="button" onClick={this.submit}>
            <i
              className="icon icon-common icon-check"
              aria-label="accept changes"
            />
          </button>
          <button className="button" type="button" onClick={this.reset}>
            <i
              className="icon icon-common icon-undo"
              aria-label="undo changes"
            />
          </button>
        </span>
      </span>
    );
  };
}
