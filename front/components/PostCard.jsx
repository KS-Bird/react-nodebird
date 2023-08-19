import { Card, Popover, Button, Avatar, List } from 'antd';
import { Comment } from '@ant-design/compatible';
import { RetweetOutlined, HeartOutlined, HeartTwoTone, MessageOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useState, useCallback } from 'react';

import PostImages from './PostImages';
import CommentForm from './CommentForm';
import PostCardContent from './PostCardContent';
import FollowButton from './FollowButton';
import { REMOVE_POST_REQUEST, LIKE_POST_REQUEST, UNLIKE_POST_REQUEST } from '../reducers/post';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();

  const [commentFormOpened, setCommentFormOpened] = useState(false);

  const onLike = useCallback(() => {
    dispatch({
      type: LIKE_POST_REQUEST,
      data: post.id,
    });
  }, []);
  const onUnlike = useCallback(() => {
    dispatch({
      type: UNLIKE_POST_REQUEST,
      data: post.id,
    });
  }, []);
  const onToggleComment = useCallback(() => {
    setCommentFormOpened((prev) => !prev);
  }, []);

  const onRemovePost = useCallback(() => {
    dispatch({
      type: REMOVE_POST_REQUEST,
      data: post.id,
    });
  }, []);
  const id = useSelector((state) => state.user.me?.id);
  const liked = post.Likers.find((v) => v.id === id);
  const removePostLoading = useSelector((state) => state.post.removePostLoading);
  return (
    <div style={{ marginBottom: 20 }}>
      <Card
        cover={post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <RetweetOutlined key="retweet" />,
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
                      <Button>수정</Button>
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
        extra={id && id !== post.UserId && <FollowButton post={post} />}
      >
        <Card.Meta
          avatar={<Avatar>{post.User.nickname[0]}</Avatar>}
          title={post.User.nickname}
          description={<PostCardContent postData={post.content} />}
        />
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
                    avatar={<Avatar>{item.User.nickname[0]}</Avatar>}
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
  }).isRequired,
};

export default PostCard;
