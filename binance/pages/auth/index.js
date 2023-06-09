import { useState, useCallback } from 'react';

import useAuth from '../../state/useAuth';

import { Form, FormRow, Input } from '../../components/common/Form';

import { Button } from '../../components/common/Button';

import styles from './style.module.scss';

const AuthPage = () => {
  const [password, setPassword] = useState('');
  const { authMe } = useAuth();
  const [error, setError] = useState(null);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    const isNew = await authMe(password).catch((err) => setError(err.message));
    if (isNew) {
      alert(`
        New user has been created.
        Please, remember your password, otherwise you loose access to your funds.
      `);
    }
  }, [password, authMe]);

  return (
    <div className={styles.container}>
      <Form error={error} onSubmit={onSubmit}>
        <FormRow>
          <Input
            placeholder="Password"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </FormRow>
        <FormRow>
          <Button type="submit" fullWidth>Enter App</Button>
        </FormRow>
      </Form>
    </div>
  );
};

export default AuthPage;
