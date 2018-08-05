import React from 'react';
import config from './config'

export const sizer = {
  add(context) {
    context._updateSize = context.updateSize.bind(context);
    context.updateSize();
    window.addEventListener('resize', context._updateSize);
  },
  remove(context) {
    if (context._updateSize) window.removeEventListener('resize', context._updateSize);
  },
}

export const elements = {
  siderScrollbarThumb ({ style, ...props }) {
    const colors = config.colors || {};
  
    return (
      <div style={{ ...style, backgroundColor: colors.siderScrollbarThumber || 'rgb(123, 225, 248)', borderRadius: 3 }} {...props} />
    );
  },
  contentScrollbarThumb ({ style, ...props }) {
    const colors = config.colors || {};
  
    return (
      <div style={{ ...style, backgroundColor: colors.contentScrollbarThumber || 'rgb(160, 153, 153)', borderRadius: 3 }} {...props} />
    );
  },
  component(Component, props) {
    return (<Component {...props} />);
  },
}