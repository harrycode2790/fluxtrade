import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import AuthLayout from "../layout/AuthLayout";

import Home from "../pages/Home";
import Market from "../pages/Market";
import Chart from "../pages/Chart";
import Messages from "../pages/Messages";
import DepositPage from "../pages/Deposit";
import WithdrawPage from "../pages/Withdraw";
import AccountPage from "../pages/Account";
import CopyTradingPage from "../pages/CopyTrading";

import NotificationsPage from "../pages/Notifications";
import EducationPage from "../pages/EducationPage";
import LiveChatPage from "../pages/LiveChatPage";

import NotFoundPage from "../pages/NotFoundPage";

// Auth pages
import LoginPage from "../pages/Login";
import RegisterPage from "../pages/Register";
import ForgetPasswordPage from "../pages/ForgetPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import TradingPackagePage from "../pages/TradingPackagePage";
import { useAuthStore } from "../store/useAuthStore";
import { useEffect } from "react";
import Spinner from "../components/Spinner";
import StockTradePage from "../pages/Stocks";
import BotsTradingPage from "../pages/BotsTradingPage";
import AdminPage from "../admin/pages/AdminPage";
import AdminUserPage from "../admin/pages/AdminUserPage";
import AdminSingleUserPage from "../admin/pages/AdminSingleUserPage";
import AdminTransactionPage from "../admin/pages/AdminTransactionPage";
import AdminSubscriptionPage from "../admin/pages/AdminSubscriptionPage";
import AdminSingleSubPage from "../admin/pages/AdminSingleSubpage";
import AdminPaymentMethodPage from "../admin/pages/AdminPaymentMethodPage";

export default function AppRoutes() {
  const { checkAuth, isCheckingAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });
  if (isCheckingAuth) return <Spinner />;
  return (
    <Routes>
      {/* MAIN APP ROUTES */}
      <Route element={<MainLayout />}>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/market"
          element={authUser ? <Market /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/trade/crypto"
          element={authUser ? <Chart /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/trade/stock"
          element={authUser ? <StockTradePage /> : <Navigate to={"/login"} />}
        />
        <Route path="/message" element={<Messages />} />
        <Route
          path="/deposit"
          element={authUser ? <DepositPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/withdraw"
          element={authUser ? <WithdrawPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/account"
          element={authUser ? <AccountPage /> : <Navigate to={"/login"} />}
        />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route
          path="/copy-trading"
          element={authUser ? <CopyTradingPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/education"
          element={authUser ? <EducationPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/livechat"
          element={authUser ? <LiveChatPage /> : <Navigate to={"/login"} />}
        />
        <Route
          path="/trading-package"
          element={
            authUser ? <TradingPackagePage /> : <Navigate to={"/login"} />
          }
        />
        <Route
          path="/bots"
          element={authUser ? <BotsTradingPage /> : <Navigate to={"/login"} />}
        />
      </Route>

      {/* NOT FOUND PAGE */}
      <Route
        path="*"
        element={authUser ? <NotFoundPage /> : <Navigate to="/login" />}
      />

      {/* ADMIN ROUTES */}
      <Route
        path="/admin/dashboard"
        element={
          authUser && authUser.role === "admin" ? (
            <AdminPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route
        path="/admin/users"
        element={
          authUser && authUser.role === "admin" ? (
            <AdminUserPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin/users/:id"
        element={
          authUser && authUser.role === "admin" ? (
            <AdminSingleUserPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin/transactions"
        element={
          authUser && authUser.role === "admin" ? (
            <AdminTransactionPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin/subscriptions"
        element={
          authUser && authUser.role === "admin" ? (
            <AdminSubscriptionPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin/subscription/:id"
        element={
          authUser && authUser.role === "admin" ? (
            <AdminSingleSubPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      <Route
        path="/admin/payment-methods/"
        element={
          authUser && authUser.role === "admin" ? (
            <AdminPaymentMethodPage />
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* AUTH ROUTES */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/register"
          element={!authUser ? <RegisterPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/forget-password"
          element={!authUser ? <ForgetPasswordPage /> : <Navigate to={"/"} />}
        />
        <Route
          path="/reset-password"
          element={!authUser ? <ResetPasswordPage /> : <Navigate to={"/"} />}
        />
      </Route>
    </Routes>
  );
}
