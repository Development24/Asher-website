"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function LandlordReferenceForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  const [formData, setFormData] = useState({
    // Tenant Information
    tenantName: "",
    currentAddress: "",
    monthlyRent: "",
    rentalStartDate: "",
    rentalEndDate: "",
    reasonForLeaving: "",

    // Landlord Information
    landlordName: "",
    contactNumber: "",
    emailAddress: "",

    // Tenant Conduct & Payment History
    rentOnTime: null,
    rentOnTimeDetails: "",
    rentArrears: null,
    rentArrearsDetails: "",
    propertyCondition: null,
    propertyConditionDetails: "",
    complaints: null,
    complaintsDetails: "",
    endCondition: null,
    endConditionDetails: "",
    rentAgain: null,
    rentAgainDetails: "",

    // Additional Comments
    additionalComments: "",

    // Signature
    signerName: "",
    signature: "",
    date: "",
  })

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    alert("Form submitted successfully!")
  }

  const steps = [
    { id: 1, name: "Tenant Information" },
    { id: 2, name: "Landlord Information" },
    { id: 3, name: "Tenant Conduct" },
    { id: 4, name: "Comments & Signature" },
  ]

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gray-50 border-b">
        <div className="flex items-center mb-6">
          <button onClick={() => {}} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-center flex-1 mr-8">Landlord Reference Form</h1>
        </div>

        {/* Progress Bar */}
        <div className="mb-2">
          <div className="flex justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-[#dc0a3c] h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex justify-between mt-4 overflow-x-auto pb-2">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center min-w-[80px]">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full border-2 transition-colors ${
                  currentStep >= step.id
                    ? "border-[#dc0a3c] bg-[#dc0a3c] text-white"
                    : "border-gray-300 bg-white text-gray-500"
                }`}
              >
                {currentStep > step.id ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{step.id}</span>
                )}
              </div>
              <span
                className={`text-xs mt-1 font-medium text-center ${
                  currentStep >= step.id ? "text-[#dc0a3c]" : "text-gray-500"
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{steps[currentStep - 1].name}</h2>
          <div className="flex items-center">
            <span className="mr-2 text-sm font-medium text-gray-600">Today's Date</span>
            <Input
              type="date"
              className="w-40"
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-8"
          >
            {/* Step 1: Tenant Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tenant-name" className="text-gray-700 font-medium">
                    Full name
                  </Label>
                  <Input
                    id="tenant-name"
                    placeholder="Enter full name"
                    className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                    value={formData.tenantName}
                    onChange={(e) => handleChange("tenantName", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="current-address" className="text-gray-700 font-medium">
                      Current address
                    </Label>
                    <Input
                      id="current-address"
                      placeholder="Address"
                      className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                      value={formData.currentAddress}
                      onChange={(e) => handleChange("currentAddress", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="monthly-rent" className="text-gray-700 font-medium">
                      Monthly Rent Paid (£)
                    </Label>
                    <Input
                      id="monthly-rent"
                      placeholder="Enter amount"
                      className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                      value={formData.monthlyRent}
                      onChange={(e) => handleChange("monthlyRent", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Rental period</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="rental-start-date" className="text-xs text-gray-500 mb-1 block">
                        Start date
                      </Label>
                      <Input
                        id="rental-start-date"
                        type="date"
                        className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                        value={formData.rentalStartDate}
                        onChange={(e) => handleChange("rentalStartDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="rental-end-date" className="text-xs text-gray-500 mb-1 block">
                        End date
                      </Label>
                      <Input
                        id="rental-end-date"
                        type="date"
                        className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                        value={formData.rentalEndDate}
                        onChange={(e) => handleChange("rentalEndDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason-for-leaving" className="text-gray-700 font-medium">
                    Reason for leaving
                  </Label>
                  <Input
                    id="reason-for-leaving"
                    placeholder="Please specify"
                    className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                    value={formData.reasonForLeaving}
                    onChange={(e) => handleChange("reasonForLeaving", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 2: Landlord Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="landlord-name" className="text-gray-700 font-medium">
                    Landlord/Agent Name
                  </Label>
                  <Input
                    id="landlord-name"
                    placeholder="Enter name"
                    className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                    value={formData.landlordName}
                    onChange={(e) => handleChange("landlordName", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-number" className="text-gray-700 font-medium">
                      Contact number
                    </Label>
                    <Input
                      id="contact-number"
                      placeholder="Phone number"
                      className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                      value={formData.contactNumber}
                      onChange={(e) => handleChange("contactNumber", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-address" className="text-gray-700 font-medium">
                      Email address
                    </Label>
                    <Input
                      id="email-address"
                      type="email"
                      placeholder="Email"
                      className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                      value={formData.emailAddress}
                      onChange={(e) => handleChange("emailAddress", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Tenant Conduct & Payment History */}
            {currentStep === 3 && (
              <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                {/* Question 1 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <span className="font-medium text-gray-700 mr-2">1.</span>
                      <span className="font-medium text-gray-700">Did the tenant pay rent on time?</span>
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
                        onChange={(e) => handleChange("rentOnTimeDetails", e.target.value)}
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
                        onChange={(e) => handleChange("rentArrearsDetails", e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Question 3 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <span className="font-medium text-gray-700 mr-2">3.</span>
                      <span className="font-medium text-gray-700">Did the tenant take good care of the property?</span>
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
                        onChange={(e) => handleChange("propertyConditionDetails", e.target.value)}
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
                        onChange={(e) => handleChange("complaintsDetails", e.target.value)}
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
                        onChange={(e) => handleChange("endConditionDetails", e.target.value)}
                      />
                    </div>
                  )}
                </div>

                {/* Question 6 */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start">
                      <span className="font-medium text-gray-700 mr-2">6.</span>
                      <span className="font-medium text-gray-700">Would you rent to this tenant again?</span>
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
            )}

            {/* Step 4: Additional Comments & Signature */}
            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-800">Additional Comments</h3>
                  <Textarea
                    placeholder="Please provide any additional information that may be helpful"
                    className="min-h-[150px] rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                    value={formData.additionalComments}
                    onChange={(e) => handleChange("additionalComments", e.target.value)}
                  />
                </div>

                <div className="space-y-6 pt-4">
                  <h3 className="text-lg font-semibold text-gray-800">Signature</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="signer-name" className="text-gray-700 font-medium">
                        Name
                      </Label>
                      <Input
                        id="signer-name"
                        className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                        value={formData.signerName}
                        onChange={(e) => handleChange("signerName", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signature" className="text-gray-700 font-medium">
                        Signature
                      </Label>
                      <Input
                        id="signature"
                        className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                        value={formData.signature}
                        onChange={(e) => handleChange("signature", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 max-w-xs">
                    <Label htmlFor="signature-date" className="text-gray-700 font-medium">
                      Date
                    </Label>
                    <Input
                      id="signature-date"
                      type="date"
                      className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                      value={formData.date}
                      onChange={(e) => handleChange("date", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-12 gap-4">
          <Button
            type="button"
            onClick={goToPreviousStep}
            disabled={currentStep === 1}
            variant="outline"
            className="flex-1 h-12 rounded-md border-[#dc0a3c] text-[#dc0a3c] bg-white hover:bg-gray-50 hover:text-[#dc0a3c] disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 transition-colors"
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button
              type="button"
              onClick={goToNextStep}
              className="flex-1 h-12 rounded-md bg-[#dc0a3c] text-white hover:bg-[#c00935] transition-colors"
            >
              Next
            </Button>
          ) : (
            <Button
              type="submit"
              className="flex-1 h-12 rounded-md bg-[#dc0a3c] text-white hover:bg-[#c00935] transition-colors"
            >
              Submit
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

