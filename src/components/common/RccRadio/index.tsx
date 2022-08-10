import { Text } from '@tarojs/components';

import './index.less';

interface IProps {
  value: string;
  text: string;
  checked?: boolean;
  onChange?: (val: string) => void;
}

const RccRadio = ({ value, text, checked = false, onChange }: IProps) => {
  const handleClick = () => {
    if (onChange) {
      onChange(value);
    }
  }

  return (
    <Text className={`rcc-radio ${checked ? 'rcc-checked' : ''}`} onClick={handleClick}>{text}</Text>
  );
}

export default RccRadio;
