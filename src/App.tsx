import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ThemeProvider } from './context/ThemeContext'
import Layout from './components/Layout'
import Homepage from './pages/Homepage'
import Dashboard from './pages/Dashboard'
import MoveCrypto from './pages/MoveCrypto'
import Discover from './pages/Discover'
import TaxHub from './pages/TaxHub'
import Travel from './pages/Travel'
import Settings from './pages/Settings'
import Rewards from './pages/Rewards'
import Marketplace from './pages/Marketplace'
import UtilityPayments from './pages/UtilityPayments'
import Transactions from './pages/Transactions'

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/app/*"
            element={
              <Layout>
                <Routes>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="move-crypto" element={<MoveCrypto />} />
                  <Route path="discover" element={<Discover />} />
                  <Route path="tax-hub" element={<TaxHub />} />
                  <Route path="travel" element={<Travel />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="rewards" element={<Rewards />} />
                  <Route path="marketplace" element={<Marketplace />} />
                  <Route path="utility-payments" element={<UtilityPayments />} />
                  <Route path="transactions" element={<Transactions />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </Router>
      </AppProvider>
    </ThemeProvider>
  )
}

export default App

