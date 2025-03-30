// components/DatePicker.tsx
import React from 'react';
import { updateDate } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DatePicker = ({ field }: any) => {
  const [year, month, day] = (field.value || "").toString().split("-");

  return (
    <div className="flex gap-4">
      <Select
        onValueChange={(value) => updateDate('day', value, field)}
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
        onValueChange={(value) => updateDate('month', value, field)}
        value={month || undefined}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {[
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ].map((monthName, i) => (
            <SelectItem key={i} value={String(i + 1).padStart(2, "0")}>
              {monthName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => updateDate('year', value, field)}
        value={year || undefined}
      >
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 100 }, (_, i) => (
            <SelectItem key={i} value={String(new Date().getFullYear() + 5 - i)}>
              {new Date().getFullYear() + 5  - i}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default DatePicker;
