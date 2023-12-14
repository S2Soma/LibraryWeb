import React from 'react';
import { Fragment, useState, useEffect } from 'react';
import className from 'classnames/bind';
import axios from 'axios';
import styles from './ThemSach.module.scss';
import { toast, ToastContainer } from 'react-toastify';
import images from '~/assets/images/images';

const cx = className.bind(styles);

const ThemSach = () => {
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
    const [genres, setGenres] = useState([]);

    useEffect(() => {
        axios.get(`${process.env.REACT_APP_BASE_URL}/Sach/getAllGenre`)
            .then(response => {
                setGenres(response.data);
                console.log(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
        console.log(genres);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setBookInfo({ ...bookInfo, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        bookInfo.image = file;
        if (file) {
            // const reader = new FileReader();
            // reader.onloadend = () => {
            //     const image = new Image();
            //     image.src = reader.result;
            //     document.body.appendChild(image);
            // };
            // reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isBookInfoEmpty = Object.values(bookInfo).some(value => value === '' || value === null);
        if (isBookInfoEmpty) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        if (!isNumberic()) return;
        // const imagePath = `~/assets/images/img_Sach/${bookInfo.image.name}`;
        // images[bookInfo.image.name] = require(imagePath);
        isExistBook()
            .then(result => {
                if (!result) {
                    axios.post(`${process.env.REACT_APP_BASE_URL}/Sach/addBook`, {
                        tenSach: bookInfo.title.trim(),
                        tenTacGia: bookInfo.author.trim(),
                        NXB: bookInfo.publisher.trim(),
                        namXB: parseInt(bookInfo.publicationYear, 10),
                        tenTheLoai: bookInfo.genre,
                        noiDung: bookInfo.content,
                        soLuong: parseInt(bookInfo.quantity, 10),
                        hinhAnh: "NNNHL",
                    })
                        .then(response => {
                            if (response.data.mess === "Add book successfully!") {
                                setBookInfo({
                                    title: '',
                                    author: '',
                                    publisher: '',
                                    publicationYear: '',
                                    genre: '',
                                    content: '',
                                    quantity: '',
                                    image: null,
                                });
                                toast.success("Thêm sách thành công!");
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
            .catch(error => {
                console.error(error);
            });

    };
    const isExistBook = () => {
        return new Promise((resolve, reject) => {
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
                    alert("sụp se vờ rầu!");
                    resolve(false);
                });
        });
    };

    const isNumberic = () => {
        if (isNaN(bookInfo.quantity)) {
            toast.error("Số lượng không phải là số!");
            return false;
        }
        if (parseInt(bookInfo.quantity, 10) <= 0) {
            toast.error('Số lượng phải là số nguyên dương và lớn hơn 0!');
            return false;
        }
        if (isNaN(bookInfo.publicationYear)) {
            toast.error("Năm không phải là số!");
            return false;
        }
        if (parseInt(bookInfo.publicationYear, 10) <= 0) {
            toast.error('Năm phải là số nguyên dương và lớn hơn 0!');
            return false;
        }
        const currentYear = new Date().getFullYear();
        if (parseInt(bookInfo.publicationYear, 10) > currentYear) {
            toast.error('Năm không được lớn hơn năm hiện tại!');
            return false;
        }
        return true;
    }
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
            <div className={cx("add-book-contatiner")}>
                <div className={cx("header")}>
                    <h1>THÊM SÁCH</h1>
                </div>

                <div className={cx("add-book-form")}>
                    <div className={cx("add-book-info-container")}>
                        <label>Tên sách:</label>
                        <input type="text" name="title" value={bookInfo.title} onChange={handleChange} />
                    </div>
                    <div className={cx("add-book-info-container")}>
                        <label>Nhà xuất bản:</label>
                        <input type="text" name="publisher" value={bookInfo.publisher} onChange={handleChange} />
                    </div>
                    <div className={cx("add-book-info-container")}>
                        <label>Thể loại:</label>
                        <select value={bookInfo.genre} name="genre" onChange={handleChange}>
                            {genres.map((genre) => (
                                <option key={genre.idtheLoai} value={genre.tenTheLoai}>
                                    {genre.tenTheLoai.charAt(0).toUpperCase() + genre.tenTheLoai.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={cx("add-book-info-container")}>
                        <label>Tác giả:</label>
                        <input type="text" name="author" value={bookInfo.author} onChange={handleChange} />
                    </div>
                    <div className={cx("add-book-info-container")}>
                        <label>Năm xuất bản:</label>
                        <input type="text" name="publicationYear" value={bookInfo.publicationYear} onChange={handleChange} />
                    </div>
                    <div className={cx("add-book-info-container")}>
                        <label>Số lượng:</label>
                        <input type="text" name="quantity" value={bookInfo.quantity} onChange={handleChange} />
                    </div>
                    <div className={cx("add-book-info-container")}>
                        <label>Nội dung:</label>
                        <textarea name="content" value={bookInfo.content} onChange={handleChange}></textarea>
                    </div>
                    <div className={cx("add-book-container-image")}>
                        <label>Hình ảnh:</label>
                        <input type="file" accept="image/*" value={bookInfo.image} onChange={handleImageChange} />
                    </div>
                    <div className={cx("add-book-container-button")}>
                        <button className={cx("add-book-submit-button")} onClick={handleSubmit}>Confirm</button>
                    </div>

                </div>
            </div>
        </Fragment>
    );
};
export default ThemSach;
