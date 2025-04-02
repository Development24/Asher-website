import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import React from "react";

interface PerformanceProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

const Performance = ({ formData, handleChange }: PerformanceProps) => {
  return (
    <div className="space-y-8">
      {/* Work Performance */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <Label className="text-gray-700 font-medium mb-2 md:mb-0">
              3. Employee's Work Performance
            </Label>
            <div className="flex items-center space-x-2 w-full md:w-1/2">
              <div className="w-full">
                <Slider
                  defaultValue={[0]}
                  value={
                    formData.workPerformance
                      ? [Number.parseInt(formData.workPerformance)]
                      : [0]
                  }
                  onValueChange={(value) =>
                    handleChange("workPerformance", value[0].toString())
                  }
                  max={4}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Poor</span>
                  <span>Needs Improvement</span>
                  <span>Satisfactory</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() =>
                    handleChange("workPerformance", (rating - 1).toString())
                  }
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      Number.parseInt(formData.workPerformance || "0") >=
                      rating - 1
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Punctuality & Attendance */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <Label className="text-gray-700 font-medium mb-2 md:mb-0">
              4. Punctuality & Attendance
            </Label>
            <div className="flex items-center space-x-2 w-full md:w-1/2">
              <div className="w-full">
                <Slider
                  defaultValue={[0]}
                  value={
                    formData.punctualityAttendance
                      ? [Number.parseInt(formData.punctualityAttendance)]
                      : [0]
                  }
                  onValueChange={(value) =>
                    handleChange("punctualityAttendance", value[0].toString())
                  }
                  max={4}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Poor</span>
                  <span>Needs Improvement</span>
                  <span>Satisfactory</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() =>
                    handleChange(
                      "punctualityAttendance",
                      (rating - 1).toString()
                    )
                  }
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      Number.parseInt(formData.punctualityAttendance || "0") >=
                      rating - 1
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reliability & Professionalism */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <Label className="text-gray-700 font-medium mb-2 md:mb-0">
              5. Reliability & Professionalism
            </Label>
            <div className="flex items-center space-x-2 w-full md:w-1/2">
              <div className="w-full">
                <Slider
                  defaultValue={[0]}
                  value={
                    formData.reliabilityProfessionalism
                      ? [Number.parseInt(formData.reliabilityProfessionalism)]
                      : [0]
                  }
                  onValueChange={(value) =>
                    handleChange(
                      "reliabilityProfessionalism",
                      value[0].toString()
                    )
                  }
                  max={4}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Poor</span>
                  <span>Needs Improvement</span>
                  <span>Satisfactory</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() =>
                    handleChange(
                      "reliabilityProfessionalism",
                      (rating - 1).toString()
                    )
                  }
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      Number.parseInt(
                        formData.reliabilityProfessionalism || "0"
                      ) >=
                      rating - 1
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Teamwork & Interpersonal Skills */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <Label className="text-gray-700 font-medium mb-2 md:mb-0">
              6. Teamwork & Interpersonal Skills
            </Label>
            <div className="flex items-center space-x-2 w-full md:w-1/2">
              <div className="w-full">
                <Slider
                  defaultValue={[0]}
                  value={
                    formData.teamworkInterpersonal
                      ? [Number.parseInt(formData.teamworkInterpersonal)]
                      : [0]
                  }
                  onValueChange={(value) =>
                    handleChange("teamworkInterpersonal", value[0].toString())
                  }
                  max={4}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>Poor</span>
                  <span>Needs Improvement</span>
                  <span>Satisfactory</span>
                  <span>Good</span>
                  <span>Excellent</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  type="button"
                  onClick={() =>
                    handleChange(
                      "teamworkInterpersonal",
                      (rating - 1).toString()
                    )
                  }
                  className="focus:outline-none"
                >
                  <Star
                    className={`h-6 w-6 ${
                      Number.parseInt(formData.teamworkInterpersonal || "0") >=
                      rating - 1
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Re-employment */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <Label className="text-gray-700 font-medium mb-2 md:mb-0">
            7. Would you re-employ this person?
          </Label>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reemploy-yes"
                checked={formData.wouldReemploy === true}
                onCheckedChange={() => handleChange("wouldReemploy", true)}
              />
              <Label htmlFor="reemploy-yes" className="text-gray-700">
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="reemploy-no"
                checked={formData.wouldReemploy === false}
                onCheckedChange={() => handleChange("wouldReemploy", false)}
              />
              <Label htmlFor="reemploy-no" className="text-gray-700">
                No
              </Label>
            </div>
          </div>
        </div>
        {formData.wouldReemploy === false && (
          <Input
            placeholder="Please provide details"
            className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm mt-2"
            value={formData.reemployDetails}
            onChange={(e) => handleChange("reemployDetails", e.target.value)}
          />
        )}
      </div>

      {/* Additional Comments */}
      <div className="space-y-4">
        <Label
          htmlFor="additional-comments"
          className="text-gray-700 font-medium"
        >
          Additional Comments
        </Label>
        <Textarea
          id="additional-comments"
          placeholder="Please provide any additional information that may be helpful"
          className="min-h-[120px] rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
          value={formData.additionalComments}
          onChange={(e) => handleChange("additionalComments", e.target.value)}
        />
      </div>
    </div>
  );
};

export default Performance;
