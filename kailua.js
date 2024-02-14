const MAX_JOBS = 10;

function stripName(name) {
    return name.replace(/\s/g, '').replace(/＋/g, '+');
}

async function parseKailuaPage(baseurl, id, page) {
    console.log(`Loading page ${page}...`);
    const url = `${baseurl}/game/ddr/${id}?page=${page}`;
    const res = await fetch(url);
    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, "text/html");
    return Array.from(doc.getElementsByClassName("accordion-toggle"))
        .filter(tr => tr.children[0].children.length > 0)
        .map(tr => {
            const diff = tr.children[2].firstChild.wholeText.split(' ').filter(x => x);
            return {
                song: tr.children[1].children[0].children[0].innerText,
                style: diff[1],
                diff: diff[2],
                score: parseInt(stripName(tr.children[3].children[0].innerText)),
                lamp: tr.children[5].children[0]?.title,
            };
        });
}

// Must be called from the player's DDR score history page
async function getKailuaScores() {
    const baseurl = window.location.origin;
    const id = window.location.pathname.split('/')[3];
    const pageCount = parseInt(document.getElementsByName("summary")[0].children[0].innerText.split(' ')[3]);
    let scores = {};
    for (let batch = 1; batch <= pageCount; batch += MAX_JOBS) {
        let jobs = [];
        for (let page = batch; page < batch + MAX_JOBS && page <= pageCount; page++) {
            jobs.push(parseKailuaPage(baseurl, id, page));
        }
        const results = await Promise.all(jobs);
        results.flat(1).forEach(({ song, style, diff, score, lamp }) => {
            const nameStripped = stripName(song);
            scores[[nameStripped, style, diff]] = { song, style, diff, score, lamp };
        });
    }
    console.log("Done!");
    return scores;
}

await getKailuaScores();
