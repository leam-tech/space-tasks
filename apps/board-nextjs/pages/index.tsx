import { useState } from 'react';
import { Flex } from '@tremor/react';
import ProjectSelector from 'components/ProjectSelector';
import SprintBoardSelector from 'components/SprintBoardSelector';
import IssueGantt from 'components/IssueGantt';

export default function Index() {
  const [projectId, setProjectId] = useState<string>('');
  const [sprintIds, setSprintIds] = useState<string[]>([]);

  return (
    <>
      <Flex alignItems="stretch">
        <ProjectSelector onChange={(v) => setProjectId(v)} />
        <SprintBoardSelector
          projectId={projectId}
          onChange={(v) => setSprintIds(v)}
        />
      </Flex>
      <IssueGantt sprintIds={sprintIds} />
    </>
  );
}
