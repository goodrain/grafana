import { css } from '@emotion/css';
import { capitalize } from 'lodash';
import React from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Badge, CallToActionCard, Card, Icon, LinkButton, Tooltip, useStyles2 } from '@grafana/ui';

import { ExternalDataSourceAM } from '../../hooks/useExternalAmSelector';
import { makeDataSourceLink } from '../../utils/misc';

export interface ExternalAlertManagerDataSourcesProps {
  alertmanagers: ExternalDataSourceAM[];
  inactive: boolean;
}

export function ExternalAlertmanagerDataSources({ alertmanagers, inactive }: ExternalAlertManagerDataSourcesProps) {
  const styles = useStyles2(getStyles);

  return (
    <>
      <h5>Alertmanagers 接收 grafana 管理的警报</h5>
      <div className={styles.muted}>
      Alertmanager数据源支持一个配置设置，允许您选择发送grafana管理的警报到该Alertmanager。 <br />
      下面，您可以看到启用了此设置的所有Alertmanager数据源的列表。
      </div>
      {alertmanagers.length === 0 && (
        <CallToActionCard
          message={
            <div>
              没有配置Alertmanager数据源来接收grafana管理的警报。 <br />
              您可以通过在数据源配置中选择Receive Grafana Alerts进行更改。
            </div>
          }
          callToActionElement={<LinkButton href="/datasources">转到数据源</LinkButton>}
          className={styles.externalDsCTA}
        />
      )}
      {alertmanagers.length > 0 && (
        <div className={styles.externalDs}>
          {alertmanagers.map((am) => (
            <ExternalAMdataSourceCard key={am.dataSource.uid} alertmanager={am} inactive={inactive} />
          ))}
        </div>
      )}
    </>
  );
}

interface ExternalAMdataSourceCardProps {
  alertmanager: ExternalDataSourceAM;
  inactive: boolean;
}

export function ExternalAMdataSourceCard({ alertmanager, inactive }: ExternalAMdataSourceCardProps) {
  const styles = useStyles2(getStyles);

  const { dataSource, status, statusInconclusive, url } = alertmanager;

  return (
    <Card>
      <Card.Heading className={styles.externalHeading}>
        {dataSource.name}{' '}
        {statusInconclusive && (
          <Tooltip content="多个alertmanager配置了相同的URL。国家可能没有定论。">
            <Icon name="exclamation-triangle" size="md" className={styles.externalWarningIcon} />
          </Tooltip>
        )}
      </Card.Heading>
      <Card.Figure>
        <img
          src="public/app/plugins/datasource/alertmanager/img/logo.svg"
          alt=""
          height="40px"
          width="40px"
          style={{ objectFit: 'contain' }}
        />
      </Card.Figure>
      <Card.Tags>
        {inactive ? (
          <Badge
            text="不活跃"
            color="red"
            tooltip="Grafana被配置为只向内置的内部Alertmanager发送警报。外部警报管理器不接收任何警报"
          />
        ) : (
          <Badge
            text={capitalize(status)}
            color={status === 'dropped' ? 'red' : status === 'active' ? 'green' : 'orange'}
          />
        )}
      </Card.Tags>
      <Card.Meta>{url}</Card.Meta>
      <Card.Actions>
        <LinkButton href={makeDataSourceLink(dataSource)} size="sm" variant="secondary">
          转到数据源
        </LinkButton>
      </Card.Actions>
    </Card>
  );
}

export const getStyles = (theme: GrafanaTheme2) => ({
  muted: css`
    font-size: ${theme.typography.bodySmall.fontSize};
    line-height: ${theme.typography.bodySmall.lineHeight};
    color: ${theme.colors.text.secondary};
  `,
  externalHeading: css`
    justify-content: flex-start;
  `,
  externalWarningIcon: css`
    margin: ${theme.spacing(0, 1)};
    fill: ${theme.colors.warning.main};
  `,
  externalDs: css`
    display: grid;
    gap: ${theme.spacing(1)};
    padding: ${theme.spacing(2, 0)};
  `,
  externalDsCTA: css`
    margin: ${theme.spacing(2, 0)};
  `,
});
