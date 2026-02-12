package session

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"github.com/redis/go-redis/v9"
	"time"
)

type SessionManager interface {
	CreateSession(ctx context.Context, userID string) (string, error)
	GetSession(ctx context.Context, sessionID string) (string, error)
	Delete(ctx context.Context, sessionID string) error
	RefreshSession(ctx context.Context, sessionID string) error
}

type sessionManager struct {
	rdb           *redis.Client
	ttl           time.Duration
	sessionPrefix string
}

func NewSessionManager(rdb *redis.Client, ttl time.Duration, sessionPrefix string) SessionManager {
	return &sessionManager{
		rdb:           rdb,
		ttl:           ttl,
		sessionPrefix: sessionPrefix,
	}
}

func (sm *sessionManager) CreateSession(ctx context.Context, userID string) (string, error) {
	sessionID, err := generateSessionID()
	if err != nil {
		return "", err
	}
	key := sm.sessionPrefix + sessionID
	err = sm.rdb.Set(ctx, key, userID, sm.ttl).Err()
	if err != nil {
		return "", err
	}

	return sessionID, nil
}

func (sm *sessionManager) GetSession(ctx context.Context, sessionID string) (string, error) {
	key := sm.sessionPrefix + sessionID
	return sm.rdb.Get(ctx, key).Result()
}

func (sm *sessionManager) Delete(ctx context.Context, sessionID string) error {
	key := sm.sessionPrefix + sessionID
	return sm.rdb.Del(ctx, key).Err()
}

func (sm *sessionManager) RefreshSession(ctx context.Context, sessionID string) error {
	key := sm.sessionPrefix + sessionID
	return sm.rdb.Expire(ctx, key, sm.ttl).Err()
}

func generateSessionID() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}
