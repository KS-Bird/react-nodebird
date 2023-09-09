import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { END } from 'redux-saga';
import { useRouter } from 'next/router';
import axios from 'axios';

import AppLayout from '../../components/AppLayout';
import PostCard from '../../components/PostCard';
import { LOAD_HASHTAG_POSTS_REQUEST } from '../../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../../reducers/user';
import wrapper from '../../store/configureStore';

const User = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { tag } = router.query; // 유저 ID
  const mainPosts = useSelector(({ post }) => post.mainPosts);
  const hasMorePosts = useSelector(({ post }) => post.hasMorePosts);
  const loadPostsLoading = useSelector(({ post }) => post.loadPostsLoading);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight
        > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_HASHTAG_POSTS_REQUEST,
            lastId: mainPosts[mainPosts.length - 1]?.id,
            data: tag,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, tag, mainPosts.length]);

  return (
    <AppLayout>
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, params }) => {
  axios.defaults.headers.Cookie = req?.headers.cookie;
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  store.dispatch({
    type: LOAD_HASHTAG_POSTS_REQUEST,
    data: params.tag,
  });
  store.dispatch(END);
  await store.sagaTask.toPromise();
  axios.defaults.headers.Cookie = '';

  return { props: {} };
});

export default User;
