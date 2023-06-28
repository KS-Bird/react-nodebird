import PropTypes from 'prop-types';
import Head from 'next/head';
import wrapper from '../store/configureStore';
import { Provider } from 'react-redux';

// _app.jsx 라는 이름의 파일은 모든 파일에 공통된다

// 여기서 Component는 렌더링할 컴포넌트의 return부분이다
// _app.jsx의 컴포넌트는 렌더링하는 컴포넌트의 부모가 된다
const NodeBird = ({ Component, ...rest }) => {
  const { store } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      < Component />
    </Provider>
  )
}

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
}

export default NodeBird;