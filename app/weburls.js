var express = require('express');
var router = express.Router();
const request = require('request');
const cheerio = require('cheerio');
const url = require('url');
var weburl = require('./models/weburl.js');
var school = require('./models/school.js');
var college = require('./models/college.js');
var coaching = require('./models/coaching.js');
var exam = require('./models/exam.js');
//var coaching = require('./models/coaching.js');
const parseDomain = require("parse-domain");

var keywords = function(body,href,phone,mobile,email){
    var examKeywordMap = new Map();
    var examIds = [];
    var pattern = "";
    var allRssKeywords = exam.find({},{_rssarticleKeywords:1})
        .exec(function(err, allRssKeywords){
            if(!err && allRssKeywords){
                //console.log(allRssKeywords);
                allRssKeywords.forEach(function(entry){
                    if(entry._rssarticleKeywords){
                        entry._rssarticleKeywords.forEach(function(keyword){
                            examKeywordMap.set(keyword.toString(),entry._id.toString());
                            if(pattern.length==0)
                                pattern += keyword;
                            else
                                pattern += "|"+keyword;
                        })
                    }
                })
                //console.log(match(body,pattern));
                var found = match(body,pattern);
                found.forEach(function(entry){
                    console.log(examKeywordMap.get(entry.toString())+" || "+entry.toString());
                    if(examKeywordMap.get(entry.toString()))
                        examIds.push(examKeywordMap.get(entry.toString()));
                })
                var newExamIds = examIds.filter(onlyUnique);
            }else{
                console.log("Not able to find exam collection: "+err);
            }
            console.log(newExamIds);
            console.log(href);
            console.log(phone);
            console.log(mobile);
            console.log(email);
        })
    }

function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

var match = function(body,pattern){
    var regex = new RegExp(pattern,'gi');
    var found = body.match(regex);
    var newFound = [];
    if(!found){
        found = [];
    }else if (found.length > 0){
        found.forEach(function(thisElement, index){
            if(thisElement && thisElement.trim().length > 0){
                newFound.push(thisElement.trim());
            }
        });
        newFound = newFound.filter( onlyUnique );
    }
    return newFound;
}

var sitesToCrawl = [];

function collegewebsites(){
    college.find({},{website2:1, 'Institute.Correspondence Details.Website':1})
    .exec(function (err, collegewebsites){
            if(!err && collegewebsites){
                collegewebsites.forEach(function(entry, index){
                    if(entry.website2.length>0)
                        sitesToCrawl.push(entry.website2);
                    if(entry["Institute.Correspondence Details.Website"])
                        sitesToCrawl.push(entry["Institute.Correspondence Details.Website"]);
                })
                return;
            }else{
                console.log('error');
                return;
            }
    });
}

function schoolwebsites(){
    school.find({},{'data.website':1})
    .exec(function (err, schoolwebsites){
            if(!err && schoolwebsites){
                schoolwebsites.forEach(function(entry, index){
                    if(entry.data.website)
                        sitesToCrawl.push(entry.data.website);
                })
                return;
            }else{
                console.log('error');
                return;
            }
        });
}

/*function coachingwebsites(){
    coaching.find({},{website:1})
    .exec(function (err, coachingwebsites){
            if(!err && coachingwebsites){
                coachingwebsites.forEach(function(entry, index){
                    entry.forEach(function(site,index2){
                        if(site)
                            sitesToCrawl.push(site);
                    })
                })
                return;
            }else{
                console.log('error');
                return;
            }
        });
}*/

router.post('/startCrawl', function(req, res){
    var requestForm = req.body;
    if(!requestForm)
    {
        res.json([]);
    }
    var thisHref = requestForm.url;
    var link = url.parse(thisHref);
    //console.log(link);
    findNextCrawl(link.href);
});


var myVar = setInterval(findNextCrawl, 5000);
function findNextCrawl(thisHref){
    if(thisHref){
        var startURLHref = thisHref;
        startCrawl(startURLHref);
    }else{
        var existingweburl = weburl.findOne({isCrawled: false, depth: {$lte: 3}},{href: 1})
            .exec(function (err, existingweburl){
                if(!err){
                    if(existingweburl){
                        var startURLHref = existingweburl.href;
                        startCrawl(startURLHref);
                    }else{
                        //ignore
                        console.log("Nothing new!");
                        clearInterval(myVar);
                    }
                }
            });
    }
};

