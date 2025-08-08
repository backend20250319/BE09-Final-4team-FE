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
        <div className="h-[140px] relative w-14">
    {/* 선택 박스 */}
      <div className="absolute pointer-events-none top-[54px] right-[12px] h-8 w-8 border-y-2" />
      {/* 스크롤 박스 */}
      <div
        className="h-full overflow-auto scrollbar-hide snap-y snap-mandatory overscroll-contain py-[60px]"
        onScroll={handleTimeScroll}
      >
        {/* 시간/분 아이템들 */}
        {time.map((t) => (
          <div
            key={t}
            className={`h-[32px] flex items-center justify-center snap-center text-sm
        ${
          selectedTime === t
            ? "text-black font-medium mt:border-solid"
            : "text-gray-400"
        }`}
          >
            {t}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimePicker;
