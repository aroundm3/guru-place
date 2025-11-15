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

interface CustomerModalForCheckoutProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function CustomerModalForCheckout({
  open,
  onClose,
  onSuccess,
}: CustomerModalForCheckoutProps) {
  const { customer, setCustomer, isLoading } = useCustomer()
  const [step, setStep] = useState<Step>("phone")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form data
  const [phoneNumber, setPhoneNumber] = useState("")
  const [fullName, setFullName] = useState("")
  const [dob, setDob] = useState<Dayjs | null>(null)
  const [address, setAddress] = useState("")

  // Reset form khi mở/đóng modal
  useEffect(() => {
    if (open) {
      setStep("phone")
      setPhoneNumber(customer?.phone_number || "")
      setError("")
    } else {
      setPhoneNumber("")
      setFullName("")
      setDob(null)
      setAddress("")
      setError("")
    }
  }, [open, customer])

  // Khi customer được set, gọi onSuccess
  useEffect(() => {
    if (customer && open) {
      onSuccess()
    }
  }, [customer, open, onSuccess])

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
        // Customer exists - set customer và onSuccess sẽ được gọi tự động
        setCustomer(existingCustomer)
        // Reset form
        setPhoneNumber("")
        setDob(null)
        setStep("phone")
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
        // Reset form
        setPhoneNumber("")
        setFullName("")
        setDob(null)
        setAddress("")
        setStep("phone")
        // onSuccess sẽ được gọi tự động qua useEffect
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

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={onClose}
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
                className="p-4 sm:p-6"
              >
                <Typography className="text-gray-900 !font-semibold !mb-6 sm:!mb-8 text-center tracking-tight !text-base sm:!text-2xl">
                  Nhập thông tin
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-600 !mb-3 sm:!mb-4 text-left !text-xs sm:!text-base"
                >
                  Vui lòng nhập thông tin để thanh toán
                </Typography>

                <form
                  onSubmit={handlePhoneSubmit}
                  className="space-y-4 sm:space-y-5"
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

                  <div className="flex space-x-3 sm:space-x-4">
                    <Button
                      onClick={onClose}
                      variant="outlined"
                      fullWidth
                      disabled={loading}
                      className="!normal-case !font-semibold !py-2 sm:!py-2.5 !text-xs sm:!text-sm !text-neutral-900 !border-neutral-900"
                    >
                      Hủy
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      className="!bg-neutral-900 !text-white !normal-case !font-semibold !py-2 sm:!py-2.5 !text-xs sm:!text-sm"
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
                className="p-4 sm:p-6"
              >
                <Typography className="text-gray-900 !font-semibold !mb-6 sm:!mb-8 text-center tracking-tight !text-base sm:!text-2xl">
                  Thông tin của bạn
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-600 !mb-3 sm:!mb-4 text-left !text-xs sm:!text-base"
                >
                  Vui lòng điền thông tin để hoàn tất đăng ký
                </Typography>

                <form
                  onSubmit={handleInfoSubmit}
                  className="space-y-4 sm:space-y-5"
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
                      className="!text-xs sm:!text-sm text-red-600"
                    >
                      {error}
                    </Typography>
                  )}

                  <div className="flex space-x-3 sm:space-x-4">
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setStep("phone")}
                      disabled={loading}
                      className="!normal-case !font-semibold !py-2 sm:!py-2.5 !text-xs sm:!text-sm !text-neutral-900 !border-neutral-900"
                    >
                      Quay lại
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      className="!bg-neutral-900 !text-white !normal-case !font-semibold !py-2 sm:!py-2.5 !text-xs sm:!text-sm"
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
