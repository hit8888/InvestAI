import { ArtifactSchema } from "../types/artifact";
import {
  ArtifactResponse,
  DemoArtifactType,
  SlideArtifactType,
  SlideImageArtifactType,
  VideoArtifactType,
} from "@meaku/core/types/chat";

//TODO: Krishna Add test for methods in ArtifactManager.Figure ou error bounday in case of error
class ArtifactManager {
  private artifact: ArtifactResponse;

  constructor(artifact: ArtifactResponse) {
    const validatedArtifact = this.validateArtifact(artifact);
    this.artifact = validatedArtifact;
  }

  private validateArtifact(artifact: ArtifactResponse) {
    if (artifact.artifact_type === "FORM") return artifact;

    const validatedArtifact = ArtifactSchema.safeParse(artifact);

    if (!validatedArtifact.success) {
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

  //Refactor this code to use different methods
  getArtifactContent() {
    return this.artifact.content;
  }

  getArtifactMetaData() {
    return this.artifact.metadata;
  }

  getArtifactTitle() {
    switch (this.artifact.artifact_type) {
      case "DEMO":
        return (this.artifact.content as DemoArtifactType).features[0]
          .feature_name;

      case "SLIDE":
        return (this.artifact.content as SlideArtifactType).title;

      case "SLIDE_IMAGE":
        return (this.artifact.content as SlideImageArtifactType).title;

      case "VIDEO":
        return (this.artifact.content as VideoArtifactType).title;

      default:
        return "";
    }
  }

  getArtifactDescription() {
    switch (this.artifact.artifact_type) {
      case "DEMO":
        return (this.artifact.content as DemoArtifactType).features[0]
          .feature_description;

      // TODO: Add description when backend adds it to the schema
      case "SLIDE":
        return (this.artifact.content as SlideArtifactType).title;

      case "SLIDE_IMAGE":
        return (this.artifact.content as SlideImageArtifactType).description;

      case "VIDEO":
        return (this.artifact.content as VideoArtifactType).description;

      default:
        return "";
    }
  }
}

export default ArtifactManager;
