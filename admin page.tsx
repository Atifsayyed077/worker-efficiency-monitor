"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  LogOut,
  Upload,
  Download,
  Search,
  TrendingUp,
  Users,
  Clock,
  Award,
  Eye,
  Coffee,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Activity,
  Timer,
  Utensils,
  Wrench,
  User,
  Settings,
  Cog,
  Shield,
  Crown,
} from "lucide-react"
import { Doughnut, Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js"
import { OrganizationalChart } from "@/components/organizational-chart"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement)

interface DetailedWorkerData {
  worker_id: string
  worker_name: string
  department: string
  date: string
  shift_start: string
  shift_end: string
  shift_duration: string
  work_time: string
  lunch_break: string
  short_breaks: string
  machine_time: string
  idle_time: string
  efficiency: number
  productivity_score: number
  attendance_status: "Present" | "Late" | "Absent"
  tasks_completed: number
  quality_score: number
  rank?: number
}

export default function AdminDashboard() {
  const [workerData, setWorkerData] = useState<DetailedWorkerData[]>([])
  const [filteredData, setFilteredData] = useState<DetailedWorkerData[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedWorker, setSelectedWorker] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedWorkerDetails, setSelectedWorkerDetails] = useState<DetailedWorkerData | null>(null)
  const router = useRouter()

  // Updated sample data with new employee names and departments
  const sampleData: DetailedWorkerData[] = [
    {
      worker_id: "EMP001",
      worker_name: "Dilshaad",
      department: "VMC Section",
      date: "2025-06-21",
      shift_start: "09:00",
      shift_end: "17:00",
      shift_duration: "08:00",
      work_time: "06:38",
      lunch_break: "00:45",
      short_breaks: "00:15",
      machine_time: "05:30",
      idle_time: "00:22",
      efficiency: 83.0,
      productivity_score: 85,
      attendance_status: "Present",
      tasks_completed: 10,
      quality_score: 88,
    },
    {
      worker_id: "EMP002",
      worker_name: "Mujeeb Shaikh",
      department: "CNC Section",
      date: "2025-06-21",
      shift_start: "09:00",
      shift_end: "17:00",
      shift_duration: "08:00",
      work_time: "07:00",
      lunch_break: "00:45",
      short_breaks: "00:15",
      machine_time: "06:20",
      idle_time: "00:15",
      efficiency: 87.5,
      productivity_score: 90,
      attendance_status: "Present",
      tasks_completed: 15,
      quality_score: 92,
    },
    {
      worker_id: "EMP003",
      worker_name: "Akram",
      department: "CNC Section",
      date: "2025-06-21",
      shift_start: "09:00",
      shift_end: "17:00",
      shift_duration: "08:00",
      work_time: "06:50",
      lunch_break: "00:45",
      short_breaks: "00:18",
      machine_time: "05:45",
      idle_time: "00:17",
      efficiency: 85.3,
      productivity_score: 87,
      attendance_status: "Present",
      tasks_completed: 12,
      quality_score: 89,
    },
    {
      worker_id: "EMP004",
      worker_name: "Zaid",
      department: "CNC Section",
      date: "2025-06-21",
      shift_start: "09:00",
      shift_end: "17:00",
      shift_duration: "08:00",
      work_time: "07:05",
      lunch_break: "00:45",
      short_breaks: "00:12",
      machine_time: "06:00",
      idle_time: "00:13",
      efficiency: 88.24,
      productivity_score: 90,
      attendance_status: "Present",
      tasks_completed: 13,
      quality_score: 91,
    },
    {
      worker_id: "EMP005",
      worker_name: "Arif",
      department: "Lathe Section",
      date: "2025-06-21",
      shift_start: "09:00",
      shift_end: "17:00",
      shift_duration: "08:00",
      work_time: "07:08",
      lunch_break: "00:45",
      short_breaks: "00:14",
      machine_time: "06:10",
      idle_time: "00:13",
      efficiency: 89.3,
      productivity_score: 91,
      attendance_status: "Present",
      tasks_completed: 14,
      quality_score: 93,
    },
    {
      worker_id: "EMP006",
      worker_name: "Salman",
      department: "Lathe Section",
      date: "2025-06-21",
      shift_start: "09:00",
      shift_end: "17:00",
      shift_duration: "08:00",
      work_time: "06:30",
      lunch_break: "00:45",
      short_breaks: "00:20",
      machine_time: "05:20",
      idle_time: "00:25",
      efficiency: 81.32,
      productivity_score: 83,
      attendance_status: "Present",
      tasks_completed: 9,
      quality_score: 85,
    },
    {
      worker_id: "EMP007",
      worker_name: "Irfan Khan",
      department: "Grinding Section",
      date: "2025-06-21",
      shift_start: "09:00",
      shift_end: "17:00",
      shift_duration: "08:00",
      work_time: "07:15",
      lunch_break: "00:45",
      short_breaks: "00:12",
      machine_time: "06:25",
      idle_time: "00:08",
      efficiency: 90.6,
      productivity_score: 93,
      attendance_status: "Present",
      tasks_completed: 16,
      quality_score: 96,
    },
    {
      worker_id: "EMP008",
      worker_name: "Amin Shaikh",
      department: "Grinding Section",
      date: "2025-06-21",
      shift_start: "09:00",
      shift_end: "17:00",
      shift_duration: "08:00",
      work_time: "07:23",
      lunch_break: "00:45",
      short_breaks: "00:10",
      machine_time: "06:35",
      idle_time: "00:07",
      efficiency: 92.3,
      productivity_score: 95,
      attendance_status: "Present",
      tasks_completed: 17,
      quality_score: 98,
    },
  ]

  useEffect(() => {
    const userType = localStorage.getItem("userType")
    if (userType !== "admin") {
      router.push("/")
      return
    }

    const dataWithRanks = calculateRanks(sampleData)
    setWorkerData(dataWithRanks)
    setFilteredData(dataWithRanks)
  }, [router])

  const calculateRanks = (data: DetailedWorkerData[]) => {
    const dates = [...new Set(data.map((d) => d.date))]
    const rankedData = [...data]

    dates.forEach((date) => {
      const dayData = rankedData.filter((d) => d.date === date)
      dayData.sort((a, b) => b.efficiency - a.efficiency)
      dayData.forEach((worker, index) => {
        const workerIndex = rankedData.findIndex((d) => d.worker_id === worker.worker_id && d.date === date)
        rankedData[workerIndex].rank = index + 1
      })
    })

    return rankedData
  }

  const handleSearch = () => {
    let filtered = workerData

    if (searchTerm) {
      filtered = filtered.filter(
        (d) =>
          d.worker_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.worker_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          d.department.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedDate) {
      filtered = filtered.filter((d) => d.date === selectedDate)
    }

    if (selectedWorker) {
      filtered = filtered.filter((d) => d.worker_name === selectedWorker)
    }

    if (selectedDepartment) {
      filtered = filtered.filter((d) => d.department === selectedDepartment)
    }

    setFilteredData(filtered)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedDate("")
    setSelectedWorker("")
    setSelectedDepartment("")
    setFilteredData(workerData)
  }

  const handleLogout = () => {
    localStorage.removeItem("userType")
    localStorage.removeItem("username")
    router.push("/")
  }

  const exportToCSV = () => {
    const headers = [
      "Employee ID",
      "Name",
      "Department",
      "Date",
      "Shift Duration",
      "Work Time",
      "Lunch Break",
      "Machine Time",
      "Idle Time",
      "Efficiency %",
      "Productivity Score",
      "Tasks Completed",
      "Quality Score",
      "Rank",
    ]
    const csvContent = [
      headers.join(","),
      ...filteredData.map((row) =>
        [
          row.worker_id,
          row.worker_name,
          row.department,
          row.date,
          row.shift_duration,
          row.work_time,
          row.lunch_break,
          row.machine_time,
          row.idle_time,
          row.efficiency,
          row.productivity_score,
          row.tasks_completed,
          row.quality_score,
          row.rank || "",
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `trackline-technology-report-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Enhanced chart data
  const efficiencyChartData = {
    labels: filteredData.map((d) => d.worker_name),
    datasets: [
      {
        label: "Efficiency %",
        data: filteredData.map((d) => d.efficiency),
        backgroundColor: filteredData.map((d) =>
          d.efficiency >= 90
            ? "rgba(34, 197, 94, 0.8)"
            : d.efficiency >= 80
              ? "rgba(59, 130, 246, 0.8)"
              : "rgba(239, 68, 68, 0.8)",
        ),
        borderColor: filteredData.map((d) =>
          d.efficiency >= 90
            ? "rgba(34, 197, 94, 1)"
            : d.efficiency >= 80
              ? "rgba(59, 130, 246, 1)"
              : "rgba(239, 68, 68, 1)",
        ),
        borderWidth: 2,
      },
    ],
  }

  const departmentData = {
    labels: [...new Set(filteredData.map((d) => d.department))],
    datasets: [
      {
        label: "Average Efficiency by Department",
        data: [...new Set(filteredData.map((d) => d.department))].map((dept) => {
          const deptWorkers = filteredData.filter((d) => d.department === dept)
          return deptWorkers.reduce((sum, w) => sum + w.efficiency, 0) / deptWorkers.length
        }),
        backgroundColor: [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(245, 158, 11, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(168, 85, 247, 0.8)",
        ],
      },
    ],
  }

  const uniqueWorkers = [...new Set(workerData.map((d) => d.worker_name))]
  const uniqueDates = [...new Set(workerData.map((d) => d.date))].sort()
  const uniqueDepartments = [...new Set(workerData.map((d) => d.department))]

  const todayData = filteredData.filter((d) => d.date === "2025-06-21")
  const avgEfficiency =
    todayData.length > 0 ? (todayData.reduce((sum, d) => sum + d.efficiency, 0) / todayData.length).toFixed(1) : "0"
  const avgProductivity =
    todayData.length > 0
      ? (todayData.reduce((sum, d) => sum + d.productivity_score, 0) / todayData.length).toFixed(1)
      : "0"
  const totalTasks = todayData.reduce((sum, d) => sum + d.tasks_completed, 0)
  const presentCount = todayData.filter((d) => d.attendance_status === "Present").length
  const lateCount = todayData.filter((d) => d.attendance_status === "Late").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Professional Header */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-4">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Trackline Technology</h1>
                <p className="text-sm text-gray-600">Precision Manufacturing Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Administrator</p>
                <p className="text-xs text-gray-500">System Access Level: Full</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <LogOut className="w-4 h-4" />
                Secure Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Workforce</p>
                  <p className="text-3xl font-bold">{uniqueWorkers.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Present Today</p>
                  <p className="text-3xl font-bold">{presentCount}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Late Arrivals</p>
                  <p className="text-3xl font-bold">{lateCount}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Avg Efficiency</p>
                  <p className="text-3xl font-bold">{avgEfficiency}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-indigo-100 text-sm font-medium">Tasks Completed</p>
                  <p className="text-3xl font-bold">{totalTasks}</p>
                </div>
                <Award className="w-8 h-8 text-indigo-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Organizational Chart */}
        <OrganizationalChart
          userType="admin"
          onCompanyClick={() => console.log("Company clicked - show company overview")}
          onDepartmentClick={(dept) => console.log("Department clicked:", dept.name)}
        />

        <Tabs defaultValue="workforce" className="space-y-6">
          <TabsList className="bg-white shadow-sm border">
            <TabsTrigger value="workforce" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Workforce Overview
            </TabsTrigger>
            <TabsTrigger value="directory" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Employee Directory
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Performance Analytics
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Reports & Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="workforce" className="space-y-6">
            {/* Advanced Search and Filters */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Search className="w-5 h-5" />
                  Advanced Search & Filters
                </CardTitle>
                <CardDescription>Search and filter workforce data with multiple criteria</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Search Employee</label>
                    <Input
                      placeholder="Name, ID, or Department..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-10"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <Select value={selectedDate} onValueChange={setSelectedDate}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select date" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueDates.map((date) => (
                          <SelectItem key={date} value={date}>
                            {date}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                    <Select value={selectedWorker} onValueChange={setSelectedWorker}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select employee" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueWorkers.map((worker) => (
                          <SelectItem key={worker} value={worker}>
                            {worker}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger className="h-10">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueDepartments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end gap-2">
                    <Button onClick={handleSearch} className="h-10 bg-blue-600 hover:bg-blue-700">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                    <Button onClick={clearFilters} variant="outline" className="h-10">
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Worker Data Table */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle className="text-gray-800">Manufacturing Performance Matrix</CardTitle>
                    <CardDescription>
                      Comprehensive employee performance data - {filteredData.length} records
                    </CardDescription>
                  </div>
                  <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="font-semibold">Employee Details</TableHead>
                        <TableHead className="font-semibold">Department</TableHead>
                        <TableHead className="font-semibold">Attendance</TableHead>
                        <TableHead className="font-semibold">Work Time</TableHead>
                        <TableHead className="font-semibold">Breaks</TableHead>
                        <TableHead className="font-semibold">Machine Time</TableHead>
                        <TableHead className="font-semibold">Efficiency</TableHead>
                        <TableHead className="font-semibold">Productivity</TableHead>
                        <TableHead className="font-semibold">Quality</TableHead>
                        <TableHead className="font-semibold">Rank</TableHead>
                        <TableHead className="font-semibold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredData.map((worker, index) => (
                        <TableRow key={index} className="hover:bg-gray-50">
                          <TableCell>
                            <div>
                              <p className="font-medium text-gray-900">{worker.worker_name}</p>
                              <p className="text-sm text-gray-500">{worker.worker_id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {worker.department}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  worker.attendance_status === "Present"
                                    ? "default"
                                    : worker.attendance_status === "Late"
                                      ? "secondary"
                                      : "destructive"
                                }
                                className={
                                  worker.attendance_status === "Present"
                                    ? "bg-green-100 text-green-800 border-green-200"
                                    : worker.attendance_status === "Late"
                                      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                      : "bg-red-100 text-red-800 border-red-200"
                                }
                              >
                                {worker.attendance_status}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{worker.work_time}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Utensils className="w-3 h-3 text-gray-400" />
                                <span className="text-xs">{worker.lunch_break}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Coffee className="w-3 h-3 text-gray-400" />
                                <span className="text-xs">{worker.short_breaks}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Wrench className="w-4 h-4 text-gray-400" />
                              <span className="text-sm">{worker.machine_time}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                worker.efficiency >= 90
                                  ? "default"
                                  : worker.efficiency >= 80
                                    ? "secondary"
                                    : "destructive"
                              }
                              className={
                                worker.efficiency >= 90
                                  ? "bg-green-100 text-green-800 border-green-200"
                                  : worker.efficiency >= 80
                                    ? "bg-blue-100 text-blue-800 border-blue-200"
                                    : "bg-red-100 text-red-800 border-red-200"
                              }
                            >
                              {worker.efficiency.toFixed(2)}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Activity className="w-4 h-4 text-gray-400" />
                              <span className="text-sm font-medium">{worker.productivity_score}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                              {worker.quality_score}%
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              #{worker.rank}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedWorkerDetails(worker)}
                                  className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="flex items-center gap-2">
                                    <User className="w-5 h-5" />
                                    Employee Performance Details
                                  </DialogTitle>
                                  <DialogDescription>
                                    Comprehensive performance analysis for {selectedWorkerDetails?.worker_name}
                                  </DialogDescription>
                                </DialogHeader>
                                {selectedWorkerDetails && (
                                  <div className="space-y-6">
                                    {/* Employee Info */}
                                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                                      <div>
                                        <h4 className="font-semibold text-gray-800">Employee Information</h4>
                                        <div className="mt-2 space-y-1">
                                          <p>
                                            <span className="font-medium">Name:</span>{" "}
                                            {selectedWorkerDetails.worker_name}
                                          </p>
                                          <p>
                                            <span className="font-medium">ID:</span> {selectedWorkerDetails.worker_id}
                                          </p>
                                          <p>
                                            <span className="font-medium">Department:</span>{" "}
                                            {selectedWorkerDetails.department}
                                          </p>
                                          <p>
                                            <span className="font-medium">Date:</span> {selectedWorkerDetails.date}
                                          </p>
                                        </div>
                                      </div>
                                      <div>
                                        <h4 className="font-semibold text-gray-800">Shift Information</h4>
                                        <div className="mt-2 space-y-1">
                                          <p>
                                            <span className="font-medium">Start Time:</span>{" "}
                                            {selectedWorkerDetails.shift_start}
                                          </p>
                                          <p>
                                            <span className="font-medium">End Time:</span>{" "}
                                            {selectedWorkerDetails.shift_end}
                                          </p>
                                          <p>
                                            <span className="font-medium">Duration:</span>{" "}
                                            {selectedWorkerDetails.shift_duration}
                                          </p>
                                          <p>
                                            <span className="font-medium">Status:</span>
                                            <Badge
                                              className="ml-2"
                                              variant={
                                                selectedWorkerDetails.attendance_status === "Present"
                                                  ? "default"
                                                  : "secondary"
                                              }
                                            >
                                              {selectedWorkerDetails.attendance_status}
                                            </Badge>
                                          </p>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Time Breakdown */}
                                    <div className="grid grid-cols-2 gap-6">
                                      <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">Time Allocation</h4>
                                        <div className="space-y-3">
                                          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                              <Clock className="w-4 h-4 text-green-600" />
                                              <span className="font-medium">Work Time</span>
                                            </div>
                                            <span className="font-bold text-green-700">
                                              {selectedWorkerDetails.work_time}
                                            </span>
                                          </div>
                                          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                              <Utensils className="w-4 h-4 text-blue-600" />
                                              <span className="font-medium">Lunch Break</span>
                                            </div>
                                            <span className="font-bold text-blue-700">
                                              {selectedWorkerDetails.lunch_break}
                                            </span>
                                          </div>
                                          <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                              <Coffee className="w-4 h-4 text-yellow-600" />
                                              <span className="font-medium">Short Breaks</span>
                                            </div>
                                            <span className="font-bold text-yellow-700">
                                              {selectedWorkerDetails.short_breaks}
                                            </span>
                                          </div>
                                          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                              <Wrench className="w-4 h-4 text-purple-600" />
                                              <span className="font-medium">Machine Time</span>
                                            </div>
                                            <span className="font-bold text-purple-700">
                                              {selectedWorkerDetails.machine_time}
                                            </span>
                                          </div>
                                          <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                                            <div className="flex items-center gap-2">
                                              <Timer className="w-4 h-4 text-red-600" />
                                              <span className="font-medium">Idle Time</span>
                                            </div>
                                            <span className="font-bold text-red-700">
                                              {selectedWorkerDetails.idle_time}
                                            </span>
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <h4 className="font-semibold text-gray-800 mb-3">Performance Metrics</h4>
                                        <div className="space-y-3">
                                          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                                            <div className="flex justify-between items-center">
                                              <span className="font-medium text-green-800">Efficiency Score</span>
                                              <span className="text-2xl font-bold text-green-700">
                                                {selectedWorkerDetails.efficiency.toFixed(2)}%
                                              </span>
                                            </div>
                                          </div>
                                          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                                            <div className="flex justify-between items-center">
                                              <span className="font-medium text-blue-800">Productivity Score</span>
                                              <span className="text-2xl font-bold text-blue-700">
                                                {selectedWorkerDetails.productivity_score}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                                            <div className="flex justify-between items-center">
                                              <span className="font-medium text-purple-800">Quality Score</span>
                                              <span className="text-2xl font-bold text-purple-700">
                                                {selectedWorkerDetails.quality_score}%
                                              </span>
                                            </div>
                                          </div>
                                          <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                                            <div className="flex justify-between items-center">
                                              <span className="font-medium text-yellow-800">Tasks Completed</span>
                                              <span className="text-2xl font-bold text-yellow-700">
                                                {selectedWorkerDetails.tasks_completed}
                                              </span>
                                            </div>
                                          </div>
                                          <div className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg">
                                            <div className="flex justify-between items-center">
                                              <span className="font-medium text-indigo-800">Daily Rank</span>
                                              <span className="text-2xl font-bold text-indigo-700">
                                                #{selectedWorkerDetails.rank}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="directory" className="space-y-6">
            {/* Professional Employee Directory */}
            <Card className="shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Users className="w-5 h-5" />
                  Trackline Technology - Employee Directory
                </CardTitle>
                <CardDescription>Comprehensive employee information and performance metrics</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* Department-wise Employee Cards */}
                <div className="space-y-8">
                  {/* VMC Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Settings className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">VMC Section</h3>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Vertical Machining Center
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="border-l-4 border-l-blue-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Dilshaad</h4>
                                <p className="text-sm text-gray-500">EMP001</p>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">83.0%</Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Position:</span>
                              <span className="font-medium">VMC Operator</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Shift:</span>
                              <span className="font-medium">09:00 - 17:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Work Time:</span>
                              <span className="font-medium">06:38</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Machine Time:</span>
                              <span className="font-medium">05:30</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quality Score:</span>
                              <span className="font-medium">88%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Daily Rank:</span>
                              <span className="font-medium">#6</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* CNC Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Cog className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">CNC Section</h3>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        DX350, DX200, DX2004B Machines
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Mujeeb Shaikh - Supervisor */}
                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <Crown className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Mujeeb Shaikh</h4>
                                <p className="text-sm text-gray-500">EMP002</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">87.5%</Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Position:</span>
                              <span className="font-medium">CNC Supervisor</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Machines:</span>
                              <span className="font-medium text-xs">DX350, DX200, DX2004B</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Work Time:</span>
                              <span className="font-medium">07:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Machine Time:</span>
                              <span className="font-medium">06:20</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quality Score:</span>
                              <span className="font-medium">92%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Daily Rank:</span>
                              <span className="font-medium">#4</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Akram */}
                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Akram</h4>
                                <p className="text-sm text-gray-500">EMP003</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">85.3%</Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Position:</span>
                              <span className="font-medium">CNC Operator</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Supervisor:</span>
                              <span className="font-medium">Mujeeb Shaikh</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Work Time:</span>
                              <span className="font-medium">06:50</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Machine Time:</span>
                              <span className="font-medium">05:45</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quality Score:</span>
                              <span className="font-medium">89%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Daily Rank:</span>
                              <span className="font-medium">#7</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Zaid */}
                      <Card className="border-l-4 border-l-green-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-green-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Zaid</h4>
                                <p className="text-sm text-gray-500">EMP004</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">88.24%</Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Position:</span>
                              <span className="font-medium">CNC Operator</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Supervisor:</span>
                              <span className="font-medium">Mujeeb Shaikh</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Work Time:</span>
                              <span className="font-medium">07:05</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Machine Time:</span>
                              <span className="font-medium">06:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quality Score:</span>
                              <span className="font-medium">91%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Daily Rank:</span>
                              <span className="font-medium">#5</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Lathe Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                        <Wrench className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Lathe Section</h3>
                      <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        Lathe Machine Operations
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Arif */}
                      <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Arif</h4>
                                <p className="text-sm text-gray-500">EMP005</p>
                              </div>
                            </div>
                            <Badge className="bg-purple-100 text-purple-800 border-purple-200">89.3%</Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Position:</span>
                              <span className="font-medium">Lathe Operator</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Shift:</span>
                              <span className="font-medium">09:00 - 17:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Work Time:</span>
                              <span className="font-medium">07:08</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Machine Time:</span>
                              <span className="font-medium">06:10</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quality Score:</span>
                              <span className="font-medium">93%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Daily Rank:</span>
                              <span className="font-medium">#3</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Salman */}
                      <Card className="border-l-4 border-l-purple-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-purple-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Salman</h4>
                                <p className="text-sm text-gray-500">EMP006</p>
                              </div>
                            </div>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">81.32%</Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Position:</span>
                              <span className="font-medium">Lathe Operator</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Shift:</span>
                              <span className="font-medium">09:00 - 17:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Work Time:</span>
                              <span className="font-medium">06:30</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Machine Time:</span>
                              <span className="font-medium">05:20</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quality Score:</span>
                              <span className="font-medium">85%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Daily Rank:</span>
                              <span className="font-medium">#8</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Grinding Section */}
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900">Grinding Section</h3>
                      <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200">
                        Precision Grinding Operations
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Irfan Khan */}
                      <Card className="border-l-4 border-l-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <User className="w-6 h-6 text-orange-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Irfan Khan</h4>
                                <p className="text-sm text-gray-500">EMP007</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">90.6%</Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Position:</span>
                              <span className="font-medium">Grinding Operator</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Shift:</span>
                              <span className="font-medium">09:00 - 17:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Work Time:</span>
                              <span className="font-medium">07:15</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Machine Time:</span>
                              <span className="font-medium">06:25</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quality Score:</span>
                              <span className="font-medium">96%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Daily Rank:</span>
                              <span className="font-medium">#2</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Amin Shaikh */}
                      <Card className="border-l-4 border-l-orange-500">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                <Award className="w-6 h-6 text-orange-600" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900">Amin Shaikh</h4>
                                <p className="text-sm text-gray-500">EMP008</p>
                              </div>
                            </div>
                            <Badge className="bg-green-100 text-green-800 border-green-200">92.3%</Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Position:</span>
                              <span className="font-medium">Grinding Specialist</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Shift:</span>
                              <span className="font-medium">09:00 - 17:00</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Work Time:</span>
                              <span className="font-medium">07:23</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Machine Time:</span>
                              <span className="font-medium">06:35</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Quality Score:</span>
                              <span className="font-medium">98%</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Daily Rank:</span>
                              <span className="font-medium">#1</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Performance Summary */}
                  <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Performance Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">92.3%</div>
                        <div className="text-sm text-gray-600">Top Performer</div>
                        <div className="text-xs text-gray-500">Amin Shaikh</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">87.1%</div>
                        <div className="text-sm text-gray-600">Average Efficiency</div>
                        <div className="text-xs text-gray-500">All Employees</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">8</div>
                        <div className="text-sm text-gray-600">Total Employees</div>
                        <div className="text-xs text-gray-500">4 Departments</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-orange-600">100%</div>
                        <div className="text-sm text-gray-600">Attendance Rate</div>
                        <div className="text-xs text-gray-500">Today</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Employee Efficiency Comparison</CardTitle>
                  <CardDescription>Individual performance analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Bar data={efficiencyChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                  <CardDescription>Average efficiency by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <Doughnut data={departmentData} options={{ responsive: true, maintainAspectRatio: false }} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  Data Management & Export
                </CardTitle>
                <CardDescription>Upload workforce data and generate comprehensive reports</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg">
                    <h3 className="font-semibold mb-4">Upload CSV Data</h3>
                    <Input
                      type="file"
                      accept=".csv"
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <div className="mt-4 text-sm text-gray-600">
                      <p className="font-medium mb-2">Expected CSV format:</p>
                      <code className="bg-gray-100 p-2 rounded block text-xs">
                        worker_id,worker_name,department,date,shift_start,shift_end,work_time,lunch_break,machine_time,efficiency
                      </code>
                    </div>
                  </div>

                  <div className="p-6 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-4">Export Options</h3>
                    <div className="space-y-3">
                      <Button onClick={exportToCSV} className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Export Detailed CSV Report
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Generate PDF Summary
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Download className="w-4 h-4 mr-2" />
                        Excel Analytics Report
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
