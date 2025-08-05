"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { GlassCard } from "@/components/ui/glass-card"
import { GradientButton } from "@/components/ui/gradient-button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { colors, typography } from "@/lib/design-tokens"
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Eye,
  EyeOff,
  Mail,
  Smartphone,
} from "lucide-react"

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
  })
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    scheduleVisible: true,
    contactVisible: false,
  })
  const [theme, setTheme] = useState("light")
  const [language, setLanguage] = useState("ko")

  const settingsSections = [
    {
      id: "profile",
      title: "프로필 설정",
      icon: User,
      color: colors.primary.blue,
      description: "개인 정보 및 프로필을 관리하세요",
    },
    {
      id: "notifications",
      title: "알림 설정",
      icon: Bell,
      color: colors.status.warning.gradient,
      description: "알림 수신 방법을 설정하세요",
    },
    {
      id: "privacy",
      title: "개인정보 보호",
      icon: Shield,
      color: colors.status.error.gradient,
      description: "개인정보 노출 범위를 설정하세요",
    },
    {
      id: "appearance",
      title: "화면 설정",
      icon: Palette,
      color: colors.status.info.gradient,
      description: "테마 및 언어 설정을 변경하세요",
    },
  ]

  return (
    <MainLayout>
      {/* Page Title */}
      <div className="mb-8">
        <h1 className={`${typography.h1} text-gray-800 mb-2`}>설정</h1>
        <p className="text-gray-600">계정 및 시스템 설정을 관리하세요</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <GlassCard className="p-6">
            <h3 className={`${typography.h3} text-gray-800 mb-6`}>설정 메뉴</h3>
            <div className="space-y-4">
              {settingsSections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 cursor-pointer transition-colors"
                >
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center`}
                  >
                    <section.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{section.title}</h4>
                    <p className="text-sm text-gray-600">{section.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-10 h-10 bg-gradient-to-r ${colors.primary.blue} rounded-lg flex items-center justify-center`}
              >
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className={`${typography.h3} text-gray-800`}>프로필 설정</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
                <Input defaultValue="김철수" className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">이메일</label>
                <Input defaultValue="kim@company.com" className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">전화번호</label>
                <Input defaultValue="010-1234-5678" className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">부서</label>
                <Input defaultValue="개발팀" className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl" />
              </div>
            </div>
          </GlassCard>

          {/* Notification Settings */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-10 h-10 bg-gradient-to-r ${colors.status.warning.gradient} rounded-lg flex items-center justify-center`}
              >
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h3 className={`${typography.h3} text-gray-800`}>알림 설정</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">이메일 알림</p>
                    <p className="text-sm text-gray-600">중요한 알림을 이메일로 받습니다</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">푸시 알림</p>
                    <p className="text-sm text-gray-600">실시간 푸시 알림을 받습니다</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">SMS 알림</p>
                    <p className="text-sm text-gray-600">긴급한 알림을 SMS로 받습니다</p>
                  </div>
                </div>
                <Switch
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                />
              </div>
            </div>
          </GlassCard>

          {/* Privacy Settings */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-10 h-10 bg-gradient-to-r ${colors.status.error.gradient} rounded-lg flex items-center justify-center`}
              >
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h3 className={`${typography.h3} text-gray-800`}>개인정보 보호</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">프로필 공개</p>
                    <p className="text-sm text-gray-600">다른 사용자가 내 프로필을 볼 수 있습니다</p>
                  </div>
                </div>
                <Switch
                  checked={privacy.profileVisible}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, profileVisible: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">일정 공개</p>
                    <p className="text-sm text-gray-600">다른 사용자가 내 일정을 볼 수 있습니다</p>
                  </div>
                </div>
                <Switch
                  checked={privacy.scheduleVisible}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, scheduleVisible: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <EyeOff className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-800">연락처 공개</p>
                    <p className="text-sm text-gray-600">다른 사용자가 내 연락처를 볼 수 있습니다</p>
                  </div>
                </div>
                <Switch
                  checked={privacy.contactVisible}
                  onCheckedChange={(checked) => setPrivacy({ ...privacy, contactVisible: checked })}
                />
              </div>
            </div>
          </GlassCard>

          {/* Appearance Settings */}
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-10 h-10 bg-gradient-to-r ${colors.status.info.gradient} rounded-lg flex items-center justify-center`}
              >
                <Palette className="w-5 h-5 text-white" />
              </div>
              <h3 className={`${typography.h3} text-gray-800`}>화면 설정</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">테마</label>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">라이트 모드</SelectItem>
                    <SelectItem value="dark">다크 모드</SelectItem>
                    <SelectItem value="auto">시스템 설정</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">언어</label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="bg-white/60 backdrop-blur-sm border-gray-200/50 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ko">한국어</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </GlassCard>

          {/* Save Button */}
          <div className="flex justify-end">
            <GradientButton variant="primary" className="px-8">
              <Save className="w-4 h-4 mr-2" />
              설정 저장
            </GradientButton>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 