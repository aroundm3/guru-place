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
  InputAdornment,
} from "@mui/material"
import CalendarTodayRoundedIcon from "@mui/icons-material/CalendarTodayRounded"
import { motion, AnimatePresence } from "framer-motion"
import { useCustomer } from "@lib/context/customer-context"
import { getCustomerByPhone, createCustomer } from "@lib/data/customer"
import Link from "next/link"
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded"
import HomeRoundedIcon from "@mui/icons-material/HomeRounded"
import CardGiftcardRoundedIcon from "@mui/icons-material/CardGiftcardRounded"

type Step = "phone" | "info" | "welcome"

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
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("phone")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Form data
  const [phoneNumber, setPhoneNumber] = useState("")
  const [fullName, setFullName] = useState("")
  const [dob, setDob] = useState("")
  const [address, setAddress] = useState("")
  const [isReturningCustomer, setIsReturningCustomer] = useState(false)
  const [customerName, setCustomerName] = useState("")

  // Check if customer exists in cookie on mount
  useEffect(() => {
    if (!isLoading && !customer) {
      setOpen(true)
    }
  }, [customer, isLoading])

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
        // Customer exists
        setIsReturningCustomer(true)
        setCustomer(existingCustomer)
        setCustomerName(existingCustomer.full_name || "")
        setStep("welcome")
      } else {
        // New customer
        setIsReturningCustomer(false)
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
        dob: dob || undefined,
        address: address,
      })

      if (newCustomer) {
        setCustomer(newCustomer)
        setCustomerName(newCustomer.full_name || "")
        setStep("welcome")
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

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={step === "welcome" ? handleClose : undefined}
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
                <Typography className="text-gray-900 !font-semibold !mb-8 text-center tracking-tight !text-lg sm:!text-2xl">
                  Chào mừng bạn đến với Divi
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-600 !mb-2 text-left text-sm sm:text-base"
                >
                  Hãy cho chúng tôi số điện thoại của bạn để được hỗ trợ tốt
                  nhất
                </Typography>

                <form onSubmit={handlePhoneSubmit} className="space-y-5">
                  <TextField
                    fullWidth
                    label="Số điện thoại"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="0901234567"
                    error={!!error}
                    helperText={error}
                    disabled={loading}
                    className="!mb-4"
                  />

                  <div className="flex space-x-4">
                    <Button
                      onClick={() => setOpen(false)}
                      variant="outlined"
                      fullWidth
                      disabled={loading}
                      className="!normal-case !font-semibold !py-2.5 !text-neutral-900 !border-neutral-900"
                    >
                      {"Để sau"}
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      className="!bg-neutral-900 !text-white !normal-case !font-semibold !py-2.5"
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
                className="p-8 sm:p-10"
              >
                <Typography
                  variant="h4"
                  className="text-gray-900 font-bold mb-4 text-center tracking-tight text-2xl sm:text-3xl"
                >
                  Thông tin của bạn
                </Typography>
                <Typography
                  variant="body1"
                  className="text-gray-600 mb-10 text-center text-sm sm:text-base font-normal"
                >
                  Vui lòng điền thông tin để hoàn tất đăng ký
                </Typography>

                <form onSubmit={handleInfoSubmit} className="space-y-5">
                  <TextField
                    fullWidth
                    label="Họ và tên"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    disabled={loading}
                  />

                  <TextField
                    fullWidth
                    label="Ngày sinh"
                    type="date"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <CalendarTodayRoundedIcon className="text-gray-400" />
                        </InputAdornment>
                      ),
                    }}
                    disabled={loading}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&:hover fieldset": {
                          borderColor: "#be185d",
                        },
                      },
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Địa chỉ"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    multiline
                    rows={3}
                    disabled={loading}
                  />

                  {error && (
                    <Typography variant="body2" className="text-red-600">
                      {error}
                    </Typography>
                  )}

                  <div className="flex gap-3">
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() => setStep("phone")}
                      disabled={loading}
                      className="!normal-case"
                    >
                      Quay lại
                    </Button>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      disabled={loading}
                      className="!bg-neutral-900 !text-white !normal-case !font-semibold"
                    >
                      {loading ? "Đang tạo..." : "Hoàn tất"}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Welcome */}
            {step === "welcome" && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="p-8 sm:p-10 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mb-8"
                >
                  <div className="w-24 h-24 mx-auto bg-stone-100 rounded-full flex items-center justify-center">
                    <CardGiftcardRoundedIcon className="!w-12 !h-12 text-stone-700" />
                  </div>
                </motion.div>

                <Typography className="text-gray-900 font-bold mb-4 tracking-tight text-lg sm:text-xl">
                  {isReturningCustomer
                    ? `Chào mừng quay trở lại${
                        customerName ? `, ${customerName}` : ""
                      }!`
                    : customerName
                    ? `Chào mừng bạn đến với Divi, ${customerName}!`
                    : "Chào mừng bạn đến với Divi!"}
                </Typography>

                <Typography
                  variant="body1"
                  className="text-gray-600 mb-12 text-base sm:text-lg leading-relaxed font-normal"
                >
                  {isReturningCustomer
                    ? "Rất vui được gặp lại bạn. Hãy khám phá những ưu đãi mới nhất!"
                    : "Cảm ơn bạn đã đăng ký. Hãy bắt đầu mua sắm ngay!"}
                </Typography>

                <div className="space-y-4">
                  <Link href="/discount-cards" onClick={handleClose}>
                    <Button
                      variant="contained"
                      fullWidth
                      className="!bg-neutral-900 !text-white !normal-case !font-semibold !py-2.5"
                      startIcon={<CardGiftcardRoundedIcon />}
                      endIcon={<ArrowForwardRoundedIcon />}
                    >
                      Xem thẻ giảm giá
                    </Button>
                  </Link>

                  <Link href="/" onClick={handleClose}>
                    <Button
                      variant="outlined"
                      fullWidth
                      className="!normal-case !py-2.5"
                      startIcon={<HomeRoundedIcon />}
                    >
                      Đi đến trang chủ
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  )
}
