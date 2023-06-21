import PropTypes from 'prop-types';
import Head from 'next/head';

// _app.jsx 라는 이름의 파일은 모든 파일에 공통된다

// 여기서 Component는 렌더링할 컴포넌트의 return부분이다
// _app.jsx의 컴포넌트는 렌더링하는 컴포넌트의 부모가 된다
const NodeBird = ({ Component }) => {
  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>NodeBird</title>
      </Head>
      < Component />
    </>
  )
}

NodeBird.propTypes = {
  Component: PropTypes.elementType.isRequired,
}

export default NodeBird;