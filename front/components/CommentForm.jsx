import { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';

import useInput from '../hooks/useInput';
import { ADD_COMMENT_REQUEST } from '../reducers/post';

const CommentForm = ({ post }) => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.user.me?.id);
  const { addCommentLoading, addCommentDone } = useSelector((state) => state.post);

  const [commentText, onChangeCommentText, setCommentText] = useInput('');

  useEffect(() => {
    if (addCommentDone) {
      setCommentText(''); // addPost 성공하면 지우기
    }
  }, [addCommentDone]);

  const onSubmitComment = useCallback(() => {
    console.log(commentText, post.id, id);
    dispatch({
      type: ADD_COMMENT_REQUEST,
      data: { content: commentText, postId: post.id, userId: id },
    });
  }, [commentText, id]);

  return (
    <Form onFinish={onSubmitComment}>
      <Form.Item style={{ position: 'relative', margin: 0 }}>
        <Input.TextArea value={commentText} onChange={onChangeCommentText} row={4} />
        <Button
          style={{ position: 'absolute', right: 0, bottom: -40, zIndex: 1 }}
          type="primary"
          htmlType="submit"
          loading={addCommentLoading}
        >
          삐약
        </Button>
      </Form.Item>
    </Form>
  );
};

CommentForm.propTypes = {
  post: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
};

export default CommentForm;
