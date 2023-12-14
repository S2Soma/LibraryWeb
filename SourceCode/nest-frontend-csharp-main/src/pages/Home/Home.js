import React, { Fragment, useState, useEffect } from 'react';
import className from 'classnames/bind';
import styles from './Home.module.scss';
import images from '~/assets/images/images';
import Image from '~/components/Image';

const cx = className.bind(styles);
const imagesBook = [
  {id: "NNNHL", name: "Ngôi Nhà Nghìn Hành Lang"},
  {id: "AMTSN", name: "Án mạng trên sông Nile"},
  {id: "DTODDD", name: "Đám Trẻ Ở Đại Dương Đen"},
  {id: "LPTH", name: "Liễu Phàm Tứ Huấn"},
  {id: "MMDVC", name: "Mật mã Da Vinci"},
  {id: "SH", name: "Sherlock Holmes"},
  {id: "SILCBC", name: "Sự im lặng của bầy cừu"},
];

const Home = () => {
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % imagesBook.length);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  const currentBookID = imagesBook[currentImage].id;

  return (
    <Fragment>
      <div className={cx("slider-container")}>
        <div className={cx("slideshow")}>
          <Image className={cx("image-slide")} src={images[currentBookID]} alt={`Slide ${currentImage + 1}`} />
          <div className={cx("book-name")}>
            <p><strong>{imagesBook[currentImage].name}</strong></p>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
