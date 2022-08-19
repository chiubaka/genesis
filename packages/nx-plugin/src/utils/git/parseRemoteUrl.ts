export function parseRemoteUrl(remoteUrl: string) {
  const colonIndex = remoteUrl.indexOf(":");
  const orgAndRepoPlusSuffix = remoteUrl.slice(colonIndex + 1);

  const suffixIndex = orgAndRepoPlusSuffix.lastIndexOf(".git");
  const orgAndRepo = orgAndRepoPlusSuffix.slice(0, suffixIndex);

  const slashIndex = orgAndRepo.lastIndexOf("/");
  const organization = orgAndRepo.slice(0, slashIndex);
  const repositoryName = orgAndRepo.slice(slashIndex + 1);

  return {
    organization,
    repositoryName,
  };
}
