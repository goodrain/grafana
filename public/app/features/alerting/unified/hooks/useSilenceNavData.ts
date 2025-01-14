import { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { NavModelItem } from '@grafana/data';

const defaultPageNav: Partial<NavModelItem> = {
  icon: 'bell-slash',
  breadcrumbs: [{ title: '静默', url: 'alerting/silences' }],
};

export function useSilenceNavData() {
  const { isExact, path } = useRouteMatch();
  const [pageNav, setPageNav] = useState<Pick<NavModelItem, 'id' | 'text' | 'icon'> | undefined>();

  useEffect(() => {
    if (path === '/alerting/silence/new') {
      setPageNav({
        ...defaultPageNav,
        id: 'silence-new',
        text: '添加静默',
      });
    } else if (path === '/alerting/silence/:id/edit') {
      setPageNav({
        ...defaultPageNav,
        id: 'silence-edit',
        text: '编辑静默',
      });
    }
  }, [path, isExact]);

  return pageNav;
}
