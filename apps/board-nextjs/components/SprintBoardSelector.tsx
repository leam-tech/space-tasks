import React, { FC, useState } from 'react';
import {
  Card,
  Flex,
  MultiSelectBox,
  MultiSelectBoxItem,
  Text,
} from '@tremor/react';
import useSprints from 'swr/useSprints';

interface SprintBoardSelectorProps {
  projectId: string;
  onChange?: (sprintIds: string[]) => void;
}

const Chip: FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex justify-center items-center m-1 font-medium py-1 px-2 bg-white rounded-full text-gray-700 bg-gray-100 border border-gray-300 ">
    <div className="text-xs font-normal leading-none max-w-full flex-initial">
      {children}
    </div>
  </div>
);

const SprintBoardSelector: FC<SprintBoardSelectorProps> = ({
  projectId,
  onChange,
}) => {
  const { data } = useSprints(projectId);
  const [selectedSprints, setSelectedSprint] = useState<string[]>([]);

  return (
    <Card>
      <Text>Sprint Board</Text>
      <MultiSelectBox
        value={selectedSprints}
        onValueChange={(v) => {
          setSelectedSprint(v);
          onChange?.(v);
        }}
      >
        {(data || []).map((board) => (
          <MultiSelectBoxItem
            key={board.id}
            value={board.id}
            text={board.name}
          />
        ))}
      </MultiSelectBox>
      <Flex className="flex-wrap" justifyContent="start">
        {selectedSprints.map((sprintId) => {
          const sprint = data?.find((s) => s.id === sprintId);
          if (!sprint) return null;
          return <Chip key={sprint.id}>{sprint.name}</Chip>;
        })}
      </Flex>
    </Card>
  );
};

export default SprintBoardSelector;
