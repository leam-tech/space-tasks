import { Task } from 'gantt-task-react';
import { useCallback } from 'react';
import { Issue } from 'swr/spaceTypes';

export default function useFormatSpaceIssue() {
  return {
    formatIssue: useCallback((issue: Issue): Task => {
      const progress = issue.doneDateTime
        ? 100
        : issue.subItemsCount
        ? (issue.doneSubItemsCount / issue.subItemsCount) * 100
        : issue.readyForReviewDateTime
        ? 75
        : issue.inProgressDateTime
        ? 30
        : 0;

      const status = issue.status.name;
      const styles = {
        backgroundColor: progress === 100 ? '#4caf50' : '#2196f3',
        backgroundSelectedColor: progress === 100 ? '#4caf50' : '#2196f3',
        progressColor: progress === 100 ? '#4caf50' : '#2196f3',
        progressSelectedColor: progress === 100 ? '#4caf50' : '#2196f3',
      };
      if (status === 'Open') {
        styles.backgroundColor = 'gray';
        styles.backgroundSelectedColor = 'gray';
        styles.progressColor = 'gray';
        styles.progressSelectedColor = 'gray';
      } else if (status === 'In progress') {
        styles.backgroundColor = '#FFF6BD';
        styles.backgroundSelectedColor = '#fff199';
        styles.progressColor = '#FFD966';
        styles.progressSelectedColor = '#ffcc33';
      } else if (status === 'Ready for Review' || status === 'In Review') {
        styles.backgroundColor = '#ff9933';
        styles.backgroundSelectedColor = '#ff8c1a';
        styles.progressColor = '#e67300';
        styles.progressSelectedColor = '#cc6600';
      } else if (status === 'Updates Requested') {
        styles.backgroundColor = '#990000';
        styles.backgroundSelectedColor = '#b30000';
        styles.progressColor = '#cc0000';
        styles.progressSelectedColor = '#e60000';
      } else if (['Done', 'Dev', 'Production'].includes(status)) {
        styles.backgroundColor = '#196719';
        styles.backgroundSelectedColor = '#239023';
        styles.progressColor = '#196719';
        styles.progressSelectedColor = '#239023';
      } else {
        console.log('Unknown Status: ', status);
      }

      return {
        id: issue.id,
        name: issue.title,
        type: 'task',
        start: issue.inProgressDateTime
          ? new Date(issue.inProgressDateTime.iso)
          : new Date(issue.creationTime.iso),
        end: issue.doneDateTime ? new Date(issue.doneDateTime.iso) : new Date(),
        dependencies: (issue.parents || []).map((parent) => parent.id),
        progress: progress,

        styles: styles,
      };
    }, []),
    rearrangeTasks: useCallback((tasks: Task[]): Task[] => {
      // We have to sort this such that parent-child tasks are colocated
      // And then, sort by start date
      const taskMap = tasks.reduce((acc, task) => {
        acc[task.id] = task;
        return acc;
      }, {} as Record<string, Task>);

      const parentChildMap = tasks.reduce((acc, task) => {
        if (!task.dependencies || task.dependencies.length === 0) {
          return acc;
        }
        const parent = taskMap[task.dependencies[0]];
        if (!parent) {
          return acc;
        }
        if (!acc[parent.id]) {
          acc[parent.id] = [];
        }
        acc[parent.id].push(task);
        return acc;
      }, {} as Record<string, Task[]>);

      const sortedTasks = tasks
        .filter((x) => !x.dependencies || x.dependencies.length === 0)
        .sort((a, b) => a.start.getTime() - b.start.getTime());

      const sortedParentChildTasks = sortedTasks.reduce((acc, task) => {
        const handleChildren = (task: Task) => {
          acc.push(task);
          const children = parentChildMap[task.id];
          for (const child of children || []) {
            handleChildren(child);
          }
        };

        handleChildren(task);

        return acc;
      }, [] as Task[]);

      return sortedParentChildTasks;
    }, []),
  };
}
