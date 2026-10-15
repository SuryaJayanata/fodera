import React, { useState } from 'react'
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'

// Feature-based Modules
import { LandingPage } from '@/features/landing'
import { LoginPage, RegisterPage, ForgotPasswordPage } from '@/features/auth'
import { BusinessSetupPage, AddOutletPage, PosPreferencesPage } from '@/features/onboarding'
import { DashboardOverviewPage } from '@/features/dashboard'
import { OrdersPage, SalesAnalyticsPage } from '@/features/sales'
import { ProductsListPage, CategoriesPage } from '@/features/products'
import { StockListPage, StockMovementPage, WasteTrackingPage } from '@/features/inventory'
import { CustomersOverviewPage } from '@/features/customers'
import { StaffManagementPage, ShiftManagementPage } from '@/features/team'
import { OutletsListPage, MultiOutletComparisonPage } from '@/features/outlets'
import { ReportsOverviewPage } from '@/features/reports'
import { ActivityTimelinePage } from '@/features/activity'
import { SettingsPage } from '@/features/settings'

// SaaS Platform Shell with Modular Inner Navigation
function SaasApp() {
  const navigate = useNavigate()
  const [activeModule, setActiveModule] = useState<string>('dashboard')
  const [activeSubPage, setActiveSubPage] = useState<string>('overview')
  const [currentOutlet, setCurrentOutlet] = useState<string>('all')
  const [currentPeriod, setCurrentPeriod] = useState<string>('7 Days')

  const handleNavigate = (moduleId: string, subPageId?: string) => {
    if (moduleId === 'auth') {
      if (subPageId === 'register') navigate('/register')
      else if (subPageId === 'forgot-password') navigate('/forgot-password')
      else navigate('/login')
      return
    }
    if (moduleId === 'onboarding') {
      if (subPageId === 'outlet') navigate('/onboarding/add-outlet')
      else if (subPageId === 'pos-settings' || subPageId === 'preferences') navigate('/onboarding/pos-settings')
      else navigate('/onboarding')
      return
    }

    // Redirect ('sales', 'analytics') call to ('dashboard', 'analytics') to avoid duplication
    if (moduleId === 'sales' && subPageId === 'analytics') {
      setActiveModule('dashboard')
      setActiveSubPage('analytics')
      return
    }

    setActiveModule(moduleId)
    if (subPageId) {
      setActiveSubPage(subPageId)
    } else {
      if (moduleId === 'dashboard') setActiveSubPage('overview')
      else if (moduleId === 'sales') setActiveSubPage('orders')
      else if (moduleId === 'products') setActiveSubPage('all')
      else if (moduleId === 'inventory') setActiveSubPage('stock')
      else if (moduleId === 'team') setActiveSubPage('staff')
      else if (moduleId === 'outlets') setActiveSubPage('list')
      else setActiveSubPage('default')
    }
  }

  const getPageTitle = () => {
    switch (activeModule) {
      case 'dashboard':
        return activeSubPage === 'analytics' ? 'Sales & Revenue Analytics' : 'Dashboard Overview'
      case 'sales':
        return 'Order Management & Kitchen Display'
      case 'products':
        return 'Products & Menu'
      case 'inventory':
        return 'Inventory & Stock'
      case 'customers':
        return 'Customer Insights'
      case 'team':
        return 'Team & Staffing'
      case 'outlets':
        return 'Outlets Management'
      case 'reports':
        return 'Structured Reports'
      case 'activity':
        return 'Activity Timeline'
      case 'settings':
        return 'Settings'
      default:
        return 'FODERA'
    }
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-secondary/50">
      <AppLayout
        activeModule={activeModule}
        activeSubPage={activeSubPage}
        onNavigate={handleNavigate}
        currentOutlet={currentOutlet}
        onOutletChange={setCurrentOutlet}
        currentPeriod={currentPeriod}
        onPeriodChange={setCurrentPeriod}
        pageTitle={getPageTitle()}
        pageSubtitle={currentOutlet === 'all' ? 'Seluruh Cabang' : `Cabang ${currentOutlet}`}
      >
        {/* Module Content Switcher */}
        {activeModule === 'dashboard' && (
          <>
            {(activeSubPage === 'overview' || activeSubPage === 'default') && (
              <DashboardOverviewPage
                currentOutlet={currentOutlet}
                currentPeriod={currentPeriod}
                onNavigate={handleNavigate}
                onOutletChange={setCurrentOutlet}
              />
            )}
            {activeSubPage === 'analytics' && (
              <SalesAnalyticsPage
                currentOutlet={currentOutlet}
                onOutletChange={setCurrentOutlet}
                currentPeriod={currentPeriod}
                onPeriodChange={setCurrentPeriod}
              />
            )}
          </>
        )}

        {activeModule === 'sales' && (
          <OrdersPage
            currentOutlet={currentOutlet}
            onOutletChange={setCurrentOutlet}
          />
        )}

        {activeModule === 'products' && (
          <>
            {activeSubPage === 'all' && <ProductsListPage />}
            {activeSubPage === 'categories' && <CategoriesPage />}
          </>
        )}

        {activeModule === 'inventory' && (
          <>
            {activeSubPage === 'stock' && <StockListPage />}
            {activeSubPage === 'movement' && <StockMovementPage />}
            {activeSubPage === 'waste' && <WasteTrackingPage />}
          </>
        )}

        {activeModule === 'customers' && <CustomersOverviewPage />}

        {activeModule === 'team' && (
          <>
            {activeSubPage === 'staff' && <StaffManagementPage />}
            {activeSubPage === 'shifts' && <ShiftManagementPage />}
          </>
        )}

        {activeModule === 'outlets' && (
          <>
            {activeSubPage === 'list' && <OutletsListPage />}
            {activeSubPage === 'compare' && <MultiOutletComparisonPage />}
          </>
        )}

        {activeModule === 'reports' && <ReportsOverviewPage />}
        {activeModule === 'activity' && <ActivityTimelinePage />}
        {activeModule === 'settings' && <SettingsPage />}
      </AppLayout>
    </div>
  )
}

