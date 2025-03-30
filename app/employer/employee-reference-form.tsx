"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { ChevronLeft, CheckCircle2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Slider } from "@/components/ui/slider"
import { Star } from "lucide-react"

export default function EmployeeReferenceForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 5

  const [formData, setFormData] = useState({
    // Employee Information
    employeeName: "",
    jobTitle: "",
    department: "",
    employmentStartDate: "",
    employmentEndDate: "",
    reasonForLeaving: "",

    // Employer Information
    companyName: "",
    refereeName: "",
    refereePosition: "",
    contactNumber: "",
    emailAddress: "",

    // Employment Details
    employmentType: "",
    mainResponsibilities: "",

    // Performance Ratings
    workPerformance: "",
    punctualityAttendance: "",
    reliabilityProfessionalism: "",
    teamworkInterpersonal: "",

    // Re-employment
    wouldReemploy: null,
    reemployDetails: "",

    // Additional Comments
    additionalComments: "",

    // Declaration
    declarationConfirmed: false,

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
    { id: 1, name: "Employee Information" },
    { id: 2, name: "Employer Information" },
    { id: 3, name: "Employment Details" },
    { id: 4, name: "Performance & Comments" },
    { id: 5, name: "Declaration & Signature" },
  ]

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6 bg-gray-50 border-b">
        <div className="flex items-center mb-6">
          <button onClick={() => {}} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Back</span>
          </button>
          <h1 className="text-xl font-bold text-center flex-1 mr-8">Employee Reference Form</h1>
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
            {/* Step 1: Employee Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="employee-name" className="text-gray-700 font-medium">
                    Employee's full name
                  </Label>
                  <Input
                    id="employee-name"
                    placeholder="Enter full name"
                    className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                    value={formData.employeeName}
                    onChange={(e) => handleChange("employeeName", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="job-title" className="text-gray-700 font-medium">
                      Job title
                    </Label>
                    <Input
                      id="job-title"
                      placeholder="Enter job title"
                      className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                      value={formData.jobTitle}
                      onChange={(e) => handleChange("jobTitle", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department" className="text-gray-700 font-medium">
                      Department
                    </Label>
                    <Input
                      id="department"
                      placeholder="Enter department"
                      className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                      value={formData.department}
                      onChange={(e) => handleChange("department", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Employment period</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="employment-start-date" className="text-xs text-gray-500 mb-1 block">
                        Start date
                      </Label>
                      <Input
                        id="employment-start-date"
                        type="date"
                        className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                        value={formData.employmentStartDate}
                        onChange={(e) => handleChange("employmentStartDate", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="employment-end-date" className="text-xs text-gray-500 mb-1 block">
                        End date
                      </Label>
                      <Input
                        id="employment-end-date"
                        type="date"
                        className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                        value={formData.employmentEndDate}
                        onChange={(e) => handleChange("employmentEndDate", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason-for-leaving" className="text-gray-700 font-medium">
                    Reason for leaving (if applicable)
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

            {/* Step 2: Employer Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="company-name" className="text-gray-700 font-medium">
                    Company name
                  </Label>
                  <Input
                    id="company-name"
                    placeholder="Enter company name"
                    className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                    value={formData.companyName}
                    onChange={(e) => handleChange("companyName", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="referee-name" className="text-gray-700 font-medium">
                      Referee's name
                    </Label>
                    <Input
                      id="referee-name"
                      placeholder="Enter name"
                      className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                      value={formData.refereeName}
                      onChange={(e) => handleChange("refereeName", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="referee-position" className="text-gray-700 font-medium">
                      Position
                    </Label>
                    <Input
                      id="referee-position"
                      placeholder="Enter position"
                      className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                      value={formData.refereePosition}
                      onChange={(e) => handleChange("refereePosition", e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contact-number" className="text-gray-700 font-medium">
                      Contact number
                    </Label>
                    <Input
                      id="contact-number"
                      placeholder="Enter phone number"
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
                      placeholder="Enter email"
                      className="h-12 rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                      value={formData.emailAddress}
                      onChange={(e) => handleChange("emailAddress", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Employment Details */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <Label className="text-gray-700 font-medium">1. Nature of Employment</Label>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="full-time"
                        checked={formData.employmentType === "full-time"}
                        onCheckedChange={(checked) => {
                          if (checked) handleChange("employmentType", "full-time")
                        }}
                      />
                      <Label htmlFor="full-time" className="text-gray-700">
                        Full-Time
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="part-time"
                        checked={formData.employmentType === "part-time"}
                        onCheckedChange={(checked) => {
                          if (checked) handleChange("employmentType", "part-time")
                        }}
                      />
                      <Label htmlFor="part-time" className="text-gray-700">
                        Part-Time
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="temporary-contract"
                        checked={formData.employmentType === "temporary-contract"}
                        onCheckedChange={(checked) => {
                          if (checked) handleChange("employmentType", "temporary-contract")
                        }}
                      />
                      <Label htmlFor="temporary-contract" className="text-gray-700">
                        Temporary/Contract
                      </Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="main-responsibilities" className="text-gray-700 font-medium">
                    2. Main Responsibilities
                  </Label>
                  <Textarea
                    id="main-responsibilities"
                    placeholder="Please describe the employee's main duties and responsibilities"
                    className="min-h-[120px] rounded-lg border-gray-300 focus:ring-[#dc0a3c] focus:border-[#dc0a3c] shadow-sm"
                    value={formData.mainResponsibilities}
                    onChange={(e) => handleChange("mainResponsibilities", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 4: Performance & Comments */}
            {currentStep === 4 && (
              <div className="space-y-8">
                {/* Work Performance */}
                <div className="space-y-4">
                  <div className="flex flex-col space-y-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <Label className="text-gray-700 font-medium mb-2 md:mb-0">3. Employee's Work Performance</Label>
                      <div className="flex items-center space-x-2 w-full md:w-1/2">
                        <div className="w-full">
                          <Slider
                            defaultValue={[0]}
                            value={formData.workPerformance ? [Number.parseInt(formData.workPerformance)] : [0]}
                            onValueChange={(value) => handleChange("workPerformance", value[0].toString())}
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
                            onClick={() => handleChange("workPerformance", (rating - 1).toString())}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                Number.parseInt(formData.workPerformance || "0") >= rating - 1
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
                      <Label className="text-gray-700 font-medium mb-2 md:mb-0">4. Punctuality & Attendance</Label>
                      <div className="flex items-center space-x-2 w-full md:w-1/2">
                        <div className="w-full">
                          <Slider
                            defaultValue={[0]}
                            value={
                              formData.punctualityAttendance ? [Number.parseInt(formData.punctualityAttendance)] : [0]
                            }
                            onValueChange={(value) => handleChange("punctualityAttendance", value[0].toString())}
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
                            onClick={() => handleChange("punctualityAttendance", (rating - 1).toString())}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                Number.parseInt(formData.punctualityAttendance || "0") >= rating - 1
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
                      <Label className="text-gray-700 font-medium mb-2 md:mb-0">5. Reliability & Professionalism</Label>
                      <div className="flex items-center space-x-2 w-full md:w-1/2">
                        <div className="w-full">
                          <Slider
                            defaultValue={[0]}
                            value={
                              formData.reliabilityProfessionalism
                                ? [Number.parseInt(formData.reliabilityProfessionalism)]
                                : [0]
                            }
                            onValueChange={(value) => handleChange("reliabilityProfessionalism", value[0].toString())}
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
                            onClick={() => handleChange("reliabilityProfessionalism", (rating - 1).toString())}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                Number.parseInt(formData.reliabilityProfessionalism || "0") >= rating - 1
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
                              formData.teamworkInterpersonal ? [Number.parseInt(formData.teamworkInterpersonal)] : [0]
                            }
                            onValueChange={(value) => handleChange("teamworkInterpersonal", value[0].toString())}
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
                            onClick={() => handleChange("teamworkInterpersonal", (rating - 1).toString())}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`h-6 w-6 ${
                                Number.parseInt(formData.teamworkInterpersonal || "0") >= rating - 1
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
                  <Label htmlFor="additional-comments" className="text-gray-700 font-medium">
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
            )}

            {/* Step 5: Declaration & Signature */}
            {currentStep === 5 && (
              <div className="space-y-8">
                <div className="flex items-start space-x-3 bg-gray-50 p-6 rounded-lg">
                  <Checkbox
                    id="declaration"
                    className="mt-1 h-5 w-5 border-gray-300 text-[#dc0a3c] rounded focus:ring-[#dc0a3c]"
                    checked={formData.declarationConfirmed}
                    onCheckedChange={(checked) => handleChange("declarationConfirmed", checked)}
                  />
                  <Label htmlFor="declaration" className="font-medium text-gray-700">
                    I confirm that the information provided in this reference is accurate and based on my knowledge of
                    the employee's performance.
                  </Label>
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

