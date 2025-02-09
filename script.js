/* script.js */

// Global değişken: hadislere ait veriler burada saklanacak.
let hadiths = [];

// JSON dosyasından hadis verilerini çekiyoruz.
fetch('hadisler.json')
  .then(response => response.json())
  .then(data => {
    hadiths = data;
  })
  .catch(error => console.error('JSON verisi yüklenemedi:', error));

// "İyilik Önerisi Al" butonuna tıklama olayı.
document.getElementById('getSuggestionBtn').addEventListener('click', function() {
  const userQuestion = document.getElementById('userInput').value.trim();

  if (hadiths.length === 0) {
    alert('Hadis verileri henüz yüklenemedi, lütfen daha sonra tekrar deneyin.');
    return;
  }

  if (userQuestion === '') {
    alert('Lütfen bir konu girin.');
    return;
  }

  // Anahtar kelimelere göre en uygun hadisi seçiyoruz
  const enUygunHadis = getHadis(userQuestion);

  // Seçilen hadisin belirlenmiş rengi varsa, arka planı o renge ayarla.
  if (enUygunHadis.color) {
    document.body.style.backgroundColor = enUygunHadis.color;
  } else {
    // Eğer renk bilgisi yoksa, rastgele pastel bir renk oluştur.
    document.body.style.backgroundColor = getRandomPastelColor();
  }

  // Hadisi ekranda göstermek: fade-in efekti uygulayarak.
  const suggestionTextElement = document.getElementById('suggestionText');
  suggestionTextElement.style.opacity = 0;  // Önce opaklığı sıfırla.
  setTimeout(() => {
    suggestionTextElement.textContent = enUygunHadis.text;
    suggestionTextElement.style.opacity = 1;  // Fade-in efektiyle göster.
  }, 300);
});

// "Paylaş" butonuna tıklama olayı: Web Share API kullanılarak.
document.getElementById('shareBtn').addEventListener('click', function() {
  const textToShare = document.getElementById('suggestionText').textContent;
  if (navigator.share) {
    navigator.share({
      title: 'İyilik Hareketi',
      text: textToShare,
      url: window.location.href
    }).then(() => {
      console.log('Başarıyla paylaşıldı.');
    }).catch((error) => {
      console.error('Paylaşım hatası:', error);
    });
  } else {
    alert('Paylaşma özelliği tarayıcınız tarafından desteklenmiyor.');
  }
});

// Rastgele pastel renk oluşturma fonksiyonu (opsiyonel).
function getRandomPastelColor() {
  const r = Math.floor((Math.random() * 128) + 127);
  const g = Math.floor((Math.random() * 128) + 127);
  const b = Math.floor((Math.random() * 128) + 127);
  return `rgb(${r}, ${g}, ${b})`;
}

// Anahtar kelimelere göre en uygun hadisi seçme fonksiyonu
function getHadis(userQuestion) {
  let enUygunHadis = null;
  let maxMatches = 0;

  // Her hadis için anahtar kelimelerle karşılaştırma yapıyoruz.
  hadiths.forEach(hadis => {
    let matches = 0;
    hadis.keywords.forEach(keyword => {
      if (userQuestion.toLowerCase().includes(keyword.toLowerCase())) {
        matches++;
      }
    });

    // En fazla eşleşme yapan hadisi seçiyoruz.
    if (matches > maxMatches) {
      maxMatches = matches;
      enUygunHadis = hadis;
    }
  });

  // Hiç eşleşme yoksa, rastgele hadis gösteriyoruz.
  if (!enUygunHadis) {
    enUygunHadis = hadiths[Math.floor(Math.random() * hadiths.length)];
  }

  return enUygunHadis;
}
