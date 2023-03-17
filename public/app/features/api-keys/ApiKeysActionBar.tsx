import React, { FC } from 'react';

import { Button, FilterInput } from '@grafana/ui';

interface Props {
  searchQuery: string;
  disabled: boolean;
  onAddClick: () => void;
  onSearchChange: (value: string) => void;
}

export const ApiKeysActionBar: FC<Props> = ({ searchQuery, disabled, onAddClick, onSearchChange }) => {
  return (
    <div className="page-action-bar">
      <div className="gf-form gf-form--grow">
        <FilterInput placeholder="搜索 keys" value={searchQuery} onChange={onSearchChange} />
      </div>
      <Button className="pull-right" onClick={onAddClick} disabled={disabled}>
        添加API密钥
      </Button>
    </div>
  );
};
