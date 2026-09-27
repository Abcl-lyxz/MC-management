import Docker from 'dockerode';

// Single Docker client; all container access goes through this module.
export const docker = new Docker();

export async function dockerPing(): Promise<unknown> {
  return docker.ping();
}
