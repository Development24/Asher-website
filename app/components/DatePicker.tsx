// components/DatePicker.tsx
import React from "react";
import { updateDate } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const formatDateValue = (value: any) => {
  if (!value) return { year: "", month: "", day: "" };

  try {
    // If it's already a Date object
    if (value instanceof Date) {
      return {
        year: value.getFullYear().toString(),
        month: (value.getMonth() + 1).toString().padStart(2, "0"),
        day: value.getDate().toString().padStart(2, "0")
      };
    }

    // If it's an ISO string or similar format
    if (typeof value === "string") {
      // Handle ISO string format
      if (value.includes("T")) {
        const date = new Date(value);
        return {
          year: date.getFullYear().toString(),
          month: (date.getMonth() + 1).toString().padStart(2, "0"),
          day: date.getDate().toString().padStart(2, "0")
        };
      }

      // Handle YYYY-MM-DD format
      const [year, month, day] = value.split("-");
      if (year && month && day) {
        return { year, month, day };
      }
    }

    // If nothing matches, return empty values
    return { year: "", month: "", day: "" };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Error parsing date:", error);
    }
    return { year: "", month: "", day: "" };
  }
};

// In your component
const DatePicker = ({ field }: any) => {
  const { year, month, day } = formatDateValue(field?.value);

  return (
    <div className="flex gap-4">
      <Select
        onValueChange={(value) => updateDate("day", value, field)}
        value={day || undefined}
      >
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 31 }, (_, i) => (
            <SelectItem key={i + 1} value={String(i + 1).padStart(2, "0")}>
              {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => updateDate("month", value, field)}
        value={month || undefined}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {[
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ].map((monthName, i) => (
            <SelectItem key={i} value={String(i + 1).padStart(2, "0")}>
              {monthName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => updateDate("year", value, field)}
        value={year || undefined}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 100 }, (_, i) => (
            <SelectItem
              key={i}
              value={String(new Date().getFullYear() + 5 - i)}
            >
              {new Date().getFullYear() + 5 - i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DatePicker;
