'use client'

import { useEffect, useState } from "react";
import AnnouncementsDetailModal from "../components/AnnouncementsDetailModal";
import { ANNOUNCEMENT_DATA } from "./announcementData";

export default function AnnouncementDetailPage() {
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // 상수 데이터 사용
    setAnnouncement(ANNOUNCEMENT_DATA.data);
    setLoading(false);
  }, []);

  const handleClose = () => {
    // 모달 닫기 시 목록 페이지로 이동
    window.history.back();
  };

  const handleEdit = () => {
    // 수정 페이지로 이동
    window.location.href = "/announcements/edit";
  };

  const handleDelete = () => {
    if (window.confirm('정말 삭제하시겠습니까?')) {
      alert('삭제가 완료되었습니다.');
      window.location.href = "/announcements";
    }
  };

  if (loading) {
    return <div>불러오는 중...</div>;
  }

  if (!announcement) {
    return <div>데이터가 없습니다.</div>;
  }

  return (
    <AnnouncementsDetailModal
      isOpen={true}
      announcement={announcement}
      onClose={handleClose}
      onEdit={handleEdit}
      onDelete={handleDelete}
    />
  );
}
