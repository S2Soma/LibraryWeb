import { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from './ThuVien.module.scss';
import className from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import images from '~/assets/images/images';
import Image from '~/components/Image';

const cx = className.bind(styles);

const ThuVien = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('tenSach');
  const [currentPage, setCurrentPage] = useState(1);
  const [booksData, setBooksData] = useState([]);
  const [isDetailFormVisible, setIsDetailFormVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const booksPerPage = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    const api = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    api.get(`${process.env.REACT_APP_BASE_URL}/Sach/getAllSach`)
      .then((res) => {
        setBooksData(res.data);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error)
      });
  }, []);


  const filteredBooks = booksData.filter((book) => {
    return String(book[filterBy]).toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleDetailShow = (book) => {
    setSelectedBook(book);
    setIsDetailFormVisible(true);
  }
  const handleDetailCancel = () => {
    setIsDetailFormVisible(false);
  }
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <Fragment>
      <div className={cx("QLSach-Container")}>
        <div className={cx("header")}>
          <div className={cx("search-book")}>
            <input className={cx("search-input")}
              type="text"
              placeholder="Search by title, author, publisher, or year..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select className={cx("search-selection")}
              onChange={(e) => setFilterBy(e.target.value)}>
              <option value="tenSach">Tên sách</option>
              <option value="tenTacGia">Tác giả</option>
              <option value="tenTheLoai">Thể loại</option>
              <option value="tenNXB">Nhà xuất bản</option>
              <option value="namSX">Năm xuất bản</option>
            </select>
          </div>
        </div>
        <div className={cx("book-list")}>
          {currentBooks.length > 0 ? (currentBooks.map((book) => (
            <div key={book.idsach} className={cx("book")} onClick={() => handleDetailShow(book)}>
              <div className={cx("Anh")}>
                <Image className={cx('img_book')} src={images[book.hinhAnh]} alt="" />
              </div>
              <h3>{book.tenSach}</h3>
              <p><strong>Tác giả:</strong> {book.tenTacGia}</p>
              <p><strong>Thể loại:</strong> {book.tenTheLoai}</p>
              <p><strong>Nhà xuất bản:</strong> {book.tenNXB}</p>
              <p><strong>Năm xuất bản:</strong> {book.namSX}</p>
            </div>
          ))) : <div className={cx('sachRong')} >Không có sách theo yêu cầu</div>}
        </div>
        <div className={cx("pagination")}>
          {Array.from({ length: Math.ceil(filteredBooks.length / booksPerPage) }).map((_, index) => (
            <button key={index + 1} onClick={() => paginate(index + 1)}>
              {index + 1}
            </button>
          ))}
        </div>
      </div>
      <div className={cx("overlay", { active: isDetailFormVisible })} onClick={handleDetailCancel}></div>
      {isDetailFormVisible && (
        <div className= {cx("detail-form", { active: isDetailFormVisible })}>
          <div className={cx("form-container")}>
            <div className={cx("image-container")}>
              <Image className={cx('img_book')} src={images[selectedBook.hinhAnh]} alt="" />
            </div>
            <div className={cx("book-info-container")}>
            <p><strong>Tên Sách:</strong> {selectedBook.tenSach}</p>
              <p><strong>Tác giả:</strong> {selectedBook.tenTacGia}</p>
              <p><strong>Thể loại:</strong> {selectedBook.tenTheLoai}</p>
              <p><strong>Nhà xuất bản:</strong> {selectedBook.tenNXB}</p>
              <p><strong>Năm xuất bản:</strong> {selectedBook.namSX}</p>
              <p><strong>Nội dung:</strong> {selectedBook.noiDung}</p>
              <p><strong>Số lượng:</strong> {selectedBook.conLai}</p>
              <button className={cx("button-close")} onClick={handleDetailCancel}>Close</button>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default ThuVien;
