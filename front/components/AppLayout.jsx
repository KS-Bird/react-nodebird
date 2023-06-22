import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import { useState } from 'react';
import styled from 'styled-components';

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

import UserProfile from '../components/UserProfile';
import LoginForm from '../components/LoginForm';

const AppLayout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/"><a>노드버드</a></Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile"><a>프로필</a></Link>
        </Menu.Item>
        <Menu.Item>
          <SearchInput enterButton />
        </Menu.Item>
        <Menu.Item>
          <Link href="/signup"><a>회원가입</a></Link>
        </Menu.Item>
      </Menu>
      {/* gutter: column간의 간격 xs: 모바일, md: 작은 데탑 */}
      <Row gutter={8}>
        <Col xs={24} md={6} > {/* 한줄의 24등분중에 모바일은 100% 차지 / 데탑은 25% 차지한다는 뜻*/}
          {isLoggedIn ? <UserProfile setIsLoggedIn={setIsLoggedIn} /> : <LoginForm setIsLoggedIn={setIsLoggedIn} />}
        </Col>
        <Col xs={24} md={12} >
          {children}
        </Col>
        <Col xs={24} md={6} >
          <a href='https://tagg129.tistory.com' target='_blank' rel='noreferrer noopener'>Made by Kyuseok Park</a>
        </Col>
      </Row>
    </div>
  );
}

AppLayout.propTypes = { // props 타입 검사
  children: PropTypes.node.isRequired, // children은 node라는 타입 // return 안에 들어갈 수 있는 모든게 node
};

export default AppLayout;