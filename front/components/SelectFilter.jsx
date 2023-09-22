import PropTypes from 'prop-types';
import { useCallback } from "react";
import { useDispatch } from 'react-redux';

import {
  LOAD_POSTS_REQUEST, LOAD_FOLLOWINGS_POSTS_REQUEST, LOAD_UNFOLLOWINGS_POSTS_REQUEST,
  REMOVE_MAINPOSTS,
} from "../reducers/post";

const SelectFilter = ({ setPostFilter }) => {
  const dispatch = useDispatch();
  const onChangeFilter = useCallback((e) => {
    setPostFilter(e.target.value);
    dispatch({
      type: REMOVE_MAINPOSTS,
    });
    dispatch({
      type: e.target.value,
    });
  }, []);

  return (
    <select onChange={onChangeFilter}>
      <option value={LOAD_POSTS_REQUEST}>전체</option>
      <option value={LOAD_FOLLOWINGS_POSTS_REQUEST}>팔로잉 게시글</option>
      <option value={LOAD_UNFOLLOWINGS_POSTS_REQUEST}>언팔로잉 게시글</option>
    </select>
  );
};

SelectFilter.propTypes = {
  setPostFilter: PropTypes.func.isRequired,
};

export default SelectFilter;
