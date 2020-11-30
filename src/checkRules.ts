import isEqual from 'lodash.isequal';
import { RuleError, warn } from './error';
import { Config, DocJSON, ErrorHandling, ParsedComment, Rule, TemplateStrictness } from './types';

export function validate (doc: DocJSON, config: Config): boolean {
  const rules = config?.template?.rules;
  const strictness = config?.template?.strictness;
  const ruleCheck = rules ? checkRules(doc?.data, rules) : {} as any;
  const errorHandling = config?.template?.errorHandling;

  const isError = ruleCheck[strictness] || !!ruleCheck.forbiddenTags?.length;

  // Log errors
  if (ruleCheck.forbiddenTags?.length) {
    const uniqueForbidden = Array.from(new Set(ruleCheck.forbiddenTags));
    const uniqueRules = Array.from(new Set(rules.map(r => r.tag)));

    warn(`
  • Found forbidden tags: ${uniqueForbidden.map(tag => `"${tag}"`).join(', ')}.
  > Allowed tags are ${uniqueRules?.map(ruleTag => `"${ruleTag}"`)?.join(', ')}.
    `);
  }

  // Stop here if errors exist
  if (isError) {
    // Strict warnings
    if (strictness === TemplateStrictness.Strict) {
      warn(`
  • Order of the tags is invalid: ${ruleCheck.tagsOrder?.map(tag => `"${tag}"`).join(', ')}.
  > The order must be following: ${ruleCheck.rulesOrder?.map(ruleTag => `"${ruleTag}"`)?.join(', ')}.
      `);
    }

    // Ignore order warnings
    if (strictness === TemplateStrictness.IgnoreOrder) {
      warn(`
  • Tags didn't match rules: ${ruleCheck.tagsOrder?.map(tag => `"${tag}"`).join(', ')}.
  > Following tags are required to be defined: ${ruleCheck.rulesOrder?.map(ruleTag => `"${ruleTag}"`)?.join(', ')}.
      `);
    }

    // If error handling is ERROR, do not generate doc
    if ((errorHandling ?? ErrorHandling.Error) === ErrorHandling.Error) {
      throw new RuleError('Documents not generated due to the validation errors. For more info, see warnings above.')
    }
  }

  return isError;
}

export function checkRules (docData: ParsedComment[], rules: Rule[]) {
  const mandatoryRulesOrder = rules?.filter(rule => rule.mandatory).map(rule => rule.tag);

  const docTags = docData.map(tag => tag.tag);

  const forbiddenTags = [];

  // Find doc tags mandatory order
  const mandatoryRules = [...mandatoryRulesOrder || []];
  const mandatoryDocTagsOrder = docTags.reduce((docTagsOrder, next) => {
    const index = mandatoryRules.indexOf(next);
    if (index < 0) {
      return docTagsOrder;
    }

    mandatoryRules.splice(index, 1);
    docTagsOrder.push(next);

    return docTagsOrder;
  }, []);

  // Check some other rules
  docTags.forEach(docTag => {
    const ruleIndex = rules?.findIndex(rule => rule.tag === docTag);
    const rule = rules[ruleIndex];

    // Forbidden rule check
    if (!rule) {
      return forbiddenTags.push(docTag);
    }
  });

  return {
    [TemplateStrictness.Strict]: !isEqual(mandatoryRulesOrder, mandatoryDocTagsOrder),
    [TemplateStrictness.IgnoreOrder]: !isEqual([...(mandatoryRulesOrder || [])].sort(), [...(mandatoryDocTagsOrder || [])].sort()),
    rulesOrder: mandatoryRulesOrder,
    tagsOrder: mandatoryDocTagsOrder,
    forbiddenTags,
  };
}
