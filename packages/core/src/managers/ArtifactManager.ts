import { ArtifactSchema } from "../types/artifact";
import {
  ArtifactResponse,
  FormArtifactContent,
  SlideArtifactContent,
  SlideImageArtifactContent,
  SuggestionArtifactContent,
  VideoArtifactContent,
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
  getArtifactContent():
    | SlideImageArtifactContent
    | SlideArtifactContent
    | VideoArtifactContent
    | FormArtifactContent
    | SuggestionArtifactContent {
    return this.artifact.content;
  }

  getArtifactMetaData() {
    return this.artifact.metadata;
  }

  getArtifactTitle() {
    switch (this.artifact.artifact_type) {
      case "SLIDE":
        return (this.artifact.content as SlideArtifactContent).title;

      case "SLIDE_IMAGE":
        return (this.artifact.content as SlideImageArtifactContent).title;

      case "VIDEO":
        return (this.artifact.content as VideoArtifactContent).title;

      default:
        return "";
    }
  }

  getArtifactDescription() {
    switch (this.artifact.artifact_type) {
      case "SLIDE":
        return (this.artifact.content as SlideArtifactContent).title;

      case "SLIDE_IMAGE":
        return (this.artifact.content as SlideImageArtifactContent).description;

      case "VIDEO":
        return (this.artifact.content as VideoArtifactContent).description;

      default:
        return "";
    }
  }
}

export default ArtifactManager;
