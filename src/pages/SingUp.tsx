import React from 'react';

import { useFormik } from 'formik';
import { useHistory } from 'react-router-dom';
import { Input, Button, Typography } from 'antd';
import { useMutation } from '@apollo/client';

import styles from './SingUp.module.scss';
import { SING_UP } from '../helpers/queries';

interface Values {
  name?: string;
  email?: string;
  password?: string;
}

interface SingUp {
  singUp: {
    token: string;
  };
}

const validate = (values: Values): Values => {
  const errors: Values = {};

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 6) {
    errors.password = 'Must be 6 characters or more';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.name) {
    errors.name = 'Required';
  }

  return errors;
};

const { Title } = Typography;

const SingUp: React.FC = () => {
  const history = useHistory();
  const [singUp] = useMutation<SingUp>(SING_UP);
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },
    validate,
    onSubmit: (values) => {
      singUp({ variables: values })
        .then(({ data, errors }) => {
          if (errors || !data) throw errors;

          const { token } = data.singUp;
          if (token) localStorage.setItem('token', token);
          history.replace('/');
        })
        .catch((err) => {
          alert('ops, something goes wrong');
        });
    },
  });

  return (
    <div className={styles.content}>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <Title level={2}>Sing Up</Title>
        <div className={styles.input}>
          <Input
            placeholder="Name"
            type="text"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
            onBlur={formik.handleBlur}
          />
          {formik.errors.name && formik.touched.name ? <span>{formik.errors.name}</span> : null}
        </div>
        <div className={styles.input}>
          <Input
            placeholder="Email"
            type="email"
            name="email"
            onChange={formik.handleChange}
            value={formik.values.email}
            onBlur={formik.handleBlur}
          />
          {formik.errors.email && formik.touched.email ? <span>{formik.errors.email}</span> : null}
        </div>
        <div className={styles.input}>
          <Input
            placeholder="Password"
            type="password"
            name="password"
            onChange={formik.handleChange}
            value={formik.values.password}
            onBlur={formik.handleBlur}
          />
          {formik.errors.password && formik.touched.password ? (
            <span>{formik.errors.password}</span>
          ) : null}
        </div>
        <Button block type="primary" htmlType="submit">
          Create Account
        </Button>
      </form>
    </div>
  );
};

export default SingUp;
