import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import AppLayout from '../components/AppLayout';
import PostForm from '../components/PostForm';
import PostCard from '../components/PostCard';
import { LOAD_POSTS_REQUEST } from '../reducers/post';
import { LOAD_MY_INFO_REQUEST } from '../reducers/user';

const Home = () => {
  const dispatch = useDispatch();
  const me = useSelector(({ user }) => user.me);
  const mainPosts = useSelector(({ post }) => post.mainPosts);
  const hasMorePosts = useSelector(({ post }) => post.hasMorePosts);
  const loadPostsLoading = useSelector(({ post }) => post.loadPostsLoading);

  useEffect(() => {
    dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
    // 컴포넌트 첫 마운트에 posts 요청
    dispatch({
      type: LOAD_POSTS_REQUEST,
    });
  }, []);

  useEffect(() => {
    function onScroll() {
      if (window.scrollY + document.documentElement.clientHeight
        > document.documentElement.scrollHeight - 300) {
        if (hasMorePosts && !loadPostsLoading) {
          dispatch({
            type: LOAD_POSTS_REQUEST,
          });
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    return () => { // 이벤트 리스너 해제, 안 그러면 메모리에 쌓인다
      window.removeEventListener('scroll', onScroll);
    };
  }, [hasMorePosts, loadPostsLoading]);

  return (
    <AppLayout>
      {me && <PostForm />}
      {mainPosts.map((post) => <PostCard key={post.id} post={post} />)}
    </AppLayout>
  );
};

export default Home;
