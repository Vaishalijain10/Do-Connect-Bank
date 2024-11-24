import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Balance from "./pages/Balance";
import DigitalPin from "./pages/DigitalPin";
import EditUserDetails from "./pages/EditUserDetails";
import ViewUserDetails from "./pages/ViewUserDetails";
import ForgotPassword from "./pages/ForgotPassword";
import TransactionHistory from "./pages/TransactionHistory";
import Transfer from "./pages/Transfer";
import WithDraw from "./pages/WithDraw";
import Deposit from "./pages/Deposit";
import PasswordReset from "./pages/PasswordReset";
import { useDispatch } from "react-redux";
import { fetchUserDetails } from "./redux/slices/userSlice";
import { useCallback, useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  const fetchUserDetailsAction = useCallback(() => {
    dispatch(fetchUserDetails());
  }, [dispatch]);

  useEffect(() => {
    fetchUserDetailsAction();
  }, [fetchUserDetailsAction]);

  return (
    <>
      <div className="App">
        <Router>
          <ToastContainer
            position="top-center"
            autoClose={1000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          {/* navbar component */}
          <NavBar />
          <div className="content">
            <Routes>
              {/* home */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/balance" element={<Balance />} />
              <Route path="/digitalPin" element={<DigitalPin />} />
              <Route path="/editUserDetails" element={<EditUserDetails />} />
              <Route path="/forgotPassword" element={<ForgotPassword />} />
              <Route
                path="/transactionHistory"
                element={<TransactionHistory />}
              />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/viewUserDetails" element={<ViewUserDetails />} />
              <Route path="/withDraw" element={<WithDraw />} />
              <Route path="/deposit" element={<Deposit />} />
              <Route path="/passwordReset" element={<PasswordReset />} />
            </Routes>
          </div>

          {/* Footer Component */}
          <Footer />
        </Router>
      </div>
    </>
  );
}

export default App;
