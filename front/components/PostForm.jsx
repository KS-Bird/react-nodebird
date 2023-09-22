import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useRef, useEffect } from 'react';

import useInput from '../hooks/useInput';
import { UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE, ADD_POST_REQUEST, CANCEL_EDIT_MODE, UPDATE_POST_REQUEST } from '../reducers/post';

const PostForm = ({ editingPostId, content }) => {
  const dispatch = useDispatch();
  const addPostDone = useSelector((state) => state.post.addPostDone);
  const imagePaths = useSelector((state) => state.post.imagePaths);
  const addPostLoading = useSelector((state) => state.post.addPostLoading);
  const updatePostLoading = useSelector((state) => state.post.updatePostLoading);

  const [text, onChangeText, setText] = useInput(content || '');

  useEffect(() => {
    if (addPostDone && !editingPostId) {
      setText(''); // addPost 성공하면 지우기
    }
  }, [addPostDone]);

  const imageInput = useRef();
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onChangeImages = useCallback((e) => {
    console.log('images', e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => { // 유사배열이라 forEach를 못씀
      imageFormData.append('image', f);
    });
    dispatch({
      type: UPLOAD_IMAGES_REQUEST,
      data: imageFormData,
    });
  }, []);

  const onRemoveImage = useCallback((index) => () => {
    dispatch({
      type: REMOVE_IMAGE,
      data: index,
    });
  });

  const onClickCancel = useCallback(() => {
    dispatch({
      type: CANCEL_EDIT_MODE,
    });
  }, []);

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요');
    }
    const formData = new FormData();
    console.log('imagePaths:', imagePaths);
    imagePaths.forEach((path) => {
      formData.append('image', path);
    });
    formData.append('content', text);
    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData,
    });
  }, [text, imagePaths.length]);

  const onSubmitUpdate = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요');
    }
    return dispatch({
      type: UPDATE_POST_REQUEST,
      data: {
        postId: editingPostId,
        content: text,
        image: imagePaths,
      },
    });
  }, [text, imagePaths.length]);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={!editingPostId ? onSubmit : onSubmitUpdate}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
      />
      <div>
        <input
          type="file"
          name="image"
          multiple
          ref={imageInput}
          onChange={onChangeImages}
          style={{ display: 'none' }}
        />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>

        {!editingPostId
          ? <Button type="primary" loading={addPostLoading} style={{ float: 'right' }} htmlType="submit">짹짹</Button>
          : (
            <>
              <Button type="primary" style={{ float: 'right' }} loading={updatePostLoading} htmlType="submit">수정완료</Button>
              <Button style={{ backgroundColor: 'tomato', float: 'right' }} onClick={onClickCancel}>취소</Button>
            </>
          )}
      </div>
      <div>
        {imagePaths.map((v, i) => ( // 이미지 미리보기
          <div key={v} style={{ display: 'inline-block' }}>
            <img
              src={process.env.NODE_ENV === 'production' ? v.replace(/\/thumb\//, '/original/') : v}
              alt={v}
              style={{ width: '200px' }}
            />
            <Button onClick={onRemoveImage(i)}>제거</Button>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
