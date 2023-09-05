import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { END } from 'redux-saga';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Card, Avatar } from 'antd';
import axios from 'axios';

import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import { LOAD_USER_POSTS_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST, LOAD_USER_REQUEST } from '../../reducers/user';
import wrapper from '../../store/configureStore';

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id } = router.query; // 유저 ID
  const mainPosts = useSelector(({ post }) => post.mainPosts);
  const hasMorePosts = useSelector(({ post }) => post.hasMorePosts);
  const loadPostsLoading = useSelector(({ post }) => post.loadPostsLoading);
  const userInfo = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight
        > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_USER_POSTS_REQUEST,
            lastId: mainPosts[mainPosts.length - 1]?.id,
            data: id,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, id, mainPosts.length]);

  return (
    <AppLayout>
      {userInfo
        ? (
          <>
            <Head>
              <title>{userInfo.nickname}</title>
              <meta name='description' content={`${userInfo.nickname}님의 게시글`} />
              <meta property='og:title' content={`${userInfo.nickname}님의 게시글`} />
              <meta property='og:description' content={`${userInfo.nickname}님의 게시글`} />
              <meta property='og:image' content='https://nodebird.com/favicon.ico' />
              <meta property='og:url' content={`https://nodebird.com/user/'${id}`} />
            </Head>
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
              />
            </Card>
            {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
          </>
        ) : '존재하지 않는 유저입니다.'}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, params }) => {
  axios.defaults.headers.Cookie = req?.headers.cookie;
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  store.dispatch({
    type: LOAD_USER_REQUEST,
    data: params.id,
  });
  store.dispatch({
    type: LOAD_USER_POSTS_REQUEST,
    data: params.id,
  });
  store.dispatch(END);
  await store.sagaTask.toPromise();
  axios.defaults.headers.Cookie = '';

  return { props: {} };
});

export default User;
