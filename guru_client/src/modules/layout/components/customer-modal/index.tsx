"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  ThemeProvider,
  createTheme,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/vi"

dayjs.locale("vi")

import { motion, AnimatePresence } from "framer-motion"
import { useCustomer } from "@lib/context/customer-context"
import { getCustomerByPhone, createCustomer } from "@lib/data/customer"
import { usePathname, useRouter } from "next/navigation"

type Step = "phone" | "info"

// MUI Theme với màu pink-700 cho TextField
const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&.Mui-focused fieldset": {
              borderColor: "#be185d", // pink-700
            },
          },
          "& .MuiInputLabel-root": {
            "&.Mui-focused": {
              color: "#be185d", // pink-700
            },
          },
        },
      },
    },
  },
})

export default function CustomerModal() {
  const { customer, setCustomer, isLoading } = useCustomer()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("phone")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form data
  const [phoneNumber, setPhoneNumber] = useState("")
  const [fullName, setFullName] = useState("")
  const [dob, setDob] = useState<Dayjs | null>(null)
  const [address, setAddress] = useState("")

  // Chỉ hiển thị modal trên 2 route cụ thể: /orders và /discount-cards
  const allowedRoutes = ["/orders", "/discount-cards"]
  const shouldShowModal = allowedRoutes.includes(pathname)
  const isDiscountCardsPage = pathname === "/discount-cards"
  const shouldAutoOpen = shouldShowModal && !isDiscountCardsPage

  // Check if customer exists in localStorage on mount và chỉ khi ở đúng route
  useEffect(() => {
    if (!isLoading && !customer && shouldAutoOpen) {
      setOpen(true)
    } else if (customer || !shouldShowModal) {
      setOpen(false)
    }
  }, [customer, isLoading, shouldAutoOpen, shouldShowModal])

  useEffect(() => {
    if (!isDiscountCardsPage || typeof window === "undefined") {
      return
    }

    const handleOpenRequest = () => {
      setOpen(true)
      setStep("phone")
      setError("")
    }

    window.addEventListener(
      "discount-cards-open-profile-modal",
      handleOpenRequest
    )

    return () => {
      window.removeEventListener(
        "discount-cards-open-profile-modal",
        handleOpenRequest
      )
    }
  }, [isDiscountCardsPage])

  const resetForm = () => {
    setPhoneNumber("")
    setFullName("")
    setDob(null)
    setAddress("")
    setStep("phone")
    setError("")
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneNumber.trim()) {
      setError("Vui lòng nhập số điện thoại")
      return
    }

    setLoading(true)
    setError("")

    try {
      const existingCustomer = await getCustomerByPhone(phoneNumber)

      if (existingCustomer) {
        // Customer exists - đóng modal luôn
        setCustomer(existingCustomer)
        setOpen(false)
        resetForm()
      } else {
        // New customer - chuyển sang form thông tin
        setStep("info")
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInfoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName.trim() || !address.trim()) {
      setError("Vui lòng điền đầy đủ thông tin")
      return
    }

    setLoading(true)
    setError("")

    try {
      const newCustomer = await createCustomer({
        full_name: fullName,
        phone_number: phoneNumber,
        dob: dob ? dob.format("YYYY-MM-DD") : undefined,
        address: address,
      })

      if (newCustomer) {
        setCustomer(newCustomer)
        setOpen(false)
        resetForm()
      } else {
        setError("Không thể tạo tài khoản. Vui lòng thử lại.")
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpen(false)
  }

  const notifyDiscountCardsSkip = () => {
    if (typeof window === "undefined") {
      return
    }

    window.dispatchEvent(new Event("discount-cards-modal-skip"))
  }

  const handleSkip = () => {
    setOpen(false)
    resetForm()

    if (isDiscountCardsPage) {
      notifyDiscountCardsSkip()
      return
    }

    router.push("/")
  }

  // Text dựa trên route
  const getDescriptionText = () => {
    if (pathname === "/orders") {
      return "Vui lòng nhập thông tin để tra cứu đơn hàng"
    } else if (pathname === "/discount-cards") {
      return "Vui lòng nhập thông tin để tra cứu thẻ tích điểm"
    }
    return "Hãy cho chúng tôi số điện thoại của bạn để được hỗ trợ tốt nhất"
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={undefined}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            overflow: "hidden",
            backgroundColor: "#fffdf8",
            border: "1px solid #d6d3d1", // stone-300
          },
        }}
      >
        <DialogContent sx={{ p: 0 }}>
          <AnimatePresence mode="wait">
            {/* Step 1: Phone Number */}
            {step === "phone" && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 lg:p-6"
              >
                <Typography className="text-gray-900 !font-semibold !mb-6 lg:!mb-8 text-center tracking-tight !text-base lg:!text-2xl">
                  Nhập thông tin
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-600 !mb-3 lg:!mb-4 text-left !text-xs lg:!text-base"
                >
                  {getDescriptionText()}
                </Typography>

                <form
                  onSubmit={handlePhoneSubmit}
                  className="space-y-4 lg:space-y-5"
                >
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0901234567"
                    error={!!error}
                    helperText={error}
                    disabled={loading}
                    size="small"
                    className="!mb-4"
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                        "@media (min-width: 640px)": {
                          fontSize: "16px",
                        },
                      },
                    }}
                  />

                  <div className="flex space-x-3 lg:space-x-4">
                    <Button
                      onClick={handleSkip}
                      variant="outlined"
                      fullWidth
                      disabled={loading}
                      className="!normal-case !font-semibold !py-2 lg:!py-2.5 !text-xs lg:!text-sm !text-neutral-900 !border-neutral-900"
                    >
                      {"Để sau"}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      className="!bg-neutral-900 !text-white !normal-case !font-semibold !py-2 lg:!py-2.5 !text-xs lg:!text-sm"
                    >
                      {loading ? "Đang kiểm tra..." : "Tiếp tục"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 2: Customer Info */}
            {step === "info" && (
              <motion.div
                key="info"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-4 lg:p-6"
              >
                <Typography className="text-gray-900 !font-semibold !mb-6 lg:!mb-8 text-center tracking-tight !text-base lg:!text-2xl">
                  Thông tin của bạn
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-600 !mb-3 lg:!mb-4 text-left !text-xs lg:!text-base"
                >
                  Vui lòng điền thông tin để hoàn tất đăng ký
                </Typography>

                <form
                  onSubmit={handleInfoSubmit}
                  className="space-y-4 lg:space-y-5"
                >
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                    size="small"
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                        "@media (min-width: 640px)": {
                          fontSize: "16px",
                        },
                      },
                    }}
                  />

                  <LocalizationProvider
                    dateAdapter={AdapterDayjs}
                    adapterLocale="vi"
                  >
                    <DatePicker
                      label="Ngày sinh"
                      value={dob}
                      onChange={(newValue: Dayjs | null) => setDob(newValue)}
                      disabled={loading}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          sx: {
                            "& .MuiOutlinedInput-root": {
                              "&.Mui-focused fieldset": {
                                borderColor: "#be185d",
                              },
                              "&:hover fieldset": {
                                borderColor: "#be185d",
                              },
                            },
                            "& .MuiInputLabel-root": {
                              "&.Mui-focused": {
                                color: "#be185d",
                              },
                            },
                            "& .MuiInputBase-input": {
                              fontSize: "14px",
                              "@media (min-width: 640px)": {
                                fontSize: "16px",
                              },
                            },
                          },
                        },
                      }}
                    />
                  </LocalizationProvider>

                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    multiline
                    rows={3}
                    disabled={loading}
                    size="small"
                    sx={{
                      "& .MuiInputBase-input": {
                        fontSize: "14px",
                        "@media (min-width: 640px)": {
                          fontSize: "16px",
                        },
                      },
                    }}
                  />

                  {error && (
                    <Typography
                      variant="body2"
                      className="!text-xs lg:!text-sm text-red-600"
                    >
                      {error}
                    </Typography>
                  )}

                  <div className="flex space-x-3 lg:space-x-4">
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setStep("phone")}
                      disabled={loading}
                      className="!normal-case !font-semibold !py-2 lg:!py-2.5 !text-xs lg:!text-sm !text-neutral-900 !border-neutral-900"
                    >
                      Quay lại
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      className="!bg-neutral-900 !text-white !normal-case !font-semibold !py-2 lg:!py-2.5 !text-xs lg:!text-sm"
                    >
                      {loading ? "Đang tạo..." : "Hoàn tất"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}
