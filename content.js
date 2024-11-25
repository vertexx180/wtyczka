chrome.storage.sync.get(['colors', 'removedColors', 'colorModeEnabled'], function(result) {
  const colors = result.colors || [];
  const removedColors = result.removedColors || [];
  const colorModeEnabled = result.colorModeEnabled !== false; // Domyślnie `true`, chyba że ustawione na `false`

  console.log('Załadowane kolory:', colors);

  if (colors.length > 0 && colorModeEnabled) {  // Sprawdzamy, czy zmiana koloru jest włączona
    const diceElements = document.querySelectorAll('.dice-wrapper .df-solid-small-dot-d6-1');
    const resultElement = document.querySelector('.zoom-result span');

    setTimeout(() => {
      diceElements.forEach((dice, index) => {
        let color = colors[index % colors.length];

        while (removedColors.includes(color)) {
          const availableColors = ['Blue', 'Green', 'Red', 'Purple', 'Orange', 'Yellow'].filter(c => !removedColors.includes(c));
          if (availableColors.length > 0) {
            color = availableColors[Math.floor(Math.random() * availableColors.length)];
          } else {
            console.log("no color to change");
            break;
          }
        }

        dice.style.color = color;

        if (resultElement) {
          resultElement.textContent = color || 'undefined';
          resultElement.style.color = (color ? color.toLowerCase() : 'black');
        }
      });
    }, 975);
  } else {
    console.log('Kolorowanie jest wyłączone.');
  }
});
