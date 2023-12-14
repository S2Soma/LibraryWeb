import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Fragment, useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import className from 'classnames/bind';
import styles from './TraSach.module.scss';
import images from '~/assets/images/images';


const cx = className.bind(styles);

function TraSach() {
    //kiểm tra đầu vào input sdt
    const [phone, setPhone] = useState('');
    const [Check_SDT, setCheck_SDT] = useState(false);
    //kiểm tra đầu vào input họ tên
    const [name, setName] = useState('');
    const [checkFullname, setCheckFullname] = useState(false);
    //kiểm tra đầu vào input ngày tháng
    const [date, setDate] = useState('');
    const [CheckDate, setCheckDate] = useState(false);
    const [mangSach, setMangSach] = useState([]);
    const [isDeleteFormVisible, setDeleteFormVisible] = useState(false);
    const [userName, setUserName] = useState('');
    //const [selectedBook, setSelectedBook] = useState(null);
    const [mangChiTietSach, setMangChiTietSach] = useState([]);
    const [selectedIDMuon, setSelectedIDMuon] = useState(null);
    function checkPhone() {
        const regex = new RegExp(/^0[0-9]{9}$/);
        if (regex.test(phone)) {
            setCheck_SDT(false)
        }
        else {
            setCheck_SDT(true)
        }
    }
    const HandelSubmit = () => {
        const token = Cookies.get('token');
        const api = axios.create({
            headers: {
                'Content-Type': 'application/json',
                cookies: token,
            },
        });
        api.get(`${process.env.REACT_APP_BASE_URL}/TraSach/getAllBorrowBook/${phone}`, {

        })
            .then((res) => {
                setMangSach(res.data.result)
                setUserName(res.data.user.hoTen)
            })
            .catch((error) => {
                console.log(error);

            });
    };

    const Delete_chiTietMuonSach = () => {
        const token = Cookies.get('token');
        const api = axios.create({
            headers: {
                'Content-Type': 'application/json',
                cookies: token,
            },
        });
        api.put(`${process.env.REACT_APP_BASE_URL}/TraSach/DeleteChiTietMuonSach/${selectedIDMuon}`, {

        })
            .then((res) => {
                const updatedBooks = mangSach.filter(phienMS => phienMS.idmuonSach !== selectedIDMuon);
                setMangSach(updatedBooks);
                toast.success(`Trả sách thành công!`);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    function Run() {
        checkPhone()
        HandelSubmit()
    }
    const openDeleteForm = (IDMuon) => {
        const token = Cookies.get('token');
        const api = axios.create({
            headers: {
                'Content-Type': 'application/json',
                cookies: token,
            },
        });
        api.get(`${process.env.REACT_APP_BASE_URL}/TraSach/LayChiTietMuonSach/${IDMuon}`, {

        })
            .then((res) => {
                setMangChiTietSach(res.data);
                setSelectedIDMuon(IDMuon);
                setDeleteFormVisible(true);
            })
            .catch((error) => {
                console.log(error);

            });
    }
    const handleDeleteConfirm = () => {
        Delete_chiTietMuonSach();
        setDeleteFormVisible(false);

    };
    const handleDeleteCancel = () => {
        setMangChiTietSach([]);
        setSelectedIDMuon(null);
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
            <div className={cx('home-slide')}>
                <div className={cx("Ban_Doc")}>
                    <p className={cx("P_banDoc")}>Bạn đọc</p>
                </div>
                <div className={cx("thongTinCaNhan")}>
                    <div className={cx("label_thongtin")}>
                        <label>SĐT: </label>
                        <label>Họ và tên: </label>
                    </div>
                    <div className={cx("input_thongtin")}>
                        <div className={cx("total_sdtAndbutton")}>
                            <input className={cx("Input_SDT")}
                                type="text"
                                placeholder="Nhập SĐT"
                                value={phone}
                                onChange={(even) => setPhone(even.target.value)}
                            />
                            {Check_SDT && (<p className={cx("invalid_phone")}>Số điện thoại không hợp lệ</p>)}

                        </div>

                        <div>
                            <input className={cx("Input_HoTen")} value={userName}
                                type="text"
                                disabled=" "
                            />
                        </div>

                        {checkFullname && (<p className={cx("invalid_hoten")}>Họ tên không hợp lệ</p>)}

                    </div>
                    <div className={cx("Bt_Ok")}>
                        <button onClick={Run} className={cx("bt_okSDT")}>OK</button>
                    </div>

                </div>
                <div id="ThongTinDaMuon">
                    <div className={cx("Title_SachDaMuon")}>
                        <p className={cx("P_SachDaMuon")}>Sách đã mượn</p>
                    </div>
                    {mangSach.length > 0 ? (mangSach.map((item) => (
                        <div key={item.idMuonSach} className={cx("SachDaMuon")}>
                            <div className={cx("ThongtinSach")}>
                                <div className={cx("thong_Tin_Anh")}>
                                    <div className={cx("label_thongtin_traSach")}>
                                        <label>Mã:</label>
                                        <label>Ngày mượn:</label>
                                        <label>Ngày trả:</label>
                                    </div>
                                    <div className={cx("MoTa")}>
                                        <p className={cx("ten_Sach")}>{item.idmuonSach}</p>
                                        <p className={cx("tac_Gia")}>{item.ngayMuon.split("T")[0]}</p>
                                        <p className={cx("tac_Gia")}>{item.thoiHan}</p>
                                    </div>
                                </div>
                                <div className={cx("Chucnang")}>
                                    <div onClick={() => openDeleteForm(item.idmuonSach)} className={cx("delete")}>
                                        <img className={cx('img_delete')} src={images.icon_delete} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))) : <div className={cx('sachRong')} >Chưa có sách đã mượn</div>}
                    <div className={cx("overlay", { active: isDeleteFormVisible })} onClick={handleDeleteCancel}></div>
                    {isDeleteFormVisible && (
                        <div className={cx("delete-form", { active: isDeleteFormVisible })}>
                            <h3>XÁC NHẬN TRẢ SÁCH</h3>
                            {mangChiTietSach.length > 0 ? (mangChiTietSach.map((item) => (
                                <div className={cx('book-container')}>
                                    <label><strong>Tên Sách:</strong> {item.tenSach} (<strong>Số lượng:</strong> {item.soLuong})</label>
                                </div>
                            ))) : <div className={cx('sachRong')} >Chưa có sách đã mượn</div>}
                            <button onClick={handleDeleteConfirm}>Yes</button>
                            <button onClick={handleDeleteCancel}>No</button>
                        </div>
                    )}
                </div>
            </div>
        </Fragment>
    );
}

export default TraSach;
