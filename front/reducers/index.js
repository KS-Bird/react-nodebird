import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";

import user from './user';
import post from './post';

const rootReducer = combineReducers({ // 쪼갠 리듀서를 합친다
  index: (state = {}, action) => {
    switch (action.type) {
      case HYDRATE:
        return {
          ...state,
          ...action.payload,
        };
      default: // 초기값 할당 // 리덕스 초기화할때 실행됨
        return state;
    }
  },
  // user와 post의 initialState는 combineReducers가 알아서 합쳐준다
  user,
  post,
});

export default rootReducer;
