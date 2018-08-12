import React from 'react';
import { 
  Input,
  Tag,
  Tooltip,
  Icon,
  message,
} from 'antd';
import { keyboardFilters } from 'utils/keyboard';
import { l } from 'utils/localization';

class MultiTags extends React.Component {

  state = {
    tags: this.props.tags || [],
    inputVisible: false,
    inputValue: '',
  };

  saveTagOps() {
    if (this.props.saveTags) this.props.saveTags(this.state.tags);
  }

  handleClose = (removedTag) => {
    const state = this.state;
    const tags = state.tags.filter(tag => tag !== removedTag);

    this.setState({
      tags,
    }, this.saveTagOps);
  }

  showInput = () => {
    this.setState({ inputVisible: true }, () => this.input.focus());
  }

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  }

  handleInputConfirm = () => {
    const state = this.state;
    const inputValue = state.inputValue;
    let isValid = true;

    if (inputValue && state.tags.indexOf(inputValue) !== -1) {
      message.error(l('Duplicated tag'));
      isValid = false;
    } else {
      const { maxLength, pattern } = this.props;

      if (maxLength && inputValue.length > maxLength) {
        message.error(l('The max length is: {0}', maxLength));
        isValid = false;
      }
      if (isValid && pattern) {
        const r = new RegExp(pattern);

        if (!r.test(inputValue)) {
          message.error(l('Tag value is invalid'));
          isValid = false;
        }
      }
    }

    const newState = {
      inputVisible: false,
      inputValue,
    };

    if (isValid) {
      newState.inputValue = '';
      newState.tags = [...state.tags, inputValue];
    }
    this.setState(newState, this.saveTagOps);
  }

  saveInputRef = input => {this.input = input};

  render() {
    const { tags, inputVisible, inputValue } = this.state;
    const { isDigit, newTagBtnText, color } = this.props;
    const inputProps = {
      ref: this.saveInputRef,
      type: "text",
      size: "small",
      style: { width: 78 },
      value: inputValue,
      onChange: this.handleInputChange,
      onBlur: this.handleInputConfirm,
      onPressEnter: this.handleInputConfirm,
    };

    if (isDigit) inputProps.onKeyPress = keyboardFilters.digit;

    return (
      <div>
        {tags.map((tag) => {
          const isLongTag = tag.length > 20;
          const props = {
            closable: true,
            key: tag,
            afterClose: () => this.handleClose(tag),
          };
          if (color) props.color = color;
          const tagElem = (<Tag {...props}>{isLongTag ? `${tag.slice(0, 20)}...` : tag}</Tag>);
          return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
        })}
        {inputVisible && (<Input {...inputProps} />)}
        {!inputVisible && (
          <Tag
            onClick={this.showInput}
            style={{ background: '#fff', borderStyle: 'dashed' }}
          >
            <Icon type="plus" /> {l(newTagBtnText || 'New Tag')}
          </Tag>
        )}
      </div>
    );
  }
}

export default MultiTags
