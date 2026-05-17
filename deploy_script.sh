#!/bin/bash
# Redéploiement complet en une commande

PROJECT_ID="projet-faneva"
CLUSTER_NAME="cluster-faneva"
ZONE="europe-west1-b"

echo "=== Création du cluster ==="
gcloud container clusters create $CLUSTER_NAME \
  --zone=$ZONE \
  --project=$PROJECT_ID \
  --addons=HttpLoadBalancing \
  --num-nodes=2 \
  --machine-type=e2-medium \
  --enable-autoscaling \
  --min-nodes=2 \
  --max-nodes=3

echo "=== Connexion kubectl ==="
gcloud container clusters get-credentials $CLUSTER_NAME \
  --zone=$ZONE \
  --project=$PROJECT_ID

echo "=== Création node pool scalable ==="
gcloud container node-pools create pool-scalable \
  --cluster=$CLUSTER_NAME \
  --zone=$ZONE \
  --machine-type=n1-standard-1 \
  --num-nodes=0 \
  --enable-autoscaling \
  --min-nodes=0 \
  --max-nodes=3 \
  --project=$PROJECT_ID

echo "=== Déploiement Kubernetes ==="
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/mongodb/
kubectl apply -f k8s/auth-service/
kubectl apply -f k8s/task-service/
kubectl apply -f k8s/frontend/
kubectl apply -f k8s/ingress/

echo "=== Attente des pods ==="
kubectl rollout status deployment/auth-service -n collab-tasks
kubectl rollout status deployment/task-service -n collab-tasks
kubectl rollout status deployment/frontend -n collab-tasks

echo "=== IP publique ==="
kubectl get ingress -n collab-tasks

echo "=== Terminé ==="