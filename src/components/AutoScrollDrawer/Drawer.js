import React from 'react';
import { Drawer } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import { sizer, elements } from 'utils/layout';
import styles from 'utils/utils.less';

function getMaxHeight(footer, footerHeight) {
  return window.innerHeight - (76 + (footer ? (footerHeight || 50) : 0));
}

export default class AutoScrollDrawer extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      height: getMaxHeight(this.props.footer, this.props.footerHeight),
    };
  }

  componentDidMount () {
    sizer.add(this);
  }

  componentWillUnmount () {
    sizer.remove(this);
  }

  updateSize() {
    this.setState({
      height: getMaxHeight(this.props.footer, this.props.footerHeight),
    });
  }

  render () {
    const { scrollbarProps, width, footerHeight, children, footer, ...props } = this.props;
    const drawerWidth = width || 360;
    const scrollbarStyle = {width: 'auto', height: this.state.height};

    return (
      <Drawer
        {...props}
        width={drawerWidth}
      >
        <Scrollbars className={styles.scrollBar} autoHide {...scrollbarProps} style={scrollbarStyle} renderThumbVertical={elements.contentScrollbarThumb}>
          {children}
        </Scrollbars>
        {footer}
      </Drawer>
    )
  }
}
