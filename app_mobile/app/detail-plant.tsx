import { View, ScrollView, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { useLocalSearchParams, useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
import { Image } from 'expo-image';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function DetailPlanScreen() {
  const params = useLocalSearchParams();
  const [specimen, setSpecimen] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.url) {
      console.log('Fetching specimen data from URL:', params.url);
      fetch(params.url as string)
        .then(res => res.json())
        .then(data => {
           console.log(data);
          if (data.success && data.data && data.data.specimen) {
            setSpecimen(data.data.specimen);
            console.log(data.data.specimen);
          } else {
            setSpecimen(null);
          }
        })
        .catch(() => setSpecimen(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [params.url]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ThemedText>Cargando datos...</ThemedText>
      </View>
    );
  }

  if (!specimen) {
    return (
      <View style={styles.center}>
        <ThemedText>No hay datos para mostrar.</ThemedText>
      </View>
    );
  }

  const { 
    taxonomy, 
    images, 
    decimalLatitude, 
    decimalLongitude, 
    scientificName, 
    catalogNumber, 
    locality, 
    recordedBy,
    identifiedBy,
    eventDate,
    country,
    stateProvince,
    occurrenceID,
    institutionCode,
    rightsHolder
  } = specimen;

  const API_BASE_URL = 'http://192.168.110.51:3000'; // Ajusta según tu backend

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Sin información';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-EC', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const router = useRouter();

  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={22} color="#2E7D32" />
          <ThemedText style={styles.backButtonText}>Regresar</ThemedText>
        </TouchableOpacity>
      {/* Título principal */}
      <ThemedText type="title" style={styles.title}>
        {taxonomy?.scientificName || scientificName}
      </ThemedText>

      
      {taxonomy?.scientificNameAuthorship && (
        <ThemedText style={styles.authorship}>
          {taxonomy.scientificNameAuthorship}
        </ThemedText>
      )}

      {/* Imagen */}
      {images && images[0] && (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `${API_BASE_URL}${images[0].url}` }}
            style={styles.image}
            contentFit="cover"
          />
        </View>
      )}

      {/* Taxonomía */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Clasificación Taxonómicaa
        </ThemedText>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Reino:</ThemedText>
          <ThemedText>{taxonomy?.kingdom || 'Sin información'}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Filo:</ThemedText>
          <ThemedText>{taxonomy?.phylum || 'Sin información'}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Clase:</ThemedText>
          <ThemedText>{taxonomy?.class || 'Sin información'}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Orden:</ThemedText>
          <ThemedText>{taxonomy?.order || 'Sin información'}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Familia:</ThemedText>
          <ThemedText>{taxonomy?.family || 'Sin información'}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Género:</ThemedText>
          <ThemedText>{taxonomy?.genus || 'Sin información'}</ThemedText>
        </View>
        {taxonomy?.specificEpithet && (
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Epíteto específico:</ThemedText>
            <ThemedText>{taxonomy.specificEpithet}</ThemedText>
          </View>
        )}
        {taxonomy?.vernacularName && (
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Nombre común:</ThemedText>
            <ThemedText>{taxonomy.vernacularName}</ThemedText>
          </View>
        )}
      </View>

      {/* Información del espécimen */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Información del Espécimen
        </ThemedText>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Número de catálogo:</ThemedText>
          <ThemedText>{catalogNumber}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>ID de ocurrencia:</ThemedText>
          <ThemedText>{occurrenceID}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Institución:</ThemedText>
          <ThemedText>{institutionCode}</ThemedText>
        </View>
      </View>

      {/* Información de colecta */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Datos de Colecta
        </ThemedText>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Fecha:</ThemedText>
          <ThemedText>{formatDate(eventDate)}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Colectado por:</ThemedText>
          <ThemedText>{recordedBy || 'Sin información'}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Identificado por:</ThemedText>
          <ThemedText>{identifiedBy || 'Sin información'}</ThemedText>
        </View>
      </View>

      {/* Localización */}
      <View style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Localización
        </ThemedText>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>País:</ThemedText>
          <ThemedText>{country}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Provincia:</ThemedText>
          <ThemedText>{stateProvince}</ThemedText>
        </View>
        <View style={styles.infoRow}>
          <ThemedText style={styles.label}>Localidad:</ThemedText>
          <ThemedText style={styles.localityText}>{locality}</ThemedText>
        </View>
        {decimalLatitude && decimalLongitude && (
          <View style={styles.infoRow}>
            <ThemedText style={styles.label}>Coordenadas:</ThemedText>
            <ThemedText>
              {parseFloat(decimalLatitude).toFixed(6)}, {parseFloat(decimalLongitude).toFixed(6)}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Mapa */}
      {decimalLatitude && decimalLongitude && (
        <View style={styles.section}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>
            Ubicación en el Mapa
          </ThemedText>
          <View style={styles.mapContainer}>
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: parseFloat(decimalLatitude),
                longitude: parseFloat(decimalLongitude),
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={{
                  latitude: parseFloat(decimalLatitude),
                  longitude: parseFloat(decimalLongitude),
                }}
                title={taxonomy?.scientificName || scientificName}
                description={locality}
              />
            </MapView>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => 
                Linking.openURL(`https://maps.google.com/?q=${decimalLatitude},${decimalLongitude}`)
              }
            >
              <ThemedText style={styles.mapButtonText}>
                Abrir en Google Maps
              </ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Derechos */}
      {rightsHolder && (
        <View style={styles.footer}>
          <ThemedText style={styles.footerText}>
            Titular de derechos: {rightsHolder}
          </ThemedText>
        </View>
      )}
    </ScrollView>
    </SafeAreaView>
    
  );
}

const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(46,125,50,0.08)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    marginTop: 4,
  },
  backButtonText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
container: {
    backgroundColor: '#F1F8E9',
    padding: 16,
},
scrollContent: {
    padding: 16,
    paddingBottom: 40,
},
 
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  authorship: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 16,
  },
  imageContainer: { 
    marginVertical: 16, 
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  section: {
    marginVertical: 12,
    padding: 16,
    backgroundColor: 'rgba(46, 125, 50, 0.05)',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#2E7D32',
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 4,
    gap: 8,
  },
  label: {
    fontWeight: '600',
    minWidth: 140,
  },
  localityText: {
    flex: 1,
  },
  mapContainer: { 
    marginTop: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    width: '100%',
    height: 250,
  },
  mapButton: {
    backgroundColor: '#2E7D32',
    padding: 14,
    alignItems: 'center',
  },
  mapButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  footerText: {
    fontSize: 12,
    opacity: 0.6,
    textAlign: 'center',
  },
});