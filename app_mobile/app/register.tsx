import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { authAPI } from '@/services/api';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await authAPI.register({ name, email, password });
      if (result && result.success) {
        Alert.alert('Registro exitoso', 'Usuario registrado correctamente', [
          { text: 'OK', onPress: () => router.replace('/login') }
        ]);
      } else {
        setError(result.message || 'Error al registrar usuario');
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <ThemedView style={styles.container}>
        {/* Header con icono de planta */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="leaf" size={48} color="#4CAF50" />
          </View>
          <ThemedText type="title" style={styles.title}>PlantApp</ThemedText>
          <ThemedText style={styles.subtitle}>Únete a nuestra comunidad verde</ThemedText>
        </View>

        {/* Formulario */}
        <View style={styles.formContainer}>
          <ThemedText style={styles.welcomeText}>Crear cuenta</ThemedText>
          
          {/* Input de Nombre */}
          <View style={styles.inputContainer}>
            <Ionicons name="person" size={20} color="#81C784" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Nombre completo"
              placeholderTextColor="#A5D6A7"
              value={name}
              onChangeText={setName}
            />
          </View>

          {/* Input de Email */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#81C784" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#A5D6A7"
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          {/* Input de Contraseña */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#81C784" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#A5D6A7"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Mensaje de error */}
          {error && (
            <View style={styles.errorContainer}>
              <ThemedText style={styles.errorText}>{error}</ThemedText>
            </View>
          )}

          {/* Botón de Registro */}
          <TouchableOpacity 
            style={[styles.button, styles.registerButton]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Registrarse</ThemedText>
            )}
          </TouchableOpacity>

          {/* Botón de Volver al Login */}
          <TouchableOpacity 
            style={[styles.button, styles.loginButton]}
            onPress={() => router.replace('/login')}
            disabled={loading}
          >
            <ThemedText style={styles.loginButtonText}>Ya tengo cuenta</ThemedText>
          </TouchableOpacity>
        </View>

        {/* Footer decorativo */}
        <View style={styles.footer}>
          <View style={styles.leafDecoration}>
            <Ionicons name="leaf" size={16} color="#C8E6C9" />
            <Ionicons name="leaf" size={16} color="#C8E6C9" style={{ marginLeft: 8 }} />
            <Ionicons name="leaf" size={16} color="#C8E6C9" style={{ marginLeft: 8 }} />
          </View>
        </View>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
  },
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
    backgroundColor: '#fff',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F1F8F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 3,
    borderColor: '#C8E6C9',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#66BB6A',
    fontWeight: '500',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1B5E20',
    marginBottom: 32,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: '#C8E6C9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: '#1B5E20',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#E53935',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
    textAlign: 'center',
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  registerButton: {
    backgroundColor: '#4CAF50',
    marginTop: 16,
  },
  loginButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  loginButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 32,
  },
  leafDecoration: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});