import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./componets/dashboard";
import CounsellorList from './componets/counsellor';
import Layout from './layout/layout';
import UserList from './componets/users';
import UpdateCounsellor from './pages/counsellor/counsellorProfile';
import AdminProfile from './pages/admin/adminProfile';
import AddPost from './pages/admin/addPost';
// import CustomInputWithEmoji from './utils/emojis'
import AddAdvertisement from './pages/admin/addAdvertisement';

function App() {
  return (
    <div className="App">
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/" element={<Layout/>} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/counsellorlist" element={<CounsellorList />} />
          <Route exact path="/userlist" element={<UserList />} />
          <Route path="/counsellor" element={<UpdateCounsellor />} />
          <Route path="/admin" element={<AdminProfile/>} />
          <Route path="/post" element={<AddPost/>} />
          {/* <Route path="/emo" element={<CustomInputWithEmoji />} /> */}
          {/* <Route path="/advertisement" element={<Advertisement/>} /> */}
          <Route path="/addadvertisement" element={<AddAdvertisement/>} />
        </Routes>
      </div>
    </BrowserRouter>
  </div>
  );
}
export default App;
