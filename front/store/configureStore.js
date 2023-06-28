import { createWrapper } from 'next-redux-wrapper';
import { applyMiddleware, createStore, compose } from 'redux';
import { composeWithDevTools } from '@redux-devtools/extension';
import reducer from '../reducers'

const configureStore = () => {
  const middleWares = [];
  const enhancer = process.env.NODE_ENV === 'production' // Redux devtools와 연동하기 위해 필요
    ? compose(applyMiddleware(...middleWares))
    : composeWithDevTools(applyMiddleware(...middleWares));
  const store = createStore(reducer, enhancer);
  return store;
}

const wrapper = createWrapper(configureStore, {
  debug: process.env.NODE_ENV === 'development', // debug true시 더 자세한 설명이 나오게 해줌
});

export default wrapper;

