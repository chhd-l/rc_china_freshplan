/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';

export type IconNames = 'male' | 'save' | 'footprint' | 'timer' | 'female' | 'location' | 'check' | 'ship' | 'ontime' | 'add' | 'right' | 'edit' | 'picture' | 'camera' | 'close' | 'cat1' | 'dog1' | 'dog2' | 'success' | 'freshweixuanzhong' | 'freshxuanzhong' | 'gerenzhongxinxuanzhong' | 'a-bianzu16';

export interface IconProps {
  name: IconNames;
  size?: number;
  color?: string | string[];
  style?: React.CSSProperties;
}

const IconFont: FunctionComponent<IconProps> = () => {
  return null;
};

export default IconFont;
