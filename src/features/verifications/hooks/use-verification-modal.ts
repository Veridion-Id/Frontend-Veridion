import { useState, useCallback } from 'react';

export function useVerificationModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null);

  const openModal = useCallback((verificationId: string) => {
    setSelectedVerification(verificationId);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSelectedVerification(null);
  }, []);

  return {
    isOpen,
    selectedVerification,
    openModal,
    closeModal,
  };
}
