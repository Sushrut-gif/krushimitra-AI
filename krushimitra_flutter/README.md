# KrushiMitra AI - Flutter Android App

This is the native Flutter Android wrapper for **KrushiMitra AI (कृषिमित्र AI)**.

## 📱 APK Build Output Location
When compiled with `flutter build apk --release`, the generated APK file is located at:
```bash
krushimitra_flutter/build/app/outputs/flutter-apk/app-release.apk
```

---

## 🛠️ How to Build the APK Locally
If you have Flutter, Java 17+, and the Android SDK installed on your machine:

```bash
cd krushimitra_flutter
flutter pub get
flutter build apk --release
```

After compilation finishes, your APK will be ready at:
`krushimitra_flutter/build/app/outputs/flutter-apk/app-release.apk`

---

## ☁️ Automated Cloud Build (Zero Setup on your Mac)
A GitHub Actions workflow is included at `.github/workflows/build-apk.yml`.
When you push to your GitHub repository (`https://github.com/Sushrut-gif/krushimitra-AI`):
1. Go to your repository on GitHub.
2. Click on the **Actions** tab.
3. Select **Build KrushiMitra Flutter APK**.
4. Once the build completes, download `krushimitra-release-apk.zip` from the **Artifacts** section!
