import React from 'react';
import { Modal, Button, Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { sizer, elements } from 'utils/layout';
import { l } from 'utils/localization';

function isMax(v) {
  return v === 'max';
}

function getMaxHeight(noFooter) {
  return window.innerHeight - (noFooter ? 143 : 200);
}

function getMaxWidth() {
  return window.innerWidth - 96;
}

class AutoSizeDialog extends React.Component {

  constructor(props) {
    super(props);

    const size = this.getInitialSize();
    this.state = {
      ...size,
    };
  }

  componentDidMount () {
    if (this.props.maximize || isMax(this.props.height) || isMax(this.props.width)) {
      sizer.add(this);
    }
  }

  componentWillUnmount () {
    if (this.props.maximize || isMax(this.props.height) || isMax(this.props.width)) {
      sizer.remove(this);
    }
  }

  getInitialSize() {
    const size = {width: 500, height: 200};
    if (this.props.maximize) {
      size.height = getMaxHeight(this.props.noFooter);
      size.width = getMaxWidth();
    } else {
      if (this.props.height) {
        if (isMax(this.props.height)) {
          size.height = getMaxHeight();
        } else {
          size.height = this.props.height;
        }
      }
      if (this.props.width) {
        if (isMax(this.props.width)) {
          size.width = getMaxWidth();
        } else {
          size.width = this.props.width;
        }
      }
    }
    return size;
  }

  updateSize() {
    const size = {};
    if (this.props.maximize || isMax(this.props.height)) size.height = getMaxHeight(this.props.noFooter);
    if (this.props.maximize || isMax(this.props.width)) size.width = getMaxWidth();
    if (size.height !== this.state.height || size.width !== this.state.width) {
      this.setState(size);
    }
  }

  render () {
    const { onOk, onCancel, loading, okText, cancelText, iconType, imageType, noFooter, closable, scrollbarProps, ...props } = this.props;
    const scrollbarStyle = {width: 'auto', height: this.state.height};
    const width = this.state.width + 48;
    let footer = null;

    if (imageType) {
      props.title = (<span><img src={imageType} /> {props.title}</span>);
    } else if (iconType) {
      props.title = (<span><Icon type={iconType} /> {props.title}</span>);
    }
    if (noFooter) {
      if (onCancel) props.onCancel = onCancel;
    } else {
      footer = [
        <Button key="back" onClick={onCancel} disabled={loading}>{cancelText || l('Cancel')}</Button>,
        <Button key="submit" type="primary" loading={loading} onClick={onOk}>{okText || l('Ok')}</Button>,
      ];
    }
    if (!this.props.maximize && !isMax(this.props.width)) scrollbarStyle.width = 'auto';
    props.maskClosable = this.props.maskClosable || false;

    return (
      <Modal
        width={width}
        {...props}
        wrapClassName="vertical-center-modal"
        closable={closable || false}
        footer={footer}
      >
        <Scrollbars autoHide {...scrollbarProps} style={scrollbarStyle} renderThumbVertical={elements.contentScrollbarThumb}>
          {this.props.children}
        </Scrollbars>
      </Modal>
    )
  }
}

export default AutoSizeDialog
