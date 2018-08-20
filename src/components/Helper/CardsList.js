import React, { PureComponent } from 'react';
import { Card, List } from 'antd';

import Ellipsis from 'components/Ellipsis';

import styles from './card.less';

export default class CardsList extends PureComponent {

  render() {
    const { list, loading, rowKey, getActions, cols } = this.props;

    return (
      <div className={styles.cardList}>
        <List
          rowKey={rowKey || "id"}
          loading={loading}
          grid={{ gutter: 24, lg: cols || 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => (
            <List.Item key={item.id}>
              <Card hoverable className={styles.card} actions={getActions ? getActions(item) : null}>
                <Card.Meta
                  avatar={<img alt="" className={styles.cardAvatar} src={item.avatar} />}
                  title={<a href="#">{item.title}</a>}
                  description={
                    <Ellipsis className={styles.item} lines={3}>
                      {item.description}
                    </Ellipsis>
                  }
                />
              </Card>
            </List.Item>
          )}
        />
      </div>
    );
  }
}
