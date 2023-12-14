import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Fragment, useState, useEffect } from 'react';
import className from 'classnames/bind';
import styles from './InfoBook.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import images from '~/assets/images/images';
import Image from '~/components/Image';
import { ReturnIcon } from '~/components/Icons';

const cx = className.bind(styles);

function InfoBook() {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookInfo, setBookInfo] = useState({
        title: '',
        author: '',
        publisher: '',
        publicationYear: '',
        genre: '',
        content: '',
        quantity: '',
        image: null,
    });
    var book = location.state ? location.state.book : [];
    const [genres, setGenres] = useState([]);
    const [thisBook, setThisBook] = useState(book);
    const [isDeleteFormVisible, setDeleteFormVisible] = useState(false);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/Sach/getAllGenre`)
            .then(response => {
                setGenres(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);
    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookInfo({ ...bookInfo, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        // if (file) {
        //     const reader = new FileReader();
        //     reader.onloadend = () => {
        //         const image = new Image();
        //         image.src = reader.result;
        //         document.body.appendChild(image);
        //     };
        //     reader.readAsDataURL(file);
        // }
        bookInfo.image = file;
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const isBookInfoEmpty = Object.values(bookInfo).every(value => value === '' || value === null);
        if (isBookInfoEmpty) {
            toast.error("Không có gì thay đổi!");
            return;
        }
        if (!isNumberic()) return;
        // const imagePath = `~/assets/images/img_Sach/${bookInfo.image.name}`;
        // images[bookInfo.image.name] = require(imagePath);
        isExistBook()
            .then(result => {
                if (!result) {
                    axios.put(`${process.env.REACT_APP_BASE_URL}/Sach/updateBook/${thisBook.idSach}`, {
                        tenSach: bookInfo.title.trim(),
                        tenTacGia: bookInfo.author.trim(),
                        NXB: bookInfo.publisher.trim(),
                        namXB: bookInfo.publicationYear !== '' ? parseInt(bookInfo.publicationYear, 10) : 0,
                        tenTheLoai: bookInfo.genre,
                        noiDung: bookInfo.content,
                        soLuong: bookInfo.quantity !== '' ? parseInt(bookInfo.quantity, 10) : 0,
                        hinhAnh: 'NNNHL',
                    })
                        .then(response => {
                            if (response.data.mess === "Update book successfully!") {
                                loadBook();
                                toast.success("Cập nhật sách thành công!");
                            }
                            else {
                                toast.error("Thông tin sách không hợp lệ!");
                            }
                        })
                        .catch(error => {
                            alert("Sụp se vờ rầu!");
                        });
                }
            })
            .catch(error => { });

    };


    const isNumberic = () => {
        if (bookInfo.quantity !== '' && isNaN(bookInfo.quantity)) {
            toast.error("Số lượng không phải là số!");
            return false;
        }
        if (bookInfo.quantity !== '' && parseInt(bookInfo.quantity, 10) <= 0) {
            toast.error('Số lượng phải là số nguyên dương và lớn hơn 0!');
            return false;
        }
        if (bookInfo.publicationYear !== '' && isNaN(bookInfo.publicationYear)) {
            toast.error("Năm không phải là số!");
            return false;
        }
        if (bookInfo.publicationYear !== '' && parseInt(bookInfo.publicationYear, 10) <= 0) {
            toast.error('Năm phải là số nguyên dương và lớn hơn 0!');
            return false;
        }
        const currentYear = new Date().getFullYear();
        if (parseInt(bookInfo.publicationYear, 10) > currentYear) {
            toast.error('Năm không được lớn hơn năm hiện tại!');
            return false;
        }
        var count = thisBook.soLuong - thisBook.conLai;
        if (bookInfo.quantity !== '' && parseInt(bookInfo.quantity, 10) < thisBook.soLuong - thisBook.conLai) {
            toast.error(`Số lượng sai. Hiện đang có ${count} quyển đang được mượn!`);
            return false;
        }
        return true;
    }
    const isExistBook = () => {
        return new Promise((resolve, reject) => {
            if (bookInfo.title === book.tenSach || bookInfo.title === '') {
                resolve(false);
                return;
            }
            axios.get(`${process.env.REACT_APP_BASE_URL}/Sach/getBookFromName/${bookInfo.title}`)
                .then(response => {
                    if (response.data.mess === 'book is Existed!') {
                        toast.error('Sách đã tồn tại!');
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch(error => {
                    resolve(false);
                });
        });
    };
    const loadBook = () => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/Sach/getBookFromID/${thisBook.idSach}`)
            .then(response => {
                    console.log(response.data.sachCanTim)
                    setThisBook(response.data.sachCanTim)
            })
            .catch(error => { });
    }
    const returnPage = () => {
        navigate("/Sach");
    }

    const handleDeleteClick = () => {
        setDeleteFormVisible(true);
      };
      const handleDeleteConfirm = (event) => {
        event.preventDefault();
        setDeleteFormVisible(false);
        axios.delete(`${process.env.REACT_APP_BASE_URL}/Sach/deleteBook/${thisBook.idSach}`)
          .then(response => {
            if (response.data.mess === "delete book successfully!" ) {
                alert("Xóa thành công!");
                navigate("/Sach");
            }
          })
          .catch(error => {
            console.error('Error deleting user:', error);
          })
      };
      const handleDeleteCancel = (event) => {
        event.preventDefault();
        setDeleteFormVisible(false);
      };
    return (
        <Fragment>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className={cx('ThongTinCaNhan')}>
                <div className={cx('ThongTin')}>
                    <div className={cx('return')} onClick={returnPage}>
                        <ReturnIcon width='70' height='70' />
                    </div>
                    <div className={cx("image-container")}>
                        <Image className={cx('img_book')} src={images[thisBook.hinhAnh]} alt="" />
                    </div>

                    <div className={cx('sub_ThongTin')}>
                        <div className={cx("book-info-container")}>
                            <p><strong>Tên Sách:</strong> {thisBook.tenSach}</p>
                            <p><strong>Tác giả:</strong> {thisBook.tenTacGia}</p>
                            <p><strong>Thể loại:</strong> {thisBook.tenTheLoai}</p>
                            <p><strong>Nhà xuất bản:</strong> {thisBook.tenNxb}</p>
                            <p><strong>Năm xuất bản:</strong> {thisBook.namSx}</p>
                            <p><strong>Số lượng:</strong> {thisBook.soLuong}</p>
                            <p><strong>Nội dung:</strong> {thisBook.noiDung}</p>
                        </div>
                    </div>
                </div>
                <div className={cx('CapNhat')}>
                    <div className={cx('thanh_cap_nhat')}>
                        <p className={cx('P_capnhat')}>Cập nhật</p>
                    </div>
                    <div className={cx("cap_nhat_thong_tin")}>
                        <div className={cx("Tong_cap_nhat_thong_tin")}>
                            <div className={cx("label_thongtin_cap_nhat")}>
                                <label>Tên Sách: </label>
                                <label>Tác giả: </label>
                                <label>Thể loại: </label>
                                <label>Nhà xuất bản: </label>
                                <label>Năm xuất bản: </label>
                                <label>Số lượng: </label>
                                <label>Nội dung: </label>
                                <label>Hình ảnh:</label>
                            </div>
                            <div className={cx("input_duLieu_cap_nhat")}>
                                <input type="text" name="title" value={bookInfo.title} onChange={handleChange} />
                                <input type="text" name="publisher" value={bookInfo.publisher} onChange={handleChange} />
                                <div className={cx("add-book-container-genre")}>
                                    <select value={bookInfo.genre} name="genre" onChange={handleChange}>
                                        {genres.map((genre) => (
                                            <option key={genre.idtheLoai} value={genre.tenTheLoai}>
                                                {genre.tenTheLoai.charAt(0).toUpperCase() + genre.tenTheLoai.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <input type="text" name="author" value={bookInfo.author} onChange={handleChange} />
                                <input type="text" name="publicationYear" value={bookInfo.publicationYear} onChange={handleChange} />
                                <input type="text" name="quantity" value={bookInfo.quantity} onChange={handleChange} />
                                <textarea name="content" value={bookInfo.content} onChange={handleChange}></textarea>
                                <input type="file" accept="image/*" onChange={handleImageChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className={cx("button-div")}>
                    <button className={cx('btn_luu')} onClick={handleSubmit}>Lưu</button>
                    <button className={cx('btn_delete')} onClick={handleDeleteClick}>Xóa sách</button>
                </div>
                <div className={cx("overlay", { active: isDeleteFormVisible })} onClick={handleDeleteCancel}></div>
                {isDeleteFormVisible && (
                    <form className={cx("delete-form", { active: isDeleteFormVisible })} onSubmit={handleDeleteConfirm}>
                        <p>Are you sure you want to delete the user?</p>
                        <button type="submit">Yes</button>
                        <button type="button" onClick={handleDeleteCancel}>No</button>
                    </form>
                )}
            </div>
        </Fragment>
    );
}

export default InfoBook;
