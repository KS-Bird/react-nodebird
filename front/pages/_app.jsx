import PropTypes from 'prop-types';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import wrapper from '../store/configureStore';

// _app.jsx 라는 이름의 파일은 모든 파일에 공통된다

// 여기서 Component는 렌더링할 컴포넌트의 return부분이다
// _app.jsx의 컴포넌트는 렌더링하는 컴포넌트의 부모가 된다
const NodeBird = ({ Component, ...rest }) => {
  const { store } = wrapper.useWrappedStore(rest);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return null;
  }
  return (
    <Provider store={store}>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      <Component />
    </Provider>
  );
};

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default NodeBird;
