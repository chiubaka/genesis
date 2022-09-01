export interface DockerComposeConfig {
  services: Record<string, DockerComposeService>;
}

export interface DockerComposeService {
  container_name?: string;
  image: string;
  ports?: string[];
  volumes?: string[];
}
