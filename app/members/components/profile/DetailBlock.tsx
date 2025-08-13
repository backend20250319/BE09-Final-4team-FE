import React from "react";
import { Calendar, MapPin } from "lucide-react";

interface DetailBlockProps {
  joinDate?: string;
  address?: string;
  isEditing: boolean;
  formValues: { joinDate?: string; address?: string };
  onChange: (next: Partial<{ joinDate?: string; address?: string }>) => void;
}

export default function DetailBlock({ 
  joinDate, 
  address, 
  isEditing, 
  formValues, 
  onChange 
}: DetailBlockProps) {
  return (
    <div>

      {!isEditing ? (
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-300 mt-0.5" />
            <div className="flex-1">
              <span className="text-sm text-gray-300 block mb-1">입사일</span>
              <div className="text-white font-medium">
                {joinDate || "입사일 정보가 없습니다."}
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-300 mt-0.5" />
            <div className="flex-1">
              <span className="text-sm text-gray-300 block mb-1">주소</span>
              <div className="text-white font-medium break-words">
                {address || "주소 정보가 없습니다."}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-2">
              <Calendar className="w-4 h-4 inline mr-1" />
              입사일
            </label>
            <input
              type="date"
              value={formValues.joinDate ?? ""}
              onChange={(e) => onChange({ joinDate: e.target.value })}
              className="w-full rounded-md p-3 bg-gray-700/50 border border-gray-600/50 text-white focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              주소
            </label>
            <input
              type="text"
              value={formValues.address ?? ""}
              onChange={(e) => onChange({ address: e.target.value })}
              placeholder="주소를 입력하세요"
              className="w-full rounded-md p-3 bg-gray-700/50 border border-gray-600/50 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-transparent"
            />
          </div>
        </div>
      )}
    </div>
  );
}
