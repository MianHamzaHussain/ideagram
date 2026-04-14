import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/useAuthStore';
import type { User } from '@/api';

describe('useAuthStore', () => {
  beforeEach(() => {
    // Reset state before each test
    useAuthStore.setState({
      isAuthenticated: false,
      user: null,
      accessToken: null,
      refreshToken: null
    });
  });

  it('initially has no authentication', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBeNull();
  });

  it('updates state when setAuth is called', () => {
    const mockUser: User = {
      id: 1,
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      role: null,
      roleValue: null,
      phone: null
    };
    const mockAccess = 'access-token';
    const mockRefresh = 'refresh-token';

    useAuthStore.getState().setAuth(mockUser, mockAccess, mockRefresh);

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.accessToken).toBe(mockAccess);
    expect(state.refreshToken).toBe(mockRefresh);
  });

  it('clears state when logout is called', () => {
    useAuthStore.getState().setAuth({ id: 1 } as User, 'access', 'refresh');
    useAuthStore.getState().logout();

    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.accessToken).toBeNull();
    expect(state.user).toBeNull();
  });
});
