const read = require('node-readability');
const cheerio = require('cheerio');
const exec = require('child-process-promise').exec;

(async function readWiki() {
    let wikiURL = 'https://ko.wikipedia.org/wiki/%EB%8C%80%ED%95%9C%EB%AF%BC%EA%B5%AD'

    try {
        let data = await read(wikiURL)
        const content = article.content
            .replace(/<script[^>]*>[\s\S]*?<\/script>/igm, '')
            .replace(/<style[^>]*>[\s\S]*?<\/style>/igm, '');

        const $ = cheerio.load(content);

        const parsedContent = ($("*").text())
            .replace(/\n|\r/g, ' ')
            .replace( /\s\s+/g, ' ')
            .trim();

        console.log("parsed content: ", parsedContent);
        let execParam = `python3 ./textrank.py '${parsedContent}'`
        
        let result = await exec(execParam)
        console.log(JSON.parse(resultstdout))
        
        article.close()
    } catch (e) {
        console.error('failed to read wiki', e)
    }
}())