import { Card, Avatar, Button } from 'antd';
import { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';

import { logoutAction } from '../reducers';

const LogOutButton = styled(Button)`
  margin-top: 15px;
`;

const UserProfile = () => {
  const dispatch = useDispatch();
  const onLogOut = useCallback(() => {
    dispatch(logoutAction());
  }, [])

  return (
    <Card
      actions={[
        <div key="twit">짹짹<br /></div>,
        <div key="following" >팔로잉<br /></div>,
        <div key="follower" >팔로워<br /></div>,
      ]}>
      <Card.Meta
        avatar={<Avatar>KS</Avatar>}
        title="Kyuseok Park"
      />
      <LogOutButton onClick={onLogOut}>로그아웃</LogOutButton>
    </Card >
  );
}

export default UserProfile;