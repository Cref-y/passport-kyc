// lib/storage-utils.ts
"use client"

// Removed re-export of getVerification and getVerificationsList
// to avoid circular dependencies

export function saveToLocalStorage(data: any): void {
  try {
    localStorage.setItem('kycData', JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

export function getFromLocalStorage(): any | null {
  try {
    const data = localStorage.getItem('kycData');
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error retrieving from localStorage:', error);
    return null;
  }
}