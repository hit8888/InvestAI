import { ArtifactSchema } from "@meaku/core/types/artifact";
import { Artifact } from "@meaku/core/types/chat";


//TODO: Krishna Add test for methods in ArtifactManager.Figure ou error bounday in case of error
class ArtifactManager {
  private artifact: Artifact;

  constructor(artifact: Artifact) {
    const validatedArtifact = this.validateArtifact(artifact);
    this.artifact = validatedArtifact;
  }

  private validateArtifact(artifact: Artifact) {
    const validatedArtifact = ArtifactSchema.safeParse(artifact);

    if (!validatedArtifact.success) {
      throw new Error(
        validatedArtifact.error.errors.map((error) => error.message).join(", "),
      );
    }

    return validatedArtifact.data;
  }

  getArtifactId() {
    return this.artifact.artifact_id;
  }

  getArtifactType() {
    return this.artifact.artifact_type;
  }

  //Refactor this code to use different mehods
  getArtifactContent() {
    const artifactType = this.getArtifactType();
    return artifactType === "VIDEO"
      ? this.artifact.video_url
      : this.artifact.content;
  }
}

export default ArtifactManager;
