import useSWRImmutable from 'swr/immutable';
import { SWRKeys } from './keys';
import { fetchSpace } from './fetcher';
import { ChannelItemRecord, ChannelRecord, Issue } from './spaceTypes';
import useLocalCache from './useLocalCache';

export default function useSprintIssues(sprintIds: string[]) {
  const ids = [...sprintIds].sort();
  const cache = useLocalCache({ kind: 'Issue' });
  const channelCache = useLocalCache({ kind: 'Channel' });

  return useSWRImmutable<Issue[], unknown, [string, string[]] | null>(
    sprintIds.length > 0 ? [SWRKeys.BOARDS, ids] : null,
    ([_, sprintIds]) =>
      Promise.all(
        sprintIds.map((sprintId) =>
          fetchSpace({
            path: `/api/http/projects/planning/boards/sprints/id:${sprintId}/issues`,
            method: 'GET',
            query: {
              $fields:
                'data(id,archived,assignee(id,username),number,dueDate,creationTime,commentsCount,attachmentsCount,doneSubItemsCount,status(id,color,name,resolved),subItemsCount,title,channel(id,lastMessage(id,author(name),inThirdPerson,text,time),totalMessages,content),description,parents(id,number,title))',
            },
          })
            .then((r) => r.json())
            .then((r) => {
              const issues = r.data as Issue[];

              return issues;
            })
        )
      )
        .then((sprintTasks) => {
          const tasks = sprintTasks.flat();

          // Remove duplicates
          const uniqueTasks = tasks.reduce((acc, task) => {
            if (!acc.find((t) => t.id === task.id)) {
              acc.push(task);
            }
            return acc;
          }, [] as Issue[]);

          // Sort by task.creationTime.timestamp
          uniqueTasks.sort((a, b) => {
            return a.creationTime.timestamp - b.creationTime.timestamp;
          });

          return uniqueTasks;
        })
        .then(async (tasks) => {
          // Load Comments if not in cache
          await Promise.all(
            tasks.map((task) => updateTaskComments(task.channel, channelCache))
          );

          // Update Task Dates
          tasks.forEach((task) => {
            if (task.title.includes('PSQL Triggers to Sync Packages')) {
              // debugger;
            }
            const comments = task.channel._items as ChannelItemRecord[];
            const statusComments = comments.filter((c) =>
              c.text.startsWith('Status: ')
            );
            const reversedStatusComments = [...statusComments].reverse();

            // Use the latest Open -> InProgress comment since the task can be moved back to Open
            const openInProgress = reversedStatusComments.find((c) =>
              c.text.includes('-> In progress')
            );
            const inProgressReadyForReview = statusComments.find((c) =>
              c.text.includes('-> Ready for Review')
            );
            const readyForReviewDone = statusComments.find(
              (c) =>
                c.text.includes('-> Done') ||
                c.text.includes('-> Dev') ||
                c.text.includes('-> Production')
            );

            if (openInProgress) {
              task.inProgressDateTime = openInProgress.created;
            }

            if (inProgressReadyForReview) {
              task.readyForReviewDateTime = inProgressReadyForReview.created;
            }

            if (readyForReviewDone) {
              task.doneDateTime = readyForReviewDone.created;
            }

            // Finally, after all the updates, update the cache
            cache.updateCache(task.id, task);
          });

          return tasks;
        })
  );
}

async function updateTaskComments(
  channel: ChannelRecord,
  channelCache: ReturnType<typeof useLocalCache>
) {
  const _channel = channelCache.getCache(channel.id) as ChannelRecord;

  if (_channel && channel.totalMessages === _channel.totalMessages) {
    // No new comments
    // Load Comments from Cache
    console.info('Loaded Comments from Cache');
    channel._items = _channel._items;
    return;
  }

  const comments: ChannelItemRecord[] = [];
  let batchCount = 0;

  async function getCommentBatch(nextStartFromDate?: string) {
    const query = {
      channel: `id:${channel.id}`,
      sorting: 'FromOldestToNewest',
      batchSize: 50,
      $fields:
        'messages(text,id,created,archived,author(name)),nextStartFromDate,orgLimitReached',
      startFromDate: undefined as string | undefined,
    };

    if (nextStartFromDate) {
      query.startFromDate = nextStartFromDate;
    } else {
      delete query.startFromDate;
    }

    const response = await fetchSpace({
      path: `/api/http/chats/messages`,
      method: 'GET',
      query,
    });

    const data = await response.json();
    batchCount++;

    if (data.messages) {
      comments.push(...data.messages);
    }

    if (data.nextStartFromDate && data.messages.length >= 50) {
      // nextStartFromDate is always returned
      // If current response has less than 50 messages, it means we have reached the end

      if (batchCount > 10) {
        // Prevent infinite loop
        console.warn('Infinite Loop detected', channel.id);
        return;
      }
      await getCommentBatch(data.nextStartFromDate.iso);
    }
  }

  await getCommentBatch();

  channel._items = comments;
  channelCache.updateCache(channel.id, channel);

  return comments;
}