// Wrapper for Auth Screens
function AuthLayoutWrapper({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-background font-sans">{children}</div>
}

// Clean wrapper for Onboarding Screens with design system grounding
function OnboardingLayoutWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-secondary/40 flex items-center justify-center p-4 sm:p-6 font-sans">
      {children}
    </div>
  )
}

// Main App with Browser Routing
export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root is Landing Page as requested */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={
            <AuthLayoutWrapper>
              <LoginPage
                onLoginSuccess={() => window.location.assign('/app')}
                onNavigateToRegister={() => window.location.assign('/register')}
                onNavigateToForgotPassword={() => window.location.assign('/forgot-password')}
              />
            </AuthLayoutWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <AuthLayoutWrapper>
              <RegisterPage
                onRegisterSuccess={() => window.location.assign('/onboarding')}
                onNavigateToLogin={() => window.location.assign('/login')}
              />
            </AuthLayoutWrapper>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <AuthLayoutWrapper>
              <ForgotPasswordPage onNavigateToLogin={() => window.location.assign('/login')} />
            </AuthLayoutWrapper>
          }
        />

        {/* Onboarding Routes */}
        <Route
          path="/onboarding"
          element={
            <OnboardingLayoutWrapper>
              <BusinessSetupPage onComplete={() => window.location.assign('/onboarding/add-outlet')} />
            </OnboardingLayoutWrapper>
          }
        />
        <Route
          path="/onboarding/add-outlet"
          element={
            <OnboardingLayoutWrapper>
              <AddOutletPage
                onNext={() => window.location.assign('/onboarding/pos-settings')}
                onFinish={() => window.location.assign('/onboarding/pos-settings')}
              />
            </OnboardingLayoutWrapper>
          }
        />
        <Route
          path="/onboarding/pos-settings"
          element={
            <OnboardingLayoutWrapper>
              <PosPreferencesPage onFinish={() => window.location.assign('/app')} />
            </OnboardingLayoutWrapper>
          }
        />

        {/* Main SaaS Platform App */}
        <Route path="/app/*" element={<SaasApp />} />
        <Route path="/dashboard" element={<Navigate to="/app" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
