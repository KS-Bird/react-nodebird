import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import { FOLLOW_REQUEST, UNFOLLOW_REQUEST } from '../reducers/user';

const FollowButton = ({ post }) => {
  const dispatch = useDispatch();
  const followLoading = useSelector((state) => state.user.followLoading);
  const followingPostId = useSelector((state) => state.user.followingPostId);
  const unfollowLoading = useSelector((state) => state.user.unfollowLoading);
  const Followings = useSelector((state) => state.user.me.Followings);
  const isFollowing = Followings.find((v) => v.id === post.User.id);

  // useEffect 처음에 팔로우 여부 확인

  const onFollow = useCallback(() => {
    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: { userId: post.User.id, postId: post.id },
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: { userId: post.User.id, postId: post.id },
      });
    }
  }, [isFollowing]);

  return (
    <Button
      loading={post.id === followingPostId && (followLoading || unfollowLoading)}
      onClick={onFollow}
    >
      {isFollowing ? '언팔로우' : '팔로우'}
    </Button>
  );
};

FollowButton.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.string,
    User: PropTypes.shape({
      id: PropTypes.string,
      nickname: PropTypes.string,
    }),
    content: PropTypes.string,
    Images: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      src: PropTypes.string,
    })),
    Comments: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.string,
      content: PropTypes.string,
      User: PropTypes.shape({
        id: PropTypes.string,
        nickname: PropTypes.string,
      }),
    })),
  }).isRequired,
};

export default FollowButton;
