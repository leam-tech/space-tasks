export interface SpaceTime {
  timestamp: number;
  iso: string;
}

export interface SpaceDate {
  iso: string;
  year: number;
  month: number;
  day: number;
}

export interface Board {
  id: string;
  archived: boolean;
  name: string;

  from: SpaceDate;
  to: SpaceDate;
}

export interface Sprint {
  id: string;
  archived: boolean;
  board: Board;

  name: string;
  description: string;

  state: 'CLOSED' | 'CURRENT' | 'PLANNED';
  from: SpaceDate;
  to: SpaceDate;
}

export interface Project {
  id: string;
  name: string;
  private: boolean;
  icon: string;
  createdAt: SpaceTime;
  description: string;
  key: string;
}

export interface MemberProfile {
  id: string;
  username: string;
}

export interface IssueStatus {
  id: string;
  color: string;
  name: string;
  resolved: boolean;
}

export interface CPrincipal {
  name: string;
}

export interface MessageInfo {
  id: string;
  author: CPrincipal;
  inThirdPerson: boolean;
  text: string;
  time: number;
}

export type ChannelContentType =
  | 'M2ChannelIssueInfo'
  | 'SpaceNewsFeedChannel'
  | 'M2ChannelContentThread';

export interface ChannelItemRecord {
  id: string;
  author: CPrincipal;
  created: SpaceTime;
  text: string;
  archived: boolean;
}

export interface ChannelRecord {
  id: string;
  totalMessages: number;
  lastMessage: MessageInfo;
  content: {
    className: ChannelContentType;
  };

  _items?: ChannelItemRecord[];
}

export interface ParentIssue {
  id: string;
  number: number;
  title: string;
}

export interface Issue {
  id: string;
  number: number;
  archived: boolean;
  title: string;
  description: string;

  subItemsCount: number;
  doneSubItemsCount: number;
  attachmentsCount: number;
  commentsCount: number;
  creationTime: SpaceTime;
  dueDate: SpaceDate;
  channel: ChannelRecord;

  assignee: MemberProfile;
  status: IssueStatus;

  parents: ParentIssue[];

  // the Following fields are not available in the API
  inProgressDateTime?: SpaceTime;
  readyForReviewDateTime?: SpaceTime;
  doneDateTime?: SpaceTime;
}
