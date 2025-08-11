import React from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function EditDeleteButtons({ onEdit, onDelete }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="p-2 rounded-full hover:bg-gray-100 focus:outline-none cursor-pointer"
          aria-label="더보기"
        >
          <MoreVertical className="w-6 h-6" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>수정</DropdownMenuItem>
        <DropdownMenuItem onClick={onDelete}>삭제</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
