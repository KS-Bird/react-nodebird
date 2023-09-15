import { Form, Input, Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useRef, useEffect } from 'react';

import useInput from '../hooks/useInput';
import { UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE, ADD_POST_REQUEST } from '../reducers/post';
import { backUrl } from '../config/config';

const PostForm = () => {
  const dispatch = useDispatch();
  const addPostDone = useSelector((state) => state.post.addPostDone);
  const imagePaths = useSelector((state) => state.post.imagePaths);
  const addPostLoading = useSelector((state) => state.post.addPostLoading);

  const [text, onChangeText, setText] = useInput('');

  useEffect(() => {
    if (addPostDone) {
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

  const onSubmit = useCallback(() => {
    if (!text || !text.trim()) {
      return alert('게시글을 작성하세요');
    }
    const formData = new FormData();
    console.log(imagePaths);
    imagePaths.forEach((path) => {
      formData.append('image', path);
    });
    formData.append('content', text);
    return dispatch({
      type: ADD_POST_REQUEST,
      data: formData, // 연습을 위해 formData사용 json형식이 더 좋다
    });
  }, [text, imagePaths]);

  return (
    <Form style={{ margin: '10px 0 20px' }} encType="multipart/form-data" onFinish={onSubmit}>
      <Input.TextArea
        value={text}
        onChange={onChangeText}
        maxLength={140}
        placeholder="어떤 신기한 일이 있었나요?"
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
        <Button type="primary" loading={addPostLoading} style={{ float: 'right' }} htmlType="submit">짹짹</Button>
      </div>
      <div>
        {imagePaths.map((v, i) => ( // 이미지 미리보기
          <div key={v} style={{ display: 'inline-block' }}>
            <img src={`${backUrl}/${v}`} alt={v} style={{ width: '200px' }} />
            <Button onClick={onRemoveImage(i)}>제거</Button>
          </div>
        ))}
      </div>
    </Form>
  );
};

export default PostForm;
