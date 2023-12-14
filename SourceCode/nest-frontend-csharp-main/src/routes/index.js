import Home from "~/pages/Home/Home"
import Login from "~/pages/Login/Login"
import Register from "~/pages/Register/Register"
import QLSach from "~/pages/QLSach/QLSach"
import ThuVien from "~/pages/ThuVien/ThuVien"
import ThongKe from "~/pages/ThongKe/ThongKe"
import MuonSach from "~/pages/MuonSach/MuonSach"
import TraSach from "~/pages/TraSach/TraSach"
import BanDoc from "~/pages/Reader/Reader"
import TTCN from "~/pages/TTCN/TTCN"
import InfoReader from "~/pages/InfoReader/InfoReader"
import ThemSach from "~/pages/ThemSach/ThemSach"
import InfoBook from "~/pages/InfoBook/InfoBook"

const publicRouter = [
    {path: '/', component: Login, layout: null},
    {path: '/Home', component: Home},
    {path: '/Sach', component: QLSach},
    {path: '/ThuVien', component: ThuVien},
    {path: '/MuonSach', component: MuonSach},
    {path: '/Sach/ThemSach', component: ThemSach},
    {path: '/Sach/InfoBook', component: InfoBook},
    {path: '/TraSach', component: TraSach},
    {path: '/BanDoc', component: BanDoc},
    {path: '/ThongKe', component: ThongKe},
    {path: '/Register', component: Register, layout: null},
    {path: '/TTCN', component: TTCN},
    {path: '/InfoReader', component: InfoReader},
]

const privateRouter = [

]

export { publicRouter, privateRouter }