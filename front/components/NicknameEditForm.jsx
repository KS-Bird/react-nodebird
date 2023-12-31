import { Form, Input } from "antd";
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import useInput from '../hooks/useInput';
import { CHANGE_NICKNAME_REQUEST } from "../reducers/user";

const NicknameEditForm = () => {
  const dispatch = useDispatch();
  const me = useSelector((state) => state.user.me);
  const [nickname, onChangeNickname] = useInput(me?.nickname || '');

  const onSubmit = useCallback(() => {
    dispatch({
      type: CHANGE_NICKNAME_REQUEST,
      data: nickname,
    });
  }, [nickname]);

  return (
    <Form style={{ marginBottom: '20px', border: '1px solid #d9d9d9', padding: '20px' }}>
      <Input.Search
        value={nickname}
        onChange={onChangeNickname}
        onSearch={onSubmit}
        addonBefore="닉네임"
        enterButton="수정"
      />
    </Form>
  );
};

export default NicknameEditForm;
