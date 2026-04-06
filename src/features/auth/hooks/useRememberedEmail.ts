'use client';

import { useEffect } from 'react';
import type { FieldPath, FieldValues, UseFormSetValue, UseFormWatch } from 'react-hook-form';

const EMAIL_STORAGE_KEY = 'novastore-login-email';

type UseRememberedEmailParams<TFormValues extends FieldValues> = {
  fieldName: FieldPath<TFormValues>;
  setValue: UseFormSetValue<TFormValues>;
  watch: UseFormWatch<TFormValues>;
};

export function useRememberedEmail<TFormValues extends FieldValues>({
  fieldName,
  setValue,
  watch,
}: UseRememberedEmailParams<TFormValues>) {
  const email = watch(fieldName);

  useEffect(() => {
    const savedEmail = window.localStorage.getItem(EMAIL_STORAGE_KEY);

    if (!savedEmail) {
      return;
    }

    setValue(fieldName, savedEmail as TFormValues[FieldPath<TFormValues>], {
      shouldDirty: false,
      shouldTouch: false,
      shouldValidate: false,
    });
  }, [fieldName, setValue]);

  useEffect(() => {
    if (typeof email !== 'string') {
      return;
    }

    if (email.trim()) {
      window.localStorage.setItem(EMAIL_STORAGE_KEY, email);
      return;
    }

    window.localStorage.removeItem(EMAIL_STORAGE_KEY);
  }, [email]);
}
