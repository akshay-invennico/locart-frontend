import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import AuthWrapper from "@/components/common/AuthWrapper";
import DashboardLayout from "@/layouts/DashboardLayout";
import AuthLayout from "@/layouts/AuthLayout";
import UserDetailsLayout from "@/layouts/UserDetailsLayout";
import MyStoreLayout from "@/layouts/MyStoreLayout";
import MyEcomLayout from "@/layouts/MyEcomLayout";
import PaymentLayout from "@/layouts/PaymentLayout";
import Spinner from "@/components/common/Spinner";

// Auth pages
const AuthPage = lazy(() => import("@/pages/auth/AuthPage"));
const StylistAuthPage = lazy(() => import("@/pages/stylists/auth/AuthPage"));

// Dashboard pages
const DashboardView = lazy(() => import("@/modules/dashboard/DashboardView"));
const AppointmentsPage = lazy(() => import("@/pages/appointments/AppointmentsPage"));
const UsersPage = lazy(() => import("@/pages/users/UsersPage"));
const UserDetailsPlaceholder = lazy(() => import("@/pages/users/details/UserDetailsPlaceholder"));
const UserOverviewPage = lazy(() => import("@/pages/users/details/overview/UserOverviewPage"));
const UserBookingPage = lazy(() => import("@/pages/users/details/booking/UserBookingPage"));
const UserProductOrdersPage = lazy(() => import("@/pages/users/details/product-orders/UserProductOrdersPage"));
const UserLoyaltyRewardsPage = lazy(() => import("@/pages/users/details/loyalty-rewards/UserLoyaltyRewardsPage"));

// My Store pages
const MyStorePage = lazy(() => import("@/pages/my-store/MyStorePage"));
const ServicesPage = lazy(() => import("@/pages/my-store/services/ServicesPage"));
const StylistPage = lazy(() => import("@/pages/my-store/stylist/StylistPage"));
const StoreCategoriesPage = lazy(() => import("@/pages/my-store/categories/CategoriesPage"));
const AvailabilityPage = lazy(() => import("@/pages/my-store/availability/AvailabilityPage"));
const OperatingHoursPage = lazy(() => import("@/pages/my-store/availability/operatinghours/OperatingHoursPage"));
const PortfolioPage = lazy(() => import("@/pages/my-store/portfolio/PortfolioPage"));
const PortfolioDetailPage = lazy(() => import("@/pages/my-store/portfolio/PortfolioDetailPage"));

// My Ecom pages
const OrderPage = lazy(() => import("@/pages/my-ecom/order/OrderPage"));
const CreateInStoreOrderPage = lazy(() => import("@/pages/my-ecom/order/create-in-store-order/CreateInStoreOrderPage"));
const ProductPage = lazy(() => import("@/pages/my-ecom/product/ProductPage"));
const EcomCategoriesPage = lazy(() => import("@/pages/my-ecom/categories/CategoriesPage"));
const VendorPage = lazy(() => import("@/pages/my-ecom/vendor/VendorPage"));
const OfferPage = lazy(() => import("@/pages/my-ecom/offer/OfferPage"));

// Other pages
const LoyaltyRewardsPage = lazy(() => import("@/pages/loyalty-rewards/LoyaltyRewardsPage"));
const ProfilePage = lazy(() => import("@/pages/profile/ProfilePage"));
const PaymentAndPayoutsPage = lazy(() => import("@/pages/payment-and-payouts/PaymentAndPayoutsPage"));
const RefundsPage = lazy(() => import("@/pages/payment-and-payouts/RefundsPage"));
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage"));
const EducationPage = lazy(() => import("@/pages/education/EducationPage"));
const TestPage = lazy(() => import("@/pages/test/TestPage"));

// Stylist pages
const StylistDashboardPage = lazy(() => import("@/pages/stylists/dashboard/StylistDashboardPage"));
const StylistAppointmentsPage = lazy(() => import("@/pages/stylists/appointments/StylistAppointmentsPage"));
const StylistClientsPage = lazy(() => import("@/pages/stylists/clients/StylistClientsPage"));
const StylistProfilePage = lazy(() => import("@/pages/stylists/profile/StylistProfilePage"));
const StylistEarningsPage = lazy(() => import("@/pages/stylists/earnings/StylistEarningsPage"));
const StylistAvailabilityPage = lazy(() => import("@/pages/stylists/availability/StylistAvailabilityPage"));
const StylistReviewPage = lazy(() => import("@/pages/stylists/review/StylistReviewPage"));

function App() {
  return (
    <AuthWrapper>
      <Suspense fallback={<Spinner />}>
        <Routes>
          {/* Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/stylists/auth" element={<StylistAuthPage />} />
          </Route>

          {/* Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<DashboardView />} />
            <Route path="/appointments" element={<AppointmentsPage />} />
            <Route path="/education" element={<EducationPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            {/* Payment & Payouts */}
            <Route path="/payment-and-payouts" element={<PaymentLayout />}>
              <Route index element={<PaymentAndPayoutsPage />} />
              <Route path="refunds" element={<RefundsPage />} />
            </Route>
            <Route path="/loyalty-rewards" element={<LoyaltyRewardsPage />} />
            <Route path="/test" element={<TestPage />} />

            {/* Users / Clients */}
            <Route path="/users" element={<UsersPage />} />
            <Route path="/users/details" element={<UserDetailsLayout />}>
              <Route index element={<UserDetailsPlaceholder />} />
              <Route path="overview/:id" element={<UserOverviewPage />} />
              <Route path="booking/:id" element={<UserBookingPage />} />
              <Route path="product-orders/:id" element={<UserProductOrdersPage />} />
              <Route path="loyalty-rewards" element={<UserLoyaltyRewardsPage />} />
            </Route>

            {/* My Store */}
            <Route path="/my-store" element={<MyStoreLayout />}>
              <Route index element={<MyStorePage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="stylist" element={<StylistPage />} />
              <Route path="categories" element={<StoreCategoriesPage />} />
              <Route path="availability" element={<AvailabilityPage />} />
              <Route path="availability/operatinghours" element={<OperatingHoursPage />} />
              <Route path="portfolio" element={<PortfolioPage />} />
              <Route path="portfolio/:slug" element={<PortfolioDetailPage />} />
            </Route>

            {/* My Ecom */}
            <Route path="/my-ecom" element={<MyEcomLayout />}>
              <Route path="order" element={<OrderPage />} />
              <Route path="order/create-in-store-order" element={<CreateInStoreOrderPage />} />
              <Route path="product" element={<ProductPage />} />
              <Route path="categories" element={<EcomCategoriesPage />} />
              <Route path="vendor" element={<VendorPage />} />
              <Route path="offer" element={<OfferPage />} />
            </Route>

            {/* Stylist routes (within dashboard layout) */}
            <Route path="/stylists/dashboard" element={<StylistDashboardPage />} />
            <Route path="/stylists/appointments" element={<StylistAppointmentsPage />} />
            <Route path="/stylists/clients" element={<StylistClientsPage />} />
            <Route path="/stylists/profile" element={<StylistProfilePage />} />
            <Route path="/stylists/earnings" element={<StylistEarningsPage />} />
            <Route path="/stylists/availability" element={<StylistAvailabilityPage />} />
            <Route path="/stylists/review" element={<StylistReviewPage />} />
          </Route>
        </Routes>
      </Suspense>
    </AuthWrapper>
  );
}

export default App;
