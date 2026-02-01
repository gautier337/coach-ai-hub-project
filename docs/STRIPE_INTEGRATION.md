# Intégration Stripe - Coach AI Hub

## Configuration

### 1. Créer un compte Stripe
1. Aller sur https://dashboard.stripe.com
2. Créer un compte ou se connecter

### 2. Obtenir les clés API
Dans le Dashboard Stripe → Developers → API Keys :
- **Publishable key** (pk_test_...) → `STRIPE_PUBLISHABLE_KEY`
- **Secret key** (sk_test_...) → `STRIPE_SECRET_KEY`

### 3. Créer les produits et prix
Dans Stripe Dashboard → Products :

**Plan Basique (9.99€/mois)**
```
Nom: Coach AI - Basique
Prix: 9.99€/mois (récurrent)
→ Copier l'ID du prix (price_...) → STRIPE_PRICE_BASIC
```

**Plan Premium (19.99€/mois)**
```
Nom: Coach AI - Premium
Prix: 19.99€/mois (récurrent)
→ Copier l'ID du prix (price_...) → STRIPE_PRICE_PREMIUM
```

### 4. Configurer le Webhook
Dans Stripe Dashboard → Developers → Webhooks :

1. Ajouter un endpoint
2. URL: `https://votre-domaine.com/api/stripe/webhook`
3. Sélectionner les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
4. Copier le Signing secret → `STRIPE_WEBHOOK_SECRET`

### 5. Variables d'environnement
```env
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_BASIC="price_..."
STRIPE_PRICE_PREMIUM="price_..."
```

## Endpoints API

### POST /api/stripe/checkout
Créer une session de paiement.

**Request:**
```json
{
  "userId": "user_id",
  "plan": "BASIC" | "PREMIUM"
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

### POST /api/stripe/portal
Créer une session du portail client Stripe.

**Request:**
```json
{
  "userId": "user_id"
}
```

**Response:**
```json
{
  "url": "https://billing.stripe.com/..."
}
```

### POST /api/stripe/cancel
Annuler un abonnement à la fin de la période.

**Request:**
```json
{
  "userId": "user_id"
}
```

### POST /api/stripe/reactivate
Réactiver un abonnement annulé.

**Request:**
```json
{
  "userId": "user_id"
}
```

### POST /api/stripe/webhook
Endpoint pour les webhooks Stripe (automatique).

### GET /api/subscription
Obtenir les informations d'abonnement.

**Request:** `?userId=user_id`

**Response:**
```json
{
  "subscription": {
    "plan": "BASIC",
    "status": "ACTIVE",
    "remainingCredits": 45,
    "currentPeriodEnd": "2024-02-01T00:00:00Z"
  },
  "planDetails": {
    "name": "Basique",
    "credits": 50,
    "price": 9.99
  }
}
```

## Cycle de vie de l'abonnement

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   TRIAL     │────▶│   ACTIVE    │────▶│  CANCELED   │
│  (3 jours)  │     │             │     │ (fin période)│
└─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   EXPIRED   │◀────│  PAST_DUE   │     │   EXPIRED   │
│             │     │  (paiement) │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Plans disponibles

| Plan | Crédits/mois | Prix | Description |
|------|-------------|------|-------------|
| FREE | 5 | 0€ | Plan gratuit avec essai |
| BASIC | 50 | 9.99€ | Plan standard |
| PREMIUM | Illimité | 19.99€ | Accès complet |

## Période d'essai
- Durée: 3 jours
- Crédits: 5 messages
- Passage automatique à EXPIRED si pas d'abonnement

## Test en local

### 1. Installer Stripe CLI
```bash
brew install stripe/stripe-cli/stripe
```

### 2. Se connecter
```bash
stripe login
```

### 3. Écouter les webhooks
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 4. Tester le checkout
```bash
curl -X POST http://localhost:3000/api/stripe/checkout \
  -H "Content-Type: application/json" \
  -d '{"userId": "test_user_id", "plan": "BASIC"}'
```

## Sécurité

- Les clés secrètes ne doivent **jamais** être exposées côté client
- Toujours vérifier la signature des webhooks
- Utiliser HTTPS en production
- Les métadonnées Stripe contiennent le `userId` pour lier les paiements
