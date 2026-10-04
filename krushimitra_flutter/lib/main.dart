import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:permission_handler/permission_handler.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Color(0xFF15803D), // Emerald 700
      statusBarIconBrightness: Brightness.light,
    ),
  );
  runApp(const KrushiMitraApp());
}

class KrushiMitraApp extends StatelessWidget {
  const KrushiMitraApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'KrushiMitra AI (कृषिमित्र)',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF15803D),
          primary: const Color(0xFF15803D),
        ),
        useMaterial3: true,
      ),
      home: const MainWebViewScreen(),
    );
  }
}

class MainWebViewScreen extends StatefulWidget {
  const MainWebViewScreen({super.key});

  @override
  State<MainWebViewScreen> createState() => _MainWebViewScreenState();
}

class _MainWebViewScreenState extends State<MainWebViewScreen> {
  late final WebViewController _controller;
  bool _isLoading = true;
  bool _isOffline = false;
  double _loadingProgress = 0.0;

  // The deployed app URL or local development URL
  // Default to the GitHub Pages / Vercel / Netlify host or local IP
  static const String appUrl = 'https://krushimitra.vercel.app'; // Replace with your live PWA link

  @override
  void initState() {
    super.initState();
    _requestAppPermissions();
    _initWebView();
    _checkConnectivity();
  }

  Future<void> _requestAppPermissions() async {
    await [
      Permission.camera,
      Permission.photos,
      Permission.storage,
    ].request();
  }

  Future<void> _checkConnectivity() async {
    final connectivityResult = await Connectivity().checkConnectivity();
    if (connectivityResult.contains(ConnectivityResult.none)) {
      setState(() => _isOffline = true);
    }

    Connectivity().onConnectivityChanged.listen((results) {
      if (results.contains(ConnectivityResult.none)) {
        setState(() => _isOffline = true);
      } else {
        if (_isOffline) {
          setState(() => _isOffline = false);
          _controller.reload();
        }
      }
    });
  }

  void _initWebView() {
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..setBackgroundColor(const Color(0xFFF8FAFC))
      ..setNavigationDelegate(
        NavigationDelegate(
          onProgress: (int progress) {
            setState(() {
              _loadingProgress = progress / 100.0;
            });
          },
          onPageStarted: (String url) {
            setState(() {
              _isLoading = true;
              _isOffline = false;
            });
          },
          onPageFinished: (String url) {
            setState(() {
              _isLoading = false;
            });
          },
          onWebResourceError: (WebResourceError error) {
            if (error.errorType == WebResourceErrorType.hostLookup ||
                error.errorType == WebResourceErrorType.connect) {
              setState(() {
                _isOffline = true;
                _isLoading = false;
              });
            }
          },
        ),
      )
      ..loadRequest(Uri.parse(appUrl));
  }

  @override
  Widget build(BuildContext context) {
    return PopScope(
      canPop: false,
      onPopInvokedWithResult: (didPop, result) async {
        if (didPop) return;
        if (await _controller.canGoBack()) {
          await _controller.goBack();
        } else {
          final shouldExit = await _showExitDialog(context);
          if (shouldExit && context.mounted) {
            SystemNavigator.pop();
          }
        }
      },
      child: Scaffold(
        backgroundColor: const Color(0xFFF8FAFC),
        body: SafeArea(
          child: Stack(
            children: [
              if (!_isOffline)
                RefreshIndicator(
                  color: const Color(0xFF15803D),
                  onRefresh: () async {
                    await _controller.reload();
                  },
                  child: WebViewWidget(controller: _controller),
                ),

              // Offline Fallback View
              if (_isOffline)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.all(24.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF2F2),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(
                            Icons.wifi_off_rounded,
                            size: 48,
                            color: Color(0xFFDC2626),
                          ),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'इंटरनेट कनेक्शन खंडित आहे',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1E293B),
                          ),
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'कृपया तुमचे इंटरनेट कनेक्शन तपासा आणि पुन्हा प्रयत्न करा.',
                          textAlign: TextAlign.center,
                          style: TextStyle(
                            fontSize: 14,
                            color: Color(0xFF64748B),
                          ),
                        ),
                        const SizedBox(height: 24),
                        ElevatedButton.icon(
                          onPressed: () {
                            setState(() => _isOffline = false);
                            _controller.reload();
                          },
                          icon: const Icon(Icons.refresh_rounded),
                          label: const Text('पुन्हा प्रयत्न करा (Retry)'),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFF15803D),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(
                              horizontal: 24,
                              vertical: 12,
                            ),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

              // Loading Progress Bar
              if (_isLoading && !_isOffline)
                LinearProgressIndicator(
                  value: _loadingProgress,
                  backgroundColor: Colors.transparent,
                  valueColor: const AlwaysStoppedAnimation<Color>(
                    Color(0xFF15803D),
                  ),
                  minHeight: 3,
                ),
            ],
          ),
        ),
      ),
    );
  }

  Future<bool> _showExitDialog(BuildContext context) async {
    return await showDialog<bool>(
          context: context,
          builder: (context) => AlertDialog(
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(16),
            ),
            title: const Text('ॲपमधून बाहेर पडायचे आहे का?'),
            content: const Text('तुम्हाला KrushiMitra AI ॲप बंद करायचे आहे का?'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(false),
                child: const Text('नाही (Cancel)'),
              ),
              FilledButton(
                style: FilledButton.styleFrom(
                  backgroundColor: const Color(0xFF15803D),
                ),
                onPressed: () => Navigator.of(context).pop(true),
                child: const Text('होय (Exit)'),
              ),
            ],
          ),
        ) ??
        false;
  }
}
