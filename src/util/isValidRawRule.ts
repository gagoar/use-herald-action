import { logger } from '../util/debug';
import { Rule, RuleActions, RuleMatchers } from '../rules';

const debug = logger('isValidRawRule');
export type RawRule = Rule & { users?: string[]; teams?: string[] };

const hasAttribute = <Attr extends string>(
  attr: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: Record<string, any>
): content is Record<Attr, string> => attr in content;

export const isValidRawRule = (content: unknown): content is RawRule => {
  if (typeof content !== 'object' || content === null) {
    return false;
  }

  const hasValidActionValues =
    hasAttribute<'action'>('action', content) && Object.keys(RuleActions).includes(content.action);

  const hasTeams = hasAttribute('teams', content) && Array.isArray(content.teams);
  const hasUsers = hasAttribute('users', content) && Array.isArray(content.users);
  const hasActors =
    hasTeams ||
    hasUsers ||
    (hasAttribute('customMessage', content) && !!content.customMessage && content.action === RuleActions.comment) ||
    (hasAttribute('labels', content) && !!content.labels && content.action === RuleActions.label) ||
    (hasAttribute('action', content) && content.action === RuleActions.status);
  const matchers = Object.keys(RuleMatchers).some((attr) => attr in content);

  debug('validation:', {
    rule: content,
    hasActors,
    hasValidActionValues,
    matchers,
  });

  return hasValidActionValues && hasActors && matchers;
};
