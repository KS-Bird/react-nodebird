import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { PlusOutlined } from '@ant-design/icons';

import ImagesZoom from './ImagesZoom';

const PostImages = ({ images }) => {
  const [showImagesZoom, setShowImagesZoom] = useState(false);

  const onZoom = useCallback(() => {
    setShowImagesZoom(true);
  }, []);
  const onClose = useCallback(() => {
    setShowImagesZoom(false);
  });

  if (images.length === 1) {
    return (
      <>
        <img
          role="presentation"
          src={images[0].src}
          alt={images[0].src}
          onClick={onZoom}
        />
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  if (images.length === 2) {
    return (
      <>
        <div>
          <img
            role="presentation"
            style={{ width: '50%', display: 'inline-block' }}
            src={images[0].src}
            alt={images[0].src}
            onClick={onZoom}
          />
          <img
            role="presentation"
            style={{ width: '50%', display: 'inline-block' }}
            src={images[1].src}
            alt={images[1].src}
            onClick={onZoom}
          />
        </div>
        {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
      </>
    );
  }
  return (
    <>
      <div style={{ position: 'relative' }}>
        <img
          role="presentation"
          style={{ width: '50%', display: 'inline-block' }}
          src={images[0].src}
          alt={images[0].src}
          onClick={onZoom}
        />
        <div
          role="presentation"
          onClick={onZoom}
          style={{
            width: '50%',
            display: 'inline-block',
            position: 'absolute',
            height: '100%',
          }}
        >
          <div
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <PlusOutlined />
            {images.length - 1}개의 사진 더보기
          </div>
        </div>
      </div>
      {showImagesZoom && <ImagesZoom images={images} onClose={onClose} />}
    </>
  );
};

PostImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.shape({
    src: PropTypes.string,
    id: PropTypes.number,
  })).isRequired,
};

export default PostImages;
