import { create } from 'zustand';

interface ModalState {
  currentReportId: number | null;
  isReadersOpen: boolean;
  isCommentsOpen: boolean;
  
  // Filters Modal
  isFiltersOpen: boolean;
  filtersProps: {
    initialFilters?: any;
    onApply?: (filters: any) => void;
  } | null;

  // Comment Form Modal
  isCommentFormOpen: boolean;
  commentFormProps: {
    reportId: number;
    mode?: 'create' | 'edit';
    commentId?: number;
    initialText?: string;
  } | null;

  // Camera Modal
  isCameraOpen: boolean;
  cameraProps: {
    onCapture: (data: any) => void;
    allowedModes?: ('photo' | 'video')[];
  } | null;

  // Confirm Modal
  isConfirmOpen: boolean;
  confirmProps: {
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    variant?: 'destructive' | 'default';
  } | null;

  // Actions
  openReaders: (reportId: number) => void;
  closeReaders: () => void;
  openComments: (reportId: number) => void;
  closeComments: () => void;
  
  openFilters: (props: NonNullable<ModalState['filtersProps']>) => void;
  closeFilters: () => void;
  
  openCommentForm: (props: NonNullable<ModalState['commentFormProps']>) => void;
  closeCommentForm: () => void;
  
  openCamera: (props: NonNullable<ModalState['cameraProps']>) => void;
  closeCamera: () => void;
  
  openConfirm: (props: NonNullable<ModalState['confirmProps']>) => void;
  closeConfirm: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  currentReportId: null,
  isReadersOpen: false,
  isCommentsOpen: false,
  
  isFiltersOpen: false,
  filtersProps: null,
  
  isCommentFormOpen: false,
  commentFormProps: null,
  
  isCameraOpen: false,
  cameraProps: null,
  
  isConfirmOpen: false,
  confirmProps: null,

  openReaders: (reportId) => set({ currentReportId: reportId, isReadersOpen: true }),
  closeReaders: () => set({ isReadersOpen: false }),
  
  openComments: (reportId) => set({ currentReportId: reportId, isCommentsOpen: true }),
  closeComments: () => set({ isCommentsOpen: false }),

  openFilters: (props) => set({ isFiltersOpen: true, filtersProps: props }),
  closeFilters: () => set({ isFiltersOpen: false }),

  openCommentForm: (props) => set({ isCommentFormOpen: true, commentFormProps: props }),
  closeCommentForm: () => set({ isCommentFormOpen: false }),

  openCamera: (props) => set({ isCameraOpen: true, cameraProps: props }),
  closeCamera: () => set({ isCameraOpen: false }),

  openConfirm: (props) => set({ isConfirmOpen: true, confirmProps: props }),
  closeConfirm: () => set({ isConfirmOpen: false }),
}));
