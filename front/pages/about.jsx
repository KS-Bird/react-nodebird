import { useSelector } from "react-redux";
import Head from 'next/head';
import { END } from 'redux-saga';
import { Card, Avatar } from 'antd';

import wrapper from "../store/configureStore";
import AppLayout from "../components/AppLayout";
import { LOAD_USER_REQUEST } from "../reducers/user";

const About = () => {
  const userInfo = useSelector((store) => store.user.userInfo);

  return (
    <AppLayout>
      <Head>
        <title>About | NodeBird</title>
      </Head>
      {userInfo ? (
        <Card
          actions={[
            <div key="twit">짹짹<br />{userInfo.Posts}</div>,
            <div key="following">팔로잉<br />{userInfo.Followings}</div>,
            <div key="follower">팔로워<br />{userInfo.Followers}</div>,
          ]}
        >
          <Card.Meta
            avatar={<Avatar>{userInfo.nickname[0]}</Avatar>}
            title={userInfo.nickname}
            description="규석"
          />
        </Card>
      ) : null}
    </AppLayout>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  store.dispatch({
    type: LOAD_USER_REQUEST,
    data: 3,
  });
  store.dispatch(END);
  await store.sagaTask.toPromise();
});

export default About;
