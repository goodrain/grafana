import { css } from '@emotion/css';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDebounce } from 'react-use';

import { dateTime, GrafanaTheme2 } from '@grafana/data';
import { Badge, useStyles2 } from '@grafana/ui';
import { useDispatch } from 'app/types';
import { Alert, AlertingRule } from 'app/types/unified-alerting';

import { useCombinedRuleNamespaces } from '../../hooks/useCombinedRuleNamespaces';
import { fetchAllPromAndRulerRulesAction } from '../../state/actions';
import { MatcherFieldValue, SilenceFormFields } from '../../types/silence-form';
import { findAlertInstancesWithMatchers } from '../../utils/matchers';
import { isAlertingRule } from '../../utils/rules';
import { AlertLabels } from '../AlertLabels';
import { DynamicTable, DynamicTableColumnProps, DynamicTableItemProps } from '../DynamicTable';
import { AlertStateTag } from '../rules/AlertStateTag';

type MatchedRulesTableItemProps = DynamicTableItemProps<{
  matchedInstance: Alert;
}>;
type MatchedRulesTableColumnProps = DynamicTableColumnProps<{ matchedInstance: Alert }>;

export const MatchedSilencedRules = () => {
  const [matchedAlertRules, setMatchedAlertRules] = useState<MatchedRulesTableItemProps[]>([]);
  const formApi = useFormContext<SilenceFormFields>();
  const dispatch = useDispatch();
  const { watch } = formApi;
  const matchers: MatcherFieldValue[] = watch('matchers');
  const styles = useStyles2(getStyles);
  const columns = useColumns();

  useEffect(() => {
    dispatch(fetchAllPromAndRulerRulesAction());
  }, [dispatch]);

  const combinedNamespaces = useCombinedRuleNamespaces();
  useDebounce(
    () => {
      const matchedInstances = combinedNamespaces.flatMap((namespace) => {
        return namespace.groups.flatMap((group) => {
          return group.rules
            .map((combinedRule) => combinedRule.promRule)
            .filter((rule): rule is AlertingRule => isAlertingRule(rule))
            .flatMap((rule) => findAlertInstancesWithMatchers(rule.alerts ?? [], matchers));
        });
      });
      setMatchedAlertRules(matchedInstances);
    },
    500,
    [combinedNamespaces, matchers]
  );

  return (
    <div>
      <h4 className={styles.title}>
        受影响的警报实例
        {matchedAlertRules.length > 0 ? (
          <Badge className={styles.badge} color="blue" text={matchedAlertRules.length} />
        ) : null}
      </h4>
      <div className={styles.table}>
        {matchers.every((matcher) => !matcher.value && !matcher.name) ? (
          <span>添加有效的匹配以查看受影响的警报</span>
        ) : (
          <>
            <DynamicTable items={matchedAlertRules.slice(0, 5) ?? []} isExpandable={false} cols={columns} />
            {matchedAlertRules.length > 5 && (
              <div className={styles.moreMatches}>和 {matchedAlertRules.length - 5} 更多</div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

function useColumns(): MatchedRulesTableColumnProps[] {
  return [
    {
      id: 'state',
      label: '状态',
      renderCell: function renderStateTag({ data: { matchedInstance } }) {
        return <AlertStateTag state={matchedInstance.state} />;
      },
      size: '160px',
    },
    {
      id: 'labels',
      label: '标签',
      renderCell: function renderName({ data: { matchedInstance } }) {
        return <AlertLabels labels={matchedInstance.labels} />;
      },
      size: '250px',
    },
    {
      id: 'created',
      label: '创建',
      renderCell: function renderSummary({ data: { matchedInstance } }) {
        return (
          <>
            {matchedInstance.activeAt.startsWith('0001')
              ? '-'
              : dateTime(matchedInstance.activeAt).format('YYYY-MM-DD HH:mm:ss')}
          </>
        );
      },
      size: '400px',
    },
  ];
}

const getStyles = (theme: GrafanaTheme2) => ({
  table: css`
    max-width: ${theme.breakpoints.values.lg}px;
  `,
  moreMatches: css`
    margin-top: ${theme.spacing(1)};
  `,
  title: css`
    display: flex;
    align-items: center;
  `,
  badge: css`
    margin-left: ${theme.spacing(1)};
  `,
});
