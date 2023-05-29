import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Gantt, Task, ViewMode } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';

import { Issue } from 'swr/spaceTypes';
import useSprintIssues from 'swr/useSprintIssues';
import { Flex, Text } from '@tremor/react';
import IssueGanttController from './gantt/IssueGanttController';
import useGanttFormatters from 'hooks/useGanttFormatters';

interface IssueListProps {
  sprintIds: string[];
}

const IssueList: FC<IssueListProps> = ({ sprintIds }) => {
  const { data, isLoading } = useSprintIssues(sprintIds);
  const { formatIssue, rearrangeTasks } = useGanttFormatters();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const [showTaskList, setShowTaskList] = useState<boolean>(true);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newTasks: Task[] =
      data?.map((issue: Issue) => formatIssue(issue)) || [];

    setTasks(rearrangeTasks(newTasks));
  }, [data, formatIssue, rearrangeTasks]);

  const ganttHeight = useMemo(() => {
    if (!wrapperRef.current || tasks.length === 0) {
      return 500;
    }
    return (
      window.outerHeight - wrapperRef.current.getBoundingClientRect().top - 150
    );
  }, [wrapperRef, tasks]);

  return (
    <Flex flexDirection="col" className="relative w-screen">
      <IssueGanttController
        showTaskList={showTaskList}
        setShowTaskList={setShowTaskList}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
      <div ref={wrapperRef} className="w-full">
        {tasks.length === 0 ? (
          <Flex justifyContent="center" className="mt-5">
            <Text>{isLoading ? 'Loading' : 'Please select the filters'}</Text>
          </Flex>
        ) : (
          <Gantt
            ganttHeight={ganttHeight}
            tasks={tasks}
            viewMode={viewMode}
            listCellWidth={showTaskList ? '100px' : ''}
          />
        )}
      </div>
    </Flex>
  );
};

export default IssueList;
