FROM debian:latest

# Allow the workspace folder name to be provided at build time so the
# WORKDIR inside the image matches the mounted path (/workspaces/<name>).
ARG LOCAL_WORKSPACE_FOLDER=workspace
ENV LOCAL_WORKSPACE_FOLDER=${LOCAL_WORKSPACE_FOLDER}

EXPOSE 8080

# Use the provided workspace folder name for WORKDIR
WORKDIR /workspaces/${LOCAL_WORKSPACE_FOLDER}

# Install dependencies
RUN apt-get update && apt-get install -y \
    git \
    gh \
    python3