import React from 'react';

import { useFormik } from 'formik';
import { gql } from 'apollo-boost';
import { useHistory } from 'react-router-dom';
import { Input, Button, Typography } from 'antd';
import { useMutation } from '@apollo/react-hooks';

import styles from './Login.module.scss';

const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

interface Values {
  email?: string;
  password?: string;
}

interface Login {
  login: {
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

  return errors;
};

const { Title } = Typography;

const Login: React.FC = () => {
  const history = useHistory();
  const [singUp] = useMutation<Login>(LOGIN);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate,
    onSubmit: (values) => {
      singUp({ variables: values })
        .then(({ data, errors }) => {
          if (errors || !data) throw errors;

          const { token } = data.login;
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
        <Title level={2}>Login</Title>
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
          Login
        </Button>
      </form>
    </div>
  );
};

export default Login;
