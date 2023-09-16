// post/[id].jsx 다이나믹 라우팅 id가 1 2 3 4....
import { useRouter } from "next/router";
import axios from "axios";
import { END } from "redux-saga";
import { useSelector } from "react-redux";
import Head from "next/head";

import wrapper from '../../store/configureStore';
import AppLayout from "../../components/AppLayout";
import PostCard from "../../components/PostCard";
import { LOAD_MY_INFO_REQUEST } from "../../reducers/user";
import { LOAD_POST_REQUEST } from "../../reducers/post";

const Post = () => {
  const router = useRouter();
  const singlePost = useSelector((state) => state.post.singlePost);
  const { id } = router.query;
  return (
    <AppLayout>
      {singlePost
        ? (
          <>
            <Head>
              <title>
                {singlePost.User.nickname}님의 글
              </title>
              <meta name="description" content={singlePost.content} />
              <meta property="og:title" content={`${singlePost.User.nickname}님의 게시글`} />
              <meta property="og:description" content={singlePost.content} />
              <meta property="og:image" content={singlePost.Images[0] ? singlePost.Images[0].src : 'https://nodebird.com/favicon.ico'} />
              <meta property="og:url" content={`http://ksbird.site/post/${id}`} />
            </Head>
            <PostCard post={singlePost} />
          </>
        ) : <div>존재하지 않는 게시글입니다.</div>}
    </AppLayout>
  );
};

export default Post;

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, params }) => {
  axios.defaults.headers.Cookie = req?.headers.cookie;
  store.dispatch({
    type: LOAD_MY_INFO_REQUEST,
  });
  store.dispatch({
    type: LOAD_POST_REQUEST,
    data: params.id,
  });
  store.dispatch(END);
  await store.sagaTask.toPromise();
  axios.defaults.headers.Cookie = '';
});
