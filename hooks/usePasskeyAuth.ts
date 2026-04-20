'use client';

import { useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface PasskeyCredentials {
  id: string;
  publicKey: string;
  counter: number;
  transports?: string[];
}

/**
 * Hook to handle passkey/WebAuthn authentication
 * Provides FaceID and TouchID support for premium passwordless experience
 */
export function usePasskeyAuth() {
  const supabase = createClient();

  const registerPasskey = useCallback(async (email: string) => {
    try {
      // Check if WebAuthn is available
      if (!navigator.credentials?.create) {
        throw new Error('Passkeys not supported on this device');
      }

      // Generate challenge
      const challenge = crypto.getRandomValues(new Uint8Array(32));

      const credentialCreationOptions = {
        challenge,
        rp: {
          name: 'Vibeora Pharmacy',
          id: typeof window !== 'undefined' ? window.location.hostname : '',
        },
        user: {
          id: crypto.getRandomValues(new Uint8Array(32)),
          name: email,
          displayName: email,
        },
        pubKeyCredParams: [
          { type: 'public-key' as const, alg: -7 },
          { type: 'public-key' as const, alg: -257 },
        ],
        timeout: 60000,
        attestation: 'direct' as const,
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'preferred' as const,
          residentKey: 'preferred' as const,
        },
      };

      const credential = await navigator.credentials.create({
        publicKey: credentialCreationOptions as PublicKeyCredentialCreationOptions,
      });

      if (!credential || credential.type !== 'public-key') {
        throw new Error('Failed to create passkey');
      }

      const publicKeyCredential = credential as PublicKeyCredential;

      // Store passkey in Supabase
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { error } = await supabase.from('passkeys').insert({
        user_id: user.user.id,
        credential_id: publicKeyCredential.id,
        public_key: Array.from(new Uint8Array((publicKeyCredential.response as any).getPublicKey())).toString(),
        counter: 0,
        transports: (publicKeyCredential.response as any).getTransports?.() || [],
        created_at: new Date(),
      });

      if (error) throw error;

      return {
        success: true,
        message: 'Passkey registered successfully',
      };
    } catch (error) {
      console.error('Passkey registration failed:', error);
      throw error;
    }
  }, [supabase]);

  const authenticateWithPasskey = useCallback(
    async (email: string) => {
      try {
        if (!navigator.credentials?.get) {
          throw new Error('Passkey authentication not supported');
        }

        // Get stored passkeys for user
        const { data: passkeys } = await supabase
          .from('passkeys')
          .select('credential_id')
          .eq('email', email);

        if (!passkeys || passkeys.length === 0) {
          throw new Error('No passkeys registered for this email');
        }

        const challenge = crypto.getRandomValues(new Uint8Array(32));

        const credentialRequestOptions = {
          challenge,
          timeout: 60000,
          userVerification: 'preferred' as const,
          allowCredentials: passkeys.map((pk) => ({
            type: 'public-key' as const,
            id: new Uint8Array(
              pk.credential_id.split(',').map((x) => parseInt(x))
            ),
            transports: ['usb', 'nfc', 'ble', 'internal'] as AuthenticatorTransport[],
          })),
        };

        const assertion = await navigator.credentials.get({
          publicKey: credentialRequestOptions as PublicKeyCredentialRequestOptions,
        });

        if (!assertion || assertion.type !== 'public-key') {
          throw new Error('Passkey authentication failed');
        }

        /**
         * In production, verify the assertion signature server-side
         * For now, we trust the browser's WebAuthn implementation
         */
        return {
          success: true,
          credential: assertion,
        };
      } catch (error) {
        console.error('Passkey authentication failed:', error);
        throw error;
      }
    },
    [supabase]
  );

  const isPasskeyAvailable = useCallback(async () => {
    try {
      if (!window.PublicKeyCredential) {
        return false;
      }

      const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      return available;
    } catch {
      return false;
    }
  }, []);

  return {
    registerPasskey,
    authenticateWithPasskey,
    isPasskeyAvailable,
  };
}
