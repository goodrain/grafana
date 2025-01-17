import React, { FC } from 'react';

import { RuleFormType } from '../../../types/rule-form';

import { DisabledTooltip } from './DisabledTooltip';
import { RuleType, SharedProps } from './RuleType';

interface Props extends SharedProps {
  onClick: (value: RuleFormType) => void;
}

const MimirFlavoredType: FC<Props> = ({ selected = false, disabled = false, onClick }) => {
  return (
    <DisabledTooltip visible={disabled}>
      <RuleType
        name="Mimir 或者 Loki 警报"
        description={
          <span>
            使用Mimir, Loki或Cortex数据源。
            <br />
            不支持表达式。
          </span>
        }
        image="public/img/alerting/mimir_logo.svg"
        selected={selected}
        disabled={disabled}
        value={RuleFormType.cloudAlerting}
        onClick={onClick}
      />
    </DisabledTooltip>
  );
};

export { MimirFlavoredType };
