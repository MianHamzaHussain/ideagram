import { useEffect, useMemo } from 'react';
import { useFormikContext } from 'formik';
import SelectionGroup from '../../../components/SelectionGroup/SelectionGroup';
import SelectablePill from '../../../components/SelectablePill/SelectablePill';
import SelectField from '../../../components/SelectField/SelectField';
import { useProjects } from '../../../hooks/useProjects';
import type { Project } from '../../../api/project';
import { useTags } from '../../../hooks/useTags';
import type { Tag } from '../../../api/tag';

interface CreatePostValues {
  reportType: number;
  project: string;
  tags: number[]; // Store tag IDs
  daysToStop: number;
}

const UI_LABEL_MAP: Record<string, string> = {
  'Current state': 'Status',
  'Change since last report': 'Trend',
};

const SINGLE_SELECT_GROUPS = ['Current state', 'Change since last report'];

const StepDetailsContent = () => {
  const { values, setFieldValue } = useFormikContext<CreatePostValues>();
  
  // React Query Hooks (Server State)
  const { data: projectsData, isLoading: isProjectsLoading } = useProjects();
  const { data: tags = [], isLoading: isTagsLoading } = useTags(values.reportType);

  const projects = projectsData || [];

  // Cleanup: Remove any tags that don't belong to the current reportType
  useEffect(() => {
    if (!isTagsLoading && tags.length > 0 && values.tags.length > 0) {
      const validTags = values.tags.filter(tagId => {
        const foundTag = tags.find(t => t.id === tagId);
        return foundTag && foundTag.reportType === values.reportType;
      });
      
      if (validTags.length !== values.tags.length) {
        setFieldValue('tags', validTags);
      }
    }
  }, [tags, isTagsLoading, values.reportType, values.tags, setFieldValue]);

  // Group tags by tagTypeName and strictly filter by reportType
  const groupedTags = useMemo(() => {
    const groups: Record<string, Tag[]> = {};
    const filteredTags = tags.filter(tag => tag.reportType === values.reportType);

    filteredTags.forEach((tag) => {
      if (!groups[tag.tagTypeName]) {
        groups[tag.tagTypeName] = [];
      }
      groups[tag.tagTypeName].push(tag);
    });
    return groups;
  }, [tags, values.reportType]);

  const handleToggleTag = (tag: Tag, groupName: string) => {
    const currentTags = [...(values.tags || [])];
    const isSingleSelect = SINGLE_SELECT_GROUPS.includes(groupName);

    if (isSingleSelect) {
      // Find and remove any other tags from the same group
      const otherTagsInGroup = groupedTags[groupName].map(t => t.id);
      const filteredTags = currentTags.filter(id => !otherTagsInGroup.includes(id));
      
      if (currentTags.includes(tag.id)) {
        // Toggle off
        setFieldValue('tags', filteredTags);
      } else {
        // Toggle on
        setFieldValue('tags', [...filteredTags, tag.id]);
      }
    } else {
      // Multi-select logic
      if (currentTags.includes(tag.id)) {
        setFieldValue('tags', currentTags.filter(id => id !== tag.id));
      } else {
        setFieldValue('tags', [...currentTags, tag.id]);
      }
    }
  };

  const projectOptions = projects.map((p: Project) => ({
    label: p.name,
    value: p.id.toString()
  }));

  const getUILabel = (backendLabel: string) => {
    return UI_LABEL_MAP[backendLabel] || backendLabel;
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  // Sort and filter groups: Status (Current state) first, Trend (Change since last report) second
  const sortedGroupEntries = useMemo(() => {
    return Object.entries(groupedTags).sort(([a], [b]) => {
      if (a === 'Current state') return -1;
      if (b === 'Current state') return 1;
      if (a === 'Change since last report') return -1;
      if (b === 'Change since last report') return 1;
      return 0;
    });
  }, [groupedTags]);

  // Check if any selected tag requires input (daysToStop)
  const showDaysToStop = useMemo(() => {
    return values.reportType === 1 && values.tags.some(tagId => {
      const tag = tags.find(t => t.id === tagId);
      return tag?.hasInput === true;
    });
  }, [values.reportType, values.tags, tags]);

  // Automatically clear daysToStop if no tag requires it
  useEffect(() => {
    if (!showDaysToStop && values.daysToStop !== 0) {
      setFieldValue('daysToStop', 0);
    }
  }, [showDaysToStop, values.daysToStop, setFieldValue]);

  const TagGroupSkeleton = () => (
    <div className="flex flex-col gap-4 animate-pulse px-1">
      {/* Title Skeleton */}
      <div className="h-5 bg-neutral-100 rounded-md w-24" />
      {/* Subtitle Skeleton */}
      <div className="h-4 bg-neutral-50 rounded-md w-40 mb-1" />
      {/* 2x2 Grid of Pills Skeleton */}
      <div className="grid grid-cols-2 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-11 bg-neutral-100 rounded-full w-full" />
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Project Section */}
      <SelectField
        label="Project"
        placeholder="Select a project"
        value={values.project}
        options={projectOptions}
        onChange={(val) => setFieldValue('project', val)}
        isLoading={isProjectsLoading}
      />

      {/* Dynamic Tag Sections */}
      {isTagsLoading ? (
        <div className="flex flex-col gap-10">
          <TagGroupSkeleton />
          <TagGroupSkeleton />
        </div>
      ) : (
        sortedGroupEntries.map(([groupName, groupTags]) => {
          const isSingleSelect = SINGLE_SELECT_GROUPS.includes(groupName);
          
          return (
              <SelectionGroup
                key={groupName}
                label={getUILabel(groupName)}
                subLabel={isSingleSelect ? `Select a ${getUILabel(groupName).toLowerCase()}` : undefined}
                contentClassName={isSingleSelect ? "flex flex-row flex-wrap gap-x-[4%] gap-y-3 px-0" : "flex flex-row flex-wrap gap-3 px-0"}
              >
                {groupTags.map((tag) => (
                  <div key={tag.id} className={isSingleSelect ? "w-[48%]" : "w-auto"}>
                    <SelectablePill
                      label={capitalize(tag.translatedName || tag.name)}
                      isActive={values.tags.includes(tag.id)}
                      onClick={() => handleToggleTag(tag, groupName)}
                      fullWidth={isSingleSelect}
                    />
                  </div>
                ))}
              </SelectionGroup>
          );
        })
      )}

      {/* Days to Stop Section (Problem Reports Only & conditional on Tag) */}
      {showDaysToStop && (
        <div className="flex flex-col gap-2 w-full animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="font-['Inter',sans-serif] font-bold text-[14px] text-neutral-900 px-1">
            Work Stop Duration (Days)
          </label>
          <input
            type="number"
            min="0"
            value={values.daysToStop || ''}
            onChange={(e) => setFieldValue('daysToStop', parseInt(e.target.value) || 0)}
            className="
              w-full h-12 px-4 
              bg-white border border-[#D5D5D5] rounded-xl 
              font-['Inter',sans-serif] text-[15px] text-neutral-900 
              focus:border-brand-blue outline-none transition-all
            "
            placeholder="0"
          />
        </div>
      )}
    </div>
  );
};

export default StepDetailsContent;
