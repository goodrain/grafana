import { css } from '@emotion/css';
import Prism from 'prismjs';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Node } from 'slate';

import { GrafanaTheme2, isValidGoDuration, SelectableValue, toOption } from '@grafana/data';
import { FetchError, getTemplateSrv, isFetchError, TemplateSrv } from '@grafana/runtime';
import {
  InlineFieldRow,
  InlineField,
  Input,
  QueryField,
  SlatePrism,
  BracesPlugin,
  TypeaheadInput,
  TypeaheadOutput,
  Alert,
  useStyles2,
  fuzzyMatch,
  Select,
} from '@grafana/ui';
import { notifyApp } from 'app/core/actions';
import { createErrorNotification } from 'app/core/copy/appNotification';
import { dispatch } from 'app/store/store';

import { DEFAULT_LIMIT, TempoDatasource } from '../datasource';
import TempoLanguageProvider from '../language_provider';
import { tokenizer } from '../syntax';
import { TempoQuery } from '../types';

interface Props {
  datasource: TempoDatasource;
  query: TempoQuery;
  onChange: (value: TempoQuery) => void;
  onBlur?: () => void;
  onRunQuery: () => void;
}

const PRISM_LANGUAGE = 'tempo';
const durationPlaceholder = '例如: e.g. 1.2s, 100ms';
const plugins = [
  BracesPlugin(),
  SlatePrism({
    onlyIn: (node: Node) => node.object === 'block' && node.type === 'code_block',
    getSyntax: () => PRISM_LANGUAGE,
  }),
];

Prism.languages[PRISM_LANGUAGE] = tokenizer;

