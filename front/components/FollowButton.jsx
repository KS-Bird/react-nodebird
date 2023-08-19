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
  const onFollow = useCallback(() => {
    if (isFollowing) {
      dispatch({
        type: UNFOLLOW_REQUEST,
        data: post.UserId,
      });
    } else {
      dispatch({
        type: FOLLOW_REQUEST,
        data: post.UserId,
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
  }).isRequired,
};

export default FollowButton;
