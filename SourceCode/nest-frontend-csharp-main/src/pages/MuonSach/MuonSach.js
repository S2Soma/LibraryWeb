import React from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Fragment, useState } from 'react';
import className from 'classnames/bind';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './MuonSach.module.scss';
import images from '~/assets/images/images';
import Image from '~/components/Image';
const cx = className.bind(styles);

function MuonSach() {
    //kiểm tra đầu vào input sdt
    const [phone, setPhone] = useState('');
    const [Check_SDT, setCheck_SDT] = useState(false);
    //kiểm tra đầu vào input ngày tháng
    const [date, setDate] = useState('');
    const [CheckDate, setCheckDate] = useState(false);
    //kiểm tra đầu vào input họ tên
    const [name, setName] = useState('');
    const [checkFullname, setCheckFullname] = useState(false);
    const [maSach, setMaSach] = useState('');
    // tăng số lượng khi ấn dâu cộng, trừ
    //const [dataTarget, setDataTarget] = useState("1");
    const [mangSach, setMangSach] = useState([]);
    const [isDeleteFormVisible, setDeleteFormVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);

    const themSach = () => {
        if(maSach == '') 
        {
            toast.warning(`Vui lòng nhập mã sách!`);
            return;
        }
        const token = Cookies.get('token');
        const api = axios.create({
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        });
        api.get(`${process.env.REACT_APP_BASE_URL}/MuonSach/get_sach/${maSach.toUpperCase().trim()}`)
            .then((res) => {
                if(res.data.result.length == 0) 
                {
                    toast.warning("Không có sách!");
                    return;
                }
                var book = res.data.result.map(item => ({ ...item, soLuong: 1 }));

                setMangSach((previous) => [
                    ...previous, ...book
                ]);

                console.log('Updated mangSach:', mangSach);
            })
            .catch((error) => {
                console.log('Error fetching data:', error);
            });
    }

    const decreaseQuantity = (idSach) => {
        setMangSach((prevMangSach) => {
            const updatedMangSach = prevMangSach.map((item) => {
                if (item.idsach === idSach) {
                    if (item.soLuong > 1) {
                        return { ...item, soLuong: item.soLuong - 1 };
                    }
                }
                return item;
            });

            return updatedMangSach;
        });
    };
    const increaseQuantity = (idSach) => {
        setMangSach((prevMangSach) => {
            const updatedMangSach = prevMangSach.map((item) => {
                if (item.idsach === idSach) {
                    if (item.soLuong < item.conLai) {
                        return { ...item, soLuong: item.soLuong + 1 };
                    }
                    else {
                        toast.warning(`Sách chỉ còn ${item.conLai} quyển`);
                    }
                }
                return item;
            });

            return updatedMangSach;
        });

    };
    //kiểm tra dữ liệu nhập vào
    function checkPhone() {

        const regex = new RegExp(/^0[0-9]{9}$/);
        if (regex.test(phone)) {
            setCheck_SDT(false)
            return true;
        }
        else {
            setCheck_SDT(true)
        }
        return false;
    }
    function CheckNgayTra() {
        const regex = new RegExp(/^(0[1-9]|1\d|2[0-8])-(0[1-9]|1[0-2])-(\d{4})$|^(29|30)-(0[13-9]|1[0-2])-(\d{4})$|^(31)-(0[13578]|1[02])-(\d{4})$|^(29)-02-(\d{2}(0[48]|[2468][048]|[13579][26]))$|^(29)-02-((0[48]|[2468][048]|[3579][26])00)$/);
        if (regex.test(date)) {
            var ngayHienTai = new Date();
            console.log(ngayHienTai)
            var dateSlipt = date.split("-");
            var ngayTraStr = dateSlipt[2] + "-" + dateSlipt[1] + "-" + dateSlipt[0] + "T23:00:00.000Z";
            var ngayTra = new Date(ngayTraStr);
            if (ngayHienTai < ngayTra) {
                setCheckDate(false)
                return true;
            }
            else {
                setCheckDate(true)
            }
        }
        else {
            setCheckDate(true)
        }
        return false;
    }
    //Kiểm tra họ tên
    function checkFullnameInput() {
        const regex = new RegExp(/[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/);
        if (regex.test(name)) {
            setCheckFullname(true)
        }
        else {
            setCheckFullname(false)
            return true;
        }
        return false;
    }
    const saveData = async () => {
        var SDT_DIV = document.querySelector(".Input_SDT");
        var SDT = SDT_DIV.value;
        var fullname_DIV = document.querySelector(".Input_HoTen");
        var fullname = fullname_DIV.value;
        var ThoiHan_DIV = document.querySelector(".NgayTra");
        var ThoiHan = ThoiHan_DIV.value;
        var IDMuonSach = "";
        console.log(SDT, fullname, ThoiHan)
        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}/MuonSach/AddgMuonSach`, {
                soDienThoai: SDT,
                hoTen: fullname,
                thoiHan: ThoiHan,
                ngayMuon: ""
            });
            IDMuonSach = response.data.id;
            console.log(IDMuonSach);
        } catch (error) {
            console.log('Error adding user:', error);
        }
        const ctmuonsaches = mangSach.map(item => {
            return {
                maMuonSach: IDMuonSach,
                sach: item.idsach,
                soLuong: item.soLuong
            };
        });
        console.log(ctmuonsaches);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/MuonSach/LuuChiTietMuonSach`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ctmuonsaches),
            });
            if(response.ok)
            {
                setMangSach([]);
                alert(`Mượn sách thành công \n Mã mượn của bạn là: ${IDMuonSach}`);
            }
        } catch (error) {
            console.error('Error adding user:', error);
        }
    }
    const openDeleteForm = (IdSach) =>{
        setSelectedBook(IdSach);
        setDeleteFormVisible(true);
    }
    const handleDeleteConfirm = () => {
        const updatedBooks = mangSach.filter(book => book.idsach !== selectedBook);
        setMangSach(updatedBooks);
        setDeleteFormVisible(false);
    };
    const handleDeleteCancel = () => {
        setDeleteFormVisible(false);
    };
    async function Run() {
        if(mangSach.length == 0)
        {
            toast.error("Chưa có sách muốn mượn!");
            return;
        }
        if(checkPhone() && CheckNgayTra() && checkFullnameInput())
        {
            
            await saveData();
        }
        
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
            <div className={cx('home-slide')}>
                <div id="Content_MuonSach">
                    <div className={cx("Ban_Doc")}>
                        <p className={cx("P_banDoc")}>Bạn đọc</p>
                    </div>
                    <div className={cx("thongTinCaNhan")}>
                        <div className={cx("label_thongtin")}>
                            <label>SĐT: </label>
                            <label>Họ tên: </label>
                            <label>Ngày trả: </label>
                        </div>
                        <div className={cx("input_thongtin")}>
                            <input className={cx("Input_SDT")}
                                type="text"
                                placeholder="Nhập SĐT"
                                value={phone}
                                onChange={(even) => setPhone(even.target.value)} />
                            {Check_SDT && (<p className={cx("invalid_phone")}>Số điện thoại không hợp lệ</p>)}
                            <input className={cx("Input_HoTen")} value={name}
                                onChange={(even) => setName(even.target.value)}
                                type="text"
                                placeholder="Nhập họ và tên"
                            />
                            {checkFullname && (<p className={cx("invalid_hoten")}>Họ tên không hợp lệ</p>)}
                            <div className={cx("div_NgayTra")}>
                                <input className={cx("NgayTra")}
                                    type="text"
                                    placeholder="Nhập ngày trả"
                                    value={date}
                                    onChange={(even) => setDate(even.target.value)} />
                                {CheckDate && (<p className={cx("invalid_NgayTra")}>Ngày tháng không hợp lệ(Ví dụ: 01-02-2000)</p>)}
                            </div>
                        </div>
                    </div>
                    <div id={cx("ThongTinMuonMuon")}>
                        <div className={cx("Title_SachMuonMuon")}>
                            <p className={cx("P_SachMuonMuon")}>Sách muốn mượn</p>
                        </div>
                        <div className={cx("SachMuonMuon")}>
                            <div className={cx("Nhapthongtin")}>
                                <div className={cx("Nhap_ma_sach")}>
                                    <input
                                        alt=''
                                        className={cx("Input_Nhap_ma_sach")}
                                        type="text" placeholder="Nhập mã sách..."
                                        value={maSach}
                                        onChange={(even) => setMaSach(even.target.value)}
                                    />
                                </div>
                                <div className={cx("Them")}>
                                    <button onClick={() => themSach()} className={cx("BT_Them")}>Thêm</button>
                                </div>
                            </div>
                            {mangSach.length > 0 ? (mangSach.map((item) => (
                                <div key={item.idsach} className={cx("ThongtinSach")}>

                                    <div className={cx("thong_Tin_Anh")}>
                                        <div className={cx("Anh")}>
                                            <Image className={cx('img_NNNHL')} src={images[item.hinhAnh]} alt="" />
                                        </div>
                                        <div className={cx("MoTa")}>
                                            <p className={cx("ten_Sach")}>{item.tenSach}</p>
                                            <p className={cx("tac_Gia")}>{item.tenTacGia}</p>
                                        </div>
                                    </div>
                                    <div className={cx("Chucnang")}>
                                        <div className={cx("so_Luong")}>
                                            <span data-target={item.idsach} onClick={() => decreaseQuantity(item.idsach)} className={cx("cong")}>-</span>
                                            <input type='tel' onChange={() => { }} data-id={item.idsach} className={cx("cong")} value={item.soLuong} name='inputSoLuong' />
                                            <span data-target={item.idsach} onClick={() => increaseQuantity(item.idsach)} className={cx("cong")}>+</span>
                                        </div>
                                        <div className={cx("delete")}>
                                            <img className={cx('img_delete')} src={images.icon_delete} alt="" onClick={() => openDeleteForm(item.idsach)} />
                                        </div>
                                    </div>
                                </div>
                            ))) : <></>}
                            <div className={cx("overlay", { active: isDeleteFormVisible })} onClick={handleDeleteCancel}></div>
                            {isDeleteFormVisible && (
                                <div className={cx("delete-form", { active: isDeleteFormVisible })}>
                                    <p>Are you sure you want to delete the user?</p>
                                    <button onClick={handleDeleteConfirm}>Yes</button>
                                    <button onClick={handleDeleteCancel}>No</button>
                                </div>
                            )}
                            <div className={cx("Bt_XuLy")}>
                                <button className={cx("BT_Huy")}>Hủy</button>
                                <button onClick={Run} className={cx("BT_XacNhan")}>Xác nhận</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}
export default MuonSach;
