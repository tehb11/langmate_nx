import {
  FormikConfig,
  FormikValues,
  useFormik as useOriginalHook,
} from 'formik';
import { FormikErrors } from 'formik/dist/types';
import React, { useState } from 'react';

type Props<Values> = {
  initialValues: FormikConfig<Values>['initialValues'];
  onSubmit: FormikConfig<Values>['onSubmit'];
  validationSchema?: FormikConfig<Values>['validationSchema'];
  enableReinitialize?: FormikConfig<Values>['enableReinitialize'];
  validate?: (values: Values) => void | object | Promise<FormikErrors<Values>>;
};

export const useFormik = <Values extends FormikValues = FormikValues>(
  props: Props<Values>
) => {
  const [validateOnChange, setValidateOnChange] = useState(false);

  const formik = useOriginalHook<Values>({
    validateOnChange: validateOnChange,
    ...props,
    onSubmit: (...args) => {
      return props.onSubmit(...args);
    },
  });

  return {
    ...formik,
    handleChange: <F extends keyof Values>(field: F) => {
      return (value: Values[F]) => formik.setFieldValue(field as string, value);
    },

    handleSubmit: (e?: React.FormEvent<HTMLFormElement> | undefined) => {
      formik.handleSubmit(e);
      setValidateOnChange(true);
    },
  };
};
