"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, Tab, Box, Button, TextField, Alert, CircularProgress } from "@mui/material"
import LogoutIcon from "@mui/icons-material/Logout"
import ReconciliationContent from "./_components/ReconciliationContent"
import CustomersContent from "./_components/CustomersContent"

type TabValue = "orders" | "customers"

export default function AdminPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialTab = (searchParams.get("tab") as TabValue) || "orders"
  const [currentTab, setCurrentTab] = useState<TabValue>(initialTab)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginError, setLoginError] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/admin/orders?page=1&pageSize=1")
      if (response.ok) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (err) {
      setIsAuthenticated(false)
    } finally {
      setIsLoadingAuth(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    setLoginLoading(true)

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setLoginError(data.error || "Đăng nhập thất bại")
        return
      }

      setIsAuthenticated(true)
      setEmail("")
      setPassword("")
    } catch (err: any) {
      setLoginError(err.message || "Có lỗi xảy ra")
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      setIsAuthenticated(false)
    } catch (err) {
      // Ignore error
    }
  }

  const handleTabChange = (_event: React.SyntheticEvent, newValue: TabValue) => {
    setCurrentTab(newValue)
    // Reset filters khi chuyển tab - chỉ giữ lại tab param
    router.push(`/admin?tab=${newValue}`, { scroll: false })
  }

  if (isLoadingAuth) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center py-12 sm:py-16">
          <CircularProgress />
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-md">
        <div className="bg-white border border-gray-200 rounded-lg p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Đăng nhập Admin
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loginLoading}
              size="small"
            />
            <TextField
              fullWidth
              label="Mật khẩu"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loginLoading}
              size="small"
            />
            {loginError && (
              <Alert severity="error" className="!text-sm">
                {loginError}
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loginLoading}
              className="!bg-neutral-900 !text-white !normal-case !font-semibold !py-2.5"
            >
              {loginLoading ? "Đang đăng nhập..." : "Đăng nhập"}
            </Button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-7xl">
      <div className="mb-4 sm:mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          Quản trị hệ thống
        </h1>
        <Button
          variant="outlined"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          className="!normal-case !font-semibold !text-neutral-900 !border-neutral-900"
        >
          Đăng xuất
        </Button>
      </div>

      <div className="mb-6">
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          aria-label="admin tabs"
          className="border-b border-gray-200"
        >
          <Tab
            label="Đối soát đơn hàng"
            value="orders"
            className="!normal-case !font-semibold"
          />
          <Tab
            label="Danh sách khách hàng"
            value="customers"
            className="!normal-case !font-semibold"
          />
        </Tabs>
      </div>

      <Box sx={{ mt: 3 }}>
        {currentTab === "orders" && (
          <ReconciliationContent key="orders" />
        )}
        {currentTab === "customers" && (
          <CustomersContent key="customers" />
        )}
      </Box>
    </div>
  )
}

