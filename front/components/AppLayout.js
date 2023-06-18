import PropTypes from 'prop-types';
import Link from 'next/link';

const AppLayout = ({ children }) => {
  return (
    <div>
      <div>
        <Link href="/"><a>노드버드</a></Link>
        <Link href="/profile"><a>프로필</a></Link>
        <Link href="/signup"><a>회원가입</a></Link>
      </div>
      {children}
    </div>
  );
}

AppLayout.propTypes = { // props 타입 검사
  children: PropTypes.node.isRequired, // children은 node라는 타입 // return 안에 들어갈 수 있는 모든게 node
};

export default AppLayout;