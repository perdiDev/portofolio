import type { NavItem } from '../layouts/FoundationLayout.astro';
import type { Project } from './posts';

/** Rail sections of a project page, in reading order. Optional ones appear only with content. */
export function projectSections(project: Project, relatedCount: number): NavItem[] {
  const d = project.data;
  return [
    { id: 'overview', label: 'Overview' },
    { id: 'screens', label: 'Screens' },
    { id: 'challenges', label: 'Challenges' },
    { id: 'learned', label: 'Learned' },
    ...(d.outcome ? [{ id: 'outcome', label: 'Outcome' }] : []),
    ...(relatedCount > 0 ? [{ id: 'related', label: 'Writing' }] : []),
  ];
}
