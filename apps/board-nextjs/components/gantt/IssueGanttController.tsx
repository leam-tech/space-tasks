import { Flex, Button } from '@tremor/react';
import { Switch } from '@headlessui/react';
import { ViewMode } from 'gantt-task-react';
import { FC } from 'react';

interface IssueGanttViewModeProps {
  viewMode: ViewMode;
  setViewMode: (viewMode: ViewMode) => void;

  showTaskList: boolean;
  setShowTaskList: (showTaskList: boolean) => void;
}

const IssueGanttViewMode: FC<IssueGanttViewModeProps> = ({
  viewMode,
  setViewMode,
  showTaskList,
  setShowTaskList,
}) => (
  <Flex justifyContent="center" className="gap-1">
    <Switch.Group>
      <Switch.Label className="mr-4">Show Task List</Switch.Label>
      <Switch
        checked={showTaskList}
        onChange={setShowTaskList}
        className={`${
          showTaskList ? 'bg-blue-600' : 'bg-gray-200'
        } relative inline-flex h-6 w-11 items-center rounded-full`}
      >
        <span className="sr-only">Show Task List</span>
        <span
          className={`${
            showTaskList ? 'translate-x-6' : 'translate-x-1'
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
    </Switch.Group>
    <Button
      variant={viewMode == ViewMode.Hour ? 'primary' : 'secondary'}
      onClick={() => setViewMode(ViewMode.Hour)}
    >
      Hour
    </Button>
    <Button
      variant={viewMode == ViewMode.HalfDay ? 'primary' : 'secondary'}
      onClick={() => setViewMode(ViewMode.HalfDay)}
    >
      Half Day
    </Button>
    <Button
      variant={viewMode == ViewMode.Day ? 'primary' : 'secondary'}
      onClick={() => setViewMode(ViewMode.Day)}
    >
      Day
    </Button>
    <Button
      variant={viewMode == ViewMode.Week ? 'primary' : 'secondary'}
      onClick={() => setViewMode(ViewMode.Week)}
    >
      Week
    </Button>
    <Button
      variant={viewMode == ViewMode.Month ? 'primary' : 'secondary'}
      onClick={() => setViewMode(ViewMode.Month)}
    >
      Month
    </Button>
    <Button
      variant={viewMode == ViewMode.Year ? 'primary' : 'secondary'}
      onClick={() => setViewMode(ViewMode.Year)}
    >
      Year
    </Button>
  </Flex>
);

export default IssueGanttViewMode;
