import React, { FC } from 'react';

import { CallToActionCard } from '@grafana/ui';
import EmptyListCTA from 'app/core/components/EmptyListCTA/EmptyListCTA';
import { contextSrv } from 'app/core/services/context_srv';

import { getInstancesPermissions } from '../../utils/access-control';
import { makeAMLink } from '../../utils/misc';

type Props = {
  alertManagerSourceName: string;
};

export const NoSilencesSplash: FC<Props> = ({ alertManagerSourceName }) => {
  const permissions = getInstancesPermissions(alertManagerSourceName);

  if (contextSrv.hasAccess(permissions.create, contextSrv.isEditor)) {
    return (
      <EmptyListCTA
        title="你还没有制造任何沉默"
        buttonIcon="bell-slash"
        buttonLink={makeAMLink('alerting/silence/new', alertManagerSourceName)}
        buttonTitle="新建沉默"
      />
    );
  }
  return <CallToActionCard callToActionElement={<div />} message="没有发现沉默。" />;
};
