"use client";

import { useState } from "react";
import { Calendar, Users } from "lucide-react";
import { MainLayout } from "@/components/layout/main-layout";
import { TabGroup } from "@/components/ui/tab-group";
import MyWorkComponent from "./components/MyWorkComponent";
import CoworkerComponent from "./components/CoworkerComponent";

export default function WorkPage() {
  const [activeTab, setActiveTab] = useState("my");

  const tabs = [
    {
      id: "my",
      label: "내 근무표",
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "coworker",
      label: "동료 근무표",
      icon: <Users className="w-4 h-4" />,
    },
  ];

  return (
    <MainLayout>
      {/* Tabs */}
      <TabGroup
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        className="mb-2"
      />

      {/* Conditional Component Rendering */}
      {activeTab === "my" && <MyWorkComponent />}
      {activeTab === "coworker" && <CoworkerComponent />}
    </MainLayout>
  );
}
