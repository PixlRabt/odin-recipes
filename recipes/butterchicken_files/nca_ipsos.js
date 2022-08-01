/*! ipsos.js  env: uat  date: 2022-07-25T03:42:27.655Z */
(function() {
    var inLocalStorage = function () {
    return window.localStorage && window.localStorage.getItem("ipsos_debug");
};
var debug = function (message) {
    // window.console is guaranteed to exist
    // https://developer.mozilla.org/en-US/docs/Web/API/console
    if (inLocalStorage()) {
        console.log(message);
        
    }
};

var id = 'ipsos-script-tag';
var isExists = document.getElementById(id);
window.nca_ipsos = window.nca_ipsos || {};
var getLocation = function() { return window.location; };
var logger = ['Ipsos data:'];
var lastSlicedPath = null;
var hasScrollAction = false;

window.nca_ipsos = window.nca_ipsos || {};

window.nca_ipsos.isTabActive = function () {
    var stateKey, eventKey, keys = {
        hidden: "visibilitychange",
        webkitHidden: "webkitvisibilitychange",
        mozHidden: "mozvisibilitychange",
        msHidden: "msvisibilitychange"
    };
    for (stateKey in keys) {
        if (stateKey in document) {
            eventKey = keys[stateKey];
            break;
        }
    }
    return function (c) {
        if (c) document.addEventListener(eventKey, c);
        return !document[stateKey];
    };
};

window.nca_ipsos.isElementVisible = function(obj){
    var rect = obj.elem.getBoundingClientRect(),
        el = obj.elem,
        vWidth = window.innerWidth || document.documentElement.clientWidth,
        vHeight = window.innerHeight || document.documentElement.clientHeight,
        efp = function (x, y) { return document.elementFromPoint(x, y); };
   // Check current top pixel of itself, happens when parent element has display:none;
    if( ! el.contains( efp(rect.left, rect.top) ) ) return false;
    // Check adslot top and left edge within the viewport
    if (rect.left < 0 || rect.top < 0 ) return false;
    // Check adslot bottom Edge within viewport Height, <= covers the responsive layout (happens in mobile footer ads)
    var rectBottomEdgeCheck = rect.bottom <= vHeight;
    // Check adslot right Edge within viewport Width, <= covers the responsive layout.
    var rectRightEdgeCheck = rect.right <= vWidth;
    return rectBottomEdgeCheck && rectRightEdgeCheck;
};

if(window){
    window.onscroll = function(){
        hasScrollAction = true;
    };
}

function QueryStrBuilder(){
    this.tmp = {};
    this.params = [];
  }
  QueryStrBuilder.prototype = {
    // prevents duplication of query parameter.
    update: function(){
      var scope = this;
      scope.params = [];
      Object.keys(scope.tmp).forEach(function(key){
        if(scope.tmp[key]) scope.params.push(key+'='+scope.tmp[key]);
      });
    },
    addParams: function (key, value){
      var scope = this;
      scope.tmp[key]=value;
      scope.update();
    },
    getParams: function (){
      var scope = this;
      var qs = '';
      scope.params.forEach(function(param, idx){ qs += (idx===0) ? '?'+ param : '&'+param; });
      return qs;
    },
    // specific methods
    addSection: function(section) {
      var scope = this;
      scope.tmp.t = section;
      scope.update();
    },
    addHost: function() {
      var scope = this;
      scope.tmp.d = document.location.host;
      scope.update();
    }
  };
  var qsBuilder = new QueryStrBuilder();
  

var getSiteConfigs = function(){
    return {
        ttb: {
            siteId: '1566',
            homepageId: '13085',
            sectionId: '13086',
            // (new)
            'news/townsville': '13306',
            'news/queensland': '13307',
            'news/national': '13308',
            'news/world': '13309',
            'news/opinion': '13310',
            'business/townsville-business': '13311',
            entertainment: '13312',
            lifestyle: '13313',
            sport: '13314',
            // additional
            classifieds: '13434'
        },
        gq: {
            siteId: '1571',
            homepageId: '13096',
            sectionId: '13097',
            // (new)
            'gq-women': '13097'
        },
        news: {
            siteId: '1554',
            homepageId: '13056',
            sectionId: '13057',
            // (default)
            national: '13188',
            world: '13189',
            lifestyle: '13190',
            travel: '13191',
            entertainment: '13192',
            technology: '13193',
            finance: '13194',
            sport: '13195',
            /* additional (needs clarity)
            decider: '0000',
            newyorkpost: '0000',
            pagesix: '13366',*/
            weather: '13368',
            'in-the-know-quiz': '13369',
            'intheknow-quiz': '13369'
        },
        taus: {
            siteId: '1555',
            homepageId: '13058',
            sectionId: '13059',
            // (default)
            nation: '13196',
            world: '13197',
            business: '13198',
            commentary: '13199',
            sport: '13200',
            arts: '13201',
            // additional
            'higher-education': '13370',
            life: '13372',                              // lifeluxury
            travel: '13373',
            'the-oz': '13531'
        },
        ///////////
        // Metros
        ///////////
        hwt: {
            siteId: '1557',
            homepageId: '13062',
            sectionId: '13063',
            // (default)
            leader: '13214',
            'news/victoria': '13215',
            'news/national': '13216',
            'news/world': '13217',
            'news/opinion': '13218',
            'business/victoria-business': '13219',
            entertainment: '13220',
            lifestyle: '13221',
            sport: '13222',
            // additional
            'real-estate': '13385',
            weather: '13386',
            // travel: '13387',
            classifieds: '13388',
            technology: '13389'
        },
        tcm: {
            siteId: '1558',
            homepageId: '13064',
            sectionId: '13065',
            questnews: '13225',
            /* News Regional
            'news/queensland/ipswich': '13395',                     // Queensland Times
            'news/queensland/gympie':  '13396',                     // Gympie Times
            'news/queensland/whitsunday': '13397',                  // Whitsunday Times
            'news/queensland/chinchilla': '13398',                  // Chinchilla News
            'news/queensland/central-queensland': '13399',          // Central Queensland News
            'news/queensland/gatton': '13400',                      // Gatton Star
            'news/queensland/south-burnett': '13401',               // South Burnett Times
            'news/queensland/roma': '13402',                        // Western Star
            'news/nsw/byron-shire': '0000',                         // Byron Shire News
            */
            'news/queensland/sunshine-coast': '13403',              // Sunshine Coast Daily
            'news/queensland/rockhampton': '13404',                 // Morning Bulletin
            /*
            'news/queensland/noosa': '13405',                       // Noosa News
            'news/queensland/dalby': '13406',                       // Dalby Herald
            'news/queensland/warwick': '13407',                     // Warwick Daily News
            'news/queensland/central-and-north-burnett': '13408',   // Central & North Burnett Times
            'news/queensland/stanthorpe': '13409',                  // Stanthorpe Border Post
            'news/queensland/fraser-coast': '13410',                // Fraser Coast Chronicle
            'news/queensland/bundaberg': '13411',                   // News Mail
            'news/queensland/gladstone': '13412',                   // Gladstone Observer
            */
            'news/queensland/mackay': '13413',                      // Daily Mercury
            
            // (default)
            'news/queensland': '13226',
            'news/national': '13227',
            'news/world': '13228',
            'news/opinion': '13229',
            'business/qld-business': '13230',
            entertainment: '13231',
            lifestyle: '13232',
            sport: '13233',
            // additional 
            // travel: '13414',
            classifieds: '13415',
            technology: '13416',
            'real-estate': '13417',
            weather: '13418'
        },
        dtm: {
            siteId: '1556',
            homepageId: '13060',
            sectionId: '13061',
            newslocal: '13203',
            /* News Regional
            'news/nsw/grafton': '13374',        // The Daily Examiner
            'news/nsw/tweed-heads': '13375',    // Tweed Daily News
            'news/nsw/byron-shire': '13376',    // Byron Shire News
            'news/nsw/lismore': '13377',        // Northern Start
            'news/nsw/ballina': '13378',        // Ballina Advocate
            'news/nsw/coffs-harbour': '13379',  // Coffs Coast Advocate
            */
            // (default)
            'news/nsw': '13204',
            'news/national': '13205',
            'news/world': '13206',
            'news/opinion': '13207',
            'business/nsw-business': '13208',
            entertainment: '13209',
            lifestyle: '13210',
            sport: '13211',
            // additional
            technology: '13380',
            // travel: '13381',
            classifieds: '13382',
            'real-estate': '13383',
            weather: '13384'
        },
        adv: {
            siteId: '1559',
            homepageId: '13066',
            sectionId: '13067',
            // (default)
            messenger: '13236',
            'news/south-australia': '13237',
            'news/national': '13238',
            'news/world': '13239',
            'news/opinion': '13240',
            'business/sa-business': '13241',
            entertainment: '13242',
            lifestyle: '13243',
            sport: '13244',
            // additional
            // travel: '13419',
            classifieds: '13420',
            technology: '13421',
            'real-estate': '13422',
            weather: '13423'
        },
        ///////////
        // Regionals
        ///////////
        tmrc: {
            siteId: '1560',
            homepageId: '13068',
            sectionId: '13069',
            // (default)
            'news/tasmania': '13247',
            'news/national': '13248',
            'news/world': '13249',
            'news/opinion': '13250',
            'business/tasmania-business': '13251',
            entertainment: '13252',
            lifestyle: '13253',
            sport: '13254',
            // additional
            'real-estate': '13424',
            classifieds: '13425'
        },
        twc: {
            siteId: '1561',
            homepageId: '13070',
            sectionId: '13071',
            // (default)
            'news/toowoomba': '13256',
            'news/queensland': '13257',
            'news/national': '13258',
            'news/world': '13259',
            'news/opinion': '13260',
            'business/toowoomba-business': '13261',
            entertainment: '13262',
            lifestyle: '13263',
            sport: '13264',
            // additional
            classifieds: '13426'
        },
        tcp: {
            siteId: '1562',
            homepageId: '13072',
            sectionId: '13073',
            // (default)
            'news/cairns': '13266',
            'news/queensland': '13267',
            'news/national': '13268',
            'news/world': '13269',
            'news/opinion': '13270',
            'business/cairns-business': '13271',
            entertainment: '13272',
            lifestyle: '13273',
            sport: '13274',
            // additional
            classifieds: '13427'
        },
        gea: {
            siteId: '1563',
            homepageId: '13074',
            sectionId: '13075',
            // (default)
            'news/geelong': '13276',
            'news/victoria': '13277',
            'news/national': '13278',
            'news/world': '13279',
            'news/opinion': '13280',
            'business/geelong-business': '13281',
            entertainment: '13282',
            lifestyle: '13283',
            sport: '13284',
            // additional
            'real-estate': '13428',
            classifieds: '13429'
        },
        gcb: {
            siteId: '1564',
            homepageId: '13076',
            sectionId: '13077',
            // (default)
            'news/gold-coast': '13286',
            'news/queensland': '13287',
            'news/national': '13288',
            'news/world': '13289',
            'news/opinion': '13290',
            'business/gold-coast-business': '13291',
            entertainment: '13292',
            lifestyle: '13293',
            sport: '13294',
            // additional
            'real-estate': '13430',
            classifieds: '13431'
        },
        ntn: {
            siteId: '1565',
            homepageId: '13078',
            sectionId: '13079',
            // (default)
            'news/northern-territory': '13296', // local
            // 'news/northern-territory-2': '13297',
            'news/national': '13298',
            'news/world': '13299',
            'news/opinion': '13300',
            'business/nt-business': '13301',
            entertainment: '13302',
            lifestyle: '13303',
            sport: '13304',
            // additional
            classifieds: '13432',
            'real-estate': '13433'
        },
        wtn: {
            siteId: '1567',
            homepageId: '13087',
            sectionId: '13088',
            // additional
            sport: '13435',
            agribusiness: '13436',
            machine: '13437',
            property: '13438'
        },
        ///////////
        // Lifestyle
        ///////////
        vogue: {
            siteId: '1568',
            homepageId: '13089',
            sectionId: '13091',
            // additional 
            'vogue-living': '13090',
            travel: '13440'
        },
        taste: {
            siteId: '1569',
            homepageId: '13092',
            sectionId: '13093'
        },
        delicious: {
            siteId: '1570',
            homepageId: '13094',
            sectionId: '13095',
            // additional
            travel: '13439'
        },
        escape: {
            siteId: '1572',
            homepageId: '13098',
            sectionId: '13099'
        },
        bodyandsoul: {
            siteId: '1573',
            homepageId: '13100',
            sectionId: '13101'
        },
        supercoach: {
            siteId: '1574',
            homepageId: '13102',
            sectionId: '13103'
        },
        bestrecipes: {
            siteId: '1575',
            homepageId: '13104',
            sectionId: '13105'
        },
        'kidspot': {
            siteId: '1576',
            homepageId: '13106',
            sectionId: '13107',
            kitchen: '13335'
        },
        ///////////
        // News Perform
        ///////////
        odds: {
            siteId: '1576',
            homepageId: '13108',
            sectionId: '13109'
        },
        punters: {
            siteId: '1578',
            homepageId: '13110',
            sectionId: '13111'
        },
        tips: {
            siteId: '1580',
            homepageId: '13124',
            sectionId: '13125'
        },
        racenet: {
            siteId: '1581',
            homepageId: '13126',
            sectionId: '13127'
        },
        ///////////
        // Others
        ///////////
        foxs: {
            siteId: '1584',
            homepageId: '13136',
            sectionId: '13137'
        },
        sky: {
            siteId: '1585',
            homepageId: '13138',
            sectionId: '13139'
        },
        // kidsnews: {
        //     siteId: '1586',
        //     homepageId: '13140',
        //     sectionId: '13141'
        // },
        myt: {
            siteId: '1587',
            homepageId: '13142',
            sectionId: '13143'
        },
        codesports: {
            siteId: '1588',
            homepageId: '13144',
            sectionId: '13145'
        },
        buysearchsell: {
            siteId: '1589',
            homepageId: '13146',
            sectionId: '13147'
        },
        braingains: {
            siteId: '1591',
            homepageId: '13150',
            sectionId: '13151'
        },
        /////////////////////////
        // TAUS Plus
        /////////////////////////
        'taus.plus': {
            siteId: '1555',
            homepageId: '13371',
            sectionId: '13371'
        },
        /////////////////////////
        // Super coach websites
        /////////////////////////
        'sc.dtm': {
            siteId: '1556',
            homepageId: '13521',    // dtm
            sectionId: '13521'      // dtm.sc any sections
        },
        'sc.hwt': {
            siteId: '1557',
            homepageId: '13522',    // hwt
            sectionId: '13522'      // hwt.sc any sections
        },
        'sc.tcm': {
            siteId: '1558',
            homepageId: '13523',    // tcm
            sectionId: '13523'      // sc.tcm any sections
        },
        'sc.adv': {
            siteId: '1559',
            homepageId: '13524',    // adv
            sectionId: '13524'      // sc.adv any sections
        },
        'sc.tmrc': {
            siteId: '1560',
            homepageId: '13525',    // tmrc
            sectionId: '13525'      // sc.tmrc any sections
        },
        // 'sc.twc': {
        //     siteId: '1561',
        //     homepageId: '13070',
        //     sectionId: '0'
        // },
        'sc.tcp': {
            siteId: '1562',
            homepageId: '13526',    // tcp
            sectionId: '13526'      // sc.tcp any sections
        },
        'sc.gea': {
            siteId: '1563',
            homepageId: '13527',    // gea
            sectionId: '13527'      // sc.gea any sections
        },
        'sc.gcb': {
            siteId: '1564',
            homepageId: '13528',    // gcb
            sectionId: '13528'      // sc.gcb any sections
        },
        'sc.ntn': {
            siteId: '1565',
            homepageId: '13529',    // ntn
            sectionId: '13529'      // sc.ntn any sections
        },
        'sc.ttb': {
            siteId: '1566',
            homepageId: '13530',    // ttb
            sectionId: '13530'      // sc.ttb any sections
        },
        'sc.foxs': {
            siteId: '1584',
            homepageId: '13532',    // foxs
            sectionId: '13532'      // sc.foxs any sections
        },
        decider: {
            siteId: '1604',
            homepageId: '13365',
            sectionId: '13365'
        },
        nypost: {
            siteId: '1605',
            homepageId: '13367',
            sectionId: '13367'
        },
        pagesix: {
            siteId: '1605',
            homepageId: '13627',
            sectionId: '13627'
        }
    };
};

var tcmNewsRegionals = [
    // 'news/queensland/ipswich',
    // 'news/queensland/gympie',
    // 'news/queensland/whitsunday',
    // 'news/queensland/chinchilla',
    // 'news/queensland/central-queensland',
    // 'news/queensland/gatton',
    // 'news/queensland/south-burnett',
    // 'news/queensland/roma',
    // 'news/nsw/byron-shire',
    'news/queensland/sunshine-coast',
    'news/queensland/rockhampton',
    // 'news/queensland/noosa',
    // 'news/queensland/dalby',
    // 'news/queensland/warwick',
    // 'news/queensland/central-and-north-burnett',
    // 'news/queensland/stanthorpe',
    // 'news/queensland/fraser-coast',
    // 'news/queensland/bundaberg',
    // 'news/queensland/gladstone',
    'news/queensland/mackay'
];
var dtNewsRegionas = [
    // 'news/nsw/grafton',
    // 'news/nsw/tweed-heads',
    // 'news/nsw/byron-shire',
    // 'news/nsw/lismore',
    // 'news/nsw/ballina',
    // 'news/nsw/coffs-harbour'
];

var lookupKey = function(arr, config){
    var key, len;
    for (len = arr.length; len > 0; --len) {
        key = arr.slice(0, len).join('/');
        lastSlicedPath = key;
        if( config && config[key] ){
            logger.push('Path: '+key);
            return config[key];
        }
    }
    return null;
};

function getId() {
    var wut = window.utag_data || {},
    net_site = wut.net_site && wut.net_site.replace("_sops", ""),
    siteconfs = getSiteConfigs();

    net_site = net_site && net_site.replace(/\s/g, "");
    var hostName = getLocation().hostname || '',
    pathName = getLocation().pathname || '/',
    paths = [],
    id = null,
    config = siteconfs[net_site];

    if (pathName.length > 1) paths = pathName.substring(1).split("/");
    ////////////////////////////////////////////////////
    // Handles News Regional DT, TCM
    ////////////////////////////////////////////////////
    var newsRegional = null, nrmPath;
    if( net_site === 'tcm' || net_site === 'dtm' || net_site === 'dt' ){
        newsRegional = []
            .concat(tcmNewsRegionals)
            .concat(dtNewsRegionas)
            .filter(function(p){ return pathName.indexOf(p) !== -1; });
    }
    if( newsRegional && newsRegional.length !== 0 ) {
        nrmPath = newsRegional[0];
        logger.push('Path: '+nrmPath);
        return config && config[nrmPath];
    }
    ////////////////////////////////////////////////////
    // Handle net_site mapping for special case domain
    ////////////////////////////////////////////////////
    var removeTestEnv = /(beta|staging\.|dev\.|sit\.|uat\.)\.|\.(staging|integration)\.apnarm\.net\.au|sit|uat|https\:\/\/|www./g;
    var trimmedDomain = hostName.replace(removeTestEnv,"");
    if(trimmedDomain.indexOf('codesports.com.au') > -1) net_site = 'codesports';
    // if(trimmedDomain.indexOf('mytributes.com.au') > -1) net_site = 'myt';
    if(trimmedDomain.indexOf('supercoach.com.au') > -1 ) net_site = 'supercoach';
    if(trimmedDomain.indexOf('theaustralianplus.com.au') > -1 ) net_site = 'taus.plus';
    if(trimmedDomain.indexOf('supercoach.dailytelegraph') > -1 ) net_site = 'sc.dtm';
    if(trimmedDomain.indexOf('supercoach.heraldsun') > -1 ) net_site = 'sc.hwt';
    if(trimmedDomain.indexOf('supercoach.couriermail') > -1 ) net_site = 'sc.tcm';
    if(trimmedDomain.indexOf('supercoach.adelaidenow') > -1 ) net_site = 'sc.adv';
    if(trimmedDomain.indexOf('supercoach.themercury') > -1 ) net_site = 'sc.tmrc';
    if(trimmedDomain.indexOf('supercoach.cairnspost') > -1 ) net_site = 'sc.tcp';
    if(trimmedDomain.indexOf('supercoach.geelongadvertiser') > -1 ) net_site = 'sc.gea';
    if(trimmedDomain.indexOf('supercoach.goldcoastbulletin') > -1 ) net_site = 'sc.gcb';
    if(trimmedDomain.indexOf('supercoach.ntnews') > -1 ) net_site = 'sc.ntn';
    if(trimmedDomain.indexOf('supercoach.townsvillebulletin') > -1 ) net_site = 'sc.ttb';
    if(trimmedDomain.indexOf('supercoach.foxsports') > -1 ) net_site = 'sc.foxs';
    // Newscomau partners
    if(trimmedDomain.indexOf('decider.com') > -1 ) net_site = 'decider';
    if(trimmedDomain.indexOf('pagesix.com') > -1 ) net_site = 'pagesix';
    if(trimmedDomain.indexOf('nypost.com') > -1 ) net_site = 'nypost';
    ////////////////////////////////////////////////////
    // Similar lookup logic in Nielsen
    ////////////////////////////////////////////////////
    config = siteconfs[net_site];
    id = lookupKey(paths, config);
    if(id === null){
        logger.push( 'Path: ' + '/'+lastSlicedPath );
        if ( wut.content_type === 'homepage' || pathName==='/' ) return config && config.homepageId;
        return config && config.sectionId;
    }
    return id;
}
window.nca_ipsos.run = function (){
    var beaconId = getId();
    
    logger.push( 'ID: ' + beaconId );
    debug('IPSOS (r): \n' + logger.join('\r\n') );
    
    // applicable ID is looked up
    qsBuilder.addParams("id", beaconId );
};
/* <![CDATA[ */
(function() {
    window.dm = window.dm || {
        AjaxData: []
    };
    window.dm.AjaxEvent = function(et, d, ssid, ad) {
        dm.AjaxData.push({
            et: et,
            d: d,
            ssid: ssid,
            ad: ad
        });
        if (typeof window.DotMetricsObj != 'undefined') {
            DotMetricsObj.onAjaxDataUpdate();
        }
    };
    
    if( ! isExists ) {
        window.nca_ipsos = window.nca_ipsos || {};
        window.nca_ipsos.run();

        var d = document,
            h = d.getElementsByTagName('head')[0],
            qs = qsBuilder.getParams(),
            s = d.createElement('script');

        s.id = id;
        s.type = 'text/javascript';
        s.async = true;
        s.src = 'https://au-script.dotmetrics.net/door.js'.concat(qs);
        h.appendChild(s);

    }

}()); 
/* ]]> */


window.nca_ipsos.fireSpaBeacon = function(){
    var beaconId = getId();
    debug('IPSOS (spa):' + beaconId);
    window.dm = window.dm || {};    
    dm.AjaxEvent("pageview", null, beaconId);
    return beaconId;
};
(function(){
    // Debugger UI
    var body = document.getElementsByTagName("BODY")[0];
    var line = document.createElement('div');
    line.id = "waypoint";
    line.setAttribute("style", "width:50%; height:1px; border: 0; position:fixed; left:50%; top:50%; transform: translate(-50%,-50%); z-index:10; pointer-events: none; -webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; -webkit-transform: translate(-50%,-50%); -moz-transform: translate(-50%,-50%); z-index:10; -ms-transform: translate(-50%,-50%); z-index:10; -o-transform: translate(-50%,-50%); z-index:10;");

    var galleryInterval = 0,
    prevImg = null,
    nextImg = null,
    GALLERY_INTERVAL = 250,
    wut = window.utag_data || {},
    isOnGalleryPage = (wut.net_content_type==='gallery') || document.querySelector('.gallery_list'),
    rawImgs = document.querySelectorAll('.galleryblock_img'),
    efp = function (x, y) { return document.elementFromPoint(x, y); },
    objImgs = [];
    window.nca_ipsos = window.nca_ipsos || {};

    if(isOnGalleryPage) body.appendChild(line);
    
    if(rawImgs){
        var blocks = Array.prototype.slice.call(rawImgs);
        for( var i = 0; i < blocks.length; i++ ){
            objImgs.push({
                name: 'image-identity' + i,
                seen: false,
                elem: blocks[i]
            });
        }
    }

    function checkGallery(){
        if ( ! window.nca_ipsos.isTabActive() ) return;
        if ( ! isOnGalleryPage) return;
        if ( ! objImgs.length ) return;

        var lineRect = line.getBoundingClientRect();
        var curTarget = null,
        curHasATarget = false;
        for( var i = 0; i < objImgs.length; i++ ){
            curTarget = objImgs[i];
            if( 
                // window.nca_ipsos.isElementVisible(objImgs[i]) &&
                hasScrollAction &&
                (
                    curTarget.elem.contains(efp(lineRect.left, lineRect.top)) ||
                    curTarget.elem.contains(efp(lineRect.right, lineRect.top)) ||
                    curTarget.elem.contains(efp(lineRect.right, lineRect.bottom)) ||
                    curTarget.elem.contains(efp(lineRect.left, lineRect.bottom)) 
                )
            ){
                // NOTE: Caching
                prevImg = curTarget.name;
                curHasATarget = true;

                // NOTE: Logic 
                var vH = window.innerHeight || document.documentElement.clientHeight;
                var vW = window.innerWidth || document.documentElement.clientWidth;
                var curTargetRect = curTarget.elem.getBoundingClientRect();
                var imageTopPlusHalfHeight = curTargetRect.top + (curTargetRect.height/2);
                var halfOfViewportHeight = vH/2;
                var targetPercentInView = 0;
                var headerOffsetHeight = 48;

                if(imageTopPlusHalfHeight >= halfOfViewportHeight) targetPercentInView = (((vH-curTargetRect.top)/curTargetRect.height)*100);
                else targetPercentInView = (((curTargetRect.bottom-headerOffsetHeight)/curTargetRect.height)*100);

                if( prevImg != nextImg ){
                    debug('[IPSOS] Sent Pageview to image-' + curTarget.name);
                    window.nca_ipsos.fireSpaBeacon();
                    nextImg = prevImg;
                }

                // UI Debugger
                if( isOnGalleryPage && !!localStorage.getItem('ipsos_debug')) {

                    var stats = document.createElement('div');
                    stats.id = "percent-debugger";
                    stats.setAttribute("style", "padding:20px;font-size:40px;color:#fff;position:absolute;top:0;left:0;max-width:100%;width:320px;height:100px;background:#3cff004d;border:3px solid #00FF00;");

                    curTarget.elem.style.border = '3px solid #00FF00';
                    targetPercentInView = (targetPercentInView>100) ? 100 : targetPercentInView;
                    if(document.querySelector('#waypoint').childElementCount === 0){
                        stats.innerHTML = Math.floor(targetPercentInView) + '%';
                        line.appendChild(stats);
                    } else {
                        // Need to remove again to update the innerHTML
                        line.removeChild(line.lastElementChild);
                        // Make sure that it add only 1
                        if(document.querySelector('#waypoint').childElementCount === 0){
                            stats.innerHTML = Math.floor(targetPercentInView) + '%';
                            line.appendChild(stats);
                        }
                    }
                }

            } else {
                if( isOnGalleryPage && !!localStorage.getItem('ipsos_debug')) curTarget.elem.style.border = '0';
            }
            // Reset history when no target found.
            if( i === objImgs.length-1 && curHasATarget === false)  prevImg = nextImg = null;
        }
        // lineRect Debugger
        if( isOnGalleryPage && !!localStorage.getItem('ipsos_debug')) line.style.border = '2px solid #00FF00';
        else line.style.border = '0';
    }

    galleryInterval = setInterval(function(){
        checkGallery();
    }, GALLERY_INTERVAL);

})();
})();