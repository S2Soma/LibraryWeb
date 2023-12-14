import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import styles from './ThongKe.module.scss';
import className from 'classnames/bind';
const cx = className.bind(styles);

const ThongKe = () => {
  const [totalBooks, setTotalBooks] = useState(0);
  const [availableBooks, setAvailableBooks] = useState(0);
  const [borrowedBooks, setBorrowedBooks] = useState(0);
  const [timesBorrowBook, setTimesBorrowBook] = useState(0);
  const [timesBackBook, setTimesBackBook] = useState(0);
  const [accounts, setAccounts] = useState(0);

  function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  useEffect(() => {
    const token = Cookies.get('token');
    const api = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    api.get(`${process.env.REACT_APP_BASE_URL}/Sach/getCountBooks`)
      .then((res) => {
        setTotalBooks(res.data.countAll);
        setAvailableBooks(res.data.countRemain);
        setBorrowedBooks(res.data.countBorrow);
        setTimesBorrowBook(res.data.countBorrowTimes);
        setTimesBackBook(res.data.countBackTimes);
        setAccounts(res.data.countReader);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className={cx("ThongKe-Container")}>
      <div className={cx("header")}>
        <h1>THỐNG KÊ</h1>
      </div>
      
      <div className={cx("statistics")}>
        <div className={cx("box-content")} style={{ backgroundColor: getRandomColor() }}>
          <div className={cx("all-book-contaner")}>
            <h2>Tổng số sách</h2>
            <p>{totalBooks}</p>
          </div>

        </div>
        <div className={cx("box-content")} style={{ backgroundColor: getRandomColor() }}>
          <div className={cx("remain-book-contaner")}>
            <h2>Sách trong kho</h2>
            <p>{availableBooks}</p>
          </div>

        </div>
        <div className={cx("box-content")} style={{ backgroundColor: getRandomColor() }}>
          <div className={cx("borrow-book-contaner")}>
            <h2>Sách đang được mượn</h2>
            <p>{borrowedBooks}</p>
          </div>
        </div>
      </div>
      <div className={cx("statistics")}>
        <div className={cx("box-content")} style={{ backgroundColor: getRandomColor() }}>
          <div className={cx("all-book-contaner")}>
            <h2>Tổng lượt mượn</h2>
            <p>{timesBorrowBook}</p>
          </div>

        </div>
        <div className={cx("box-content")} style={{ backgroundColor: getRandomColor() }}>
          <div className={cx("remain-book-contaner")}>
            <h2>Tổng lượt trả</h2>
            <p>{timesBackBook}</p>
          </div>

        </div>
        <div className={cx("box-content")} style={{ backgroundColor: getRandomColor() }}>
          <div className={cx("borrow-book-contaner")}>
            <h2>Tổng bạn đọc</h2>
            <p>{accounts}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThongKe;
