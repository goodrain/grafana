import React from 'react';

import { Permissions } from 'app/core/components/AccessControl';
import { contextSrv } from 'app/core/services/context_srv';

import { AccessControlAction, ServiceAccountDTO } from '../../types';

type ServiceAccountPermissionsProps = {
  serviceAccount: ServiceAccountDTO;
};

export const ServiceAccountPermissions = (props: ServiceAccountPermissionsProps) => {
  const canSetPermissions = contextSrv.hasPermissionInMetadata(
    AccessControlAction.ServiceAccountsPermissionsWrite,
    props.serviceAccount
  );

  return (
    <Permissions
      title="权限"
      addPermissionTitle="添加权限"
      buttonLabel="添加权限"
      resource="serviceaccounts"
      resourceId={props.serviceAccount.id}
      canSetPermissions={canSetPermissions}
    />
  );
};
