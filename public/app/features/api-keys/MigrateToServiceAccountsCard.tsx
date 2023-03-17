import { css } from '@emotion/css';
import React, { useState } from 'react';

import { GrafanaTheme2 } from '@grafana/data';
import { Alert, Button, ConfirmModal, useStyles2 } from '@grafana/ui';

interface Props {
  onMigrate: () => void;
  disabled?: boolean;
}

export const MigrateToServiceAccountsCard = ({ onMigrate, disabled }: Props): JSX.Element => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const styles = useStyles2(getStyles);

  const docsLink = (
    <a
      className="external-link"
      href="https://grafana.com/docs/grafana/latest/administration/api-keys/#migrate-api-keys-to-grafana-service-accounts/"
      target="_blank"
      rel="noopener noreferrer"
    >
      了解更多。
    </a>
  );
  const migrationBoxDesc = (
    <span>您确定要将所有API密钥迁移到服务帐户吗? 点击这里 {docsLink}</span>
  );

  return (
    <Alert title="从API密钥切换到服务帐户" severity="info">
      <div className={styles.text}> 
      每个API密钥都将自动迁移到带有令牌的服务帐户中。服务帐户将为使用与API密钥相同的权限创建的API密钥和当前的API密钥将继续工作。
      </div>
      <div className={styles.actionRow}>
        <Button className={styles.actionButton} onClick={() => setIsModalOpen(true)}>
        现在迁移到服务帐户
        </Button>
        <ConfirmModal
          title={'将API密钥迁移到服务帐户'}
          isOpen={isModalOpen}
          body={migrationBoxDesc}
          confirmText={'确定迁移'}
          onConfirm={onMigrate}
          onDismiss={() => setIsModalOpen(false)}
        />
      </div>
    </Alert>
  );
};

export const getStyles = (theme: GrafanaTheme2) => ({
  text: css`
    margin-bottom: ${theme.spacing(2)};
  `,
  actionRow: css`
    display: flex;
    align-items: center;
  `,
  actionButton: css`
    margin-right: ${theme.spacing(2)};
  `,
});
