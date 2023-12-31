import { Card, Popover, Button, Avatar, List } from 'antd';
import { Comment } from '@ant-design/compatible';
import { RetweetOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';

import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import FollowButton from './FollowButton';
import {
  REMOVE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST,
  RETWEET_REQUEST, CHANGE_EDIT_MODE,
} from '../reducers/post';

dayjs.locale('ko');
dayjs.extend(relativeTime);

const PostCard = ({ post }) => {
  const dispatch = useDispatch();

  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const id = useSelector((state) => state.user.me?.id);

  const onLike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onUnlike = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onRetweet = useCallback(() => {
    if (!id) {
      return alert('로그인이 필요합니다.');
    }
    return dispatch({
      type: RETWEET_REQUEST,
      data: post.id,
    });
  }, [id]);

  const onChangeEditMode = useCallback(() => {
    if (id !== post.UserId) {
      return alert('로그인이 필요합니다.');
    }
    dispatch({
      type: CHANGE_EDIT_MODE,
      data: {
        postId: post.id,
        imagePaths: post.Images.map((v) => v.src),
      },
    });
  });

  const liked = post.Likers.find((v) => v.id === id);
  const removePostLoading = useSelector((state) => state.post.removePostLoading);

  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" onClick={onRetweet} />,
          liked
            ? <HeartTwoTone twoToneColor="red" key="heart" onClick={onUnlike} />
            : <HeartOutlined key="heart" onClick={onLike} />,
          <MessageOutlined key="comment" onClick={onToggleComment} />,
          <Popover
            key="more"
            content={(
              <Button.Group>
                {id === post.UserId
                  ? (
                    <>
                      {!post.RetweetId && <Button onClick={onChangeEditMode}>수정</Button>}
                      <Button
                        style={{ backgroundColor: 'tomato' }}
                        onClick={onRemovePost}
                        loading={removePostLoading}
                      >
                        삭제
                      </Button>
                    </>
                  )
                  : <Button>신고</Button>}
              </Button.Group>
            )}
          >
            <EllipsisOutlined />
          </Popover>,
        ]}
        title={post.RetweetId && `${post.User.nickname}님이 리트윗하셨습니다.`}
        extra={id && id !== post.UserId && <FollowButton post={post} />}
      >
        {post.RetweetId && post.Retweet
          ? (
            <Card
              cover={post.Retweet.Images[0]
                  && <PostImages images={post.Retweet.Images} />}
            >
              <div style={{ float: 'right' }}>{dayjs(post.createdAt).fromNow()}</div>
              <Card.Meta
                avatar={(
                  <Link href={`/user/${post.Retweet.User.id}`}>
                    <a><Avatar>{post.Retweet.User.nickname[0]}</Avatar></a>
                  </Link>
                      )}
                title={post.Retweet.User.nickname}
                description={(
                  <PostCardContent
                    postData={post.Retweet.content}
                  />
                      )}
              />
            </Card>
          )
          : (
            <>
              <div style={{ float: 'right' }}>{dayjs(post.createdAt).fromNow()}</div>
              <Card.Meta
                avatar={(
                  <Link href={`/user/${post.User.id}`}>
                    <a><Avatar>{post.User.nickname[0]}</Avatar></a>
                  </Link>
                      )}
                title={post.User.nickname}
                description={(
                  <PostCardContent
                    postData={post.content}
                  />
                      )}
              />
            </>
          )}
      </Card>
      {commentFormOpened
        && (
          <div>
            <CommentForm post={post} />
            <List
              header={`${post.Comments.length}개의 댓글`}
              itemLayout='horizontal'
              dataSource={post.Comments}
              renderItem={(item) => (
                <li>
                  <Comment
                    author={item.User.nickname}
                    avatar={(
                      <Link href={`/user/${item.User.id}`}>
                        <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                      </Link>
                    )}
                    content={item.content}
                  />
                </li>
              )}
            />
          </div>
        )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
    User: PropTypes.shape({
      id: PropTypes.number,
      nickname: PropTypes.string,
    }),
    content: PropTypes.string,
    Images: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      src: PropTypes.string,
    })),
    Comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      content: PropTypes.string,
      User: PropTypes.shape({
        id: PropTypes.number,
        nickname: PropTypes.string,
      }),
    })),
    Likes: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
    })),
    RetweetId: PropTypes.number,
    Retweet: PropTypes.objectOf(PropTypes.any),
  }).isRequired,
};

export default PostCard;
