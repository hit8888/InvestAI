import { SlideArtifactContent, SlideImageArtifactContent, VideoArtifactContent } from '../types/artifact';
import { ArtifactMessageContent, ArtifactMessageContentSchema } from '../types/webSocketData';

class ArtifactManager {
  private artifact: ArtifactMessageContent;

  constructor(artifact: ArtifactMessageContent) {
    const validatedArtifact = this.validateArtifact(artifact);
    this.artifact = validatedArtifact;
  }

  validateArtifact(artifact: ArtifactMessageContent) {
    if (artifact.artifact_type === 'FORM') return artifact;

    const validatedArtifact = ArtifactMessageContentSchema.safeParse(artifact);

    if (!validatedArtifact.success) {
      console.error('Artifact validation failed:', validatedArtifact.error.errors, artifact);
      return artifact;
    }

    return validatedArtifact.data;
  }

  getArtifactId() {
    return this.artifact.artifact_data.artifact_id;
  }

  getArtifactType() {
    return this.artifact.artifact_type;
  }

  //Refactor this code to use different methods
  getArtifactContent() {
    return this.artifact.content;
  }

  getArtifactMetaData() {
    return this.artifact.artifact_data.metadata;
  }

  getArtifactTitle() {
    switch (this.artifact.artifact_type) {
      case 'SLIDE':
        return (this.artifact.artifact_data.content as SlideArtifactContent).title;

      case 'SLIDE_IMAGE':
        return (this.artifact.artifact_data.content as SlideImageArtifactContent).title;

      case 'VIDEO':
        return (this.artifact.artifact_data.content as VideoArtifactContent).title;

      default:
        return '';
    }
  }

  getArtifactDescription() {
    switch (this.artifact.artifact_type) {
      case 'SLIDE':
        return (this.artifact.artifact_data.content as SlideArtifactContent).title;

      case 'SLIDE_IMAGE':
        return (this.artifact.artifact_data.content as SlideImageArtifactContent).description;

      case 'VIDEO':
        return (this.artifact.artifact_data.content as VideoArtifactContent).description;

      default:
        return '';
    }
  }
}

export default ArtifactManager;
