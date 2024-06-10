---
title: "Deployment for vedantkv.dev"
slug: kubernetes-deployment
datetime: 2024-06-22T16:13:06.242Z
draft: false
tags:
  - Kubernetes
  - Docker
  - CI-CD
  - GCP
ogImage: ""
---

In this blog post, I will walk you through the steps I took to deploy my application on a Kubernetes cluster using Google Kubernetes Engine (GKE). I'll cover the creation of a Docker image, hosting it on Docker Hub, setting up a Kubernetes cluster, and configuring the necessary files to make my application accessible over the internet with HTTPS.

## Creating a Docker Image

First, I created a Docker image of my application. I used a simple Dockerfile to define the environment and dependencies for my application. This Dockerfile specifies the base image, sets the working directory, copies the application files, installs the necessary packages, exposes the required port, and defines the command to run the application.

### `Dockerfile`
```sh
FROM node:18-alpine AS build-stage

WORKDIR /app

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

COPY package*.json ./

RUN npm install

COPY . .



EXPOSE 80

RUN npm run build

FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY default.conf /etc/nginx/conf.d/default.conf


CMD ["nginx", "-g", "daemon off;"]
```

## Setting Up a Kubernetes Cluster with GKE

Next, I set up a Kubernetes cluster using Google Kubernetes Engine (GKE). GKE simplifies the process of managing Kubernetes clusters and provides a robust environment for deploying applications.

To deploy my application on the Kubernetes cluster, I created two YAML files: one for the deployment and another for the service.

### `deployment.yaml`
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vedantrajkavi
spec:
  replicas: 1
  selector:
    matchLabels:
      app: vedantrajkavi
  template:
    metadata:
      labels:
        app: vedantrajkavi
    spec:
      containers:
      - name: vedantrajkavi-container
        image: vedant332/vedantx86:latest
        imagePullPolicy: Always  
        ports:
        - containerPort: 80

```
### `service.yaml`
```yaml
apiVersion: v1
kind: Service
metadata:
  name: vedantrajkavi
spec:
  selector:
    app: vedantrajkavi
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
  type: NodePort
```

The deployment file specifies the desired state of the application, including the Docker image to use and the number of replicas. The service file defines how the application will be exposed to the internet, allowing external traffic to reach the application.
With the deployment and service files ready, I applied these configurations to the Kubernetes cluster. After the deployment, I obtained an external IP address for my application, making it accessible from the internet.

## Setting Up HTTPS with Ingress and SSL

To ensure secure access to my application, I set up HTTPS by creating an Ingress resource and adding an SSL certificate.

### `ingress.yaml`
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: vedantrajkavi-ingress
  annotations:
    networking.gke.io/managed-certificates: new-vedantrajkavi-cert  
    kubernetes.io/ingress.allow-http: "false" 
spec:
  rules:
  - host: vedantkv.dev
    http:
      paths:
      - path: /*
        pathType: ImplementationSpecific
        backend:
          service:
            name: vedantrajkavi
            port:
              number: 80
  - host: www.vedantkv.dev
    http:
      paths:
      - path: /*
        pathType: ImplementationSpecific
        backend:
          service:
            name: vedantrajkavi
            port:
              number: 80

```

## Setting Up a CI/CD Pipeline with GitLab

To automate the deployment process, I set up a CI/CD pipeline using GitLab. This pipeline automates the building, testing, and deployment of my application whenever changes are pushed to the repository.

### `.gitlab-ci.yaml`

```yaml
image: docker:latest

services:
  - name: docker:dind
    
stages:
  - build-and-push-dh
  - install-gcloud-and-deploy-to-gke

variables:
  DOCKER_IMAGE: vedant332/vedantx86:$CI_COMMIT_SHORT_SHA
  GKE_CLUSTER:  vedantrajkavi-dev
  GKE_ZONE: us-east4-c	
  GKE_PROJECT: vedantrajkavi
  DEPLOYMENT_NAME: vedantrajkavi

build-and-push-to-dockerhub-job:
  stage: build-and-push-dh
  script:
    - echo "Building Image $DOCKER_HUB_URL"
    - docker build -t $DOCKER_IMAGE .
    - echo "Image Built"
    - echo "Pushing Image To DockerHub"
    - docker login -u $DOCKER_HUB_USERNAME -p $DOCKER_HUB_TOKEN
    - docker push $DOCKER_IMAGE
    - echo "Image pushed to DockerHub with SHA tag"
    - echo "Tagging image with latest and pushing to DockerHub"
    - docker tag $DOCKER_IMAGE vedant332/vedantx86:latest
    - docker push vedant332/vedantx86:latest
    - echo "Image tagged with latest and pushed to DockerHub"

install-gcloud-and-update-cluster-job:
  image: google/cloud-sdk:latest
  stage: install-gcloud-and-deploy-to-gke
  script:
    - echo $GCLOUD_SERVICE_KEY > ${HOME}/gcloud-service-key.json
    - gcloud auth activate-service-account --key-file=${HOME}/gcloud-service-key.json
    - gcloud config set project $GKE_PROJECT
    - gcloud config set compute/zone $GKE_ZONE
    - gcloud container clusters get-credentials $GKE_CLUSTER
    - echo "GCloud Installed and Configured"
    - echo "Deploying to GKE"
    - kubectl set image deployment/$DEPLOYMENT_NAME vedantrajkavi-container=$DOCKER_IMAGE
    - kubectl rollout restart deployment/$DEPLOYMENT_NAME
    - echo "Deployment updated and rollout restarted"
    - echo "Should Restart Deployment $DEPLOYMENT_NAME with Image $DOCKER_IMAGE"

```


By following these steps, I successfully deployed my application on a Kubernetes cluster, making it accessible over the internet with HTTPS. This process involved creating a Docker image, setting up a Kubernetes cluster on GKE, configuring deployment and service files, obtaining an external IP, setting up DNS and SSL for secure access, and automating the deployment with a CI/CD pipeline in GitLab. Now, my application is live and accessible at https://vedantkv.dev.

This deployment journey not only helped me understand the intricacies of Kubernetes and GKE but also highlighted the importance of proper configuration and security measures in modern application development. By leveraging these tools and techniques, I can ensure that my applications are scalable, reliable, and secure.