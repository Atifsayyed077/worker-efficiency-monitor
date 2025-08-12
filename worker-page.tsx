"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Shield, User, Building2 } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [userType, setUserType] = useState<"admin" | "worker">("admin")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Debug logging
      console.log("Login attempt:", { username: credentials.username, userType })

      if (userType === "admin") {
        if (credentials.username.toLowerCase() === "admin" && credentials.password === "admin123") {
          localStorage.setItem("userType", "admin")
          localStorage.setItem("username", "Administrator")
          console.log("Admin login successful, redirecting...")
          window.location.href = "/admin-dashboard"
          return
        } else {
          alert("Invalid admin credentials. Please use:\nUsername: admin\nPassword: admin123")
          setIsLoading(false)
          return
        }
      }

      if (userType === "worker") {
        if (credentials.username && credentials.password) {
          const validWorkers = ["ramesh", "suresh", "mahesh", "rajesh", "priya"]
          if (validWorkers.includes(credentials.username.toLowerCase())) {
            localStorage.setItem("userType", "worker")
            localStorage.setItem("username", credentials.username)
            console.log("Worker login successful, redirecting...")
            window.location.href = "/worker-dashboard"
            return
          } else {
            alert("Invalid worker ID. Please use: Ramesh, Suresh, Mahesh, Rajesh, or Priya")
            setIsLoading(false)
            return
          }
        }
      }

      alert("Please fill in all required fields")
      setIsLoading(false)
    } catch (error) {
      console.error("Login error:", error)
      alert("Login failed. Please try again.")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">WorkForce Analytics</h1>
          <p className="text-gray-600">Enterprise Worker Efficiency Monitoring System</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl font-semibold text-gray-800">Secure Access Portal</CardTitle>
            <CardDescription className="text-gray-600">Please authenticate to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Debug Info - Remove in production */}
            <div className="mb-4 p-3 bg-gray-100 rounded text-xs">
              <p>
                <strong>Debug Info:</strong>
              </p>
              <p>Current User Type: {userType}</p>
              <p>Username: "{credentials.username}"</p>
              <p>Password: "{credentials.password}"</p>
              <p>Admin Credentials: admin / admin123</p>
            </div>
            <Tabs value={userType} onValueChange={(value) => setUserType(value as "admin" | "worker")}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger
                  value="admin"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <Shield className="w-4 h-4" />
                  Administrator
                </TabsTrigger>
                <TabsTrigger
                  value="worker"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  <User className="w-4 h-4" />
                  Employee
                </TabsTrigger>
              </TabsList>

              <TabsContent value="admin">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username" className="text-sm font-medium text-gray-700">
                      Administrator Username
                    </Label>
                    <Input
                      id="admin-username"
                      type="text"
                      placeholder="Enter administrator username"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter secure password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        className="h-11 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : "Access Admin Dashboard"}
                  </Button>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-xs text-blue-700 text-center">
                      <strong>Demo Credentials:</strong> admin / admin123
                    </p>
                  </div>
                </form>
              </TabsContent>

              <TabsContent value="worker">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="worker-username" className="text-sm font-medium text-gray-700">
                      Employee ID
                    </Label>
                    <Input
                      id="worker-username"
                      type="text"
                      placeholder="Enter your employee identification"
                      value={credentials.username}
                      onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                      className="h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="worker-password" className="text-sm font-medium text-gray-700">
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="worker-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={credentials.password}
                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                        className="h-11 pr-10"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-11 px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    disabled={isLoading}
                  >
                    {isLoading ? "Authenticating..." : "Access Employee Dashboard"}
                  </Button>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-green-700 text-center">
                      <strong>Demo:</strong> Use employee names (Ramesh, Suresh, Mahesh, Rajesh) with any password
                    </p>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">© 2025 WorkForce Analytics. Enterprise-grade monitoring solution.</p>
        </div>
      </div>
    </div>
  )
}
