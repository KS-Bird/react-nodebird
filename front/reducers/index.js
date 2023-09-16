import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";

import user from './user';
import post from './post';

const rootReducer = (state, action) => { // 쪼갠 리듀서를 합친다
  switch (action.type) {
    case HYDRATE: // SSR 완료시 실행된다
      return action.payload; // 받아온 데이터
    default: {
      const combinedReducer = combineReducers({
        user,
        post,
      });
      return combinedReducer(state, action);
    }
  }
};

export default rootReducer;
