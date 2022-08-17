/* tslint:disable */
/* eslint-disable */

import React, { FunctionComponent } from 'react';

export type IconNames = 'rccicon-male' | 'rccicon-save' | 'rccicon-footprint' | 'rccicon-timer' | 'rccicon-female' | 'rccicon-location' | 'rccicon-check' | 'rccicon-ship' | 'rccicon-ontime' | 'rccicon-add' | 'rccicon-right' | 'rccicon-edit' | 'rccicon-picture' | 'rccicon-camera' | 'rccicon-close' | 'rccicon-cat1' | 'rccicon-dog1' | 'rccicon-dog2' | 'rccicon-success' | 'rccicon-freshweixuanzhong' | 'rccicon-freshxuanzhong' | 'rccicon-gerenzhongxinxuanzhong' | 'rccicon-a-bianzu16';

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
