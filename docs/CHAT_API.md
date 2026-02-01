# API Chat - Coach AI Hub

## Vue d'ensemble

L'API Chat permet aux utilisateurs d'interagir avec le coach IA. Elle gère les sessions de conversation, l'envoi de messages, et le décompte des crédits.

## Endpoints

### Sessions de Chat

#### GET /api/chat/sessions
Récupérer toutes les sessions d'un utilisateur.

**Query Parameters:**
- `userId` (requis): ID de l'utilisateur

**Response:**
```json
{
  "sessions": [
    {
      "id": "session_id",
      "title": "Ma conversation",
      "lastMessage": "Aperçu du dernier message...",
      "messageCount": 10,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T12:30:00Z"
    }
  ]
}
```

#### POST /api/chat/sessions
Créer une nouvelle session de chat.

**Request:**
```json
{
  "userId": "user_id",
  "title": "Titre optionnel"
}
```

**Response:**
```json
{
  "session": {
    "id": "new_session_id",
    "title": "Nouvelle conversation",
    "createdAt": "2024-01-15T10:00:00Z"
  }
}
```

#### GET /api/chat/sessions/[sessionId]
Récupérer une session avec tous ses messages.

**Response:**
```json
{
  "session": {
    "id": "session_id",
    "title": "Ma conversation",
    "createdAt": "2024-01-15T10:00:00Z",
    "updatedAt": "2024-01-15T12:30:00Z",
    "messages": [
      {
        "id": "msg_1",
        "role": "USER",
        "content": "Bonjour !",
        "createdAt": "2024-01-15T10:00:00Z"
      },
      {
        "id": "msg_2",
        "role": "ASSISTANT",
        "content": "Bonjour ! Comment puis-je t'aider ?",
        "createdAt": "2024-01-15T10:00:05Z"
      }
    ]
  }
}
```

#### PATCH /api/chat/sessions/[sessionId]
Mettre à jour le titre d'une session.

**Request:**
```json
{
  "title": "Nouveau titre"
}
```

#### DELETE /api/chat/sessions/[sessionId]
Supprimer une session et tous ses messages.

---

### Envoi de Messages

#### POST /api/chat/send
Envoyer un message et recevoir une réponse de l'IA.

**Request:**
```json
{
  "userId": "user_id",
  "sessionId": "session_id (optionnel)",
  "message": "Mon message au coach"
}
```

**Response (succès):**
```json
{
  "sessionId": "session_id",
  "userMessage": {
    "id": "msg_user_id",
    "role": "USER",
    "content": "Mon message au coach",
    "createdAt": "2024-01-15T10:00:00Z"
  },
  "assistantMessage": {
    "id": "msg_assistant_id",
    "role": "ASSISTANT",
    "content": "Réponse du coach IA...",
    "createdAt": "2024-01-15T10:00:02Z"
  },
  "remainingCredits": 4
}
```

**Response (crédits insuffisants - 402):**
```json
{
  "error": "Crédits insuffisants",
  "code": "NO_CREDITS",
  "message": "Vous avez épuisé vos crédits de chat. Passez à un abonnement supérieur pour continuer."
}
```

---

### Historique

#### GET /api/chat/history
Récupérer l'historique complet des conversations.

**Query Parameters:**
- `userId` (requis): ID de l'utilisateur
- `limit` (optionnel): Nombre max de sessions

**Response:**
```json
{
  "history": [
    {
      "id": "session_id",
      "title": "Conversation récente",
      "preview": "Aperçu du contenu...",
      "messageCount": 15,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-01-15T12:30:00Z"
    }
  ],
  "stats": {
    "totalSessions": 5,
    "totalMessages": 47
  }
}
```

---

### Statistiques Utilisateur

#### GET /api/user/stats
Obtenir les statistiques de l'utilisateur.

**Query Parameters:**
- `userId` (requis): ID de l'utilisateur

**Response:**
```json
{
  "stats": {
    "totalChats": 5,
    "totalMessages": 47,
    "remainingCredits": 3,
    "plan": "BASIC",
    "status": "ACTIVE"
  }
}
```

---

## Gestion des Crédits

### Logique de décompte

1. **Avant l'envoi** : Vérification des crédits disponibles
2. **Après la réponse IA** : Décompte d'1 crédit
3. **Premium** : Pas de décompte (illimité)

### Crédits par plan

| Plan | Crédits/mois |
|------|-------------|
| FREE | 5 |
| BASIC | 50 |
| PREMIUM | Illimité |

### Code de vérification

```typescript
// Vérifier les crédits
const hasCredits = await UserService.hasCredits(userId);
if (!hasCredits) {
  // Retourner erreur 402
}

// Après succès, décrémenter
await UserService.decrementCredits(userId);
```

---

## Configuration OpenAI

### Variables d'environnement

```env
OPENAI_API_KEY="sk-..."
```

### Modèle utilisé

- **Modèle**: `gpt-4o-mini`
- **Max tokens**: 1000
- **Temperature**: 0.7

### Prompt système

Le coach IA est configuré avec un prompt système qui définit :
- Son rôle de coach en séduction et développement personnel
- Son style de communication empathique
- Ses règles éthiques (pas de manipulation, respect mutuel)

---

## Exemples d'utilisation

### Démarrer une conversation

```bash
curl -X POST http://localhost:3000/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "message": "Bonjour, j'\''ai besoin de conseils pour améliorer ma confiance en moi"
  }'
```

### Continuer une conversation

```bash
curl -X POST http://localhost:3000/api/chat/send \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user123",
    "sessionId": "session456",
    "message": "Comment puis-je me sentir plus à l'\''aise dans les situations sociales ?"
  }'
```

### Récupérer l'historique

```bash
curl "http://localhost:3000/api/chat/history?userId=user123&limit=10"
```

---

## Codes d'erreur

| Code | Description |
|------|-------------|
| 400 | Paramètres manquants ou invalides |
| 402 | Crédits insuffisants |
| 403 | Session non autorisée |
| 404 | Session non trouvée |
| 500 | Erreur serveur |
