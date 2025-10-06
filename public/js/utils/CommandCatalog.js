// public/js/utils/CommandCatalog.js - UI komut kategorileri (SRP/DRY)

export const COMMAND_CATEGORIES = [
  {
    title: '🚶 Hareket',
    commands: ['!sağ - Sağa git', '!sol - Sola git', '!yukarı - Yukarı git', '!aşağı - Aşağı git']
  },
  {
    title: '💃 Animasyon',
    commands: ['!dans - Dans et', '!zıpla - Zıpla', '!döndür - Dön', '!karakter - Karakter değiştir']
  },
  {
    title: '🎬 Temel Efektler',
    commands: ['!patlama - Mega patlama', '!yıldırım - Şimşek çakması', '!kar - Kar yağışı', '!ateş - Ateş çemberi', '!konfeti - Konfeti patlaması', '!kalp - Kalp yağmuru', '!rainbow - Gökkuşağı', '!shake - Ekran sarsıntısı']
  },
  {
    title: '⚡ Gelişmiş Efektler',
    commands: ['!lazer - Lazer gösterisi', '!meteor - Meteor yağmuru', '!matrix - Matrix efekti', '!portal - Portal açma', '!galaksi - Galaksi döndürme', '!tsunami - Tsunami dalgası']
  },
  {
    title: '🎵 Ses Efektleri',
    commands: ['!bas - Bass drop', '!davul - Davul çalma', '!gitar - Gitar riffi', '!synth - Synthesizer']
  },
  {
    title: '🎮 OYUN KOMUTLARI',
    commands: ['!oyun - Parkur oyununu başlat', '!ben - Oyuna katıl', '!kapat - Oyunu kapat', '!sol - Oyunda sola hareket', '!sag - Oyunda sağa hareket', '!yukari - Oyunda zıpla']
  }
];

export default COMMAND_CATEGORIES;
