import { Card, Avatar, Button } from 'antd';
import { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { logOutRequestAction } from '../reducers/user';

const LogOutButton = styled(Button)`
  margin-top: 15px;
`;

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, isLoggingOut } = useSelector(state => state.user);
  const onLogOut = useCallback(() => {
    dispatch(logOutRequestAction());
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">짹짹<br /></div>,
        <div key="following" >팔로잉<br /></div>,
        <div key="follower" >팔로워<br /></div>,
      ]}>
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <LogOutButton onClick={onLogOut} loading={isLoggingOut}>로그아웃</LogOutButton>
    </Card >
  );
}

export default UserProfile;