import Crawler from "crawler";
import fs from "fs";
import path from 'path';

const allChildCareLinks = new Set();
const centresLinks = new Set();
const coordinatingOfficesLinks = new Set();

const c = new Crawler({
    maxConnections: 10, //use this for parallel, rateLimit for individual
    //rateLimit: 1000,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        if (error) {
            console.log(error);
        } else {
            let baseWebLink = 'https://geoegl.msp.gouv.qc.ca/mfa/recherche-region.php';

            let $ = res.$; //get cheerio data, see cheerio docs for info

            let resultLinks = $('#results a');

            // let results = $('#results').children().find('.liste-resultats');

            // console.log($(results).find('a'));

            $(resultLinks).each(function (i, link) {
                //Log out links
                var webLink = $(link).attr('href');
                if (webLink != undefined && webLink.includes('id=')) {
                    console.log(webLink);
                    allChildCareLinks.add(webLink);

                    if (webLink.includes('fiche-service-garde')) {
                        //figure out to separate for now
                        centresLinks.add(webLink);
                    } else {
                        coordinatingOfficesLinks.add(webLink);
                        c.add(baseWebLink + webLink);
                    }

                }
            });

            
        }
        done();
    }
});

//Triggered when the crawler queue becomes empty
c.on('drain', async function () {
    console.log("Done.");
    // downloadLinks.forEach(async link => {
    //     var linkCopy = link.toLowerCase();
    //     if(linkCopy.includes("application") || linkCopy.includes("form") || linkCopy.includes("faq") || linkCopy.includes("guideline")){
    //         downloadLinks.delete(link);//gets rid of random pdfs that are not course outlines
    //     }else{
    //         var fileName = link.split("/");
    //         fileName = fileName[fileName.length - 1];
    //         console.log(fileName);

    //     }
    // });

    // console.log("Links Downloaded Size: ",downloadLinks.size);
});

//URL to scrape child care info from
c.add('https://geoegl.msp.gouv.qc.ca/mfa/recherche-region.php?submit=1&region_admin=06&mrc=&mun=&clsc=&cpe=1&garderie=1&milieuFamilial=1&sgd=1&cpeDev=1&garderieDev=1&langue=en');