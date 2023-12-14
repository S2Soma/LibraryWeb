import { useEffect, useState } from 'react';
import className from 'classnames/bind';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from './MenuBar.module.scss';
import { Link, useNavigate } from 'react-router-dom';

const cx = className.bind(styles);

function MenuBar({ variable }) {
    const [user, setUser] = useState(null);
    const [menuStates, setMenuStates] = useState({
        avatar: false,
        home: true,
        books: false,
        borrow: false,
        back: false,
        reader: false,
        count: false,
        borrowManager: false,
    });
    useEffect(() => {
        const token = Cookies.get("accountToken");
        if (token) {
            const api = axios.create({
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
    
            api.get(`${process.env.REACT_APP_BASE_URL}/User/getUserFromToken/${token}`)
                .then((res) => {
                    setUser(res.data);
                })
                .catch((error) => {});
        }
    }, [variable]);
    const handleClick = (menuItem) => {
        const updatedMenuStates = { ...menuStates };
        Object.keys(updatedMenuStates).forEach((key) => {
            updatedMenuStates[key] = false;
        });
        updatedMenuStates[menuItem] = true;
        setMenuStates(updatedMenuStates);
    };
    const navigate = useNavigate();
    const clickAvatar = () =>{
        handleClick('avatar');
        navigate("/TTCN", {state:{user}});
    }
    
    return (
        <div className={cx('Content-Menu-Bar')}>
            <div className={cx("user-card")}>
                <div className={cx("user-avatar" , { 'active': menuStates.avatar })} onClick={clickAvatar}>
                    {user && (<span>{user.hoTen.toUpperCase().charAt(0)}</span>)}
                </div>
                <div className={cx("user-info")}>
                    {user && (<h3>{user.hoTen}</h3>)}
                </div>
            </div>
            <ul className={cx('Activity-List')}>
                <li className={cx('Activity-List-Home')}>
                    <Link className={cx('nav-link', { 'active': menuStates.home })} to={"/Home"} onClick={() => handleClick('home')}>Trang chủ</Link>
                </li>
                <li className={cx('Activity-Listt-Books')}>
                    <Link className={cx('nav-link', { 'active': menuStates.books })} to={"/Sach"} onClick={() => handleClick('books')}>Quản lý sách</Link>
                </li>
                <li className={cx('Activity-List-Borrow-Books')}>
                    <Link className={cx('nav-link', { 'active': menuStates.borrow })} to={"/MuonSach"} onClick={() => handleClick('borrow')}>Mượn sách</Link>
                </li>
                <li className={cx('Activity-List-Give-Books-Back')}>
                    <Link className={cx('nav-link', { 'active': menuStates.back })} to={"/TraSach"} onClick={() => handleClick('back')}>Trả sách</Link>
                </li>
                <li className={cx('Activity-List-Reader')}>
                    <Link className={cx('nav-link', { 'active': menuStates.reader })} to={"/BanDoc"} onClick={() => handleClick('reader')}>Quản lý tài khoản</Link>
                </li>
                <li className={cx('Activity-List-Count')}>
                    <Link className={cx('nav-link', { 'active': menuStates.count })} to={"/ThongKe"} onClick={() => handleClick('count')}>Thống kê</Link>
                </li>
                <li className={cx('Activity-Log-Out')}>
                    <Link className={cx('nav-link')} to={"/"}>Đăng xuất</Link>
                </li>
            </ul>
        </div>
    );
}

export default MenuBar;
