import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';

const COLORS = {
  primary: '#2E7D32',
  secondary: '#66BB6A',
  background: '#F1F8E9',
  card: '#FFFFFF',
  textDark: '#1B5E20',
  textLight: '#558B2F',
  danger: '#C62828',
};

export default function ExploreScreen() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.multiRemove(['token', 'tokenType', 'user']);
    router.replace('/login');
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title" style={{ fontFamily: Fonts.rounded }}>
            Perfil
          </ThemedText>
        </ThemedView>

        {user ? (
          <ThemedView style={styles.card}>
            {/* Avatar */}
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {getInitials(user.name)}
              </ThemedText>
            </View>

            {/* Nombre */}
            <ThemedText type="subtitle" style={styles.name}>
              {user.name}
            </ThemedText>

            <ThemedText style={styles.email}>{user.email}</ThemedText>

            {/* Info */}
          

            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Institución</ThemedText>
              <ThemedText style={styles.value}>{user.institution}</ThemedText>
            </View>

            <View style={styles.infoRow}>
              <ThemedText style={styles.label}>Estado</ThemedText>
              <ThemedText
                style={[
                  styles.value,
                  { color: user.isActive ? COLORS.primary : COLORS.danger },
                ]}
              >
                {user.isActive ? 'Activo' : 'Inactivo'}
              </ThemedText>
            </View>

            {/* Logout */}
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <ThemedText style={styles.logoutText}>
                Cerrar sesión
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        ) : (
          <ThemedText style={{ padding: 16 }}>
            No hay datos de usuario.
          </ThemedText>
        )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F8E9',
    padding: 16,
  },

  headerImage: {
    height: 180,
    width: '100%',
    position: 'absolute',
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  name: {
    color: COLORS.textDark,
    marginTop: 4,
  },
  email: {
    color: COLORS.textLight,
    marginBottom: 20,
  },
  infoRow: {
    width: '100%',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  value: {
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '600',
  },
  logoutBtn: {
    marginTop: 24,
    width: '100%',
    backgroundColor: COLORS.danger,
    borderRadius: 12,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    padding: 14,
    fontWeight: 'bold',
  },
});
