import { useCallback } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Input, Row, Col } from 'antd';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import Router from 'next/router';

import LoginForm from './LoginForm';
import UserProfile from './UserProfile';
import useInput from '../hooks/useInput';

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const AppLayout = ({ children }) => {
  const { me } = useSelector((state) => state.user);
  const [searchInput, onChangeSearchInput] = useInput('');

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  return (
    <>
      <Menu
        mode="horizontal"
        items={[
          {
            label: <Link key="Home" href="/"><a>노드버드</a></Link>,
            key: "Home",
          },
          {
            label: <Link key="profile" href="/profile"><a>프로필</a></Link>,
            key: "profile",
          },
          {
            label: (
              <SearchInput
                key="search"
                enterButton
                value={searchInput}
                onChange={onChangeSearchInput}
                onSearch={onSearch}
              />
            ),
            key: "search",
          },
          {
            label: <Link href="/signup"><a>회원가입</a></Link>,
            key: "signup",
          },
        ]}
      />
      {/* gutter: column간의 간격 xs: 모바일, md: 작은 데탑 */}
      <Row gutter={8}>
        <Col xs={24} md={6}> {/* 한줄의 24등분중에 모바일은 100% 차지 / 데탑은 25% 차지한다는 뜻 */}
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <a href='https://tagg129.tistory.com' target='_blank' rel='noreferrer noopener'>Made by Kyuseok Park</a>
        </Col>
      </Row>
    </>
  );
};

AppLayout.propTypes = { // props 타입 검사
  children: PropTypes.node.isRequired, // children은 node라는 타입 // return 안에 들어갈 수 있는 모든게 node
};

export default AppLayout;
