import PropTypes from 'prop-types';
import Link from 'next/link';
import { Input, Button } from 'antd';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

import useInput from '../hooks/useInput';

const PostCardContent = ({ editMode, postData, onChangePost, onCancelUpdatePost }) => {
  const [editText, onChangeEditText] = useInput(postData);
  const updatePostLoading = useSelector((state) => state.post.updatePostLoading);
  const updatePostDone = useSelector((state) => state.post.updatePostDone);

  useEffect(() => {
    if (updatePostDone) {
      onCancelUpdatePost();
    }
  }, [updatePostDone]);

  return (
    <div>
      { editMode
        ? (
          <>
            <Input.TextArea value={editText} onChange={onChangeEditText} />
            <Button.Group>
              <Button loading={updatePostLoading} onClick={onChangePost(editText)}>수정완료</Button>
              <Button
                style={{ backgroundColor: 'tomato' }}
                onClick={onCancelUpdatePost}
              >
                취소
              </Button>
            </Button.Group>
          </>
        )
        : postData.split(/(#[^\s#]+)/g).map((v, i) => { // 해시태그로 split
          if (v.match(/#[^\s#]+/)) { // 해시태그면 Link 달기
            return <Link key={i} href={`/hashtag/${v.slice(1)}`}><a>{v}</a></Link>;
          }
          return v;
        })}
    </div>
  );
};

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
  editMode: PropTypes.bool,
  onChangePost: PropTypes.func.isRequired,
  onCancelUpdatePost: PropTypes.func.isRequired,
};

PostCardContent.defaultProps = {
  editMode: false,
};

export default PostCardContent;
