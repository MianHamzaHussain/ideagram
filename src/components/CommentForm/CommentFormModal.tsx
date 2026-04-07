import { Formik } from 'formik';
import * as Yup from 'yup';
import BottomSheet from '../BottomSheet/BottomSheet';
import PageHeader from '../PageHeader/PageHeader';
import TextField from '../TextField/TextField';
import { useCreateComment, useUpdateComment } from '../../hooks/useComments';
import { toast } from 'react-toastify';
import { getErrorMessage } from '../../utils/errorUtils';

interface CommentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: number;
  mode?: 'create' | 'edit';
  commentId?: number;
  initialText?: string;
}

const commentSchema = Yup.object().shape({
  text: Yup.string()
    .required('Comment text is required')
    .min(1, 'Comment cannot be empty')
    .max(500, 'Comment is too long (max 500 characters)'),
});

const CommentFormModal = ({ 
  isOpen, 
  onClose, 
  reportId, 
  mode = 'create', 
  commentId, 
  initialText = '' 
}: CommentFormModalProps) => {
  const createMutation = useCreateComment(reportId);
  const updateMutation = useUpdateComment(reportId);

  const handleSubmit = async (values: { text: string }, { setSubmitting }: any) => {
    try {
      if (mode === 'create') {
        await createMutation.mutateAsync(values.text);
        toast.success('Comment posted successfully');
      } else if (mode === 'edit' && commentId) {
        await updateMutation.mutateAsync({ id: commentId, text: values.text });
        toast.success('Comment updated successfully');
      }
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error, 'Failed to save comment'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <Formik
        initialValues={{ text: initialText }}
        validationSchema={commentSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ submitForm, isSubmitting, values, isValid, dirty }) => (
          <>
            <PageHeader 
              title={mode === 'create' ? 'Add Comment' : 'Edit Comment'} 
              variant="creation"
              showBack={false}
              showBorder={false}
              showHandle={true}
              leftElement={
                <button 
                  type="button" 
                  onClick={onClose}
                  className="font-inter font-medium text-[16px] text-neutral-500 hover:opacity-70 transition-opacity"
                >
                  Cancel
                </button>
              }
              rightElement={
                <button 
                  type="button"
                  onClick={submitForm}
                  disabled={isSubmitting || !isValid || (mode === 'edit' && !dirty)}
                  className="font-inter font-bold text-[16px] text-primary-300 disabled:text-neutral-300 disabled:font-medium hover:opacity-70 transition-opacity"
                >
                  {isSubmitting 
                    ? (mode === 'create' ? 'Posting...' : 'Saving...') 
                    : (mode === 'create' ? 'Post' : 'Save')
                  }
                </button>
              }
            />
            <div className="p-5 pb-8 overflow-y-auto max-h-[70vh]">
              <div className="flex flex-col gap-6">
                <TextField 
                  label="Your Comment"
                  name="text"
                  placeholder="Write something here..."
                  multiline={true}
                  height="160px"
                />
                <div className="flex justify-end px-1 -mt-4">
                  <span className={`text-[12px] font-inter ${values.text.length > 480 ? 'text-brand-red font-bold' : 'text-neutral-400 font-medium'}`}>
                    {values.text.length}/500
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </Formik>
    </BottomSheet>
  );
};
export default CommentFormModal;
