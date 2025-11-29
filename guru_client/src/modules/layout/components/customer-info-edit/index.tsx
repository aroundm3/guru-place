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
  Snackbar,
  Alert,
} from "@mui/material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/vi"

dayjs.locale("vi")

import EditRoundedIcon from "@mui/icons-material/EditRounded"
import { motion, AnimatePresence } from "framer-motion"
import { useCustomer } from "@lib/context/customer-context"
import {
  getCustomerByPhone,
  updateCustomer,
  Customer,
} from "@lib/data/customer"

type Step = "phone" | "edit"

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

export default function CustomerInfoEdit() {
  const { customer, setCustomer } = useCustomer()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>("phone")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Form data
  const [phoneNumber, setPhoneNumber] = useState("")
  const [fullName, setFullName] = useState("")
  const [dob, setDob] = useState<Dayjs | null>(null)
  const [address, setAddress] = useState("")
  const [customerToEdit, setCustomerToEdit] = useState<Customer | null>(null)

  const handleOpen = () => {
    setOpen(true)
    setStep("phone")
    // Load số điện thoại từ customer hiện tại nếu có
    setPhoneNumber(customer?.phone_number || "")
    setError("")
  }

  const handleClose = () => {
    setOpen(false)
    setStep("phone")
    setPhoneNumber("")
    setFullName("")
    setDob(null)
    setAddress("")
    setCustomerToEdit(null)
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
        // Customer exists - lưu vào localStorage và chuyển sang step edit với data đã fill sẵn
        setCustomer(existingCustomer)
        setCustomerToEdit(existingCustomer)
        setFullName(existingCustomer.full_name || "")
        setDob(existingCustomer.dob ? dayjs(existingCustomer.dob) : null)
        setAddress(existingCustomer.address || "")
        setStep("edit")
      } else {
        setError("Không tìm thấy khách hàng với số điện thoại này")
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerToEdit) return

    if (!fullName.trim() || !address.trim()) {
      setError("Vui lòng điền đầy đủ thông tin")
      return
    }

    setLoading(true)
    setError("")

    try {
      const updatedCustomer = await updateCustomer({
        documentId: customerToEdit.documentId,
        full_name: fullName,
        phone_number: phoneNumber,
        dob: dob ? dob.format("YYYY-MM-DD") : undefined,
        address: address,
      })

      if (updatedCustomer) {
        // Luôn cập nhật customer context và localStorage sau khi update thành công
        setCustomer(updatedCustomer)
        setSuccess(true)
        setTimeout(() => {
          handleClose()
          setSuccess(false)
        }, 1500)
      } else {
        setError("Không thể cập nhật thông tin. Vui lòng thử lại.")
      }
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  // Chỉ hiển thị button khi có customer
  if (!customer) {
    return null
  }

  return (
    <>
      <div className="flex justify-end mb-6">
        <Button
          variant="text"
          onClick={handleOpen}
          className="!normal-case !font-semibold !py-2 !text-neutral-900 !border-neutral-900"
          startIcon={<EditRoundedIcon className="!w-4 !h-4" />}
        >
          Chỉnh sửa thông tin cá nhân
        </Button>
      </div>

      <ThemeProvider theme={theme}>
        <Dialog
          open={open}
          onClose={handleClose}
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
                    Vui lòng nhập số điện thoại để chỉnh sửa thông tin
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
                        onClick={handleClose}
                        variant="outlined"
                        fullWidth
                        disabled={loading}
                        className="!normal-case !font-semibold !py-2 lg:!py-2.5 !text-xs lg:!text-sm !text-neutral-900 !border-neutral-900"
                      >
                        Hủy
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

              {/* Step 2: Edit Customer Info */}
              {step === "edit" && customerToEdit && (
                <motion.div
                  key="edit"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 lg:p-6"
                >
                  <Typography className="text-gray-900 !font-semibold !mb-6 lg:!mb-8 text-center tracking-tight !text-base lg:!text-2xl">
                    Chỉnh sửa thông tin
                  </Typography>
                  <Typography
                    variant="body1"
                    className="text-gray-600 !mb-3 lg:!mb-4 text-left !text-xs lg:!text-base"
                  >
                    Vui lòng điền thông tin để cập nhật
                  </Typography>

                  <form
                    onSubmit={handleUpdateSubmit}
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

                    <TextField
                      fullWidth
                      label="Số điện thoại"
                      value={phoneNumber}
                      disabled
                      size="small"
                      className="!bg-gray-50"
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

                    <div className="flex gap-3">
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
                        {loading ? "Đang cập nhật..." : "Cập nhật"}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </DialogContent>
        </Dialog>
      </ThemeProvider>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Cập nhật thông tin thành công!
        </Alert>
      </Snackbar>
    </>
  )
}
