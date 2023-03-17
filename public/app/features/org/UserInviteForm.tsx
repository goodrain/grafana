import React from 'react';

import { locationUtil } from '@grafana/data';
import { Stack } from '@grafana/experimental';
import { locationService } from '@grafana/runtime';
import { Button, LinkButton, Input, Switch, RadioButtonGroup, Form, Field, InputControl, FieldSet } from '@grafana/ui';
import { getConfig } from 'app/core/config';
import { OrgRole, useDispatch } from 'app/types';

import { addInvitee } from '../invites/state/actions';

const roles = [
  { label: 'Viewer', value: OrgRole.Viewer },
  { label: 'Editor', value: OrgRole.Editor },
  { label: 'Admin', value: OrgRole.Admin },
];

export interface FormModel {
  role: OrgRole;
  name: string;
  loginOrEmail?: string;
  sendEmail: boolean;
  email: string;
}

const defaultValues: FormModel = {
  name: '',
  email: '',
  role: OrgRole.Editor,
  sendEmail: true,
};

export const UserInviteForm = () => {
  const dispatch = useDispatch();

  const onSubmit = async (formData: FormModel) => {
    await dispatch(addInvitee(formData)).unwrap();
    locationService.push('/org/users/');
  };

  return (
    <Form defaultValues={defaultValues} onSubmit={onSubmit}>
      {({ register, control, errors }) => {
        return (
          <>
            <FieldSet>
              <Field
                invalid={!!errors.loginOrEmail}
                error={!!errors.loginOrEmail ? '邮箱或者用户名必填' : undefined}
                label="邮箱或者用户名"
              >
                <Input {...register('loginOrEmail', { required: true })} placeholder="例如: email@example.com" />
              </Field>
              <Field invalid={!!errors.name} label="名称">
                <Input {...register('name')} placeholder="(optional)" />
              </Field>
              <Field invalid={!!errors.role} label="角色">
                <InputControl
                  render={({ field: { ref, ...field } }) => <RadioButtonGroup {...field} options={roles} />}
                  control={control}
                  name="role"
                />
              </Field>
              <Field label="发送邮件邀请">
                <Switch id="send-email-switch" {...register('sendEmail')} />
              </Field>
            </FieldSet>
            <Stack>
              <Button type="submit">提交</Button>
              <LinkButton href={locationUtil.assureBaseUrl(getConfig().appSubUrl + '/org/users')} variant="secondary">
                返回
              </LinkButton>
            </Stack>
          </>
        );
      }}
    </Form>
  );
};

export default UserInviteForm;
