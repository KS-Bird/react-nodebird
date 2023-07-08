import PropTypes from 'prop-types';
import Link from 'next/link';

const PostCardContent = ({ postData }) => {
  return (
    <>
      {postData.split(/(#[^/s#]+)/g).map((v, i) => { // 해시태그로 split
        if (v.match(/#[^/s#]+/)) { // 해시태그면 Link 달기
          return <Link key={i} href={`/hashtag/${v.slice(1)}`}><a>{v}</a></Link>;
        }
        return v;
      })}
    </>
  );
}

PostCardContent.propTypes = {
  postData: PropTypes.string.isRequired,
};

export default PostCardContent;