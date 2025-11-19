import type { BlueprintDocument } from '@shared';

export interface DocumentTreeNode {
  title: string;
  key: string;
  isLeaf: boolean;
  children?: DocumentTreeNode[];
  document: BlueprintDocument;
}
