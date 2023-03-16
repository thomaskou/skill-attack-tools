# skill-attack-tools

## Importing scores from Flower/Eagle into Skill Attack

1. Log into **Flower/Eagle**.
2. On **Flower/Eagle**, copy/paste the code for `parseKailuaPage` and `parseKailua` into the developer console. These can be found in `index.js`.
3. In the developer console, type `const scores = await parseKailua("https://projectflower.eu", XXXXXXXX);` or `const scores = await parseKailua("https://eagle.ac", XXXXXXXX);`, replacing `XXXXXXXX` with your numeric user ID (which can be found in the URL bar on your DDR scores history).
4. Once the script finishes scraping the scores, type `scores` into the console and then right click -> Copy object. ![image](https://user-images.githubusercontent.com/25218060/224912606-4a664b46-8e1c-4f3f-acfa-1c94b32f8155.png)
5. Log into **Skill Attack**, then complete the following steps on each of these pages circled in red: ![image](https://user-images.githubusercontent.com/25218060/224912796-b71dc2b5-6513-4c9a-929c-a727508e5364.png)
6. Make sure your page is in Japanese (not automatically translated to English).
7. In the developer console, type the following lines of code, inserting your scores as needed:

```
const scores = <paste from clipboard here>;

function inputIntoSA(scores) {
  ... copy this from index.js in this repository ...
}

inputIntoSA(scores);
```

The script will only overwrite scores with higher scores.
