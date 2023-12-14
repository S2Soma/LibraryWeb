import React, { Fragment, useState, useEffect } from 'react';
import className from 'classnames/bind';
import axios from 'axios';
import styles from './Reader.module.scss';
import { useNavigate } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import images from '~/assets/images/images';

const cx = className.bind(styles);

const Reader = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [isDeleteFormVisible, setDeleteFormVisible] = useState(false);
  const [isAddFormVisible, setIsAddFormVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [fullname, setFullname] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  const usersPerPage = 10;
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
    api.get(`${process.env.REACT_APP_BASE_URL}/User/getAllUser`)
      .then((res) => {
        setUsers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  const handlePhoneChange = (e) => {
    setPhone(e.target.value);
  };
  const handleFullnameChange = (e) => {
    setFullname(e.target.value);
  };
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleAdminChange = (e) => {
    setIsAdmin(e.target.checked);
  };
  const handleAddUser = () => {
    if (checkFullnameInput() && checkPhoneInput() && checkUsernameInput() && checkPassInput()) {
      checkUserExist().then(result => {
        console.log('Result check phone:', result);
        if (!result) checkUserNameExist().then(result => {
          if (!result) addUser().then(result => {
            if (result) {
              toast.success(`Tạo tài khoản thành công!`);
              updateAndClear();
            }
            else alert('Sụp se vờ rầu không lưu được!');
          }).catch(error => {
            console.error('Error:', error);
          });
        }).catch(error => {
          console.error('Error:', error);
        });
      }).catch(error => {
        console.error('Error:', error);
      });
    }
  };
  function checkPhoneInput() {
    var err = document.getElementsByClassName("invalid_Phone")[0];
    const regex = new RegExp(/^0[0-9]{9}$/);
    if (phone.length === 0) {
      err.innerHTML = "Bạn chưa nhập gì nè";
      err.style.display = "flex";
      return false;
    }
    if (!regex.test(phone)) {
      err.innerHTML = "Số điện thoại chỉ chứa 10 số và bắt đầu bằng 0";
      err.style.display = "flex";
      return false;
    }
    err.style.display = "none";
    return true;
  }

  function checkFullnameInput() {
    var err = document.getElementsByClassName("invalid_Fullname")[0];
    const regex = new RegExp(/[0-9!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/);
    if (fullname.length === 0) {
      err.innerHTML = "Bạn chưa nhập gì nè";
      err.style.display = "flex";
      return false;
    }
    if (regex.test(fullname)) {
      err.innerHTML = "Tên không chứa các ký tự đặc biệt hoặc số";
      err.style.display = "flex";
      return false;
    }
    err.style.display = "none";
    return true;
  }

  function checkUsernameInput() {
    var err = document.getElementsByClassName("invalid_Username")[0];
    const regex = new RegExp(/^[^\s]{3,10}$/);
    if (username.length === 0) {
      err.innerHTML = "Bạn chưa nhập gì nè";
      err.style.display = "flex";
      return false;
    }
    if (!regex.test(username)) {
      err.innerHTML = "Username có từ 3-10 ký tự và không chứa khoảng trắng";
      err.style.display = "flex";
      return false;
    }
    err.style.display = "none";
    return true;
  }

  function checkPassInput() {
    var err = document.getElementsByClassName("invalid_Password")[0];
    const regex = new RegExp(/^[^\s]{3,10}$/);
    if (password.length === 0) {
      err.innerHTML = "Bạn chưa nhập gì nè";
      err.style.display = "flex";
      return false;
    }
    if (!regex.test(password)) {
      err.innerHTML = "Password có từ 3-10 ký tự và không chứa khoảng trắng";
      err.style.display = "flex";
      return false;
    }
    err.style.display = "none";
    return true;
  }
  const checkUserNameExist = () => {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_BASE_URL}/Login/getUserLogin/${username}`)
        .then(response => {
          if (response.ok) {
            var err = document.getElementsByClassName("invalid_Username")[0];
            err.innerHTML = "Tài khoản đã tồn tại!";
            err.style.display = "flex";
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          console.log('Error fetching user data:', error);
          reject(error);
        });
    });
  };
  const checkUserExist = () => {
    return new Promise((resolve, reject) => {
      fetch(`${process.env.REACT_APP_BASE_URL}/User/getUser/${phone}`)
        .then(response => {
          if (response.ok) {
            var err = document.getElementsByClassName("invalid_Phone")[0];
            err.innerHTML = "Số điện thoại đã được đăng ký!";
            err.style.display = "flex";
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch(error => {
          console.log('Error fetching user data:', error);
          reject(error);
        });
    });
  };
  const addUser = () => {
    return new Promise((resolve, reject) => {
      axios.post(`${process.env.REACT_APP_BASE_URL}/User/adduser`, {
        sdt: phone,
        hoTen: fullname,
        taiKhoan: username,
        matKhau: password,
        admin: isAdmin,
        active: true
      })
        .then(response => {
          if (response.status === 200) {
            console.log("Add success!");
            resolve(true);
          } else {
            console.log("Add failed!");
            resolve(false);
          }
        })
        .catch(error => {
          console.error('Error adding user:', error);
          reject(error);
        });
    });
  };
  const updateAndClear = () =>{
    const token = Cookies.get('token');
    const api = axios.create({
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    api.get(`${process.env.REACT_APP_BASE_URL}/User/getAllUser`)
      .then((res) => {
        setUsers(res.data);
        setFullname('');
        setPhone('');
        setUsername('');
        setPassword('');
        setIsAdmin(false);
        setIsAddFormVisible(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const filteredUsers = users.filter(user =>
    user.hoTen.toLowerCase().includes(searchTerm.toLowerCase()) || user.sdt.includes(searchTerm)
  );

  const offset = currentPage * usersPerPage;
  const currentPageData = filteredUsers.slice(offset, offset + usersPerPage);
  const pageCount = Math.ceil(filteredUsers.length / usersPerPage);
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };
  const handleDeleteClick = (sdt) => {
    setSelectedUser(sdt);
    setDeleteFormVisible(true);
  };
  const handleDeleteConfirm = (event) => {
    event.preventDefault();
    setDeleteFormVisible(false);
    axios.put(`${process.env.REACT_APP_BASE_URL}/User/DeleteUser/${selectedUser}`)
      .then(response => {
        if (response.data != null) {
          const updatedUsers = users.filter(user => user.sdt !== selectedUser);
          setUsers(updatedUsers);
        }
        console.log(response);
      })
      .catch(error => {
        console.error('Error deleting user:', error);
      })
  };
  const handleAddConfirm = (event) => {
    event.preventDefault();
    if (fullname === '' && phone === '' && username === '' && password === '') {
      toast.error(`Không có gì để lưu!`);
      setIsAddFormVisible(false);
    }
    else {
      handleAddUser();
    }
  };

  const handleAddUserClick = () => {
    setIsAddFormVisible(true);
  }
  const handleAddCancel = (event) => {
    event.preventDefault();
    setDeleteFormVisible(false);
  };
  const handleDeleteCancel = (event) => {
    event.preventDefault();
    setDeleteFormVisible(false);
  };
  const handleUserClick = (user) => {
    navigate("/InfoReader", { state: { user } });
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
      <div className={cx("Rader-container")}>
        <div className={cx("search-container")}>
          <input className={cx("search-user")}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className={cx("add-user-button")}>
            <button className={cx("add-button-button")} onClick={handleAddUserClick}>
              Add user
            </button>
          </div>
        </div>

        <div className={cx("list-user-container")}>
          <ul className={cx("ul-list")}>
            {currentPageData.length > 0 ? (currentPageData.map(user => (
              <li className={cx("li-user")} key={user.sdt}>
                <div className={cx("user-cover")} onClick={() => handleUserClick(user)}>
                  <div className={cx("user-card")}>
                    <div className={cx("user-avatar")} style={{ backgroundColor: getRandomColor() }}>
                      <span>{user.hoTen.toUpperCase().charAt(0)}</span>
                    </div>
                  </div>
                  <div className={cx("user-container")}>
                    <strong>{user.hoTen}</strong>
                    <p>{user.sdt}</p>
                  </div>
                </div>
                <div className={cx("delete-container")}>
                  <img className={cx('img_delete')} src={images.icon_delete} alt="" onClick={() => handleDeleteClick(user.sdt)} />
                </div>
              </li>
            ))) : <div className={cx('emptyAccount')} >Không có tài khoản theo yêu cầu</div>}
          </ul>
          <div className={cx("overlay", { active: isDeleteFormVisible })} onClick={handleDeleteCancel}></div>
          {isDeleteFormVisible && (
            <form className={cx("delete-form", { active: isDeleteFormVisible })} onSubmit={handleDeleteConfirm}>
              <p>Are you sure you want to delete the user?</p>
              <button type="submit">Yes</button>
              <button type="button" onClick={handleDeleteCancel}>No</button>
            </form>
          )}
          <div className={cx("overlay", { active: isAddFormVisible })} onClick={handleAddCancel}></div>
          {isAddFormVisible && (
            <form className={cx('form-add-container')} onSubmit={handleAddConfirm}>
              <h2>ADD USER</h2>
              <p className={cx("invalid_Fullname")}>Họ tên không chứa số và kí tự đặc biệt</p>
              <input className={cx("input-text")} type="text" value={fullname} onChange={handleFullnameChange} required placeholder='Nhập họ tên' />
              <p className={cx("invalid_Phone")}>Số điện thoại chỉ chứa 10 số và bắt đầu bằng 0</p>
              <input className={cx("input-text")} type="tel" value={phone} onChange={handlePhoneChange} required placeholder='Nhập số điện thoại' />
              <p className={cx("invalid_Username")}>Username có từ 3-10 ký tự và không chứa khoảng trắng</p>
              <input className={cx("input-text")} type="text" value={username} onChange={handleUsernameChange} required placeholder='Nhập tên đăng nhập' />
              <p className={cx("invalid_Password")}>Password có từ 3-10 ký tự và không chứa khoảng trắng</p>
              <input className={cx("input-text")} type="password" value={password} onChange={handlePasswordChange} required placeholder='Nhập mật khẩu' />
              <div className={cx('checkbox-container')} >
                <label >Admin</label>
                <input type="checkbox" checked={isAdmin} onChange={handleAdminChange} />
              </div>
              <button className={cx('register-button')} onClick={handleAddConfirm}>Xác nhận</button>
            </form>
          )}
          <ReactPaginate
            pageCount={pageCount}
            pageRangeDisplayed={5}
            marginPagesDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName={cx('pagination')}
            activeClassName={cx('active')}
          />
        </div>
      </div>
    </Fragment>
  );
};

export default Reader;
