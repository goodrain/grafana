import { css, cx } from '@emotion/css';
import React from 'react';

import { dateTimeFormat, GrafanaTheme2, TimeZone } from '@grafana/data';
import { DeleteButton, Icon, Tooltip, useStyles2, useTheme2 } from '@grafana/ui';
import { ApiKey } from 'app/types';

interface Props {
  tokens: ApiKey[];
  timeZone: TimeZone;
  tokenActionsDisabled?: boolean;
  onDelete: (token: ApiKey) => void;
}

export const ServiceAccountTokensTable = ({ tokens, timeZone, tokenActionsDisabled, onDelete }: Props): JSX.Element => {
  const theme = useTheme2();
  const styles = getStyles(theme);

  return (
    <table className={cx(styles.section, 'filter-table')}>
      <thead>
        <tr>
          <th>名称</th>
          <th>到期</th>
          <th>创建</th>
          <th>最后使用于</th>
          <th />
          <th />
        </tr>
      </thead>
      <tbody>
        {tokens.map((key) => {
          return (
            <tr key={key.id} className={styles.tableRow(key.hasExpired || key.isRevoked)}>
              <td>{key.name}</td>
              <td>
                <TokenExpiration timeZone={timeZone} token={key} />
              </td>
              <td>{formatDate(timeZone, key.created)}</td>
              <td>{formatLastUsedAtDate(timeZone, key.lastUsedAt)}</td>
              <td className="width-1 text-center">{key.isRevoked && <TokenRevoked />}</td>
              <td>
                <DeleteButton
                  aria-label={`删除服务帐户令牌${key.name}`}
                  size="sm"
                  onConfirm={() => onDelete(key)}
                  disabled={tokenActionsDisabled}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

function formatLastUsedAtDate(timeZone: TimeZone, lastUsedAt?: string): string {
  if (!lastUsedAt) {
    return '从来没有';
  }
  return dateTimeFormat(lastUsedAt, { timeZone });
}

function formatDate(timeZone: TimeZone, expiration?: string): string {
  if (!expiration) {
    return '无有效期';
  }
  return dateTimeFormat(expiration, { timeZone });
}

function formatSecondsLeftUntilExpiration(secondsUntilExpiration: number): string {
  const days = Math.ceil(secondsUntilExpiration / (3600 * 24));
  const daysFormat = days > 1 ? `${days} days` : `${days} day`;
  return `Expires in ${daysFormat}`;
}

const TokenRevoked = () => {
  const styles = useStyles2(getStyles);
  return (
    <span className={styles.hasExpired}>
      撤销
      <span className={styles.tooltipContainer}>
        <Tooltip content="此令牌已被公开。请旋转此令牌">
          <Icon name="exclamation-triangle" className={styles.toolTipIcon} />
        </Tooltip>
      </span>
    </span>
  );
};

interface TokenExpirationProps {
  timeZone: TimeZone;
  token: ApiKey;
}

const TokenExpiration = ({ timeZone, token }: TokenExpirationProps) => {
  const styles = useStyles2(getStyles);
  if (!token.expiration) {
    return <span className={styles.neverExpire}>Never</span>;
  }
  if (token.secondsUntilExpiration) {
    return (
      <span className={styles.secondsUntilExpiration}>
        {formatSecondsLeftUntilExpiration(token.secondsUntilExpiration)}
      </span>
    );
  }
  if (token.hasExpired) {
    return (
      <span className={styles.hasExpired}>
        过期
        <span className={styles.tooltipContainer}>
          <Tooltip content="此令牌已过期">
            <Icon name="exclamation-triangle" className={styles.toolTipIcon} />
          </Tooltip>
        </span>
      </span>
    );
  }
  return <span>{formatDate(timeZone, token.expiration)}</span>;
};

const getStyles = (theme: GrafanaTheme2) => ({
  tableRow: (hasExpired: boolean | undefined) => css`
    color: ${hasExpired ? theme.colors.text.secondary : theme.colors.text.primary};
  `,
  tooltipContainer: css`
    margin-left: ${theme.spacing(1)};
  `,
  toolTipIcon: css`
    color: ${theme.colors.error.text};
  `,
  secondsUntilExpiration: css`
    color: ${theme.colors.warning.text};
  `,
  hasExpired: css`
    color: ${theme.colors.error.text};
  `,
  neverExpire: css`
    color: ${theme.colors.text.secondary};
  `,
  section: css`
    margin-bottom: ${theme.spacing(4)};
  `,
});
