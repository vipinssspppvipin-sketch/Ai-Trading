const crypto = require('crypto');

function createSessionStore() {
  const sessions = new Map();

  function createSession(sessionData) {
    const sessionId = crypto.randomUUID();
    sessions.set(sessionId, {
      ...sessionData,
      createdAt: Date.now(),
      lastActiveAt: Date.now()
    });
    return sessionId;
  }

  function getSession(sessionId) {
    const session = sessions.get(sessionId);
    if (!session) return null;
    session.lastActiveAt = Date.now();
    return session;
  }

  function removeSession(sessionId) {
    sessions.delete(sessionId);
  }

  function listSessions() {
    return Array.from(sessions.entries()).map(([id, session]) => ({
      id,
      clientCode: session.clientCode,
      userName: session.userName,
      createdAt: session.createdAt,
      lastActiveAt: session.lastActiveAt
    }));
  }

  return { createSession, getSession, removeSession, listSessions };
}

module.exports = { createSessionStore };
