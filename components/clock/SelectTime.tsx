"use client";
import { useState } from "react";
import TimePicker from "./TimePicker";

interface SelecTimeProps {
  onTimeSelect: (time: string) => void;
  onClose: () => void;
}

const SelectTime = ({ onTimeSelect, onClose }: SelecTimeProps) => {
  const [selectedHour, setSelectedHour] = useState("12");
  const [selectedMinute, setSelectedMinute] = useState("00");

  // 시간,분 데이터 만들기(인덱스 활용)
  // 인덱스를 문자열로 변환하고 문자열 길이 2자리로 만들기(앞에 "0"채움)
  const hours = [...Array(24)].map((_, i) => i.toString().padStart(2, "0"));
  const minutes = [...Array(60)].map((_, i) => i.toString().padStart(2, "0"));

  // 시간,분 스크롤 이벤트 핸들러
  const handleHourScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollTop / 32); // 32px 단위로 스크롤 위치 계산
    setSelectedHour(hours[index] || "00"); // 해당 인덱스의 값(시간)으로 상태 업데이트
  };

  const handleMinuteScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollTop / 32);
    setSelectedMinute(minutes[index] || "00");
  };

  // 확인버튼 + 모달닫기
  const handleConfirm = () => {
    onTimeSelect(`${selectedHour}:${selectedMinute}`); // 선택된 시간을 "12:30" 형식으로 전달
    onClose();
  };

  // "13:30" → "오후 1시 30분" 형태로 변환하는 함수 (모달 상단 표시용)
  const convertTimeFormat = (timeStr: string): string => {
    const [h, m] = timeStr.split(":").map(Number);
    return `${h >= 12 ? "오후" : "오전"} ${h % 12 || 12}시 ${m}분`;
  };

  return (
    // 모달 배경(클릭 시 닫힘)
    <div
      onClick={onClose}
      className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/50 backdrop-blur-sm z-50"
    >
      <div
        className="w-full max-w-sm mx-6 bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS 스타일 헤더 */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <p className="text-center text-lg font-semibold text-gray-800">
            {convertTimeFormat(`${selectedHour}:${selectedMinute}`)}
          </p>
        </div>

        {/* 시간 선택 영역 */}
        <div className="px-6 py-8 bg-white">
          <div className="flex justify-center items-center">
            {/* 시간 선택 */}
            <TimePicker
              time={hours}
              handleTimeScroll={handleHourScroll}
              selectedTime={selectedHour}
            />
            <span className="text-2xl font-bold mx-4 text-gray-400">:</span>
            {/* 분 선택 */}
            <TimePicker
              time={minutes}
              handleTimeScroll={handleMinuteScroll}
              selectedTime={selectedMinute}
            />
          </div>
        </div>

        {/* iOS 스타일 버튼 영역 */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 text-gray-600 font-medium bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-3 px-4 text-white font-medium bg-blue-500 rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
            >
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectTime;
