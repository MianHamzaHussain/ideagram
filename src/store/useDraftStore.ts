import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CreatePostFormValues } from '@/pages/CreatePostPage/types';

/**
 * Store for persisting the "Create Report" form state locally.
 * This prevents data loss if the user navigates away or refreshes the page
 * during the multi-step creation flow.
 */
export interface DraftState {
  /** The current values of the multi-step Formik form */
  currentFormValues: CreatePostFormValues | null;
  /** The zero-indexed step the user is currently on */
  currentStep: number;
  /** ISO timestamp of the last local save */
  lastUpdated: string | null;
  
  /**
   * Updates the local persistent draft.
   * Called automatically as the user progresses through steps.
   */
  setDraft: (values: CreatePostFormValues, step: number) => void;
  
  /**
   * Clears the local persistent draft.
   * Called after successful publication or manual deletion.
   */
  clearDraft: () => void;
}

export const useDraftStore = create<DraftState>()(
  persist(
    (set) => ({
      currentFormValues: null,
      currentStep: 0,
      lastUpdated: null,

      setDraft: (values, step) => set({ 
        currentFormValues: values, 
        currentStep: step,
        lastUpdated: new Date().toISOString()
      }),
      
      clearDraft: () => set({ 
        currentFormValues: null, 
        currentStep: 0, 
        lastUpdated: null 
      }),
    }),
    {
      name: 'report-draft-storage',
    }
  )
);
