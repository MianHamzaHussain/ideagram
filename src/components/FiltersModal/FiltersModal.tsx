import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BottomSheet from '../BottomSheet/BottomSheet';
import PageHeader from '../PageHeader/PageHeader';
import SelectionGroup from '../SelectionGroup/SelectionGroup';
import SelectablePill from '../SelectablePill/SelectablePill';
import Button from '../Button/Button';
import { useTags } from '../../hooks/useTags';
import type { Tag } from '../../api/tag';

interface FiltersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: {
    reportType?: 'progress' | 'trouble';
    tagsMap: Record<number, number[]>;
    tagIds: number[];
  }) => void;
  initialFilters: {
    reportType?: 'progress' | 'trouble';
    tagIds: number[];
  };
}

const UI_LABEL_MAP: Record<string, string> = {
  'Current state': 'Status',
  'Change since last report': 'Trend',
};

const SINGLE_SELECT_GROUPS = ['Current state', 'Change since last report'];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const FiltersModal = ({ isOpen, onClose, onApply, initialFilters }: FiltersModalProps) => {
  const [selectedType, setSelectedType] = useState<'progress' | 'trouble' | undefined>(initialFilters.reportType);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>(initialFilters.tagIds);

  // Sync with initialFilters when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedType(initialFilters.reportType);
      setSelectedTagIds(initialFilters.tagIds);
    }
  }, [isOpen, initialFilters]);

  // Fetch tags based on selected type
  const reportTypeInt = selectedType === 'trouble' ? 1 : selectedType === 'progress' ? 2 : 0;
  const { data: tags = [], isLoading: isTagsLoading } = useTags(reportTypeInt);

  // Group tags by tagTypeName for UI and sort them: Status first, Trend second
  const groupedTags = useMemo(() => {
    const groups: Record<string, Tag[]> = {};
    if (!selectedType) return groups;

    const filteredTags = selectedType === 'trouble' 
      ? tags.filter(tag => tag.tagTypeName !== 'Current state' && tag.tagTypeName !== 'Change since last report')
      : tags;

    filteredTags.forEach((tag) => {
      if (!groups[tag.tagTypeName]) {
        groups[tag.tagTypeName] = [];
      }
      groups[tag.tagTypeName].push(tag);
    });

    // Sort entries: Current state (Status) first, Change since last report (Trend) second
    return Object.fromEntries(
      Object.entries(groups).sort(([a], [b]) => {
        if (a === 'Current state') return -1;
        if (b === 'Current state') return 1;
        if (a === 'Change since last report') return -1;
        if (b === 'Change since last report') return 1;
        return 0;
      })
    );
  }, [tags, selectedType]);

  const handleToggleTag = (tag: Tag, groupName: string) => {
    const isSingleSelect = SINGLE_SELECT_GROUPS.includes(groupName);
    
    if (isSingleSelect) {
      // Find other tags in the same group and remove them
      const groupTagIds = groupedTags[groupName].map(t => t.id);
      setSelectedTagIds(prev => [
        ...prev.filter(id => !groupTagIds.includes(id)),
        tag.id
      ]);
    } else {
      setSelectedTagIds((prev) =>
        prev.includes(tag.id) ? prev.filter((id) => id !== tag.id) : [...prev, tag.id]
      );
    }
  };

  const handleReset = () => {
    // Reset local state first
    setSelectedType('progress');
    setSelectedTagIds([]);

    // Immediately apply the reset to the store and refresh the feed
    onApply({
      reportType: 'progress',
      tagsMap: {},
      tagIds: [],
    });
    onClose();
  };


  const handleSearch = () => {
    const tagsMap: Record<number, number[]> = {};
    selectedTagIds.forEach(id => {
      const tag = tags.find(t => t.id === id);
      if (tag) {
        if (!tagsMap[tag.tagType]) {
          tagsMap[tag.tagType] = [];
        }
        tagsMap[tag.tagType].push(id);
      }
    });

    onApply({
      reportType: selectedType,
      tagsMap,
      tagIds: selectedTagIds,
    });
    onClose();
  };

  const getUILabel = (backendLabel: string) => UI_LABEL_MAP[backendLabel] || backendLabel;
  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col h-full bg-white max-h-[90vh]">
        <PageHeader
          title="Filter"
          onBack={onClose}
          backIcon="arrow"
          centered={true}
          showHandle={true}
          showBorder={false}
          className="rounded-t-[32px]"
        />

        <div className="flex-1 overflow-y-auto px-6 py-6 pb-10 scrollbar-hide">
          <div className="flex flex-col gap-10">
            <SelectionGroup label="Feed">
              <div className="flex flex-row gap-3">
                <SelectablePill
                  label="Progress"
                  isActive={selectedType === 'progress'}
                  onClick={() => {
                    setSelectedType('progress');
                    setSelectedTagIds([]);
                  }}
                />
                <SelectablePill
                  label="Trouble Report"
                  isActive={selectedType === 'trouble'}
                  onClick={() => {
                    setSelectedType('trouble');
                    setSelectedTagIds([]);
                  }}
                />
              </div>
            </SelectionGroup>

            {selectedType && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedType}
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="flex flex-col gap-10"
                >
                  {isTagsLoading ? (
                    <div className="flex flex-col gap-10">
                      {[1, 2].map(i => (
                        <div key={i} className="flex flex-col gap-4 animate-pulse">
                          <div className="h-6 bg-neutral-100 rounded w-24 mb-1" />
                          <div className="grid grid-cols-2 gap-3">
                            <div className="h-11 bg-neutral-100 rounded-full w-full" />
                            <div className="h-11 bg-neutral-100 rounded-full w-full" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    Object.entries(groupedTags).map(([groupName, groupTags]) => {
                      const isSingleSelect = SINGLE_SELECT_GROUPS.includes(groupName);
                      const uiLabel = getUILabel(groupName);

                      return (
                        <motion.div key={groupName} variants={itemVariants}>
                          <SelectionGroup 
                            label={uiLabel}
                            subLabel={isSingleSelect ? `Select a ${uiLabel.toLowerCase()}` : undefined}
                          >
                            <div className={isSingleSelect ? "grid grid-cols-2 gap-3" : "flex flex-row flex-wrap gap-3"}>
                              {groupTags.map((tag) => (
                                <SelectablePill
                                  key={tag.id}
                                  label={capitalize(tag.translatedName || tag.name)}
                                  isActive={selectedTagIds.includes(tag.id)}
                                  onClick={() => handleToggleTag(tag, groupName)}
                                  fullWidth={isSingleSelect}
                                />
                              ))}
                            </div>
                          </SelectionGroup>
                        </motion.div>
                      );
                    })
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        <div className="flex-none px-6 py-4 border-t border-neutral-100 bg-white pb-[env(safe-area-inset-bottom,20px)]">
          <div className="flex gap-4">
            <Button
              variant="brand-outline"
              onClick={handleReset}
              className="flex-1 !h-14"
            >
              Reset
            </Button>
            <Button
              variant="primary"
              onClick={handleSearch}
              className="flex-1 !h-14 shadow-lg"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

export default FiltersModal;
