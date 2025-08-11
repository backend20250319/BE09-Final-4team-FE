interface TimePickerProps {
  time: string[];
  handleTimeScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  selectedTime: string;
}

const TimePicker = ({
  time,
  handleTimeScroll,
  selectedTime,
}: TimePickerProps) => {
  return (
    <div className="h-[140px] relative w-16">
      {/* iOS 스타일 선택 박스 - 그라데이션 오버레이 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 상단 그라데이션 */}
        <div className="absolute top-0 left-0 right-0 h-[54px] bg-gradient-to-b from-white via-white/80 to-transparent z-10" />
        {/* 하단 그라데이션 */}
        <div className="absolute bottom-0 left-0 right-0 h-[54px] bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
        {/* 선택 영역 하이라이트 */}
        <div className="absolute top-[54px] left-0 right-0 h-8 bg-blue-50/30 border-y border-blue-200/50 rounded-lg z-5" />
      </div>

      {/* 스크롤 박스 */}
      <div
        className="h-full overflow-auto snap-y snap-mandatory overscroll-contain py-[60px] scrollbar-none"
        onScroll={handleTimeScroll}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {/* 시간/분 아이템들 */}
        {time.map((t) => (
          <div
            key={t}
            className={`h-[32px] flex items-center justify-center snap-center text-base font-medium transition-all duration-200
              ${
                selectedTime === t
                  ? "text-blue-600 font-semibold scale-110"
                  : "text-gray-500"
              }
            `}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimePicker;
