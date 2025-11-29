"use client"

import {
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Typography,
} from "@mui/material"
import { useEmployees, Employee } from "@lib/context/employee-context"

interface EmployeeSelectorProps {
  onSelect: (employee: Employee) => void
}

export default function EmployeeSelector({ onSelect }: EmployeeSelectorProps) {
  const { employees, isLoading, error } = useEmployees()

  const handleSelect = (employee: Employee) => {
    // Lưu vào localStorage
    localStorage.setItem("selectedEmployee", JSON.stringify(employee))
    onSelect(employee)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-3 lg:px-4 py-6 lg:py-8">
        <div className="text-center py-12 lg:py-16">
          <CircularProgress />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 lg:px-4 py-6 lg:py-8 max-w-md">
        <Alert severity="error">{error}</Alert>
      </div>
    )
  }

  if (employees.length === 0) {
    return (
      <div className="container mx-auto px-3 lg:px-4 py-6 lg:py-8 max-w-md">
        <Alert severity="warning">
          Không có nhân viên nào. Vui lòng thêm nhân viên trong Strapi.
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-3 lg:px-4 py-6 lg:py-8 max-w-2xl">
      <div className="bg-white border border-gray-200 rounded-lg p-6 lg:p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Chọn nhân viên
        </h1>
        <div className="grid grid-cols-1 gap-4">
          {employees.map((employee) => (
            <Card
              key={employee.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleSelect(employee)}
            >
              <CardContent>
                <Typography variant="h6" component="div">
                  {employee.name || `Nhân viên #${employee.id}`}
                </Typography>
                {employee.documentId && (
                  <Typography variant="body2" color="text.secondary">
                    ID: {employee.documentId}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
