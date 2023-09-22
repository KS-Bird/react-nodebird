import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { END } from 'redux-saga';
import axios from 'axios';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import SelectFilter from '../components/SelectFilter';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';
import wrapper from '../store/configureStore';

const Home = () => {
  const dispatch = useDispatch();
  const me = useSelector(({ user }) => user.me);
  const mainPosts = useSelector(({ post }) => post.mainPosts);
  const hasMorePosts = useSelector(({ post }) => post.hasMorePosts);
  const loadPostsLoading = useSelector(({ post }) => post.loadPostsLoading);
  const retweetError = useSelector((state) => state.post.retweetError);
  const [postFilter, setPostFilter] = useState(LOAD_POSTS_REQUEST);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight
        > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          const lastId = mainPosts[mainPosts.length - 1]?.id;
          dispatch({
            type: postFilter,
            lastId,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => { // 이벤트 리스너 해제, 안 그러면 메모리에 쌓인다
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading, mainPosts.length, postFilter]);

  // 리트윗 에러 메시지
  useEffect(() => {
    if (retweetError) {
      alert(retweetError);
    }
  }, [retweetError]);

  return (
    <AppLayout>
      {me && <PostForm />}
      <SelectFilter setPostFilter={setPostFilter} />
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};

// 화면을 그리기 전에 프론트서버에서 실행됨
export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req }) => {
  // 쿠키를 넣는다
  // 새로고침시 로그인 요청
  axios.defaults.headers.Cookie = req?.headers.cookie;
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  // 컴포넌트 첫 마운트에 posts 요청
  store.dispatch({
    type: LOAD_POSTS_REQUEST,
  });
  store.dispatch(END);
  await store.sagaTask.toPromise();
  axios.defaults.headers.Cookie = ''; // 쿠키를 비운다
});

export default Home;
