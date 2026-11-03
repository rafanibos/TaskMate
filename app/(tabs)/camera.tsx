import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import { useCallback, useRef, useState } from 'react';
import {
  CameraView,
  CameraType,
  useCameraPermissions,
} from 'expo-camera';
import {
  Camera,
  CameraOff,
  RefreshCw,
  Check,
  X,
  SwitchCamera,
  Trash2,
  ImagePlus,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { Colors, Radius, Spacing } from '@/constants/theme';

const PHOTOS_KEY = 'taskmate:photos';

interface SavedPhoto {
  id: string;
  uri: string;
  createdAt: string;
}

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [capturing, setCapturing] = useState(false);
  const [savedPhotos, setSavedPhotos] = useState<SavedPhoto[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadPhotos();
    }, []),
  );

  const loadPhotos = async () => {
    try {
      const raw = await AsyncStorage.getItem(PHOTOS_KEY);
      const list: SavedPhoto[] = raw ? JSON.parse(raw) : [];
      setSavedPhotos(list);
    } catch {
      setSavedPhotos([]);
    }
  };

  const persistPhotos = async (list: SavedPhoto[]) => {
    setSavedPhotos(list);
    await AsyncStorage.setItem(PHOTOS_KEY, JSON.stringify(list));
  };

  const takePicture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const result = await cameraRef.current.takePictureAsync({
        quality: 0.7,
      });
      setPhoto(result.uri);
    } catch {
      Alert.alert('Gagal', 'Tidak dapat mengambil foto. Coba lagi.');
    } finally {
      setCapturing(false);
    }
  };

  const retake = () => setPhoto(null);

  const savePhoto = async () => {
    if (!photo) return;
    const newPhoto: SavedPhoto = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      uri: photo,
      createdAt: new Date().toISOString(),
    };
    const updated = [newPhoto, ...savedPhotos];
    await persistPhotos(updated);
    setPhoto(null);
    Alert.alert('Tersimpan', 'Foto berhasil disimpan ke galeri tugas.');
  };

  const deletePhoto = async (id: string) => {
    const updated = savedPhotos.filter((p) => p.id !== id);
    await persistPhotos(updated);
  };

  const flipCamera = () =>
    setFacing((f) => (f === 'back' ? 'front' : 'back'));

  // ===== Permission not loaded =====
  if (!permission) {
    return (
      <View style={styles.center}>
        <Text style={styles.muted}>Memeriksa izin kamera...</Text>
      </View>
    );
  }

  // ===== Permission denied =====
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <View style={styles.deniedIcon}>
          <CameraOff size={40} color={Colors.neutral[400]} />
        </View>
        <Text style={styles.deniedTitle}>Akses Kamera Diperlukan</Text>
        <Text style={styles.deniedDesc}>
          TaskMate butuh izin kamera untuk memotret tugas atau catatan tangan.
        </Text>
        <Pressable style={styles.grantBtn} onPress={requestPermission}>
          <Text style={styles.grantBtnLabel}>Berikan Izin</Text>
        </Pressable>
      </View>
    );
  }

  // ===== Preview captured photo (retake or save) =====
  if (photo) {
    return (
      <View style={styles.flex}>
        <View style={styles.previewHeader}>
          <Text style={styles.previewTitle}>Pratinjau Foto</Text>
        </View>
        <View style={styles.previewWrap}>
          <Image source={{ uri: photo }} style={styles.previewImage} />
        </View>
        <View style={styles.previewActions}>
          <Pressable style={styles.previewBtnDanger} onPress={retake}>
            <RefreshCw size={20} color={Colors.error[600]} />
            <Text style={styles.previewBtnDangerLabel}>Ambil Ulang</Text>
          </Pressable>
          <Pressable style={styles.previewBtnPrimary} onPress={savePhoto}>
            <Check size={20} color="#fff" />
            <Text style={styles.previewBtnPrimaryLabel}>Simpan</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ===== Camera view =====
  return (
    <View style={styles.flex}>
      <View style={styles.cameraHeader}>
        <Text style={styles.cameraHeaderTitle}>Kamera Tugas</Text>
        <Text style={styles.cameraHeaderSub}>
          Potret tugas atau catatan tulisan tangan
        </Text>
      </View>

      <View style={styles.cameraWrap}>
        <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
          <Pressable style={styles.flipBtn} onPress={flipCamera}>
            <SwitchCamera size={22} color="#fff" />
          </Pressable>
        </CameraView>
      </View>

      <View style={styles.captureRow}>
        <View style={styles.captureSpacer} />
        <Pressable
          onPress={takePicture}
          disabled={capturing}
          style={styles.captureBtn}
        >
          {capturing ? (
            <View style={styles.captureInnerWhite} />
          ) : null}
        </Pressable>
        <View style={styles.captureSpacer} />
      </View>

      {savedPhotos.length > 0 ? (
        <View style={styles.gallery}>
          <Text style={styles.galleryTitle}>
            Foto Tersimpan ({savedPhotos.length})
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {savedPhotos.map((p) => (
              <View key={p.id} style={styles.galleryItem}>
                <Image source={{ uri: p.uri }} style={styles.galleryImage} />
                <Pressable
                  style={styles.galleryDelete}
                  onPress={() => deletePhoto(p.id)}
                >
                  <Trash2 size={14} color="#fff" />
                </Pressable>
              </View>
            ))}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.galleryEmpty}>
          <ImagePlus size={22} color={Colors.neutral[400]} />
          <Text style={styles.galleryEmptyText}>
            Belum ada foto. Potret tugas untuk menyimpan di sini.
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.neutral[50] },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  muted: {
    fontSize: 14,
    color: Colors.neutral[500],
  },
  deniedIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  deniedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral[900],
    marginBottom: 6,
  },
  deniedDesc: {
    fontSize: 14,
    color: Colors.neutral[500],
    textAlign: 'center',
    marginBottom: Spacing.lg,
    lineHeight: 21,
  },
  grantBtn: {
    backgroundColor: Colors.primary[600],
    paddingVertical: 14,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.md,
  },
  grantBtnLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  cameraHeader: {
    padding: Spacing.lg,
    paddingTop: Spacing.lg + 6,
    paddingBottom: Spacing.sm,
  },
  cameraHeaderTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  cameraHeaderSub: {
    fontSize: 13,
    color: Colors.neutral[500],
    marginTop: 2,
  },
  cameraWrap: {
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.neutral[200],
    backgroundColor: '#000',
  },
  camera: {
    height: 380,
    width: '100%',
  },
  flipBtn: {
    position: 'absolute',
    right: 14,
    top: 14,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(15,23,42,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.md,
  },
  captureSpacer: { width: 50 },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInnerWhite: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary[600],
  },
  previewHeader: {
    padding: Spacing.lg,
    paddingTop: Spacing.lg + 6,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral[900],
  },
  previewWrap: {
    flex: 1,
    marginHorizontal: Spacing.lg,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: Spacing.md,
  },
  previewImage: {
    flex: 1,
    resizeMode: 'contain',
  },
  previewActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.lg,
    paddingBottom: Spacing.lg + 70,
  },
  previewBtnDanger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs + 2,
    paddingVertical: 14,
    borderRadius: Radius.md,
    backgroundColor: Colors.error[50],
    borderWidth: 1,
    borderColor: Colors.error[300],
  },
  previewBtnDangerLabel: {
    color: Colors.error[600],
    fontWeight: '600',
    fontSize: 15,
  },
  previewBtnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs + 2,
    paddingVertical: 14,
    borderRadius: Radius.md,
    backgroundColor: Colors.primary[600],
  },
  previewBtnPrimaryLabel: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  gallery: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.lg + 70,
  },
  galleryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral[700],
    marginBottom: Spacing.sm,
  },
  galleryItem: {
    marginRight: Spacing.sm,
    position: 'relative',
  },
  galleryImage: {
    width: 88,
    height: 88,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.neutral[200],
  },
  galleryDelete: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(239,68,68,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  galleryEmpty: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
    gap: Spacing.xs,
  },
  galleryEmptyText: {
    fontSize: 13,
    color: Colors.neutral[500],
    textAlign: 'center',
  },
});
