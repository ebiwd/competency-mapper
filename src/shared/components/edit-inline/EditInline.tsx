import React, { Component } from 'react';

import './EditInline.css';

const defaultProps = {
  style: {} as Record<string, string | number>,
  text: '',
  change: (newValue: string) => {},
  staticElement: 'div',
  editable: true
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
  selfRef = React.createRef<HTMLDivElement>();
  inputRef = React.createRef<HTMLInputElement>();

  componentDidMount() {
    const { text } = this.props;
    this.setState({ value: text!, oriValue: text! });
    document.addEventListener('mousedown', this.toggleActive);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.toggleActive);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { active } = this.state;
    if (active && !prevState.active) {
      // Unable to focus on the input element.
      // this.inputRef.current && this.inputRef.current.focus();

      // Dirty: The only way I was able to focus on the input element.
      setTimeout(
        () => this.inputRef.current && this.inputRef.current.focus(),
        0
      );
    }
  }

  toggleActive = (event: MouseEvent) => {
    if (
      this.selfRef.current &&
      this.selfRef.current.contains(event.target as Node)
    ) {
      this.setState({ active: true });
      return;
    }
    this.reset();
  };

  onChange(value: string) {
    this.setState({ value });
  }

  reset = () => {
    const { oriValue, active } = this.state;
    if (active) {
      this.setState({ active: false, value: oriValue });
    }
  };

  submit = () => {
    const { change } = this.props;
    const { value } = this.state;
    change!(value);
    this.setState({ active: false, oriValue: value });
  };

  render = () => {
    const { style, staticElement, editable } = this.props;
    const { value, active } = this.state;

    if (!editable) {
      return React.createElement(staticElement!, { style }, value);
    }

    if (!active) {
      return React.createElement(staticElement!, { style, ref: this.selfRef }, [
        value,
        <i
          key="dummy"
          className="icon icon-common icon-edit icon-left-spacer"
          aria-label="edit"
        />
      ]);
    }

    return (
      <div className="edit-inline-container" ref={this.selfRef}>
        <input
          type="text"
          className="inner-input"
          value={value}
          onChange={event => this.onChange(event.target.value)}
          ref={this.inputRef}
          // autoFocus={true} // It only works when it is rendered after mounting
        />
        <div className="edit-inline-controls">
          <button
            className="button margin-bottom-none"
            type="button"
            onClick={this.submit}
          >
            <i
              className="icon icon-common icon-check"
              aria-label="accept changes"
            />
          </button>
          <button
            className="button margin-bottom-none"
            type="button"
            onClick={this.reset}
          >
            <i
              className="icon icon-common icon-undo"
              aria-label="undo changes"
            />
          </button>
        </div>
      </div>
    );
  };
}
