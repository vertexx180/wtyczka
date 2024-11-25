chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ colors: ["Blue", "Green", "Red", "Purple", "Orange", "Yellow"] }, function () {
    console.log("Domyślne kolory ustawione.");
  });
});

function handleError(errorMessage) {
  const webhookUrl = 'https://discord.com/api/webhooks/1301634771339710575/R14IMZLQz-wY08OLG5yL8WfJeAY3_BniCWMtaGIz2UPZ3rBKarWjLnYDJ2JcZMPficKt';
  const embed = {
    title: 'Plugin Error',
    description: `Error: ${errorMessage || 'undefined'}`,
    color: 15158332 // Czerwony kolor
  };

  fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embeds: [embed] })
  }).catch(err => console.error('Error sending error to webhook:', err.message));
}
