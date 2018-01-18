export const HELP_OFFERED = 'helpOffered'
export const HELP_WANTED = 'helpWanted'
const VALID_TYPES = [HELP_OFFERED, HELP_WANTED]

export function isValidPostType (postType) {
  return VALID_TYPES.includes(postType)
}

