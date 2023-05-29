import { FC } from 'react';
import { Card, SelectBox, SelectBoxItem, Text } from '@tremor/react';
import useProjects from 'swr/useProjects';

interface ProjectSelectorProps {
  onChange?: (projectId: string) => void;
}

const ProjectSelector: FC<ProjectSelectorProps> = ({ onChange }) => {
  const projects = useProjects();

  if (!projects.data) return <div>Loading...</div>;

  return (
    <Card>
      <Text>Projects</Text>
      <SelectBox onValueChange={(v) => onChange?.(v)}>
        {projects.data?.map((project) => (
          <SelectBoxItem
            key={project.id}
            value={project.id}
            text={project.name}
          />
        ))}
      </SelectBox>
    </Card>
  );
};

export default ProjectSelector;
