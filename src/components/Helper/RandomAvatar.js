import React from 'react'
import _ from 'lodash';
import classNames from 'classnames';
import styles from './avatar.less'

class Avatar extends React.PureComponent {
  constructor(props) {
    super(props);
    const c1 = _.random(0, 255)
    const c2 = _.random(0, 255)
    const c3 = _.random(0, 255)
    const b1 = 255 - c1
    const b2 = 255 - c2
    const b3 = 255 - c3
    const br1 = parseInt(c1 * 2 / 3, 10)
    const br2 = parseInt(c2 * 2 / 3, 10)
    const br3 = parseInt(c3 * 2 / 3, 10)
    const square = this.props.square || 24
    this.colors = {
      width: square + 'px',
      height: square + 'px',
      backgroundColor: `rgb(${b1},${b2},${b3})`,
      color: `rgb(${c1},${c2},${c3})`,
      border: `1px solid rgb(${br1},${br2},${br3})`,
      fontSize: this.props.fontSize || '12px',
    };
  }

  render() {
    return (
      <div>
        <div
          className={classNames(styles.avatar, {[styles.avatarLeft]: !!this.props.children})}
          style={{ ...this.colors }}
        >
          {this.props.text.toUpperCase()}
        </div>
        { this.props.children }
      </div>
    )
  }
}

export default Avatar
