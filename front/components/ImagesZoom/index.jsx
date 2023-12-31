import { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';

import { Overlay, Header, CloseBtn, SlickWrapper, ImgWrapper, Indicator, Global } from './styles';

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <Overlay>
      <Global /> {/* 전역에 적용이 됨. 기존 스타일 덮어씌움 */}
      <Header>
        <h1>상세 이미지</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0}
            afterChange={(slide) => setCurrentSlide(slide)}
            infinite
            arrows={false}
            slidesToShow={1}
            slidesToScroll={1}
          >
            {images.map((v) => (
              <ImgWrapper key={v.src}>
                <img
                  src={
                  process.env.NODE_ENV === 'production'
                    ? v.src.replace(/\/thumb\//, '/original/')
                    : v.src
                }
                  alt={v.src}
                />
              </ImgWrapper>
            ))}
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1} / {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
