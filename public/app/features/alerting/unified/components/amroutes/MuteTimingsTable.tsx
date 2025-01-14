import { css } from '@emotion/css';
import React, { FC, useMemo, useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { IconButton, LinkButton, Link, useStyles2, ConfirmModal } from '@grafana/ui';
import { contextSrv } from 'app/core/services/context_srv';
import { AlertManagerCortexConfig, MuteTimeInterval, TimeInterval } from 'app/plugins/datasource/alertmanager/types';
import { useDispatch } from 'app/types';

import { Authorize } from '../../components/Authorize';
import { useUnifiedAlertingSelector } from '../../hooks/useUnifiedAlertingSelector';
import { deleteMuteTimingAction } from '../../state/actions';
import { getNotificationsPermissions } from '../../utils/access-control';
import {
  getTimeString,
  getWeekdayString,
  getDaysOfMonthString,
  getMonthsString,
  getYearsString,
} from '../../utils/alertmanager';
import { makeAMLink } from '../../utils/misc';
import { AsyncRequestState, initialAsyncRequestState } from '../../utils/redux';
import { DynamicTable, DynamicTableItemProps, DynamicTableColumnProps } from '../DynamicTable';
import { EmptyAreaWithCTA } from '../EmptyAreaWithCTA';
import { ProvisioningBadge } from '../Provisioning';

interface Props {
  alertManagerSourceName: string;
  muteTimingNames?: string[];
  hideActions?: boolean;
}

export const MuteTimingsTable: FC<Props> = ({ alertManagerSourceName, muteTimingNames, hideActions }) => {
  const styles = useStyles2(getStyles);
  const dispatch = useDispatch();
  const permissions = getNotificationsPermissions(alertManagerSourceName);
  const amConfigs = useUnifiedAlertingSelector((state) => state.amConfigs);
  const [muteTimingName, setMuteTimingName] = useState<string>('');
  const { result }: AsyncRequestState<AlertManagerCortexConfig> =
    (alertManagerSourceName && amConfigs[alertManagerSourceName]) || initialAsyncRequestState;

  const items = useMemo((): Array<DynamicTableItemProps<MuteTimeInterval>> => {
    const muteTimings = result?.alertmanager_config?.mute_time_intervals ?? [];
    const muteTimingsProvenances = result?.alertmanager_config?.muteTimeProvenances ?? {};

    return muteTimings
      .filter(({ name }) => (muteTimingNames ? muteTimingNames.includes(name) : true))
      .map((mute) => {
        return {
          id: mute.name,
          data: {
            ...mute,
            provenance: muteTimingsProvenances[mute.name],
          },
        };
      });
  }, [
    result?.alertmanager_config?.mute_time_intervals,
    result?.alertmanager_config?.muteTimeProvenances,
    muteTimingNames,
  ]);

  const columns = useColumns(alertManagerSourceName, hideActions, setMuteTimingName);

  return (
    <div className={styles.container}>
      {!hideActions && <h5>静默时间</h5>}
      {!hideActions && (
        <p>
          静默时间是一个指定的时间间隔，可以在通知策略树中引用，以便在一天中的特定时间静默特定的通知策略。
        </p>
      )}
      {!hideActions && items.length > 0 && (
        <Authorize actions={[permissions.create]}>
          <LinkButton
            className={styles.addMuteButton}
            icon="plus"
            variant="primary"
            href={makeAMLink('alerting/routes/mute-timing/new', alertManagerSourceName)}
          >
            新增静默计时
          </LinkButton>
        </Authorize>
      )}
      {items.length > 0 ? (
        <DynamicTable items={items} cols={columns} />
      ) : !hideActions ? (
        <EmptyAreaWithCTA
          text="您还没有创建任何静默计时"
          buttonLabel="添加静默计时"
          buttonIcon="plus"
          buttonSize="lg"
          href={makeAMLink('alerting/routes/mute-timing/new', alertManagerSourceName)}
          showButton={contextSrv.hasPermission(permissions.create)}
        />
      ) : (
        <p>没有配置静默计时</p>
      )}
      {!hideActions && (
        <ConfirmModal
          isOpen={!!muteTimingName}
          title="删除静默计时"
          body={`您确定要删除 "${muteTimingName}"吗`}
          confirmText="Delete"
          onConfirm={() => dispatch(deleteMuteTimingAction(alertManagerSourceName, muteTimingName))}
          onDismiss={() => setMuteTimingName('')}
        />
      )}
    </div>
  );
};

function useColumns(alertManagerSourceName: string, hideActions = false, setMuteTimingName: (name: string) => void) {
  const permissions = getNotificationsPermissions(alertManagerSourceName);

  const userHasEditPermissions = contextSrv.hasPermission(permissions.update);
  const userHasDeletePermissions = contextSrv.hasPermission(permissions.delete);
  const showActions = !hideActions && (userHasEditPermissions || userHasDeletePermissions);

  return useMemo((): Array<DynamicTableColumnProps<MuteTimeInterval>> => {
    const columns: Array<DynamicTableColumnProps<MuteTimeInterval>> = [
      {
        id: 'name',
        label: 'Name',
        renderCell: function renderName({ data }) {
          return (
            <>
              {data.name} {data.provenance && <ProvisioningBadge />}
            </>
          );
        },
        size: '250px',
      },
      {
        id: 'timeRange',
        label: 'Time range',
        renderCell: ({ data }) => renderTimeIntervals(data.time_intervals),
      },
    ];
    if (showActions) {
      columns.push({
        id: 'actions',
        label: 'Actions',
        renderCell: function renderActions({ data }) {
          if (data.provenance) {
            return (
              <div>
                <Link
                  href={makeAMLink(`/alerting/routes/mute-timing/edit`, alertManagerSourceName, {
                    muteName: data.name,
                  })}
                >
                  <IconButton name="file-alt" title="View mute timing" />
                </Link>
              </div>
            );
          }
          return (
            <div>
              <Authorize actions={[permissions.update]}>
                <Link
                  href={makeAMLink(`/alerting/routes/mute-timing/edit`, alertManagerSourceName, {
                    muteName: data.name,
                  })}
                >
                  <IconButton name="edit" title="Edit mute timing" />
                </Link>
              </Authorize>
              <Authorize actions={[permissions.delete]}>
                <IconButton
                  name={'trash-alt'}
                  title="Delete mute timing"
                  onClick={() => setMuteTimingName(data.name)}
                />
              </Authorize>
            </div>
          );
        },
        size: '100px',
      });
    }
    return columns;
  }, [alertManagerSourceName, setMuteTimingName, showActions, permissions]);
}

function renderTimeIntervals(timeIntervals: TimeInterval[]) {
  return timeIntervals.map((interval, index) => {
    const { times, weekdays, days_of_month, months, years } = interval;
    const timeString = getTimeString(times);
    const weekdayString = getWeekdayString(weekdays);
    const daysString = getDaysOfMonthString(days_of_month);
    const monthsString = getMonthsString(months);
    const yearsString = getYearsString(years);

    return (
      <React.Fragment key={JSON.stringify(interval) + index}>
        {`${timeString} ${weekdayString}`}
        <br />
        {[daysString, monthsString, yearsString].join(' | ')}
        <br />
      </React.Fragment>
    );
  });
}

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    display: flex;
    flex-flow: column nowrap;
  `,
  addMuteButton: css`
    margin-bottom: ${theme.spacing(2)};
    align-self: flex-end;
  `,
});
