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
  const { me, logOutLoading } = useSelector(state => state.user);
  const onLogOut = useCallback(() => {
    dispatch(logOutRequestAction());
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">짹짹<br />{me.Post.length}</div>,
        <div key="following" >팔로잉<br />{me.Followings.length}</div>,
        <div key="follower" >팔로워<br />{me.Followers.length}</div>,
      ]}>
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <LogOutButton onClick={onLogOut} loading={logOutLoading}>로그아웃</LogOutButton>
    </Card >
  );
}

export default UserProfile;