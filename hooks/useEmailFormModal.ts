"use client";

import { useState } from "react";

export function useEmailFormModal() {
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const openEmailModal = (propertyDetails: any) => {
    setSelectedProperty(propertyDetails);
    setIsEmailModalOpen(true);
  };

  const closeEmailModal = () => {
    setIsEmailModalOpen(false);
    setSelectedProperty(null);
  };

  return {
    isEmailModalOpen,
    selectedProperty,
    openEmailModal,
    closeEmailModal
  };
} 