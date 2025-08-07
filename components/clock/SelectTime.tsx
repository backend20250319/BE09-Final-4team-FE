"use client";
import { useState } from "react";
import TimePicker from "./TimePicker";
const buttonClass = "p-2.5 flex-1 rounded-xl bg-[#8D8D8D]";

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
      className="fixed inset-0 flex items-center justify-center w-full h-full bg-black/70 z-50"
    >
      <div
        className="w-full max-w-sm mx-6 h-[280px] bg-white rounded-2xl flex items-center justify-center p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <section className="w-full">
          <p className="text-center text-lg font-medium border-b-2 pb-2">
            {convertTimeFormat(`${selectedHour}:${selectedMinute}`)}
          </p>
          <div className="flex justify-center items-center">
            {/* 시간 선택 */}
            <TimePicker
              time={hours}
              handleTimeScroll={handleHourScroll}
              selectedTime={selectedHour}
            />
            <span className="text-lg font-bold mx-3">:</span>
            {/* 분 선택 */}
            <TimePicker
              time={minutes}
              handleTimeScroll={handleMinuteScroll}
              selectedTime={selectedMinute}
            />
          </div>
          <div className="flex justify-center items-center gap-2 text-white mt-6">
            <button onClick={onClose} className={buttonClass}>
              취소
            </button>
            <button onClick={handleConfirm} className={buttonClass}>
              확인
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default SelectTime;
