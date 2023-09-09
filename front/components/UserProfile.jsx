import { Card, Avatar, Button } from 'antd';
import { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import { logOutRequestAction } from '../reducers/user';

const LogOutButton = styled(Button)`
  margin-top: 15px;
`;

const UserProfile = () => {
  const dispatch = useDispatch();
  const { me, logOutLoading } = useSelector((state) => state.user);
  const onLogOut = useCallback(() => {
    dispatch(logOutRequestAction());
  }, []);

  return (
    <Card
      actions={[
        <div key="twit">
          <Link href={`/user/${me.id}`}>
            <a>
              짹짹
              <br />
              {me.Posts.length}
            </a>
          </Link>
        </div>,
        <div key="following">
          <Link href="/profile">
            <a>
              팔로잉
              <br />
              {me.Followings.length}
            </a>
          </Link>
        </div>,
        <div key="follower">
          <Link href="/profile">
            <a>
              팔로워<br />{me.Followers.length}
            </a>
          </Link>
        </div>,
      ]}
    >
      <Card.Meta
        avatar={(
          <Link href={`/user/${me.id}`}>
            <a><Avatar>{me.nickname[0]}</Avatar></a>
          </Link>
        )}
        title={me.nickname}
      />
      <LogOutButton onClick={onLogOut} loading={logOutLoading}>로그아웃</LogOutButton>
    </Card>
  );
};

export default UserProfile;
