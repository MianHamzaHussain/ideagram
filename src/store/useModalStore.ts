import { create } from 'zustand';

interface ModalState {
  currentReportId: number | null;
  isReadersOpen: boolean;
  isCommentsOpen: boolean;
  
  // Actions
  openReaders: (reportId: number) => void;
  openComments: (reportId: number) => void;
  closeReaders: () => void;
  closeComments: () => void;
  closeAll: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  currentReportId: null,
  isReadersOpen: false,
  isCommentsOpen: false,

  openReaders: (reportId) => set({ 
    currentReportId: reportId, 
    isReadersOpen: true, 
    isCommentsOpen: false 
  }),

  openComments: (reportId) => set({ 
    currentReportId: reportId, 
    isCommentsOpen: true, 
    isReadersOpen: false 
  }),

  closeReaders: () => set({ isReadersOpen: false }),

  closeComments: () => set({ isCommentsOpen: false }),

  closeAll: () => set({ 
    isReadersOpen: false, 
    isCommentsOpen: false 
  }),
}));
