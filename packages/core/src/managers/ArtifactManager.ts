import { ArtifactSchema } from "../types/artifact";
import {
  ArtifactResponse,
  DemoArtifactType,
  SlideArtifactType,
} from "../types/chat";

//TODO: Krishna Add test for methods in ArtifactManager.Figure ou error bounday in case of error
class ArtifactManager {
  private artifact: ArtifactResponse;

  constructor(artifact: ArtifactResponse) {
    const validatedArtifact = this.validateArtifact(artifact);
    this.artifact = validatedArtifact;
  }

  private validateArtifact(artifact: ArtifactResponse) {
    const validatedArtifact = ArtifactSchema.safeParse(artifact);

    if (!validatedArtifact.success) {
      console.log(validatedArtifact.error.errors);

      throw new Error(
        validatedArtifact.error.errors.map((error) => error.message).join(", ")
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
    return this.artifact.content;
  }

  getArtifactTitle() {
    switch (this.artifact.artifact_type) {
      case "DEMO":
        return (this.artifact.content as DemoArtifactType).features[0].frames[0]
          .frame_name;

      case "SLIDE":
        return (this.artifact.content as SlideArtifactType).title;

      default:
        return "";
    }
  }

  getArtifactDescription() {
    switch (this.artifact.artifact_type) {
      case "DEMO":
        return (this.artifact.content as DemoArtifactType).features[0].frames[0]
          .frame_description;

      default:
        return "";
    }
  }
}

export default ArtifactManager;
