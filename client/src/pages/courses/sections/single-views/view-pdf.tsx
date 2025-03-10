import { updateProgress } from '@/api/course.api';
import { registerTimeline } from '@/api/get.info.api';
import { createTimelineData } from '@/helpers/createTimelineData';
import { SectionTypes } from '@/helpers/types';
import { useAuth } from '@/stores/AuthContext';

interface PDFViewProps {
  currentId: SectionTypes;
}

const PDFView: React.FC<PDFViewProps> = ({ currentId }) => {

  const { user, dispatch } = useAuth();
  return (
    <div className='mt-3 flex flex-col'>
      <p className='text-xs'>{currentId?.description}</p>
      {currentId?.resource && (
        <a
          href={currentId.resource}
          target='_blank'
          rel='noopener noreferrer'
          className='text-blue-700 underline text-sm !mt-5'
          onClick={async () => {
            const res = await updateProgress(user._id, currentId._id);

            dispatch({ type: 'UPDATE_PROGRESS', payload: res });
            dispatch(
              registerTimeline(
                createTimelineData({
                  user: user._id,
                  section: currentId._id,
                  activityType: 'completed',
                  text: `Completed ${currentId.title}`,
                })
              )
            );
          }}
        >
          {currentId?.title}
        </a>
      )}
    </div>
  );
};

export default PDFView;
