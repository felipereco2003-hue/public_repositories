import { Image } from 'expo-image';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { ThemedText } from '@/components/themed-text';
import { publicAPI, API_BASE_URL } from '@/services/api';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';


interface Stats {
  collection: string;
  statistics: {
    totalSpecimens: number;
    totalFamilies: number;
    totalGenera: number;
  };
}

interface QRData {
  url: string;
  catalogNumber: string;
  scientificName: string;
  family: string;
  locality: string;
  recordedBy: string;
  image: string;
}

const COLORS = {
  primary: '#2E7D32',
  secondary: '#66BB6A',
  accent: '#1B5E20',
  background: '#F1F8E9',
  card: '#FFFFFF',
  textDark: '#1B5E20',
  textLight: '#558B2F',
  border: '#C8E6C9',
  error: '#D32F2F',
};

export default function HomeScreen() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState<QRData | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const cameraRef = useRef<any>(null);
  const router = useRouter();

  useEffect(() => {
    publicAPI
      .getStats()
      .then((res) => setStats(res.data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    };
    fetchUser();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : (parts[0][0] + parts[1][0]).toUpperCase();
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      const parsed = JSON.parse(data);
      setQrData(parsed);
    } catch {
      setQrData(null);
    }

    setModalVisible(true);
    setShowCamera(false);
  };

  const handleOpenURL = async () => {
    if (qrData?.url) {
      const canOpen = await Linking.canOpenURL(qrData.url);
      if (canOpen) {
        await Linking.openURL(qrData.url);
      } else {
        alert('No se puede abrir este enlace');
      }
    }
  };



  const resetScanner = () => {
    setScanned(false);
    setQrData(null);
  };

  if (permission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!permission?.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <View style={styles.permissionCard}>
            <Ionicons name="camera" size={64} color={COLORS.primary} />
            <ThemedText type="subtitle" style={styles.permissionText}>
              Permisos de cámara necesarios
            </ThemedText>
            <ThemedText style={styles.permissionSubtext}>
              Para escanear códigos QR, necesitamos acceso a tu cámara
            </ThemedText>
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={requestPermission}
            >
              <ThemedText style={styles.primaryButtonText}>
                Otorgar permisos
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Bienvenida */}
        <View style={styles.welcomeContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <ThemedText style={styles.avatarText}>
                {getInitials(user?.name)}
              </ThemedText>
            </View>
          </View>
          <View style={styles.welcomeTextContainer}>
            <ThemedText style={styles.welcomeText}>Bienvenido</ThemedText>
            <ThemedText type="subtitle" style={styles.userName}>
              {user?.name || 'Visitante'}
            </ThemedText>
            
          </View>
        </View>

        {/* Estadísticas */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="stats-chart" size={20} color={COLORS.primary} />
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Estadísticas del Herbario
            </ThemedText>
          </View>
          
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator color={COLORS.primary} size="large" />
            </View>
          ) : (
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="leaf" size={24} color={COLORS.primary} />
                </View>
                <ThemedText style={styles.statValue}>
                  {stats?.statistics.totalSpecimens.toLocaleString()}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Plantas</ThemedText>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="people" size={24} color={COLORS.primary} />
                </View>
                <ThemedText style={styles.statValue}>
                  {stats?.statistics.totalFamilies.toLocaleString()}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Familias</ThemedText>
              </View>
              
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <Ionicons name="git-branch" size={24} color={COLORS.primary} />
                </View>
                <ThemedText style={styles.statValue}>
                  {stats?.statistics.totalGenera.toLocaleString()}
                </ThemedText>
                <ThemedText style={styles.statLabel}>Géneros</ThemedText>
              </View>
            </View>
          )}
        </View>

        {/* Botón de Escaneo */}
        <View style={styles.scanSection}>
          <View style={styles.scanCard}>
            <Ionicons name="qr-code" size={40} color={COLORS.primary} />
            <ThemedText type="subtitle" style={styles.scanTitle}>
              Escanear QR de planta
            </ThemedText>
            <ThemedText style={styles.scanDescription}>
              Escanea el código QR en las etiquetas de las plantas para ver información detallada
            </ThemedText>
            <TouchableOpacity
              style={styles.scanButton}
              onPress={() => {
                resetScanner();
                setShowCamera(true);
              }}
            >
              <Ionicons name="camera" size={22} color="#fff" />
              <ThemedText style={styles.scanButtonText}>
                Iniciar escaneo
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        
      </ScrollView>

      {/* Modal de Cámara */}
      <Modal 
        visible={showCamera} 
        animationType="slide"
        statusBarTranslucent
      >
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ['qr'],
            }}
          />
          
          {/* Marco de escaneo */}
          <View style={styles.scanFrame}>
            <View style={styles.cornerTopLeft} />
            <View style={styles.cornerTopRight} />
            <View style={styles.cornerBottomLeft} />
            <View style={styles.cornerBottomRight} />
            
            <ThemedText style={styles.scanInstruction}>
              Escanea el código QR dentro del marco
            </ThemedText>
          </View>
          
          {/* Controles de cámara */}
          <View style={styles.cameraControls}>
            <TouchableOpacity
              style={styles.closeCameraButton}
              onPress={() => setShowCamera(false)}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.cameraActions}>
              <TouchableOpacity
                style={styles.flashButton}
                onPress={() => cameraRef.current?.toggleTorch()}
              >
                <Ionicons name="flashlight" size={24} color="#fff" />
              </TouchableOpacity>
              
              {scanned && (
                <TouchableOpacity
                  style={styles.rescanButton}
                  onPress={() => setScanned(false)}
                >
                  <ThemedText style={styles.rescanButtonText}>
                    Escanear de nuevo
                  </ThemedText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Resultado QR */}
      <Modal 
        visible={modalVisible} 
        transparent 
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle" style={styles.modalTitle}>
                Resultado del escaneo
              </ThemedText>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={COLORS.textDark} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {qrData ? (
                <>
                  {qrData.image && (
                    <Image
                      source={{ uri: `${API_BASE_URL}${qrData.image}` }}
                      style={styles.modalImage}
                      contentFit="cover"
                      transition={300}
                    />
                  )}
                  
                  <View style={styles.qrDataContainer}>
                    <View style={styles.qrDataRow}>
                      <Ionicons name="barcode" size={18} color={COLORS.primary} />
                      <ThemedText style={styles.qrDataLabel}>Número de catálogo:</ThemedText>
                      <ThemedText style={styles.qrDataValue}>{qrData.catalogNumber}</ThemedText>
                    </View>
                    
                    <View style={styles.qrDataRow}>
                      <Ionicons name="leaf" size={18} color={COLORS.primary} />
                      <ThemedText style={styles.qrDataLabel}>Nombre científico:</ThemedText>
                      <ThemedText style={[styles.qrDataValue, styles.scientificName]}>
                        {qrData.scientificName}
                      </ThemedText>
                    </View>
                    
                    <View style={styles.qrDataRow}>
                      <Ionicons name="people" size={18} color={COLORS.primary} />
                      <ThemedText style={styles.qrDataLabel}>Familia:</ThemedText>
                      <ThemedText style={styles.qrDataValue}>{qrData.family}</ThemedText>
                    </View>
                    
                    <View style={styles.qrDataRow}>
                      <Ionicons name="location" size={18} color={COLORS.primary} />
                      <ThemedText style={styles.qrDataLabel}>Localidad:</ThemedText>
                      <ThemedText style={styles.qrDataValue}>{qrData.locality}</ThemedText>
                    </View>
                    
                    <View style={styles.qrDataRow}>
                      <Ionicons name="person" size={18} color={COLORS.primary} />
                      <ThemedText style={styles.qrDataLabel}>Registrado por:</ThemedText>
                      <ThemedText style={styles.qrDataValue}>{qrData.recordedBy}</ThemedText>
                    </View>
                  </View>
                </>
              ) : (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning" size={48} color={COLORS.error} />
                  <ThemedText style={styles.errorText}>
                    Código QR inválido
                  </ThemedText>
                  <ThemedText style={styles.errorSubtext}>
                    El código escaneado no contiene información válida
                  </ThemedText>
                </View>
              )}
            </ScrollView>
            
            <View style={styles.modalActions}>
              {qrData && qrData.url && (
                <TouchableOpacity
                  style={styles.urlButton}
                  onPress={() => {
                    router.push({
                      pathname: '/detail-plant',
                      params: { url: qrData.url }
                    });
                    setModalVisible(false);
                  }}
                >
                  <Ionicons name="open" size={20} color="#fff" />
                  <ThemedText style={styles.urlButtonText}>
                    Ver detalles completos
                  </ThemedText>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => setModalVisible(false)}
              >
                <ThemedText style={styles.secondaryButtonText}>
                  Cerrar
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.rescanModalButton}
                onPress={() => {
                  setModalVisible(false);
                  setTimeout(() => {
                    resetScanner();
                    setShowCamera(true);
                  }, 300);
                }}
              >
                <Ionicons name="camera" size={18} color={COLORS.primary} />
                <ThemedText style={styles.rescanModalButtonText}>
                  Escanear otro QR
                </ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionCard: {
    backgroundColor: COLORS.card,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  permissionText: {
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  permissionSubtext: {
    textAlign: 'center',
    marginBottom: 24,
    color: COLORS.textLight,
  },
  welcomeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  avatarContainer: {
    marginRight: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: 2,
  },
  userName: {
    color: COLORS.textDark,
    fontSize: 18,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    marginLeft: 8,
    color: COLORS.textDark,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  scanSection: {
    marginBottom: 24,
  },
  scanCard: {
    backgroundColor: COLORS.card,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scanTitle: {
    marginTop: 16,
    marginBottom: 8,
    color: COLORS.textDark,
  },
  scanDescription: {
    textAlign: 'center',
    color: COLORS.textLight,
    marginBottom: 24,
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    elevation: 3,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  scanButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  quickLinks: {
    flexDirection: 'row',
    gap: 12,
  },
  quickLink: {
    flex: 1,
    backgroundColor: COLORS.card,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  quickLinkText: {
    marginLeft: 8,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  scanFrame: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '80%',
    height: '40%',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#fff',
    borderTopLeftRadius: 16,
  },
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#fff',
    borderTopRightRadius: 16,
  },
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#fff',
    borderBottomLeftRadius: 16,
  },
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#fff',
    borderBottomRightRadius: 16,
  },
  scanInstruction: {
    color: '#fff',
    position: 'absolute',
    bottom: -40,
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    fontSize: 14,
  },
  cameraControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  closeCameraButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraActions: {
    alignItems: 'center',
  },
  flashButton: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  rescanButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  rescanButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: COLORS.card,
    borderRadius: 20,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    color: COLORS.textDark,
    fontSize: 18,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    maxHeight: 400,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  qrDataContainer: {
    padding: 20,
  },
  qrDataRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  qrDataLabel: {
    fontWeight: '600',
    color: COLORS.textDark,
    marginLeft: 8,
    marginRight: 4,
    fontSize: 14,
  },
  qrDataValue: {
    color: COLORS.textLight,
    fontSize: 14,
    flex: 1,
    flexWrap: 'wrap',
  },
  scientificName: {
    fontStyle: 'italic',
    fontWeight: '500',
    color: COLORS.accent,
  },
  errorContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    gap: 12,
  },
  urlButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  urlButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: COLORS.textDark,
    fontWeight: 'bold',
    fontSize: 16,
  },
  rescanModalButton: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  rescanModalButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
});