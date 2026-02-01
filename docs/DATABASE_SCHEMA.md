# Schéma de Base de Données - Coach AI Hub

## Vue d'ensemble

Ce document décrit le schéma de base de données pour l'application Coach AI Hub.
La base de données est PostgreSQL, hébergée sur Neon Database, avec Prisma comme ORM.

## Diagramme ERD (Entity Relationship Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│   ┌───────────────────┐          ┌───────────────────────────────────────┐  │
│   │       USER        │          │            SUBSCRIPTION               │  │
│   ├───────────────────┤          ├───────────────────────────────────────┤  │
│   │ id           PK   │──────────│ userId            PK, FK              │  │
│   │ email        UQ   │    1:1   │ stripeCustomerId  UQ                  │  │
│   │ name              │          │ stripeSubscriptionId UQ               │  │
│   │ image             │          │ stripePriceId                         │  │
│   │ googleId     UQ   │          │ plan              ENUM                │  │
│   │ chatCredits       │          │ status            ENUM                │  │
│   │ createdAt         │          │ monthlyCredits                        │  │
│   │ updatedAt         │          │ creditsUsed                           │  │
│   └────────┬──────────┘          │ trialStartDate                        │  │
│            │                     │ trialEndDate                          │  │
│            │ 1:N                 │ currentPeriodStart                    │  │
│            │                     │ currentPeriodEnd                      │  │
│            ▼                     │ cancelAtPeriodEnd                     │  │
│   ┌───────────────────┐          │ createdAt                             │  │
│   │   CHAT_SESSION    │          │ updatedAt                             │  │
│   ├───────────────────┤          └───────────────────────────────────────┘  │
│   │ id           PK   │                                                     │
│   │ userId       FK   │                                                     │
│   │ title             │                                                     │
│   │ createdAt         │                                                     │
│   │ updatedAt         │                                                     │
│   └────────┬──────────┘                                                     │
│            │                                                                │
│            │ 1:N                                                            │
│            ▼                                                                │
│   ┌───────────────────┐                                                     │
│   │     MESSAGE       │                                                     │
│   ├───────────────────┤                                                     │
│   │ id           PK   │                                                     │
│   │ chatSessionId FK  │                                                     │
│   │ role         ENUM │                                                     │
│   │ content      TEXT │                                                     │
│   │ metadata     JSON │                                                     │
│   │ createdAt         │                                                     │
│   └───────────────────┘                                                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Entités

### 1. User (users)

Représente un utilisateur de l'application.

| Champ | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Identifiant unique |
| email | String | Email (unique) |
| name | String? | Nom de l'utilisateur |
| image | String? | URL de la photo de profil Google |
| googleId | String? | ID Google OAuth (unique) |
| chatCredits | Int | Crédits de chat restants (défaut: 5) |
| createdAt | DateTime | Date de création |
| updatedAt | DateTime | Dernière mise à jour |

**Relations:**
- 1:1 avec Subscription
- 1:N avec ChatSession

### 2. Subscription (subscriptions)

Gère les abonnements Stripe des utilisateurs.

| Champ | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Identifiant unique |
| userId | String | FK vers User (unique) |
| stripeCustomerId | String? | ID client Stripe (unique) |
| stripeSubscriptionId | String? | ID abonnement Stripe (unique) |
| stripePriceId | String? | ID du prix Stripe |
| plan | SubscriptionPlan | Plan actuel (FREE, BASIC, PREMIUM) |
| status | SubscriptionStatus | Statut (TRIAL, ACTIVE, CANCELED, EXPIRED, PAST_DUE) |
| monthlyCredits | Int | Crédits mensuels selon le plan |
| creditsUsed | Int | Crédits utilisés ce mois |
| trialStartDate | DateTime? | Début période d'essai |
| trialEndDate | DateTime? | Fin période d'essai |
| currentPeriodStart | DateTime? | Début période actuelle |
| currentPeriodEnd | DateTime? | Fin période actuelle |
| cancelAtPeriodEnd | Boolean | Annulation à la fin de période |
| createdAt | DateTime | Date de création |
| updatedAt | DateTime | Dernière mise à jour |

**Enums:**
- `SubscriptionPlan`: FREE, BASIC, PREMIUM
- `SubscriptionStatus`: TRIAL, ACTIVE, CANCELED, EXPIRED, PAST_DUE

### 3. ChatSession (chat_sessions)

Représente une conversation/session de chat.

| Champ | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Identifiant unique |
| userId | String | FK vers User |
| title | String | Titre de la conversation |
| createdAt | DateTime | Date de création |
| updatedAt | DateTime | Dernière mise à jour |

**Index:** userId (pour requêtes rapides)

### 4. Message (messages)

Stocke les messages individuels.

| Champ | Type | Description |
|-------|------|-------------|
| id | String (CUID) | Identifiant unique |
| chatSessionId | String | FK vers ChatSession |
| role | MessageRole | Rôle (USER, ASSISTANT, SYSTEM) |
| content | Text | Contenu du message |
| metadata | Json? | Métadonnées (tokens, etc.) |
| createdAt | DateTime | Date de création |

**Enum:**
- `MessageRole`: USER, ASSISTANT, SYSTEM

**Index:** chatSessionId (pour requêtes rapides)

## Plans d'Abonnement

| Plan | Crédits/mois | Prix | Fonctionnalités |
|------|--------------|------|-----------------|
| FREE | 5 | 0€ | 5 messages/mois, historique limité |
| BASIC | 50 | 9.99€ | 50 messages/mois, historique complet, support prioritaire |
| PREMIUM | Illimité | 19.99€ | Messages illimités, toutes les fonctionnalités |

## Période d'Essai

- Durée: 3 jours
- Crédits: 5 messages
- Automatiquement créée à l'inscription

## Cascade Delete

- User → Subscription: Suppression en cascade
- User → ChatSession: Suppression en cascade
- ChatSession → Message: Suppression en cascade

## Commandes Prisma

```bash
# Générer le client Prisma
npx prisma generate

# Créer une migration
npx prisma migrate dev --name init

# Appliquer les migrations en production
npx prisma migrate deploy

# Visualiser la base de données
npx prisma studio
```
