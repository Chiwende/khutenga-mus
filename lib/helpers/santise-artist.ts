export const sanitizeArtist = (artist: string) => {
  const _remove_underscore = artist.replaceAll('-', ' ');
  const _remove_hyphen = _remove_underscore.replaceAll('_', ' ');
  const lower_case = _remove_hyphen.toLowerCase();

  return lower_case;
};
