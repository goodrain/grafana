import React from 'react';

import { Permissions } from 'app/core/components/AccessControl';
import { contextSrv } from 'app/core/services/context_srv';

import { AccessControlAction, Team } from '../../types';

type TeamPermissionsProps = {
  team: Team;
};

// TeamPermissions component replaces TeamMembers component when the accesscontrol feature flag is set
const TeamPermissions = (props: TeamPermissionsProps) => {
  const canSetPermissions = contextSrv.hasPermissionInMetadata(
    AccessControlAction.ActionTeamsPermissionsWrite,
    props.team
  );

  return (
    <Permissions
      title=""
      addPermissionTitle="添加成员"
      buttonLabel="添加成员"
      emptyLabel="此团队中没有成员，或者您没有列出当前成员的权限。"
      resource="teams"
      resourceId={props.team.id}
      canSetPermissions={canSetPermissions}
    />
  );
};

export default TeamPermissions;
