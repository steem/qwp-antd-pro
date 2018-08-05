/**
 * @fileOverview
 * @author huangtonger@aliyun.com
 */

import React from 'react';
import { Checkbox, Input, InputNumber, Button } from 'antd';
import ColorPicker from 'rc-color-picker';
import Navigator from './Navigator';
import ToolBar from './Toolbar';
import Contextmenu from './Contextmenu';
import Page from './Page';
import Editor from './Editor';
import './colorPicker.less';
import './baseFlowEditor.less';
import './editor.less';

class BaseFlowEditor extends Editor {
  componentDidMount() {
    super.componentDidMount();
    const page = this.page;
    page.changeAddEdgeModel({
      shape: 'flow-polyline',
    });
  }

  saveData() {
    console.log(this.page.save());
  }

  render() {
    const { curZoom, minZoom, maxZoom, selectedModel, inputingLabel } = this.state;
    const splitSize = selectedModel.size ? selectedModel.size.split('*') : '';
    const width = splitSize[0];
    const height = splitSize[1];
    const labelInput = (
      <div className="p">
        名称：
        <Input
          size="small"
          className="input name-input"
          value={inputingLabel ? inputingLabel : selectedModel.label}
          onChange={ev => {
            this.setState({
              inputingLabel: ev.target.value,
            });
          }}
          onBlur = { ev => {
            this.updateGraph('label', ev.target.value);
            this.setState({
              inputingLabel: null,
            });
          }}
        />
      </div>
    );
    const colorInput = (
      <div className="p">
      颜色：<ColorPicker
        animation="slide-up"
        className="color-picker"
        color={selectedModel.color}
        onClose={ ev => {
          this.updateGraph('color', ev.color);
        }}
      />
      </div>);

    return (
      <div id="editor">
        <ToolBar btns={(<Button shape="circle" icon="save" size="small" onClick={this.saveData.bind(this)} />)} />
        <div style={{ height: '42px' }} />
        <div className="bottom-container">
          <Contextmenu />
          <div id="itempannel">
            <img
              draggable="false"
              src="./flow/normal.svg"
              data-type="node"
              data-shape="flow-rect"
              data-size="80*48"
              data-color="#1890FF"
              data-label="A局"
              className="getItem"
            />
            <img
              draggable="false"
              src="./flow/normal.svg"
              data-type="node"
              data-shape="flow-rect"
              data-size="80*48"
              data-color="#1890FF"
              data-label="A局"
              className="getItem"
            />
            <img
              draggable="false"
              src="./flow/normal.svg"
              data-type="node"
              data-shape="flow-rect"
              data-size="80*48"
              data-color="#1890FF"
              data-label="A局"
              className="getItem"
            />
            <img
              draggable="false"
              src="./flow/normal.svg"
              data-type="node"
              data-shape="flow-rect"
              data-size="80*48"
              data-color="#1890FF"
              data-label="A局"
              className="getItem"
            />
            <img
              draggable="false"
              src="./flow/normal.svg"
              data-type="node"
              data-shape="flow-rect"
              data-size="80*48"
              data-color="#1890FF"
              data-label="A局"
              className="getItem"
            />
          </div>
          <div id="detailpannel">
            <div data-status="node-selected" className="pannel" id="node_detailpannel">
              <div className="pannel-title">节点</div>
              <div className="block-container">
                {labelInput}
                <div className="p">
                  尺寸：
                  <InputNumber
                    size="small"
                    value={width}
                    className="input width-input"
                    onChange={value => {
                      const newSize = value + '*' + height;
                      selectedModel.size = newSize;
                      this.setState({
                        selectedModel,
                      });
                      this.updateGraph('size', newSize);
                    }}
                  />
                  <InputNumber
                    size="small"
                    value={height}
                    className="input height-input"
                    onChange={ value => {
                      const newSize = width + '*' + value;
                      selectedModel.size = newSize;
                      this.setState({
                        selectedModel,
                      });
                      this.updateGraph('size', newSize);
                    } }/>
                </div>
                {colorInput}
              </div>
            </div>
            <div data-status="edge-selected" className="pannel" id="edge_detailpannel">
              <div className="pannel-title">边</div>
              <div className="block-container">
                {labelInput}
              </div>
            </div>
            <div data-status="group-selected" className="pannel" id="group_detailpannel">
              <div className="pannel-title">组</div>
              <div className="block-container">
                {labelInput}
              </div>
            </div>
            <div data-status="canvas-selected" className="pannel" id="canvas_detailpannel">
              <div className="pannel-title">画布</div>
              <div className="block-container">
                <Checkbox onChange={ this.toggleGrid.bind(this) } >网格对齐</Checkbox>
              </div>
            </div>
            <div data-status="multi-selected" className="pannel" id="multi_detailpannel">
              <div className="pannel-title">多选</div>
              <div className="block-container">
                {colorInput}
              </div>
            </div>
          </div>
          <Navigator
            curZoom={curZoom}
            minZoom={minZoom}
            maxZoom={maxZoom}
            changeZoom={this.changeZoom.bind(this)}
          />
          <Page />
        </div>
      </div>
    );
  }
}

export default BaseFlowEditor;
