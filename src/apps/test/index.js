import React, { PureComponent } from 'react';
import { Carousel } from 'antd';
import styles from './index.less';

export default class TestPage extends PureComponent {
  render() {
    return (
      <Carousel autoplay>
        <div><h3>Test item 1</h3></div>
        <div><h3>Test item 2</h3></div>
        <div><h3>Test item 3</h3></div>
        <div><h3>Test item 4</h3></div>
      </Carousel>
    );
  }
}
