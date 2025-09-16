import { useState, useCallback } from 'react';
import { MODAL_DATA } from '../constants/modal-data';

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

  const selectedVerificationData = selectedVerification ? MODAL_DATA[selectedVerification as keyof typeof MODAL_DATA] : null;

  return {
    isOpen,
    selectedVerification: selectedVerificationData,
    openModal,
    closeModal,
  };
}
