import { css } from '@emotion/css';
import React, { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { GrafanaTheme2 } from '@grafana/data';
import { Field, InlineFieldRow, InlineField, Input, Button, IconButton, useStyles2 } from '@grafana/ui';

import { MuteTimingFields } from '../../types/mute-timing-form';

interface Props {
  intervalIndex: number;
}

export const MuteTimingTimeRange: FC<Props> = ({ intervalIndex }) => {
  const styles = useStyles2(getStyles);
  const { register, formState } = useFormContext<MuteTimingFields>();

  const {
    fields: timeRanges,
    append: addTimeRange,
    remove: removeTimeRange,
  } = useFieldArray<MuteTimingFields>({
    name: `time_intervals.${intervalIndex}.times`,
  });

  const validateTime = (timeString: string) => {
    if (!timeString) {
      return true;
    }
    const [hour, minutes] = timeString.split(':').map((x) => parseInt(x, 10));
    const isHourValid = hour >= 0 && hour < 25;
    const isMinuteValid = minutes > -1 && minutes < 60;
    const isTimeValid = hour === 24 ? minutes === 0 : isHourValid && isMinuteValid;

    return isTimeValid || 'Time is invalid';
  };

  const formErrors = formState.errors.time_intervals?.[intervalIndex];
  const timeRangeInvalid = formErrors?.times?.some((value) => value?.start_time || value?.end_time) ?? false;

  return (
    <div>
      <Field
        className={styles.field}
        label="时间范围"
        description="UTC格式中包含开始时间但不包含结束时间的时间"
        invalid={timeRangeInvalid}
        error={timeRangeInvalid ? '时间必须在UTC时间00:00到24:00之间' : ''}
      >
        <>
          {timeRanges.map((timeRange, index) => {
            return (
              <div className={styles.timeRange} key={timeRange.id}>
                <InlineFieldRow>
                  <InlineField label="开始时间" invalid={!!formErrors?.times?.[index]?.start_time}>
                    <Input
                      {...register(`time_intervals.${intervalIndex}.times.${index}.start_time`, {
                        validate: validateTime,
                      })}
                      className={styles.timeRangeInput}
                      // @ts-ignore react-hook-form doesn't handle nested field arrays well
                      defaultValue={timeRange.start_time}
                      placeholder="HH:MM"
                      data-testid="mute-timing-starts-at"
                    />
                  </InlineField>
                  <InlineField label="结束时间" invalid={!!formErrors?.times?.[index]?.end_time}>
                    <Input
                      {...register(`time_intervals.${intervalIndex}.times.${index}.end_time`, {
                        validate: validateTime,
                      })}
                      className={styles.timeRangeInput}
                      // @ts-ignore react-hook-form doesn't handle nested field arrays well
                      defaultValue={timeRange.end_time}
                      placeholder="HH:MM"
                      data-testid="mute-timing-ends-at"
                    />
                  </InlineField>
                  <IconButton
                    className={styles.deleteTimeRange}
                    title={'Remove'}
                    name={'trash-alt'}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeTimeRange(index);
                    }}
                  />
                </InlineFieldRow>
              </div>
            );
          })}
        </>
      </Field>
      <Button
        className={styles.addTimeRange}
        variant="secondary"
        type="button"
        icon={'plus'}
        onClick={() => addTimeRange({ start_time: '', end_time: '' })}
      >
        添加另一个时间范围
      </Button>
    </div>
  );
};

const getStyles = (theme: GrafanaTheme2) => ({
  field: css`
    margin-bottom: 0;
  `,
  timeRange: css`
    margin-bottom: ${theme.spacing(1)};
  `,
  timeRangeInput: css`
    width: 120px;
  `,
  deleteTimeRange: css`
    margin: ${theme.spacing(1)} 0 0 ${theme.spacing(0.5)};
  `,
  addTimeRange: css`
    margin-bottom: ${theme.spacing(2)};
  `,
});
