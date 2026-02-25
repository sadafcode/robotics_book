#!/usr/bin/env python3
"""
Install Argos Translate language packages for Urdu translation.
Run this once to download the required models.

Usage:
    cd backend
    python -m scripts.install_translation_models
"""

import argostranslate.package
import argostranslate.translate


def install_language_packages():
    """Download and install required language packages."""
    print("Checking available language packages...")

    # Update package index
    argostranslate.package.update_package_index()

    # Get available packages
    available_packages = argostranslate.package.get_available_packages()

    print(f"Found {len(available_packages)} available packages")

    # Look for English -> Urdu or close equivalents
    target_packages = []

    for pkg in available_packages:
        # Try to find English to Urdu
        if pkg.from_code == 'en' and pkg.to_code == 'ur':
            target_packages.append(pkg)
            print(f"Found: {pkg.from_code} to {pkg.to_code} (direct en->ur)")

        # Fallback: English to Hindi (similar script, might help)
        if pkg.from_code == 'en' and pkg.to_code == 'hi':
            target_packages.append(pkg)
            print(f"Found: {pkg.from_code} to {pkg.to_code} (en->hi as fallback)")

    if not target_packages:
        print("\nWarning: No direct en->ur package found")
        print("Available packages that might work:")
        for pkg in available_packages:
            if 'en' in [pkg.from_code, pkg.to_code] or 'ur' in [pkg.from_code, pkg.to_code]:
                print(f"  - {pkg.from_code} -> {pkg.to_code}")

    # Install packages
    for pkg in target_packages:
        print(f"\nInstalling: {pkg.from_code} -> {pkg.to_code}")
        try:
            argostranslate.package.install_from_path(pkg.download())
            print("[OK] Installed successfully")
        except Exception as e:
            print(f"[FAIL] Installation failed: {e}")

    # Check installed languages
    print("\n" + "="*50)
    print("INSTALLED LANGUAGES:")
    print("="*50)
    installed_languages = argostranslate.translate.get_installed_languages()
    for lang in installed_languages:
        print(f"  - {lang.code}: {lang.name}")

    if not installed_languages:
        print("  No languages installed yet")
        print("\nYou may need to wait for the download to complete...")

    print("\n[OK] Done! You can now use the translation service.")


if __name__ == "__main__":
    install_language_packages()
