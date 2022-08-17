/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';
import Taro from '@tarojs/taro';

export type IconNames = 'male' | 'save' | 'footprint' | 'timer' | 'female' | 'location' | 'check' | 'ship' | 'ontime' | 'add' | 'right' | 'edit' | 'picture' | 'camera' | 'close' | 'cat1' | 'dog1' | 'dog2' | 'success' | 'freshweixuanzhong' | 'freshxuanzhong' | 'gerenzhongxinxuanzhong' | 'a-bianzu16';

interface Props {
  name: IconNames;
  size?: number;
  color?: string | string[];
  style?: React.CSSProperties;
}

const IconFont: FunctionComponent<Props> = (props) => {
  const { name, size, color, style } = props;

  // @ts-ignore
  return <iconfont name={name} size={parseFloat(Taro.pxTransform(size))} color={color} style={style} />;
};

IconFont.defaultProps = {
  size: 18,
};

export default IconFont;
