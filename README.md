# skill-attack-tools

**Update 2024-02-12:**
* The script now automatically sends all of your scores at once to Skill Attack, without the user having to go to multiple pages.
* Scraping scores from Flower/Eagle is now much faster, since it loads 10 pages at once instead of one at a time.
* Now supports importing scores from Sanbai, so you can merge all of your best scores together from both official and unofficial servers.

## Copying scores from Sanbai

1. Copy everything from here: https://raw.githubusercontent.com/thomaskou/skill-attack-tools/master/sanbai.js
2. Log into **Sanbai**, open the developer console, paste the copied code, and hit *Enter*.
![image](https://github.com/thomaskou/skill-attack-tools/assets/25218060/6ea5fa47-f9b6-438f-9abf-39bcd99db0ec)
3. Right click the output and click *Copy object*.
<img src="https://github.com/thomaskou/skill-attack-tools/assets/25218060/48c5cc3c-8b26-467e-9d3b-0e3cb0a0247b" style="width:600px;"/>

## Copying scores from Flower or Eagle

1. Copy everything from here: https://raw.githubusercontent.com/thomaskou/skill-attack-tools/master/kailua.js
2. Log into **Flower/Eagle** and navigate to your DDR profile's score history page.
3. Open the developer console, paste the copied code, and hit *Enter*.
![image](https://github.com/thomaskou/skill-attack-tools/assets/25218060/46ce4fc5-cd3f-4486-aab2-90b9415237f3)
4. Once the script is finished, right click the output and click *Copy object*.
<img src="https://github.com/thomaskou/skill-attack-tools/assets/25218060/c0b1b551-3b5c-413e-9a67-771d6a52243b" style="width:600px;"/>

## Submitting scores to Skill Attack

1. In **Skill Attack**, navigate to your profile's score matrix page (access by clicking *Score* in the top right of your profile).
2. In the developer console, type `const password = ` followed by your Skill Attack password **in quotation marks**, then hit *Enter*.
3. Open the developer console and type `const scores = `, paste the scores you copied from one of the previous steps, then hit *Enter*.
![image](https://github.com/thomaskou/skill-attack-tools/assets/25218060/2b388fe1-34b4-4cc9-8d48-7b8e003d501e)
4. Copy everything from here: https://raw.githubusercontent.com/thomaskou/skill-attack-tools/master/skillattack.js
5. In the developer console in Skill Attack, paste the copied code, and hit *Enter*. This will submit your scores.
![image](https://github.com/thomaskou/skill-attack-tools/assets/25218060/d08cad70-5e12-4273-8d58-c71c865e40c7)
6. To check if your scores were submitted, press *Update* in the top right of your profile and check that your score updates look correct.

By default, the script will only overwrite scores with higher scores. You can pass in additional options as follows:
```
await submitToSA(scores, password, { overwrite: true, dryRun: true });
```
where the `overwrite` option will overwrite **every** score on your Skill Attack profile, and the `dryRun` option will show you what scores *would* get updated without actually submitting the update.
