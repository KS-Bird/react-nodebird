import { Card, Avatar, Button } from 'antd';
import { useCallback } from 'react';
import styled from 'styled-components';

const LogOutButton = styled(Button)`
  margin-top: 15px;
`;

const UserProfile = ({ setIsLoggedIn }) => {
  const onLogOut = useCallback(() => {
    setIsLoggedIn(false);
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