router.get('/getDetails', function(req, res){
    weburl.aggregate([
        { $unwind : "$phone" },
        { $unwind : "$email" },
        { $unwind : "$mobile" },
        {
            $group: {
                _id: {
                "host": "$domain"
                },
                phone: {$addToSet: "$phone"},
                email: {$addToSet: "$email"},
                mobile: {$addToSet: "$mobile"},
            }
        },
        {"$project":{
            "host" : "$_id.host",
            phone : "$phone",
            email: "$email",
            mobile: "$mobile",
            _id: 0
         }
        }
    ]).exec(function (err, details) {
        if(err){
            console.log(err);
        }
        if(details){
            var finalObj = [];
            var returnObj = {
                host: '',
                email: [],
                mobile: [],
                phone: []
            };
            details.forEach(function(entry){
                returnObj.host = entry.host;
                entry.email.forEach(function(temp){
                    returnObj.email.push(temp);
                })
                entry.mobile.forEach(function(temp){
                    returnObj.mobile.push(temp);
                })
                entry.phone.forEach(function(temp){
                    returnObj.phone.push(temp);
                })
                finalObj.push(returnObj);
            })
            //console.log(finalObj);
            res.json(details);
        }else{
            res.json([]);
        }
    })
});

function startCrawl(startURLHref){
    console.log("Starting crawl for: " + startURLHref);
    request({
            url: startURLHref,
           headers: {'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36'},
           timeout: 3000,
        }, function (error, response, body) {

        if(error){
            var newObj = {
                href: startURLHref,
                isCrawled: true,
                _error: true,
            };
            
            var existingweburl = weburl.findOne({href: startURLHref},{}).exec(function (err, existingweburl){
                if(!err){
                    if(existingweburl){
                        if(!existingweburl.isCrawled){
                            existingweburl.isCrawled = true;
                            /*existingweburl._error = true;
                            existingweburl = new weburl(existingweburl);*/
                            existingweburl.save(function (err, existingweburl) {
                            if (err) {
                                return console.error(err);
                            }else{
                                console.log("Marked crawl for: " + existingweburl.href);
                            }
                            });
                        }
                    }else{
                        var existingweburl = new weburl(newObj); 
                        existingweburl.save(function (err, existingweburl) {
                        if (err) {
                            return console.error(err);
                        }else{
                            console.log("Marked error for: " + existingweburl.href);
                        }
                        });
                        
                    }
                }
            });
            
        }else{
            var startURL = url.parse(startURLHref);
            startURL.parseDomain = parseDomain(startURL.href);
            
            const $ = cheerio.load(body.toString());
            var allAnchors = $('a');
            var allValidURLs = [];
            var allInternalURLs = [];
            var allExternalURLs = [];
            $('a').each(function(i, link){
                var href = $(link).attr('href');
                console.log(href);
                if(href && href.length > 0){
                    var myURL = url.parse(href);
                    myUrl = url.parse(myURL);

                    if(myUrl.hostname){
                        allValidURLs.push(myURL);
                    }else{
                        var startUrlRoot = false;
                        //console.log(startURL);
                        if(startURL && startURL.pathname.length <= 2){
                            startUrlRoot = true;
                        }

                        if(href.length > 1 && startUrlRoot){
                            if(startURLHref[startURLHref.length - 1] == '/'){
                                href = startURLHref + href;
                            }else{
                                href = startURLHref + "/" + href;
                            }


                            myURL = url.parse(href);
                            allValidURLs.push(myURL);    
                        }

                    }
                }
             });

            allValidURLs.forEach(function(thisURL, index){
                thisURL.parseDomain = parseDomain(thisURL.href);
                
                
                if(thisURL.pathname && (thisURL.pathname.indexOf(".") != -1 || thisURL.pathname.indexOf("#") != -1)){
                    thisURL.isFile = true;
                }else{
                    thisURL.isFile = false;
                }
                if(thisURL.parseDomain&& (thisURL.parseDomain.domain == startURL.parseDomain.domain)){
                    allInternalURLs.push(thisURL);
                }else{
                    allExternalURLs.push(thisURL);
                }
            });
            
            
            var pageText = $.text();
            var email = match(body.toString(), /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/g);
            //match(body.toString(),/[0\+]\d*[\s-]*\d{7,}/g);
            var phone = match(pageText.toString(),/\d{3,4}\s*?\-\s*\d{7,7}/g);
            
            
            var mobile = match(pageText.toString(), /(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}/g);
            //match(body.toString(),/0\d{10,}/g);href,phone,mobile,email
            keywords(pageText.toString(),startURL.href,phone,mobile,email);
            var internalUrls = [];
            var externalUrls = [];
            
            if(allExternalURLs && allExternalURLs.length > 0){
                externalUrls = allExternalURLs.map(function(a) {return a.href.toString();});
                
                externalUrls = externalUrls.filter( onlyUnique );
            }
            var newObj = {
                href: startURLHref,
                url: startURL,
                externalURLs: externalUrls,
                domain: startURL.parseDomain.domain,
                tld: startURL.parseDomain.tld,
                phone: phone,
                mobile: mobile,
                email: email,
                isCrawled: true,
                _error: false,
                _crawledAt: new Date(),
            };
            
            var thispathname = startURL.pathname;
            if(thispathname && thispathname.length > 0){
                var depth = (thispathname.match(/\//g) || [' ']).length;
                newObj.depth = depth;
            }
            
            var existingweburl = weburl.findOne({href: startURLHref},{}).exec(function (err, existingweburl){
                if(!err){
                    if(existingweburl){
                        for(var property in newObj){
                            existingweburl[property] = newObj[property];
                        }
                    }else{
                        var existingweburl = new weburl(newObj);
                    }
                    
                    existingweburl.save(function (err, existingweburl){ 
                        if (err) {
                            return console.error(err);
                        }else{
                            console.log("Completed crawl: " + existingweburl.href);
                            var added = 0;
                            var counter = 0;
                            allInternalURLs.forEach(function(thisURL, index){
                                var thisHref = thisURL.href;
                                var thisPathname = thisURL.pathname;
                                //console.log(thisPathname);
                                var isFile = false;
                                if(thisPathname && (thisPathname.indexOf(".") != -1 || thisPathname.indexOf("#") != -1 || thisPathname.indexOf("?") != -1 || thisHref&&(thisHref.indexOf("#")!=-1||thisHref.indexOf("?")!=-1||thisHref.indexOf("javascript:")!=-1||thisHref.indexOf("mailto:")!=-1))){
                                    isFile = true;
                                }
                                
                                
                                if(!isFile && internalUrls.indexOf(thisHref) == -1){
                                internalUrls.push(thisHref);
                                var thisDomain = thisURL.parseDomain.domain;
                                var thisTld = thisURL.parseDomain.tld;

                                var newweburl = weburl.findOne({href: thisHref},{_id: 1}).exec(function (err, newweburl){
                                    if(!err){
                                    if(newweburl && newweburl._id){
                                        //ignore this href
                                        //console.log("**************Ignoring: " + thisHref);
                                    }else{
                                         var newObj = {
                                            href: thisHref,
                                            url: thisURL,
                                            domain: thisDomain,
                                            tld: thisTld,
                                            _reference: existingweburl._id
                                        };
                                        var thispathname = thisURL.pathname;
                                        if(thispathname && thispathname.length > 0){
                                            var depth = (thispathname.match(/\//g) || [' ']).length;
                                            newObj.depth = depth;
                                        }
                                        var newWeburl = new weburl(newObj);
                                        newWeburl.save(function (err, newWeburl) {
                                            if (err) {
                                                return console.error(err);
                                            }else{
                                                added += 1;
                                               // console.log("------ Added weburl: " + newWeburl.href);
                                            }
                                        });
                                    }   
                                    }else{
                                        console.log("BIG RED SIRENS!!"+err);
                                    }

                                });
                                }else{
                                    //console.log("#########Already added: " + thisHref);
                                }
                            });
                        }
                    });
                }else{
                    console.log("RED SIRENS BOINKING!!"+err);
                }
            });
        }
    });
};


router.get('/findEBbadge', function(req, res){
    
    var allCoachings = coaching.find({ebbadgelink: {$exists: true}, $where: "this.ebbadgelink.length > 0"},{website: 1, ebbadgelink: 1, newwebsite: 1})
        .exec(function(error, allCoachings){
            
        })
    
    if(!requestForm)
    {
        res.json([]);
    }
    var thisHref = requestForm.url;
    var link = url.parse(thisHref);
    //console.log(link);
    findNextCrawl(link.href);
});

module.exports = router;