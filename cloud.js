import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, sendEmailVerification, sendPasswordResetEmail, updateProfile, reload, getIdToken, GoogleAuthProvider, linkWithPopup, unlink, signOut as firebaseSignOut } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js';
import { getFirestore, collection, doc, getDocs, getDoc, setDoc, writeBatch } from 'https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js';

const config = window.AY_FIREBASE_CONFIG;
const actionSettings = { url: 'https://ssuheyyo.github.io/ay-atlasi/' };
const cloud = { status: config?.apiKey && config?.projectId ? 'loading' : 'unconfigured', user: null, error: '', message };
window.AyCloud = cloud;
let auth, db, activeUid = null, muted = false, syncing = null, dirtyWhileMuted = false;
function update(status, error = '') { cloud.status = status; cloud.error = error; window.refreshAyState?.(); }
function message(error) {
  const code = error?.code || '';
  const map = {
    'auth/email-already-in-use': 'Bu e-posta zaten kayıtlı. Giriş yapmayı dene.',
    'auth/invalid-email': 'Geçerli bir e-posta yaz.',
    'auth/invalid-credential': 'E-posta veya şifre hatalı.',
    'auth/wrong-password': 'E-posta veya şifre hatalı.',
    'auth/user-not-found': 'Bu e-postayla hesap bulunamadı.',
    'auth/weak-password': 'Daha güçlü bir şifre seç.',
    'auth/too-many-requests': 'Çok fazla deneme yapıldı. Bir süre sonra tekrar dene.',
    'auth/network-request-failed': 'İnternet bağlantısını kontrol et.',
    'auth/unauthorized-domain': 'Bu site Firebase yetkili alan adlarına eklenmemiş.',
    'auth/popup-blocked': 'Tarayıcı Google penceresini engelledi. Açılır pencerelere izin verip tekrar dene.',
    'auth/popup-closed-by-user': 'Google penceresi kapatıldı. İstersen yeniden deneyebilirsin.',
    'auth/operation-not-allowed': 'Google ile doğrulama henüz etkin değil.',
    'auth/credential-already-in-use': 'Bu Google hesabı başka bir Ay Atlası hesabına bağlı. Destek almadan hesapları birleştirme.',
    'auth/account-exists-with-different-credential': 'Bu Google adresi farklı bir giriş yöntemiyle kayıtlı. Hesapları birleştirmeden önce destek al.',
    'auth/provider-already-linked': 'Google hesabı zaten bağlı. Doğrulamayı yenile.',
    'permission-denied': 'Bulut erişimi reddedildi. E-postanı doğruladığından emin ol.',
    'unavailable': 'Bulut şu anda kullanılamıyor. Yerel kayıtların duruyor.'
  };
  return map[code] || error?.message || 'İşlem tamamlanamadı.';
}
function paths(uid) { return { items: collection(db, 'users', uid, 'items'), settings: doc(db, 'users', uid, 'meta', 'settings') }; }
async function syncNow() {
  if (syncing) return syncing;
  syncing = (async () => {
    const user = auth?.currentUser;
    if (!user) throw Error('Önce giriş yap.');
    const ensureCurrent = () => { if (auth.currentUser?.uid !== user.uid) throw Error('Oturum değişti. Yeniden giriş yap.'); };
    await reload(user);
    ensureCurrent();
    cloud.user = user;
    if (!user.emailVerified) { update('verify'); throw Error('Önce e-posta adresini doğrula.'); }
    await getIdToken(user, true);
    ensureCurrent();
    if (activeUid !== user.uid) { activeUid = user.uid; window.setAyStorageUser(user.uid); await window.refreshAyState?.(); }
    update('syncing'); muted = true;
    try {
      const local = await window.localApi('export');
      const path = paths(user.uid);
      const [remoteItemsSnapshot, remoteSettingsSnapshot] = await Promise.all([getDocs(path.items), getDoc(path.settings)]);
      ensureCurrent();
      const localMap = new Map(local.items.map(item => [item.id, item]));
      const remoteItems = remoteItemsSnapshot.docs.map(d => d.data());
      const remoteMap = new Map(remoteItems.map(item => [item.id, item]));
      const upload = local.items.filter(item => !remoteMap.has(item.id) || (item.updated || 0) > (remoteMap.get(item.id).updated || 0));
      const download = remoteItems.filter(item => !localMap.has(item.id) || (item.updated || 0) > (localMap.get(item.id).updated || 0));
      for (let i = 0; i < upload.length; i += 400) {
        ensureCurrent();
        const batch = writeBatch(db);
        for (const item of upload.slice(i, i + 400)) batch.set(doc(path.items, item.id), item);
        await batch.commit();
      }
      ensureCurrent();
      if (download.length) await window.localApi('import', { format: 'ay-atlasi-1', items: download });
      const remoteSettings = remoteSettingsSnapshot.exists() ? remoteSettingsSnapshot.data() : null;
      if (!remoteSettings || (local.settingsUpdated || 0) > (remoteSettings.updated || 0)) {
        await setDoc(path.settings, { settings: local.settings, updated: local.settingsUpdated || Date.now() });
      } else if ((remoteSettings.updated || 0) > (local.settingsUpdated || 0)) {
        await window.localApi('replace_settings', remoteSettings);
      }
      ensureCurrent();
      update('ready');
    } catch (error) { if (auth.currentUser?.uid === user.uid) update('error', message(error)); throw error; }
    finally { muted = false; }
  })().catch(error => {
    if (auth?.currentUser?.emailVerified && cloud.status !== 'error') update('error', message(error));
    throw error;
  }).finally(() => {
    syncing = null;
    if (dirtyWhileMuted && auth?.currentUser?.emailVerified) {
      dirtyWhileMuted = false;
      queueMicrotask(() => syncNow().catch(() => {}));
    }
  });
  return syncing;
}
cloud.syncNow = syncNow;
cloud.signup = async (email, password, name) => {
  const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
  if (name?.trim()) await updateProfile(result.user, { displayName: name.trim().slice(0, 40) });
  await sendEmailVerification(result.user, actionSettings);
  cloud.user = result.user; update('verify');
};
cloud.login = async (email, password) => { await signInWithEmailAndPassword(auth, email.trim(), password); };
cloud.loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  cloud.user = result.user;
  await syncNow();
};
cloud.resetPassword = async email => { await sendPasswordResetEmail(auth, email.trim(), actionSettings); };
let lastVerificationSent = 0;
cloud.resendVerification = async () => {
  if (!auth.currentUser) throw Error('Önce giriş yap.');
  if (Date.now() - lastVerificationSent < 60_000) throw Error('Doğrulama isteği yeni gönderildi. Bir dakika sonra tekrar deneyebilirsin.');
  await sendEmailVerification(auth.currentUser, actionSettings);
  lastVerificationSent = Date.now();
};
cloud.verifyWithGoogle = async () => {
  const current = auth?.currentUser;
  if (!current?.email?.toLowerCase().endsWith('@gmail.com')) throw Error('Bu seçenek aynı Gmail adresiyle kullanılabilir.');
  if (current.providerData.some(x => x.providerId === 'google.com')) {
    await syncNow();
    return;
  }
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ login_hint: current.email, prompt: 'select_account' });
  const result = await linkWithPopup(current, provider);
  const linkedEmail = result.user.providerData.find(x => x.providerId === 'google.com')?.email;
  if (linkedEmail?.toLowerCase() !== current.email.toLowerCase()) {
    await unlink(result.user, 'google.com');
    throw Error('Lütfen hesap açarken kullandığın Gmail adresini seç.');
  }
  await reload(result.user);
  cloud.user = result.user;
  if (!result.user.emailVerified) { update('verify'); throw Error('Google hesabı bağlandı; e-posta henüz doğrulanmış görünmüyor.'); }
  await syncNow();
};
cloud.refreshVerification = async () => { if (!auth.currentUser) throw Error('Önce giriş yap.'); await syncNow(); };
cloud.signOut = async () => { await firebaseSignOut(auth); activeUid = null; window.setAyStorageUser(null); cloud.user = null; update('guest'); };
cloud.importGuest = async () => {
  if (!auth.currentUser?.emailVerified || !activeUid) throw Error('Önce doğrulanmış hesaba giriş yap.');
  const guest = window.peekAyGuestData?.(), items = (guest?.items || []).filter(item => ['birth_profile', 'tarot_reading', 'daily_card'].includes(item.kind));
  if (!items.length) return;
  muted = true;
  try { await window.localApi('import', { format: 'ay-atlasi-1', items }); }
  finally { muted = false; }
  await syncNow();
};
window.addEventListener('ay-data-change', async event => {
  if (muted) { if (['item', 'settings'].includes(event.detail?.type)) dirtyWhileMuted = true; return; }
  if (!auth?.currentUser?.emailVerified || activeUid !== auth.currentUser.uid) return;
  try {
    const detail = event.detail, path = paths(activeUid);
    if (detail.type === 'item') await setDoc(doc(path.items, detail.item.id), detail.item);
    else if (detail.type === 'settings') await setDoc(path.settings, { settings: detail.settings, updated: detail.updated });
    else if (detail.type === 'import') await syncNow();
  } catch (error) { update('error', message(error)); }
});
window.addEventListener('online', () => { if (auth?.currentUser?.emailVerified) syncNow().catch(() => {}); });
if (cloud.status === 'unconfigured') update('unconfigured');
else {
  try {
    const app = initializeApp(config);
    auth = getAuth(app); auth.languageCode = 'tr';
    db = getFirestore(app);
    onAuthStateChanged(auth, async user => {
      cloud.user = user;
      if (user?.emailVerified) { try { await syncNow(); } catch (_) {} }
      else { activeUid = null; window.setAyStorageUser(null); update(user ? 'verify' : 'guest'); }
    }, error => update('error', message(error)));
  } catch (error) { update('error', message(error)); }
}