const NativeSearch = ({ datasource, query, onChange, onBlur, onRunQuery }: Props) => {
  const styles = useStyles2(getStyles);
  const languageProvider = useMemo(() => new TempoLanguageProvider(datasource), [datasource]);
  const [hasSyntaxLoaded, setHasSyntaxLoaded] = useState(false);
  const [serviceOptions, setServiceOptions] = useState<Array<SelectableValue<string>>>();
  const [spanOptions, setSpanOptions] = useState<Array<SelectableValue<string>>>();
  const [error, setError] = useState<Error | FetchError | null>(null);
  const [inputErrors, setInputErrors] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState<{
    serviceName: boolean;
    spanName: boolean;
  }>({
    serviceName: false,
    spanName: false,
  });

  const loadOptions = useCallback(
    async (name: string, query = '') => {
      const lpName = name === 'serviceName' ? 'service.name' : 'name';
      setIsLoading((prevValue) => ({ ...prevValue, [name]: true }));

      try {
        const options = await languageProvider.getOptions(lpName);
        const filteredOptions = options.filter((item) => (item.value ? fuzzyMatch(item.value, query).found : false));
        return filteredOptions;
      } catch (error) {
        if (isFetchError(error) && error?.status === 404) {
          setError(error);
        } else if (error instanceof Error) {
          dispatch(notifyApp(createErrorNotification('Error', error)));
        }
        return [];
      } finally {
        setIsLoading((prevValue) => ({ ...prevValue, [name]: false }));
      }
    },
    [languageProvider]
  );

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [services, spans] = await Promise.all([loadOptions('serviceName'), loadOptions('spanName')]);
        if (query.serviceName && getTemplateSrv().containsTemplate(query.serviceName)) {
          services.push(toOption(query.serviceName));
        }
        setServiceOptions(services);
        if (query.spanName && getTemplateSrv().containsTemplate(query.spanName)) {
          spans.push(toOption(query.spanName));
        }
        setSpanOptions(spans);
      } catch (error) {
        // Display message if Tempo is connected but search 404's
        if (isFetchError(error) && error?.status === 404) {
          setError(error);
        } else if (error instanceof Error) {
          dispatch(notifyApp(createErrorNotification('Error', error)));
        }
      }
    };
    fetchOptions();
  }, [languageProvider, loadOptions, query.serviceName, query.spanName]);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        await languageProvider.start();
        setHasSyntaxLoaded(true);
      } catch (error) {
        if (error instanceof Error) {
          dispatch(notifyApp(createErrorNotification('Error', error)));
        }
      }
    };
    fetchTags();
  }, [languageProvider]);

  const onTypeahead = useCallback(
    async (typeahead: TypeaheadInput): Promise<TypeaheadOutput> => {
      return await languageProvider.provideCompletionItems(typeahead);
    },
    [languageProvider]
  );

  const cleanText = useCallback((text: string) => {
    const splittedText = text.split(/\s+(?=([^"]*"[^"]*")*[^"]*$)/g);
    if (splittedText.length > 1) {
      return splittedText[splittedText.length - 1];
    }
    return text;
  }, []);

  const onKeyDown = (keyEvent: React.KeyboardEvent) => {
    if (keyEvent.key === 'Enter' && (keyEvent.shiftKey || keyEvent.ctrlKey)) {
      onRunQuery();
    }
  };

  const onSpanNameChange = (v: SelectableValue<string>) => {
    // If the 'x' icon is clicked to clear the selected span name, remove spanName from the query object.
    if (!v) {
      delete query.spanName;
      return;
    }
    if (spanOptions?.find((obj) => obj.value === v.value)) {
      onChange({
        ...query,
        spanName: v.value,
      });
    }
  };

  const handleOnChange = useCallback(
    (value) => {
      onChange({
        ...query,
        search: value,
      });
    },
    [onChange, query]
  );

  const templateSrv: TemplateSrv = getTemplateSrv();

  return (
    <>
      <div className={styles.container}>
        <InlineFieldRow>
          <InlineField label="Service 名称" labelWidth={14} grow>
            <Select
              inputId="service"
              options={serviceOptions}
              onOpenMenu={() => {
                loadOptions('serviceName');
              }}
              isLoading={isLoading.serviceName}
              value={serviceOptions?.find((v) => v?.value === query.serviceName) || undefined}
              onChange={(v) => {
                onChange({
                  ...query,
                  serviceName: v?.value || undefined,
                });
              }}
              placeholder="选择 Service"
              isClearable
              onKeyDown={onKeyDown}
              aria-label={'select-service-name'}
              allowCustomValue={true}
            />
          </InlineField>
        </InlineFieldRow>
        <InlineFieldRow>
          <InlineField label="Span 名称" labelWidth={14} grow>
            <Select
              inputId="spanName"
              options={spanOptions}
              onOpenMenu={() => {
                loadOptions('spanName');
              }}
              isLoading={isLoading.spanName}
              onChange={onSpanNameChange}
              placeholder="选择 Span"
              isClearable
              onKeyDown={onKeyDown}
              aria-label={'select-span-name'}
              allowCustomValue={true}
            />
          </InlineField>
        </InlineFieldRow>
        <InlineFieldRow>
          <InlineField label="标签" labelWidth={14} grow tooltip="值应该在logfmt中">
            <QueryField
              additionalPlugins={plugins}
              query={query.search}
              onTypeahead={onTypeahead}
              onBlur={onBlur}
              onChange={handleOnChange}
              cleanText={cleanText}
              placeholder="http.status_code=200 error=true"
              onRunQuery={onRunQuery}
              syntaxLoaded={hasSyntaxLoaded}
              portalOrigin="tempo"
            />
          </InlineField>
        </InlineFieldRow>
        <InlineFieldRow>
          <InlineField label="最小间隔" invalid={!!inputErrors.minDuration} labelWidth={14} grow>
            <Input
              id="minDuration"
              value={query.minDuration || ''}
              placeholder={durationPlaceholder}
              onBlur={() => {
                const templatedMinDuration = templateSrv.replace(query.minDuration ?? '');
                if (query.minDuration && !isValidGoDuration(templatedMinDuration)) {
                  setInputErrors({ ...inputErrors, minDuration: true });
                } else {
                  setInputErrors({ ...inputErrors, minDuration: false });
                }
              }}
              onChange={(v) =>
                onChange({
                  ...query,
                  minDuration: v.currentTarget.value,
                })
              }
              onKeyDown={onKeyDown}
            />
          </InlineField>
        </InlineFieldRow>
        <InlineFieldRow>
          <InlineField label="最大间隔" invalid={!!inputErrors.maxDuration} labelWidth={14} grow>
            <Input
              id="maxDuration"
              value={query.maxDuration || ''}
              placeholder={durationPlaceholder}
              onBlur={() => {
                const templatedMaxDuration = templateSrv.replace(query.maxDuration ?? '');
                if (query.maxDuration && !isValidGoDuration(templatedMaxDuration)) {
                  setInputErrors({ ...inputErrors, maxDuration: true });
                } else {
                  setInputErrors({ ...inputErrors, maxDuration: false });
                }
              }}
              onChange={(v) =>
                onChange({
                  ...query,
                  maxDuration: v.currentTarget.value,
                })
              }
              onKeyDown={onKeyDown}
            />
          </InlineField>
        </InlineFieldRow>
        <InlineFieldRow>
          <InlineField
            label="限制"
            invalid={!!inputErrors.limit}
            labelWidth={14}
            grow
            tooltip="返回结果的最大数目"
          >
            <Input
              id="limit"
              value={query.limit || ''}
              placeholder={`默认: ${DEFAULT_LIMIT}`}
              type="number"
              onChange={(v) => {
                let limit = v.currentTarget.value ? parseInt(v.currentTarget.value, 10) : undefined;
                if (limit && (!Number.isInteger(limit) || limit <= 0)) {
                  setInputErrors({ ...inputErrors, limit: true });
                } else {
                  setInputErrors({ ...inputErrors, limit: false });
                }

                onChange({
                  ...query,
                  limit: v.currentTarget.value ? parseInt(v.currentTarget.value, 10) : undefined,
                });
              }}
              onKeyDown={onKeyDown}
            />
          </InlineField>
        </InlineFieldRow>
      </div>
      {error ? (
        <Alert title="无法连接到Tempo搜索" severity="info" className={styles.alert}>
          请确保Tempo已配置为启用搜索。如果你想隐藏这个标签，你可以在
          <a href={`/datasources/edit/${datasource.uid}`}>数据源设置</a>中配置它.
        </Alert>
      ) : null}
    </>
  );
};

export default NativeSearch;

const getStyles = (theme: GrafanaTheme2) => ({
  container: css`
    max-width: 500px;
  `,
  alert: css`
    max-width: 75ch;
    margin-top: ${theme.spacing(2)};
  `,
});
