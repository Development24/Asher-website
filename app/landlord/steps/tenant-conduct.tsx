import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface TenantConductProps {
  formData: any;
  handleChange: (field: string, value: any) => void;
}

const TenantConduct = ({ formData, handleChange }: TenantConductProps) => {
  return (
    <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
      {/* Question 1 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <span className="font-medium text-gray-700 mr-2">1.</span>
            <span className="font-medium text-gray-700">
              Did the tenant pay rent on time?
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Label htmlFor="rent-on-time-yes" className="text-gray-700">
                Yes
              </Label>
              <Checkbox
                id="rent-on-time-yes"
                checked={formData.rentOnTime === true}
                onCheckedChange={() => handleChange("rentOnTime", true)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="rent-on-time-no" className="text-gray-700">
                No
              </Label>
              <Checkbox
                id="rent-on-time-no"
                checked={formData.rentOnTime === false}
                onCheckedChange={() => handleChange("rentOnTime", false)}
              />
            </div>
          </div>
        </div>
        {formData.rentOnTime === false && (
          <div className="mt-2">
            <Input
              placeholder="Please provide details"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.rentOnTimeDetails}
              onChange={(e) =>
                handleChange("rentOnTimeDetails", e.target.value)
              }
            />
          </div>
        )}
      </div>

      {/* Question 2 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <span className="font-medium text-gray-700 mr-2">2.</span>
            <span className="font-medium text-gray-700">
              Were there any rent arrears or outstanding balances?
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Label htmlFor="rent-arrears-yes" className="text-gray-700">
                Yes
              </Label>
              <Checkbox
                id="rent-arrears-yes"
                checked={formData.rentArrears === true}
                onCheckedChange={() => handleChange("rentArrears", true)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="rent-arrears-no" className="text-gray-700">
                No
              </Label>
              <Checkbox
                id="rent-arrears-no"
                checked={formData.rentArrears === false}
                onCheckedChange={() => handleChange("rentArrears", false)}
              />
            </div>
          </div>
        </div>
        {formData.rentArrears === true && (
          <div className="mt-2">
            <Input
              placeholder="Please specify"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.rentArrearsDetails}
              onChange={(e) =>
                handleChange("rentArrearsDetails", e.target.value)
              }
            />
          </div>
        )}
      </div>

      {/* Question 3 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <span className="font-medium text-gray-700 mr-2">3.</span>
            <span className="font-medium text-gray-700">
              Did the tenant take good care of the property?
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Label htmlFor="property-condition-yes" className="text-gray-700">
                Yes
              </Label>
              <Checkbox
                id="property-condition-yes"
                checked={formData.propertyCondition === true}
                onCheckedChange={() => handleChange("propertyCondition", true)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="property-condition-no" className="text-gray-700">
                No
              </Label>
              <Checkbox
                id="property-condition-no"
                checked={formData.propertyCondition === false}
                onCheckedChange={() => handleChange("propertyCondition", false)}
              />
            </div>
          </div>
        </div>
        {formData.propertyCondition === false && (
          <div className="mt-2">
            <Input
              placeholder="Please provide details"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.propertyConditionDetails}
              onChange={(e) =>
                handleChange("propertyConditionDetails", e.target.value)
              }
            />
          </div>
        )}
      </div>

      {/* Question 4 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <span className="font-medium text-gray-700 mr-2">4.</span>
            <span className="font-medium text-gray-700">
              Were there any complaints from neighbors or property damage?
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Label htmlFor="complaints-yes" className="text-gray-700">
                Yes
              </Label>
              <Checkbox
                id="complaints-yes"
                checked={formData.complaints === true}
                onCheckedChange={() => handleChange("complaints", true)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="complaints-no" className="text-gray-700">
                No
              </Label>
              <Checkbox
                id="complaints-no"
                checked={formData.complaints === false}
                onCheckedChange={() => handleChange("complaints", false)}
              />
            </div>
          </div>
        </div>
        {formData.complaints === true && (
          <div className="mt-2">
            <Input
              placeholder="Please specify"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.complaintsDetails}
              onChange={(e) =>
                handleChange("complaintsDetails", e.target.value)
              }
            />
          </div>
        )}
      </div>

      {/* Question 5 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <span className="font-medium text-gray-700 mr-2">5.</span>
            <span className="font-medium text-gray-700">
              Was the property left in good condition at the end of the tenancy?
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Label htmlFor="end-condition-yes" className="text-gray-700">
                Yes
              </Label>
              <Checkbox
                id="end-condition-yes"
                checked={formData.endCondition === true}
                onCheckedChange={() => handleChange("endCondition", true)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="end-condition-no" className="text-gray-700">
                No
              </Label>
              <Checkbox
                id="end-condition-no"
                checked={formData.endCondition === false}
                onCheckedChange={() => handleChange("endCondition", false)}
              />
            </div>
          </div>
        </div>
        {formData.endCondition === false && (
          <div className="mt-2">
            <Input
              placeholder="Please provide details"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.endConditionDetails}
              onChange={(e) =>
                handleChange("endConditionDetails", e.target.value)
              }
            />
          </div>
        )}
      </div>

      {/* Question 6 */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <span className="font-medium text-gray-700 mr-2">6.</span>
            <span className="font-medium text-gray-700">
              Would you rent to this tenant again?
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Label htmlFor="rent-again-yes" className="text-gray-700">
                Yes
              </Label>
              <Checkbox
                id="rent-again-yes"
                checked={formData.rentAgain === true}
                onCheckedChange={() => handleChange("rentAgain", true)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="rent-again-no" className="text-gray-700">
                No
              </Label>
              <Checkbox
                id="rent-again-no"
                checked={formData.rentAgain === false}
                onCheckedChange={() => handleChange("rentAgain", false)}
              />
            </div>
          </div>
        </div>
        {formData.rentAgain === false && (
          <div className="mt-2">
            <Input
              placeholder="Please explain"
              className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
              value={formData.rentAgainDetails}
              onChange={(e) => handleChange("rentAgainDetails", e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantConduct;
