import assert from 'assert'
import arrayDiff from 'array-diff';
import universalDiff from 'universal-diff';
import googleDiff2 from '../libs/google_diff_arrays';
import googleDiff from 'diff-match-patch';
import _3WayDiff from '3-way-diff';
import threeWayDiff from 'three-way-merge';
//import diff3 from 'diff3';
import diff3 from '../libs/diff3';
import synchrotron from '../libs/diff';
import Merge from '../src/merger';

xdescribe('diff-comparison', function() {
    this.timeout(60000);

    var s = "КакполуатьудовольствиеотизуениянаукОбуениеизуениезапоминаниевыуиваниеуебаэмоциональнуюреакциюнаэтислованесложнопредсказатьскукаотвращениетоскауныниеипроиеотрыжкимноголетнегоизнасилованиянужнымизнаниямипотюремномурасписаниюНоизуениеегоугоднонеобязанобытьтакимВсеэтинегативныеэмоциинеявляютсянеотъемлемойастьюдобыванияизапоминанияинформацииЕслипонаблюдатьзаподросткомувлееннымкомпигрушкойименноувлееннымполуающимудовольствиеаневтыкающимнапряженноозлобленновнепроходимыйуровеньстановитсязаметнокакмногоеловекможетзапомнитьеслиноваяинформация1нужнаемупрямосейасвладениеейдаетемукакиетобонусыпустьдаженематериальныетипарадостиудовлетворения2сопровождаетсяпозитивнымипереживаниями3всплываетвовремяинтереснойеловекудеятельностикоторойонхоетзаниматьсяименносейасАнглийскиесловазапоминаютсяпакамитемижесамымидетьмикоторыехватаютдвойкизаневыуенныезысызэпэнНалогиескихзадакахбезусилийсосредотаиваютсянеусидивыеинеобуаемыеИтакдалеетобыполуатьудовольствиеотизуенияегоугоднопридетсяпреодолеватьвесьэтотвъевшийсякомплексуеника1убиратьнегативныепривыкиотношенияуверенностисвязанныесуебойПривыкиуитьстрогопопорядкунеподвергатьсомнениюавторитетыуверенностивмоемвозрастеужепоздноматематиканедлядевоекдавлениесостороныобществародителейуителейкоторыезнаюткакправильноКакоесовсемэтимгрузомможетбытьпредвкушениектомутобытотоузнатьизапомнить2создаватьпозитивныепривыкиуверенностиитпСамойважнойяситаюпривыкуориентироватьсянаполуениеудовольствияприизуенииегоугодноПоэтомупронеебудетотдельнаястатьяапокадостатоноосознатьпроувствоватьтакойфактзапомнивсудовольствиемкакуютомелоьтыприобретаешьнеизмеримобольшеемвызубривпараграфуебникаснеослабевающимотвращениемтвояжизньулушитсяпрямосейасведьтыиспытываешьудовольствиеинформациязапомнитсялушепростозасетприятныхпереживанийвовремяееполуенияПодтвержденоэкспериментамивтомисленалюдяхполуивнебольшойхорошопонятыйкусоекинформациитысбольшойвероятностьюзахоешьдобытьещеодинкусоекрасширивсвоизнанияЛабораторнаякрысаприходитвторойитретийистотретийраззакусокомсахаравтоместогдеейегодаютНеужелитыглупеекрысыиполуивудовольствиеотмелкогокусказнанийнезахоешьузнатьещетотоГлава2тотакоегенГенэтоуастокмолекулыДНКпокоторомуможетбытьпостроенбелокилимолекулаРНКЭтотбелокилиРНКмогутпригодитьсясамойклеткеилионаможетпроизводитьэтонаэкспорттотакоеРНКэтопохожаянаДНКмолекуланопосвоимфункциямоеньсильноотнееотлиаетсяДНКсодержитгеныисуществуютввидедвойнойспиралиаРНКсуществуетввидеодинарнойцепокианедвойнойиащевсеговыполняетразныеобслуживающиефункцииКакнибудьпотоммыобэтомрасскажемподробнейГлава3тотакоегеномГеномэтонабормолекулДНКнаходящийсявклеткеОнсодержитполнуюинформациюопризнакахорганизмапередающихсяпонаследствуТолько15геномаеловеказанимаютгенытеуасткиДНКпокоторымстроятсяиспользуемыеорганизмомбелкиимолекулыРНКОстальнаяастьнашегогеномаконеножетожедляеготонужнаиуеныеактивноразбираютсязатоотвеаеткаждыйуастокнесодержащейгеныДНКИмногоегоинтересногонаходятМногиеуасткиДНКкоторыераньшеназывалимусорныминасамомделесодержатважнуюинформациюрегулирующуюработугеновВсегоуеловекаоколо28000активныхгеновтонамн";

    var s0 = "", s1 = "", s2 = "";
    var searchChars = "оатиснепрлвд".split('');
    var replaceChars = "QWERTYUIOPASDFGZXCVBNM".split('');
    for (let i = 0; i < 10; i++) {
        var j = i;
        s0 += s.replace(new RegExp(searchChars[i % searchChars.length], "g"), replaceChars[(j++) % replaceChars.length]);
        s1 += s.replace(new RegExp(searchChars[i % searchChars.length], "g"), replaceChars[(j++) % replaceChars.length]);
        s2 += s.replace(new RegExp(searchChars[i % searchChars.length], "g"), replaceChars[(j++) % replaceChars.length]);
    }
    var countDifferences0 = s0.match(/[QWERTYUIOPASDFGZXCVBNM]+/g).length;
    var countDifferences1 = s1.match(/[QWERTYUIOPASDFGZXCVBNM]+/g).length;
    var countDifferences2 = s2.match(/[QWERTYUIOPASDFGZXCVBNM]+/g).length;

    //var s3 = "огоменьшеемполагалиизнаальноЭтосвязаностемтогенымогутиспользоватьсяпоразномукакконструкторЕсливзять20кусоковконструктораизнихможнослепитьскажемвелосипедНоможноотложить10кусоковвсторонуаизостальныхвылепитьсамокатВприродетакипроисходитТакоймеханизмназываетсяальтернативныйсплайсингПоэтомуизодногоитогожегенаможносделатьмногоегохорошегоивкусногоГеномеловекасостоитиз23пархромосомвсумме46хромосомгдекаждаяхромосомасодержитсотнигеновразделнныхмежгеннымпространствомГлава4КровьплазмаформенныеэлементыальбуминыглобулиныфибриногеныСтокизренияфизиологиикровьявляетсятканьюорганизмаЖидкойтканьюОнасостоитиздвухастейПерваяПЛАЗМАсобственножидкаяастьвкоторойплаваютразныебелкиаминокислотыуглеводыферментыжирысолигормоныатакжерастворенныегазыВтораятакназываемыеФОРМЕННЫЕЭЛЕМЕНТЫэритроцитылейкоцитытромбоцитыПлазмыоколо60массыФорменныхэлементовоколо40Есливзятьотдельноплазмутоводывнейоколо90Исоответственно10сухоговеществаВэтомсухомвеществебольшевсегобелковОсновныебелкикровиАЛЬБУМИНЫГЛОБУЛИНЫФИБРИНОГЕНЫВотивстеперьутебяестьсамоегрубоепредставлениеоструктурекровиАтеперьофункцияхФункцийукровимного1ДЫХАТЕЛЬНАЯпереноситкислородизлегкихвовсеорганыаобратновлегкиепереноситуглекислыйгаз2ТРОФИЕСКАЯдоставляеторганампитательныевещества3ЗАЩИТНАЯобеспеиваетгуморальныйиклетоныйиммунитетсвертываниекровипритравмах4ВЫДЕЛИТЕЛЬНАЯудалениеитранспортировкавпокипродуктовобменавеществ5ГОМЕОСТАТИЕСКАЯподдерживаетворганизмепостоянствовнутреннейсреды6РЕГУЛЯТОРНАЯерезкровьилимфутранспортируютсягормоныидругиебиологиескиактивныевеществаПотеря30кровивлеетсмертьКровьэтожизньСкажемнетвампирамивурдалакамГлава5ГипофизобщаяинформацияГормонростаУоснованиянашегомозгавуглубленииерепалежитжелезаподназваниемГИПОФИЗЖЕЛЕЗАэтотакойорганкоторыйтотопроизводитивыделяетизсебятонужноорганизмуГипофизвелиинойсгорошинуихарактеризуетсянеобыайныммогуществомОнСЕКРЕТИРУЕТтевыделяетшестьгормоновкоторыесовместнымиусилиямирегулируютразвитиемолоныхжелезуподрастающихдевоекисекрециюмолокауродившихженщинвыработкуспермыумужинисозреваниеяйцеклетокуженщиннашиаллергиескиереакцииитокакмысправляемсясострессомНобольшаяастьгипофизапредназнаенадляпроизводстваГОРМОНАРОСТАеговырабатываетсяв1000разбольшеемвсехпятиостальныхгормоновСекретируемыйвкровьгормонростациркулируетповсемутелуОнотдаетклеткаморганизмапростойприказРаститеиделитесьГормонростаконенонеединственнаямолекулакотораяможетэтоделатьВкаждоморганеимеютсясобственныемолекулярныемеханизмыдлярегуляцииегоразмеровиформыноспособностьгормонаростараспространятьсяповсемутелуизединогоистоникаознааеттоонодновременноконтролируетроствсехтканейумножаетнашуплотьикостиУЙозефаБорувласкогопридворногокарликаМарииТерезииэрцгерцогиняАвстрииикоролеваВенгриис1741по1780ггимелисьвсепризнакинедостаткагормонаростателосразмерамиипропорциямиетырехлетнегоребенказапоздалоеполовоеразвитиеиживойзрелыйумНевозможнотоноидентифицироватьприинумолекулярногосбояМутациявлюбомизполудюжиныгеновконтролирующихрегуляциюгормонаростаможетбытьответственназанизкорослостьБорувласкогоНеисклюеноидругоегормонаростаунегобылодостатононоотсутств";

    // var s0 = "This is a '''list of newspapers published by [[Journal Register Company]]'''.\n\nThe company owns daily and weekly newspapers, other print media properties and newspaper-affiliated local Websites in the [[U.S.]] states of [[Connecticut]], [[Michigan]], [[New York]], [[Ohio]] and [[Pennsylvania]], organized in six geographic \"clusters\":<ref>[http://www.journalregister.com/newspapers.html Journal Register Company: Our Newspapers], accessed February 10, 2008.</ref>\n\n== Capital-Saratoga ==\nThree dailies, associated weeklies and [[pennysaver]]s in greater [[Albany, New York]]; also [http://www.capitalcentral.com capitalcentral.com] and [http://www.jobsinnewyork.com JobsInNewYork.com].\n\n* ''The Oneida Daily Dispatch'' {{WS|oneidadispatch.com}} of [[Oneida, New York]]\n* ''[[The Record (Troy)|The Record]]'' {{WS|troyrecord.com}} of [[Troy, New York]]\n* ''[[The Saratogian]]'' {{WS|saratogian.com}} of [[Saratoga Springs, New York]]\n* Weeklies:\n** ''Community News'' {{WS|cnweekly.com}} weekly of [[Clifton Park, New York]]\n** ''Rome Observer'' of [[Rome, New York]]\n** ''Life & Times of Utica'' of [[Utica, New York]]\n\n== Connecticut ==\nFive dailies, associated weeklies and [[pennysaver]]s in the state of [[Connecticut]]; also [http://www.ctcentral.com CTcentral.com], [http://www.ctcarsandtrucks.com CTCarsAndTrucks.com] and [http://www.jobsinct.com JobsInCT.com].\n\n* ''The Middletown Press'' {{WS|middletownpress.com}} of [[Middletown, Connecticut|Middletown]]\n* ''[[New Haven Register]]'' {{WS|newhavenregister.com}} of [[New Haven, Connecticut|New Haven]]\n* ''The Register Citizen'' {{WS|registercitizen.com}} of [[Torrington, Connecticut|Torrington]]\n\n* [[New Haven Register#Competitors|Elm City Newspapers]] {{WS|ctcentral.com}}\n** ''The Advertiser'' of [[East Haven, Connecticut|East Haven]]\n** ''Hamden Chronicle'' of [[Hamden, Connecticut|Hamden]]\n** ''Milford Weekly'' of [[Milford, Connecticut|Milford]]\n** ''The Orange Bulletin'' of [[Orange, Connecticut|Orange]]\n** ''The Post'' of [[North Haven, Connecticut|North Haven]]\n** ''Shelton Weekly'' of [[Shelton, Connecticut|Shelton]]\n** ''The Stratford Bard'' of [[Stratford, Connecticut|Stratford]]\n** ''Wallingford Voice'' of [[Wallingford, Connecticut|Wallingford]]\n** ''West Haven News'' of [[West Haven, Connecticut|West Haven]]\n* Housatonic Publications\n** ''The New Milford Times'' {{WS|newmilfordtimes.com}} of [[New Milford, Connecticut|New Milford]]\n** ''The Brookfield Journal'' of [[Brookfield, Connecticut|Brookfield]]\n** ''The Kent Good Times Dispatch'' of [[Kent, Connecticut|Kent]]\n** ''The Bethel Beacon'' of [[Bethel, Connecticut|Bethel]]\n** ''The Litchfield Enquirer'' of [[Litchfield, Connecticut|Litchfield]]\n** ''Litchfield County Times'' of [[Litchfield, Connecticut|Litchfield]]\n* Imprint Newspapers {{WS|imprintnewspapers.com}}\n** ''West Hartford News'' of [[West Hartford, Connecticut|West Hartford]]\n** ''Windsor Journal'' of [[Windsor, Connecticut|Windsor]]\n** ''Windsor Locks Journal'' of [[Windsor Locks, Connecticut|Windsor Locks]]\n** ''Avon Post'' of [[Avon, Connecticut|Avon]]\n** ''Farmington Post'' of [[Farmington, Connecticut|Farmington]]\n** ''Simsbury Post'' of [[Simsbury, Connecticut|Simsbury]]\n** ''Tri-Town Post'' of [[Burlington, Connecticut|Burlington]], [[Canton, Connecticut|Canton]] and [[Harwinton, Connecticut|Harwinton]]\n* Minuteman Publications\n** ''[[Fairfield Minuteman]]'' of [[Fairfield, Connecticut|Fairfield]]\n** ''The Westport Minuteman'' {{WS|westportminuteman.com}} of [[Westport, Connecticut|Westport]]\n* Shoreline Newspapers weeklies:\n** ''Branford Review'' of [[Branford, Connecticut|Branford]]\n** ''Clinton Recorder'' of [[Clinton, Connecticut|Clinton]]\n** ''The Dolphin'' of [[Naval Submarine Base New London]] in [[New London, Connecticut|New London]]\n** ''Main Street News'' {{WS|ctmainstreetnews.com}} of [[Essex, Connecticut|Essex]]\n** ''Pictorial Gazette'' of [[Old Saybrook, Connecticut|Old Saybrook]]\n** ''Regional Express'' of [[Colchester, Connecticut|Colchester]]\n** ''Regional Standard'' of [[Colchester, Connecticut|Colchester]]\n** ''Shoreline Times'' {{WS|shorelinetimes.com}} of [[Guilford, Connecticut|Guilford]]\n** ''Shore View East'' of [[Madison, Connecticut|Madison]]\n** ''Shore View West'' of [[Guilford, Connecticut|Guilford]]\n* Other weeklies:\n** ''Registro'' {{WS|registroct.com}} of [[New Haven, Connecticut|New Haven]]\n** ''Thomaston Express'' {{WS|thomastownexpress.com}} of [[Thomaston, Connecticut|Thomaston]]\n** ''Foothills Traders'' {{WS|foothillstrader.com}} of Torrington, Bristol, Canton\n\n== Michigan ==\nFour dailies, associated weeklies and [[pennysaver]]s in the state of [[Michigan]]; also [http://www.micentralhomes.com MIcentralhomes.com] and [http://www.micentralautos.com MIcentralautos.com]\n* ''[[Oakland Press]]'' {{WS|theoaklandpress.com}} of [[Oakland, Michigan|Oakland]]\n* ''Daily Tribune'' {{WS|dailytribune.com}} of [[Royal Oak, Michigan|Royal Oak]]\n* ''Macomb Daily'' {{WS|macombdaily.com}} of [[Mt. Clemens, Michigan|Mt. Clemens]]\n* ''[[Morning Sun]]'' {{WS|themorningsun.com}} of  [[Mount Pleasant, Michigan|Mount Pleasant]]\n* Heritage Newspapers {{WS|heritage.com}}\n** ''Belleville View''\n** ''Ile Camera''\n** ''Monroe Guardian''\n** ''Ypsilanti Courier''\n** ''News-Herald''\n** ''Press & Guide''\n** ''Chelsea Standard & Dexter Leader''\n** ''Manchester Enterprise''\n** ''Milan News-Leader''\n** ''Saline Reporter''\n* Independent Newspapers {{WS|sourcenewspapers.com}}\n** ''Advisor''\n** ''Source''\n* Morning Star {{WS|morningstarpublishing.com}}\n** ''Alma Reminder''\n** ''Alpena Star''\n** ''Antrim County News''\n** ''Carson City Reminder''\n** ''The Leader & Kalkaskian''\n** ''Ogemaw/Oscoda County Star''\n** ''Petoskey/Charlevoix Star''\n** ''Presque Isle Star''\n** ''Preview Community Weekly''\n** ''Roscommon County Star''\n** ''St. Johns Reminder''\n** ''Straits Area Star''\n** ''The (Edmore) Advertiser''\n* Voice Newspapers {{WS|voicenews.com}}\n** ''Armada Times''\n** ''Bay Voice''\n** ''Blue Water Voice''\n** ''Downriver Voice''\n** ''Macomb Township Voice''\n** ''North Macomb Voice''\n** ''Weekend Voice''\n** ''Suburban Lifestyles'' {{WS|suburbanlifestyles.com}}\n\n== Mid-Hudson ==\nOne daily, associated magazines in the [[Hudson River Valley]] of [[New York]]; also [http://www.midhudsoncentral.com MidHudsonCentral.com] and [http://www.jobsinnewyork.com JobsInNewYork.com].\n\n* ''[[Daily Freeman]]'' {{WS|dailyfreeman.com}} of [[Kingston, New York]]\n\n== Ohio ==\nTwo dailies, associated magazines and three shared Websites, all in the state of [[Ohio]]: [http://www.allaroundcleveland.com AllAroundCleveland.com], [http://www.allaroundclevelandcars.com AllAroundClevelandCars.com] and [http://www.allaroundclevelandjobs.com AllAroundClevelandJobs.com].\n\n* ''[[The News-Herald (Ohio)|The News-Herald]]'' {{WS|news-herald.com}} of [[Willoughby, Ohio|Willoughby]]\n* ''[[The Morning Journal]]'' {{WS|morningjournal.com}} of [[Lorain, Ohio|Lorain]]\n\n== Philadelphia area ==\nSeven dailies and associated weeklies and magazines in [[Pennsylvania]] and [[New Jersey]], and associated Websites: [http://www.allaroundphilly.com AllAroundPhilly.com], [http://www.jobsinnj.com JobsInNJ.com], [http://www.jobsinpa.com JobsInPA.com], and [http://www.phillycarsearch.com PhillyCarSearch.com].\n\n* ''The Daily Local'' {{WS|dailylocal.com}} of [[West Chester, Pennsylvania|West Chester]]\n* ''[[Delaware County Daily and Sunday Times]] {{WS|delcotimes.com}} of Primos\n* ''[[The Mercury (Pennsylvania)|The Mercury]]'' {{WS|pottstownmercury.com}} of [[Pottstown, Pennsylvania|Pottstown]]\n* ''The Phoenix'' {{WS|phoenixvillenews.com}} of [[Phoenixville, Pennsylvania|Phoenixville]]\n* ''[[The Reporter (Lansdale)|The Reporter]]'' {{WS|thereporteronline.com}} of [[Lansdale, Pennsylvania|Lansdale]]\n* ''The Times Herald'' {{WS|timesherald.com}} of [[Norristown, Pennsylvania|Norristown]]\n* ''[[The Trentonian]]'' {{WS|trentonian.com}} of [[Trenton, New Jersey]]\n\n* Weeklies\n** ''El Latino Expreso'' of [[Trenton, New Jersey]]\n** ''La Voz'' of [[Norristown, Pennsylvania]]\n** ''The Village News'' of [[Downingtown, Pennsylvania]]\n** ''The Times Record'' of [[Kennett Square, Pennsylvania]]\n** ''The Tri-County Record'' {{WS|tricountyrecord.com}} of [[Morgantown, Pennsylvania]]\n** ''News of Delaware County'' {{WS|newsofdelawarecounty.com}}of [[Havertown, Pennsylvania]]\n** ''Main Line Times'' {{WS|mainlinetimes.com}}of [[Ardmore, Pennsylvania]]\n** ''Penny Pincher'' of [[Pottstown, Pennsylvania]]\n** ''Town Talk'' {{WS|towntalknews.com}} of [[Ridley, Pennsylvania]]\n* Chesapeake Publishing {{WS|pa8newsgroup.com}}\n** ''Solanco Sun Ledger'' of [[Quarryville, Pennsylvania]]\n** ''Columbia Ledger'' of [[Columbia, Pennsylvania]]\n** ''Coatesville Ledger'' of [[Downingtown, Pennsylvania]]\n** ''Parkesburg Post Ledger'' of [[Quarryville, Pennsylvania]]\n** ''Downingtown Ledger'' of [[Downingtown, Pennsylvania]]\n** ''The Kennett Paper'' of [[Kennett Square, Pennsylvania]]\n** ''Avon Grove Sun'' of [[West Grove, Pennsylvania]]\n** ''Oxford Tribune'' of [[Oxford, Pennsylvania]]\n** ''Elizabethtown Chronicle'' of [[Elizabethtown, Pennsylvania]]\n** ''Donegal Ledger'' of [[Donegal, Pennsylvania]]\n** ''Chadds Ford Post'' of [[Chadds Ford, Pennsylvania]]\n** ''The Central Record'' of [[Medford, New Jersey]]\n** ''Maple Shade Progress'' of [[Maple Shade, New Jersey]]\n* Intercounty Newspapers {{WS|buckslocalnews.com}}\n** ''The Review'' of Roxborough, Pennsylvania\n** ''The Recorder'' of [[Conshohocken, Pennsylvania]]\n** ''The Leader'' of [[Mount Airy, Pennsylvania|Mount Airy]] and West Oak Lake, Pennsylvania\n** ''The Pennington Post'' of [[Pennington, New Jersey]]\n** ''The Bristol Pilot'' of [[Bristol, Pennsylvania]]\n** ''Yardley News'' of [[Yardley, Pennsylvania]]\n** ''New Hope Gazette'' of [[New Hope, Pennsylvania]]\n** ''Doylestown Patriot'' of [[Doylestown, Pennsylvania]]\n** ''Newtown Advance'' of [[Newtown, Pennsylvania]]\n** ''The Plain Dealer'' of [[Williamstown, New Jersey]]\n** ''News Report'' of [[Sewell, New Jersey]]\n** ''Record Breeze'' of [[Berlin, New Jersey]]\n** ''Newsweekly'' of [[Moorestown, New Jersey]]\n** ''Haddon Herald'' of [[Haddonfield, New Jersey]]\n** ''New Egypt Press'' of [[New Egypt, New Jersey]]\n** ''Community News'' of [[Pemberton, New Jersey]]\n** ''Plymouth Meeting Journal'' of [[Plymouth Meeting, Pennsylvania]]\n** ''Lafayette Hill Journal'' of [[Lafayette Hill, Pennsylvania]]\n* Montgomery Newspapers {{WS|montgomerynews.com}}\n** ''Ambler Gazette'' of [[Ambler, Pennsylvania]]\n** ''Central Bucks Life'' of [[Bucks County, Pennsylvania]]\n** ''The Colonial'' of [[Plymouth Meeting, Pennsylvania]]\n** ''Glenside News'' of [[Glenside, Pennsylvania]]\n** ''The Globe'' of [[Lower Moreland Township, Pennsylvania]]\n** ''Main Line Life'' of [[Ardmore, Pennsylvania]]\n** ''Montgomery Life'' of [[Fort Washington, Pennsylvania]]\n** ''North Penn Life'' of [[Lansdale, Pennsylvania]]\n** ''Perkasie News Herald'' of [[Perkasie, Pennsylvania]]\n** ''Public Spirit'' of [[Hatboro, Pennsylvania]]\n** ''Souderton Independent'' of [[Souderton, Pennsylvania]]\n** ''Springfield Sun'' of [[Springfield, Pennsylvania]]\n** ''Spring-Ford Reporter'' of [[Royersford, Pennsylvania]]\n** ''Times Chronicle'' of [[Jenkintown, Pennsylvania]]\n** ''Valley Item'' of [[Perkiomenville, Pennsylvania]]\n** ''Willow Grove Guide'' of [[Willow Grove, Pennsylvania]]\n* News Gleaner Publications (closed December 2008) {{WS|newsgleaner.com}}\n** ''Life Newspapers'' of [[Philadelphia, Pennsylvania]]\n* Suburban Publications\n** ''The Suburban & Wayne Times'' {{WS|waynesuburban.com}} of [[Wayne, Pennsylvania]]\n** ''The Suburban Advertiser'' of [[Exton, Pennsylvania]]\n** ''The King of Prussia Courier'' of [[King of Prussia, Pennsylvania]]\n* Press Newspapers {{WS|countypressonline.com}}\n** ''County Press'' of [[Newtown Square, Pennsylvania]]\n** ''Garnet Valley Press'' of [[Glen Mills, Pennsylvania]]\n** ''Haverford Press'' of [[Newtown Square, Pennsylvania]] (closed January 2009)\n** ''Hometown Press'' of [[Glen Mills, Pennsylvania]] (closed January 2009)\n** ''Media Press'' of [[Newtown Square, Pennsylvania]] (closed January 2009)\n** ''Springfield Press'' of [[Springfield, Pennsylvania]]\n* Berks-Mont Newspapers {{WS|berksmontnews.com}}\n** ''The Boyertown Area Times'' of [[Boyertown, Pennsylvania]]\n** ''The Kutztown Area Patriot'' of [[Kutztown, Pennsylvania]]\n** ''The Hamburg Area Item'' of [[Hamburg, Pennsylvania]]\n** ''The Southern Berks News'' of [[Exeter Township, Berks County, Pennsylvania]]\n** ''The Free Press'' of [[Quakertown, Pennsylvania]]\n** ''The Saucon News'' of [[Quakertown, Pennsylvania]]\n** ''Westside Weekly'' of [[Reading, Pennsylvania]]\n\n* Magazines\n** ''Bucks Co. Town & Country Living''\n** ''Chester Co. Town & Country Living''\n** ''Montomgery Co. Town & Country Living''\n** ''Garden State Town & Country Living''\n** ''Montgomery Homes''\n** ''Philadelphia Golfer''\n** ''Parents Express''\n** ''Art Matters''\n\n{{JRC}}\n\n==References==\n<references />\n\n[[Category:Journal Register publications|*]]\n";
    // var s1 = "This is a '''list of newspapers pyblished by [[Joyrnal Register Company]]'''.\n\nThe company owns daily and weekly newspapers, other print media properties and newspaper-affiliated local Websites in the [[y.S.]] states of [[Connecticyt]], [[Michigan]], [[New York]], [[Ohio]] and [[Pennsylvania]], organized in six geographic \"clysters\":<ref>[http://www.joyrnalregister.com/newspapers.html Joyrnal Register Company: Oyr Newspapers], accessed Febryary 10, 2008.</ref>\n\n== Capital-Saratoga ==\nThree dailies, associated weeklies and [[pennysaver]]s in greater [[Albany, New York]]; also [http://www.capitalcentral.com capitalcentral.com] and [http://www.jobsinnewyork.com JobsInNewYork.com].\n\n* ''The Oneida Daily Dispatch'' {{WS|oneidadispatch.com}} of [[Oneida, New York]]\n* ''[[The Record (Troy)|The Record]]'' {{WS|troyrecord.com}} of [[Troy, New York]]\n* ''[[The Saratogian]]'' {{WS|saratogian.com}} of [[Saratoga Springs, New York]]\n* Weeklies:\n** ''Commynity News'' {{WS|cnweekly.com}} weekly of [[Clifton Park, New York]]\n** ''Rome Observer'' of [[Rome, New York]]\n** ''Life & Times of ytica'' of [[ytica, New York]]\n\n== Connecticyt ==\nFive dailies, associated weeklies and [[pennysaver]]s in the state of [[Connecticyt]]; also [http://www.ctcentral.com CTcentral.com], [http://www.ctcarsandtrycks.com CTCarsAndTrycks.com] and [http://www.jobsinct.com JobsInCT.com].\n\n* ''The Middletown Press'' {{WS|middletownpress.com}} of [[Middletown, Connecticyt|Middletown]]\n* ''[[New Haven Register]]'' {{WS|newhavenregister.com}} of [[New Haven, Connecticyt|New Haven]]\n* ''The Register Citizen'' {{WS|registercitizen.com}} of [[Torrington, Connecticyt|Torrington]]\n\n* [[New Haven Register#Competitors|Elm City Newspapers]] {{WS|ctcentral.com}}\n** ''The Advertiser'' of [[East Haven, Connecticyt|East Haven]]\n** ''Hamden Chronicle'' of [[Hamden, Connecticyt|Hamden]]\n** ''Milford Weekly'' of [[Milford, Connecticyt|Milford]]\n** ''The Orange Bylletin'' of [[Orange, Connecticyt|Orange]]\n** ''The Post'' of [[North Haven, Connecticyt|North Haven]]\n** ''Shelton Weekly'' of [[Shelton, Connecticyt|Shelton]]\n** ''The Stratford Bard'' of [[Stratford, Connecticyt|Stratford]]\n** ''Wallingford Voice'' of [[Wallingford, Connecticyt|Wallingford]]\n** ''West Haven News'' of [[West Haven, Connecticyt|West Haven]]\n* Hoysatonic Pyblications\n** ''The New Milford Times'' {{WS|newmilfordtimes.com}} of [[New Milford, Connecticyt|New Milford]]\n** ''The Brookfield Joyrnal'' of [[Brookfield, Connecticyt|Brookfield]]\n** ''The Kent Good Times Dispatch'' of [[Kent, Connecticyt|Kent]]\n** ''The Bethel Beacon'' of [[Bethel, Connecticyt|Bethel]]\n** ''The Litchfield Enqyirer'' of [[Litchfield, Connecticyt|Litchfield]]\n** ''Litchfield Coynty Times'' of [[Litchfield, Connecticyt|Litchfield]]\n* Imprint Newspapers {{WS|imprintnewspapers.com}}\n** ''West Hartford News'' of [[West Hartford, Connecticyt|West Hartford]]\n** ''Windsor Joyrnal'' of [[Windsor, Connecticyt|Windsor]]\n** ''Windsor Locks Joyrnal'' of [[Windsor Locks, Connecticyt|Windsor Locks]]\n** ''Avon Post'' of [[Avon, Connecticyt|Avon]]\n** ''Farmington Post'' of [[Farmington, Connecticyt|Farmington]]\n** ''Simsbyry Post'' of [[Simsbyry, Connecticyt|Simsbyry]]\n** ''Tri-Town Post'' of [[Byrlington, Connecticyt|Byrlington]], [[Canton, Connecticyt|Canton]] and [[Harwinton, Connecticyt|Harwinton]]\n* Minyteman Pyblications\n** ''[[Fairfield Minyteman]]'' of [[Fairfield, Connecticyt|Fairfield]]\n** ''The Westport Minyteman'' {{WS|westportminyteman.com}} of [[Westport, Connecticyt|Westport]]\n* Shoreline Newspapers weeklies:\n** ''Branford Review'' of [[Branford, Connecticyt|Branford]]\n** ''Clinton Recorder'' of [[Clinton, Connecticyt|Clinton]]\n** ''The Dolphin'' of [[Naval Sybmarine Base New London]] in [[New London, Connecticyt|New London]]\n** ''Main Street News'' {{WS|ctmainstreetnews.com}} of [[Essex, Connecticyt|Essex]]\n** ''Pictorial Gazette'' of [[Old Saybrook, Connecticyt|Old Saybrook]]\n** ''Regional Express'' of [[Colchester, Connecticyt|Colchester]]\n** ''Regional Standard'' of [[Colchester, Connecticyt|Colchester]]\n** ''Shoreline Times'' {{WS|shorelinetimes.com}} of [[Gyilford, Connecticyt|Gyilford]]\n** ''Shore View East'' of [[Madison, Connecticyt|Madison]]\n** ''Shore View West'' of [[Gyilford, Connecticyt|Gyilford]]\n* Other weeklies:\n** ''Registro'' {{WS|registroct.com}} of [[New Haven, Connecticyt|New Haven]]\n** ''Thomaston Express'' {{WS|thomastownexpress.com}} of [[Thomaston, Connecticyt|Thomaston]]\n** ''Foothills Traders'' {{WS|foothillstrader.com}} of Torrington, Bristol, Canton\n\n== Michigan ==\nFoyr dailies, associated weeklies and [[pennysaver]]s in the state of [[Michigan]]; also [http://www.micentralhomes.com MIcentralhomes.com] and [http://www.micentralaytos.com MIcentralaytos.com]\n* ''[[Oakland Press]]'' {{WS|theoaklandpress.com}} of [[Oakland, Michigan|Oakland]]\n* ''Daily Tribyne'' {{WS|dailytribyne.com}} of [[Royal Oak, Michigan|Royal Oak]]\n* ''Macomb Daily'' {{WS|macombdaily.com}} of [[Mt. Clemens, Michigan|Mt. Clemens]]\n* ''[[Morning Syn]]'' {{WS|themorningsyn.com}} of  [[Moynt Pleasant, Michigan|Moynt Pleasant]]\n* Heritage Newspapers {{WS|heritage.com}}\n** ''Belleville View''\n** ''Ile Camera''\n** ''Monroe Gyardian''\n** ''Ypsilanti Coyrier''\n** ''News-Herald''\n** ''Press & Gyide''\n** ''Chelsea Standard & Dexter Leader''\n** ''Manchester Enterprise''\n** ''Milan News-Leader''\n** ''Saline Reporter''\n* Independent Newspapers {{WS|soyrcenewspapers.com}}\n** ''Advisor''\n** ''Soyrce''\n* Morning Star {{WS|morningstarpyblishing.com}}\n** ''Alma Reminder''\n** ''Alpena Star''\n** ''Antrim Coynty News''\n** ''Carson City Reminder''\n** ''The Leader & Kalkaskian''\n** ''Ogemaw/Oscoda Coynty Star''\n** ''Petoskey/Charlevoix Star''\n** ''Presqye Isle Star''\n** ''Preview Commynity Weekly''\n** ''Roscommon Coynty Star''\n** ''St. Johns Reminder''\n** ''Straits Area Star''\n** ''The (Edmore) Advertiser''\n* Voice Newspapers {{WS|voicenews.com}}\n** ''Armada Times''\n** ''Bay Voice''\n** ''Blye Water Voice''\n** ''Downriver Voice''\n** ''Macomb Township Voice''\n** ''North Macomb Voice''\n** ''Weekend Voice''\n** ''Sybyrban Lifestyles'' {{WS|sybyrbanlifestyles.com}}\n\n== Mid-Hydson ==\nOne daily, associated magazines in the [[Hydson River Valley]] of [[New York]]; also [http://www.midhydsoncentral.com MidHydsonCentral.com] and [http://www.jobsinnewyork.com JobsInNewYork.com].\n\n* ''[[Daily Freeman]]'' {{WS|dailyfreeman.com}} of [[Kingston, New York]]\n\n== Ohio ==\nTwo dailies, associated magazines and three shared Websites, all in the state of [[Ohio]]: [http://www.allaroyndcleveland.com AllAroyndCleveland.com], [http://www.allaroyndclevelandcars.com AllAroyndClevelandCars.com] and [http://www.allaroyndclevelandjobs.com AllAroyndClevelandJobs.com].\n\n* ''[[The News-Herald (Ohio)|The News-Herald]]'' {{WS|news-herald.com}} of [[Willoyghby, Ohio|Willoyghby]]\n* ''[[The Morning Joyrnal]]'' {{WS|morningjoyrnal.com}} of [[Lorain, Ohio|Lorain]]\n\n== Philadelphia area ==\nSeven dailies and associated weeklies and magazines in [[Pennsylvania]] and [[New Jersey]], and associated Websites: [http://www.allaroyndphilly.com AllAroyndPhilly.com], [http://www.jobsinnj.com JobsInNJ.com], [http://www.jobsinpa.com JobsInPA.com], and [http://www.phillycarsearch.com PhillyCarSearch.com].\n\n* ''The Daily Local'' {{WS|dailylocal.com}} of [[West Chester, Pennsylvania|West Chester]]\n* ''[[Delaware Coynty Daily and Synday Times]] {{WS|delcotimes.com}} of Primos\n* ''[[The Mercyry (Pennsylvania)|The Mercyry]]'' {{WS|pottstownmercyry.com}} of [[Pottstown, Pennsylvania|Pottstown]]\n* ''The Phoenix'' {{WS|phoenixvillenews.com}} of [[Phoenixville, Pennsylvania|Phoenixville]]\n* ''[[The Reporter (Lansdale)|The Reporter]]'' {{WS|thereporteronline.com}} of [[Lansdale, Pennsylvania|Lansdale]]\n* ''The Times Herald'' {{WS|timesherald.com}} of [[Norristown, Pennsylvania|Norristown]]\n* ''[[The Trentonian]]'' {{WS|trentonian.com}} of [[Trenton, New Jersey]]\n\n* Weeklies\n** ''El Latino Expreso'' of [[Trenton, New Jersey]]\n** ''La Voz'' of [[Norristown, Pennsylvania]]\n** ''The Village News'' of [[Downingtown, Pennsylvania]]\n** ''The Times Record'' of [[Kennett Sqyare, Pennsylvania]]\n** ''The Tri-Coynty Record'' {{WS|tricoyntyrecord.com}} of [[Morgantown, Pennsylvania]]\n** ''News of Delaware Coynty'' {{WS|newsofdelawarecoynty.com}}of [[Havertown, Pennsylvania]]\n** ''Main Line Times'' {{WS|mainlinetimes.com}}of [[Ardmore, Pennsylvania]]\n** ''Penny Pincher'' of [[Pottstown, Pennsylvania]]\n** ''Town Talk'' {{WS|towntalknews.com}} of [[Ridley, Pennsylvania]]\n* Chesapeake Pyblishing {{WS|pa8newsgroyp.com}}\n** ''Solanco Syn Ledger'' of [[Qyarryville, Pennsylvania]]\n** ''Colymbia Ledger'' of [[Colymbia, Pennsylvania]]\n** ''Coatesville Ledger'' of [[Downingtown, Pennsylvania]]\n** ''Parkesbyrg Post Ledger'' of [[Qyarryville, Pennsylvania]]\n** ''Downingtown Ledger'' of [[Downingtown, Pennsylvania]]\n** ''The Kennett Paper'' of [[Kennett Sqyare, Pennsylvania]]\n** ''Avon Grove Syn'' of [[West Grove, Pennsylvania]]\n** ''Oxford Tribyne'' of [[Oxford, Pennsylvania]]\n** ''Elizabethtown Chronicle'' of [[Elizabethtown, Pennsylvania]]\n** ''Donegal Ledger'' of [[Donegal, Pennsylvania]]\n** ''Chadds Ford Post'' of [[Chadds Ford, Pennsylvania]]\n** ''The Central Record'' of [[Medford, New Jersey]]\n** ''Maple Shade Progress'' of [[Maple Shade, New Jersey]]\n* Intercoynty Newspapers {{WS|byckslocalnews.com}}\n** ''The Review'' of Roxboroygh, Pennsylvania\n** ''The Recorder'' of [[Conshohocken, Pennsylvania]]\n** ''The Leader'' of [[Moynt Airy, Pennsylvania|Moynt Airy]] and West Oak Lake, Pennsylvania\n** ''The Pennington Post'' of [[Pennington, New Jersey]]\n** ''The Bristol Pilot'' of [[Bristol, Pennsylvania]]\n** ''Yardley News'' of [[Yardley, Pennsylvania]]\n** ''New Hope Gazette'' of [[New Hope, Pennsylvania]]\n** ''Doylestown Patriot'' of [[Doylestown, Pennsylvania]]\n** ''Newtown Advance'' of [[Newtown, Pennsylvania]]\n** ''The Plain Dealer'' of [[Williamstown, New Jersey]]\n** ''News Report'' of [[Sewell, New Jersey]]\n** ''Record Breeze'' of [[Berlin, New Jersey]]\n** ''Newsweekly'' of [[Moorestown, New Jersey]]\n** ''Haddon Herald'' of [[Haddonfield, New Jersey]]\n** ''New Egypt Press'' of [[New Egypt, New Jersey]]\n** ''Commynity News'' of [[Pemberton, New Jersey]]\n** ''Plymoyth Meeting Joyrnal'' of [[Plymoyth Meeting, Pennsylvania]]\n** ''Lafayette Hill Joyrnal'' of [[Lafayette Hill, Pennsylvania]]\n* Montgomery Newspapers {{WS|montgomerynews.com}}\n** ''Ambler Gazette'' of [[Ambler, Pennsylvania]]\n** ''Central Bycks Life'' of [[Bycks Coynty, Pennsylvania]]\n** ''The Colonial'' of [[Plymoyth Meeting, Pennsylvania]]\n** ''Glenside News'' of [[Glenside, Pennsylvania]]\n** ''The Globe'' of [[Lower Moreland Township, Pennsylvania]]\n** ''Main Line Life'' of [[Ardmore, Pennsylvania]]\n** ''Montgomery Life'' of [[Fort Washington, Pennsylvania]]\n** ''North Penn Life'' of [[Lansdale, Pennsylvania]]\n** ''Perkasie News Herald'' of [[Perkasie, Pennsylvania]]\n** ''Pyblic Spirit'' of [[Hatboro, Pennsylvania]]\n** ''Soyderton Independent'' of [[Soyderton, Pennsylvania]]\n** ''Springfield Syn'' of [[Springfield, Pennsylvania]]\n** ''Spring-Ford Reporter'' of [[Royersford, Pennsylvania]]\n** ''Times Chronicle'' of [[Jenkintown, Pennsylvania]]\n** ''Valley Item'' of [[Perkiomenville, Pennsylvania]]\n** ''Willow Grove Gyide'' of [[Willow Grove, Pennsylvania]]\n* News Gleaner Pyblications (closed December 2008) {{WS|newsgleaner.com}}\n** ''Life Newspapers'' of [[Philadelphia, Pennsylvania]]\n* Sybyrban Pyblications\n** ''The Sybyrban & Wayne Times'' {{WS|waynesybyrban.com}} of [[Wayne, Pennsylvania]]\n** ''The Sybyrban Advertiser'' of [[Exton, Pennsylvania]]\n** ''The King of Pryssia Coyrier'' of [[King of Pryssia, Pennsylvania]]\n* Press Newspapers {{WS|coyntypressonline.com}}\n** ''Coynty Press'' of [[Newtown Sqyare, Pennsylvania]]\n** ''Garnet Valley Press'' of [[Glen Mills, Pennsylvania]]\n** ''Haverford Press'' of [[Newtown Sqyare, Pennsylvania]] (closed Janyary 2009)\n** ''Hometown Press'' of [[Glen Mills, Pennsylvania]] (closed Janyary 2009)\n** ''Media Press'' of [[Newtown Sqyare, Pennsylvania]] (closed Janyary 2009)\n** ''Springfield Press'' of [[Springfield, Pennsylvania]]\n* Berks-Mont Newspapers {{WS|berksmontnews.com}}\n** ''The Boyertown Area Times'' of [[Boyertown, Pennsylvania]]\n** ''The Kytztown Area Patriot'' of [[Kytztown, Pennsylvania]]\n** ''The Hambyrg Area Item'' of [[Hambyrg, Pennsylvania]]\n** ''The Soythern Berks News'' of [[Exeter Township, Berks Coynty, Pennsylvania]]\n** ''The Free Press'' of [[Qyakertown, Pennsylvania]]\n** ''The Saycon News'' of [[Qyakertown, Pennsylvania]]\n** ''Westside Weekly'' of [[Reading, Pennsylvania]]\n\n* Magazines\n** ''Bycks Co. Town & Coyntry Living''\n** ''Chester Co. Town & Coyntry Living''\n** ''Montomgery Co. Town & Coyntry Living''\n** ''Garden State Town & Coyntry Living''\n** ''Montgomery Homes''\n** ''Philadelphia Golfer''\n** ''Parents Express''\n** ''Art Matters''\n\n{{JRC}}\n\n==References==\n<references />\n\n[[Category:Joyrnal Register pyblications|*]]\n";
    // var s2 = "This is a '''list of newspapers published by [[Journal Register Company]]'''.\n\nThe company owns daily and weekly newspapers, other print media properties and newspaper-affiliated local Websites in the [[U.S.]] states of [[Connecticut]], [[Michigan]], [[New York]], [[Ohio]], [[Pennsylvania]] and [[New Jersey]], organized in six geographic \"clusters\":<ref>[http://www.journalregister.com/publications.html Journal Register Company: Our Publications], accessed April 21, 2010.</ref>\n\n== Capital-Saratoga ==\nThree dailies, associated weeklies and [[pennysaver]]s in greater [[Albany, New York]]; also [http://www.capitalcentral.com capitalcentral.com] and [http://www.jobsinnewyork.com JobsInNewYork.com].\n\n* ''The Oneida Daily Dispatch'' {{WS|oneidadispatch.com}} of [[Oneida, New York]]\n* ''[[The Record (Troy)|The Record]]'' {{WS|troyrecord.com}} of [[Troy, New York]]\n* ''[[The Saratogian]]'' {{WS|saratogian.com}} of [[Saratoga Springs, New York]]\n* Weeklies:\n** ''Community News'' {{WS|cnweekly.com}} weekly of [[Clifton Park, New York]]\n** ''Rome Observer'' {{WS|romeobserver.com}} of [[Rome, New York]]\n** ''WG Life '' {{WS|saratogian.com/wglife/}} of [[Wilton, New York]]\n** ''Ballston Spa Life '' {{WS|saratogian.com/bspalife}} of [[Ballston Spa, New York]]\n** ''Greenbush Life'' {{WS|troyrecord.com/greenbush}} of [[Troy, New York]]\n** ''Latham Life'' {{WS|troyrecord.com/latham}} of [[Latham, New York]]\n** ''River Life'' {{WS|troyrecord.com/river}} of [[Troy, New York]]\n\n== Connecticut ==\nThree dailies, associated weeklies and [[pennysaver]]s in the state of [[Connecticut]]; also [http://www.ctcentral.com CTcentral.com], [http://www.ctcarsandtrucks.com CTCarsAndTrucks.com] and [http://www.jobsinct.com JobsInCT.com].\n\n* ''The Middletown Press'' {{WS|middletownpress.com}} of [[Middletown, Connecticut|Middletown]]\n* ''[[New Haven Register]]'' {{WS|newhavenregister.com}} of [[New Haven, Connecticut|New Haven]]\n* ''The Register Citizen'' {{WS|registercitizen.com}} of [[Torrington, Connecticut|Torrington]]\n\n* Housatonic Publications\n** ''The Housatonic Times'' {{WS|housatonictimes.com}} of [[New Milford, Connecticut|New Milford]]\n** ''Litchfield County Times'' {{WS|countytimes.com}} of [[Litchfield, Connecticut|Litchfield]]\n\n* Minuteman Publications\n** ''[[Fairfield Minuteman]]'' {{WS|fairfieldminuteman.com}}of [[Fairfield, Connecticut|Fairfield]]\n** ''The Westport Minuteman'' {{WS|westportminuteman.com}} of [[Westport, Connecticut|Westport]]\n\n* Shoreline Newspapers\n** ''The Dolphin'' {{WS|dolphin-news.com}} of [[Naval Submarine Base New London]] in [[New London, Connecticut|New London]]\n** ''Shoreline Times'' {{WS|shorelinetimes.com}} of [[Guilford, Connecticut|Guilford]]\n\n* Foothills Media Group {{WS|foothillsmediagroup.com}}\n** ''Thomaston Express'' {{WS|thomastonexpress.com}} of [[Thomaston, Connecticut|Thomaston]]\n** ''Good News About Torrington'' {{WS|goodnewsabouttorrington.com}} of [[Torrington, Connecticut|Torrington]]\n** ''Granby News'' {{WS|foothillsmediagroup.com/granby}} of [[Granby, Connecticut|Granby]]\n** ''Canton News'' {{WS|foothillsmediagroup.com/canton}} of [[Canton, Connecticut|Canton]]\n** ''Avon News'' {{WS|foothillsmediagroup.com/avon}} of [[Avon, Connecticut|Avon]]\n** ''Simsbury News'' {{WS|foothillsmediagroup.com/simsbury}} of [[Simsbury, Connecticut|Simsbury]]\n** ''Litchfield News'' {{WS|foothillsmediagroup.com/litchfield}} of [[Litchfield, Connecticut|Litchfield]]\n** ''Foothills Trader'' {{WS|foothillstrader.com}} of Torrington, Bristol, Canton\n\n* Other weeklies\n** ''The Milford-Orange Bulletin'' {{WS|ctbulletin.com}} of [[Orange, Connecticut|Orange]]\n** ''The Post-Chronicle'' {{WS|ctpostchronicle.com}} of [[North Haven, Connecticut|North Haven]]\n** ''West Hartford News'' {{WS|westhartfordnews.com}} of [[West Hartford, Connecticut|West Hartford]]\n\n* Magazines\n** ''The Connecticut Bride'' {{WS|connecticutmag.com}}\n** ''Connecticut Magazine'' {{WS|theconnecticutbride.com}}\n** ''Passport Magazine'' {{WS|passport-mag.com}}\n\n== Michigan ==\nFour dailies, associated weeklies and [[pennysaver]]s in the state of [[Michigan]]; also [http://www.micentralhomes.com MIcentralhomes.com] and [http://www.micentralautos.com MIcentralautos.com]\n* ''[[Oakland Press]]'' {{WS|theoaklandpress.com}} of [[Oakland, Michigan|Oakland]]\n* ''Daily Tribune'' {{WS|dailytribune.com}} of [[Royal Oak, Michigan|Royal Oak]]\n* ''Macomb Daily'' {{WS|macombdaily.com}} of [[Mt. Clemens, Michigan|Mt. Clemens]]\n* ''[[Morning Sun]]'' {{WS|themorningsun.com}} of  [[Mount Pleasant, Michigan|Mount Pleasant]]\n\n* Heritage Newspapers {{WS|heritage.com}}\n** ''Belleville View'' {{WS|bellevilleview.com}}\n** ''Ile Camera'' {{WS|thenewsherald.com/ile_camera}}\n** ''Monroe Guardian''  {{WS|monreguardian.com}}\n** ''Ypsilanti Courier'' {{WS|ypsilanticourier.com}}\n** ''News-Herald'' {{WS|thenewsherald.com}}\n** ''Press & Guide'' {{WS|pressandguide.com}}\n** ''Chelsea Standard & Dexter Leader'' {{WS|chelseastandard.com}}\n** ''Manchester Enterprise'' {{WS|manchesterguardian.com}}\n** ''Milan News-Leader'' {{WS|milannews.com}}\n** ''Saline Reporter'' {{WS|salinereporter.com}}\n* Independent Newspapers\n** ''Advisor'' {{WS|sourcenewspapers.com}}\n** ''Source'' {{WS|sourcenewspapers.com}}\n* Morning Star {{WS|morningstarpublishing.com}}\n** ''The Leader & Kalkaskian'' {{WS|leaderandkalkaskian.com}}\n** ''Grand Traverse Insider'' {{WS|grandtraverseinsider.com}}\n** ''Alma Reminder''\n** ''Alpena Star''\n** ''Ogemaw/Oscoda County Star''\n** ''Presque Isle Star''\n** ''St. Johns Reminder''\n\n* Voice Newspapers {{WS|voicenews.com}}\n** ''Armada Times''\n** ''Bay Voice''\n** ''Blue Water Voice''\n** ''Downriver Voice''\n** ''Macomb Township Voice''\n** ''North Macomb Voice''\n** ''Weekend Voice''\n\n== Mid-Hudson ==\nOne daily, associated magazines in the [[Hudson River Valley]] of [[New York]]; also [http://www.midhudsoncentral.com MidHudsonCentral.com] and [http://www.jobsinnewyork.com JobsInNewYork.com].\n\n* ''[[Daily Freeman]]'' {{WS|dailyfreeman.com}} of [[Kingston, New York]]\n* ''Las Noticias'' {{WS|lasnoticiasny.com}} of [[Kingston, New York]]\n\n== Ohio ==\nTwo dailies, associated magazines and three shared Websites, all in the state of [[Ohio]]: [http://www.allaroundcleveland.com AllAroundCleveland.com], [http://www.allaroundclevelandcars.com AllAroundClevelandCars.com] and [http://www.allaroundclevelandjobs.com AllAroundClevelandJobs.com].\n\n* ''[[The News-Herald (Ohio)|The News-Herald]]'' {{WS|news-herald.com}} of [[Willoughby, Ohio|Willoughby]]\n* ''[[The Morning Journal]]'' {{WS|morningjournal.com}} of [[Lorain, Ohio|Lorain]]\n* ''El Latino Expreso'' {{WS|lorainlatino.com}} of [[Lorain, Ohio|Lorain]]\n\n== Philadelphia area ==\nSeven dailies and associated weeklies and magazines in [[Pennsylvania]] and [[New Jersey]], and associated Websites: [http://www.allaroundphilly.com AllAroundPhilly.com], [http://www.jobsinnj.com JobsInNJ.com], [http://www.jobsinpa.com JobsInPA.com], and [http://www.phillycarsearch.com PhillyCarSearch.com].\n\n* ''[[The Daily Local News]]'' {{WS|dailylocal.com}} of [[West Chester, Pennsylvania|West Chester]]\n* ''[[Delaware County Daily and Sunday Times]] {{WS|delcotimes.com}} of Primos [[Upper Darby Township, Pennsylvania]]\n* ''[[The Mercury (Pennsylvania)|The Mercury]]'' {{WS|pottstownmercury.com}} of [[Pottstown, Pennsylvania|Pottstown]]\n* ''[[The Reporter (Lansdale)|The Reporter]]'' {{WS|thereporteronline.com}} of [[Lansdale, Pennsylvania|Lansdale]]\n* ''The Times Herald'' {{WS|timesherald.com}} of [[Norristown, Pennsylvania|Norristown]]\n* ''[[The Trentonian]]'' {{WS|trentonian.com}} of [[Trenton, New Jersey]]\n\n* Weeklies\n* ''The Phoenix'' {{WS|phoenixvillenews.com}} of [[Phoenixville, Pennsylvania]]\n** ''El Latino Expreso'' {{WS|njexpreso.com}} of [[Trenton, New Jersey]]\n** ''La Voz'' {{WS|lavozpa.com}} of [[Norristown, Pennsylvania]]\n** ''The Tri County Record'' {{WS|tricountyrecord.com}} of [[Morgantown, Pennsylvania]]\n** ''Penny Pincher'' {{WS|pennypincherpa.com}}of [[Pottstown, Pennsylvania]]\n\n* Chesapeake Publishing  {{WS|southernchestercountyweeklies.com}}\n** ''The Kennett Paper'' {{WS|kennettpaper.com}} of [[Kennett Square, Pennsylvania]]\n** ''Avon Grove Sun'' {{WS|avongrovesun.com}} of [[West Grove, Pennsylvania]]\n** ''The Central Record'' {{WS|medfordcentralrecord.com}} of [[Medford, New Jersey]]\n** ''Maple Shade Progress'' {{WS|mapleshadeprogress.com}} of [[Maple Shade, New Jersey]]\n\n* Intercounty Newspapers {{WS|buckslocalnews.com}} {{WS|southjerseylocalnews.com}}\n** ''The Pennington Post'' {{WS|penningtonpost.com}} of [[Pennington, New Jersey]]\n** ''The Bristol Pilot'' {{WS|bristolpilot.com}} of [[Bristol, Pennsylvania]]\n** ''Yardley News'' {{WS|yardleynews.com}} of [[Yardley, Pennsylvania]]\n** ''Advance of Bucks County'' {{WS|advanceofbucks.com}} of [[Newtown, Pennsylvania]]\n** ''Record Breeze'' {{WS|recordbreeze.com}} of [[Berlin, New Jersey]]\n** ''Community News'' {{WS|sjcommunitynews.com}} of [[Pemberton, New Jersey]]\n\n* Montgomery Newspapers {{WS|montgomerynews.com}}\n** ''Ambler Gazette'' {{WS|amblergazette.com}} of [[Ambler, Pennsylvania]]\n** ''The Colonial'' {{WS|colonialnews.com}} of [[Plymouth Meeting, Pennsylvania]]\n** ''Glenside News'' {{WS|glensidenews.com}} of [[Glenside, Pennsylvania]]\n** ''The Globe'' {{WS|globenewspaper.com}} of [[Lower Moreland Township, Pennsylvania]]\n** ''Montgomery Life'' {{WS|montgomerylife.com}} of [[Fort Washington, Pennsylvania]]\n** ''North Penn Life'' {{WS|northpennlife.com}} of [[Lansdale, Pennsylvania]]\n** ''Perkasie News Herald'' {{WS|perkasienewsherald.com}} of [[Perkasie, Pennsylvania]]\n** ''Public Spirit'' {{WS|thepublicspirit.com}} of [[Hatboro, Pennsylvania]]\n** ''Souderton Independent'' {{WS|soudertonindependent.com}} of [[Souderton, Pennsylvania]]\n** ''Springfield Sun'' {{WS|springfieldsun.com}} of [[Springfield, Pennsylvania]]\n** ''Spring-Ford Reporter'' {{WS|springfordreporter.com}} of [[Royersford, Pennsylvania]]\n** ''Times Chronicle'' {{WS|thetimeschronicle.com}} of [[Jenkintown, Pennsylvania]]\n** ''Valley Item'' {{WS|valleyitem.com}} of [[Perkiomenville, Pennsylvania]]\n** ''Willow Grove Guide'' {{WS|willowgroveguide.com}} of [[Willow Grove, Pennsylvania]]\n** ''The Review'' {{WS|roxreview.com}} of [[Roxborough, Philadelphia, Pennsylvania]]\n\n* Main Line Media News {{WS|mainlinemedianews.com}}\n** ''Main Line Times'' {{WS|mainlinetimes.com}} of [[Ardmore, Pennsylvania]]\n** ''Main Line Life'' {{WS|mainlinelife.com}} of [[Ardmore, Pennsylvania]]\n** ''The King of Prussia Courier'' {{WS|kingofprussiacourier.com}} of [[King of Prussia, Pennsylvania]]\n\n* Delaware County News Network {{WS|delconewsnetwork.com}}\n** ''News of Delaware County'' {{WS|newsofdelawarecounty.com}} of [[Havertown, Pennsylvania]]\n** ''County Press'' {{WS|countypressonline.com}} of [[Newtown Square, Pennsylvania]]\n** ''Garnet Valley Press'' {{WS|countypressonline.com}} of [[Glen Mills, Pennsylvania]]\n** ''Springfield Press'' {{WS|countypressonline.com}} of [[Springfield, Pennsylvania]]\n** ''Town Talk'' {{WS|towntalknews.com}} of [[Ridley, Pennsylvania]]\n\n* Berks-Mont Newspapers {{WS|berksmontnews.com}}\n** ''The Boyertown Area Times'' {{WS|berksmontnews.com/boyertown_area_times}} of [[Boyertown, Pennsylvania]]\n** ''The Kutztown Area Patriot'' {{WS|berksmontnews.com/kutztown_area_patriot}} of [[Kutztown, Pennsylvania]]\n** ''The Hamburg Area Item'' {{WS|berksmontnews.com/hamburg_area_item}} of [[Hamburg, Pennsylvania]]\n** ''The Southern Berks News'' {{WS|berksmontnews.com/southern_berks_news}} of [[Exeter Township, Berks County, Pennsylvania]]\n** ''Community Connection'' {{WS|berksmontnews.com/community_connection}} of [[Boyertown, Pennsylvania]]\n\n* Magazines\n** ''Bucks Co. Town & Country Living'' {{WS|buckscountymagazine.com}}\n** ''Parents Express'' {{WS|parents-express.com}}\n** ''Real Men, Rednecks'' {{WS|realmenredneck.com}}\n\n{{JRC}}\n\n==References==\n<references />\n\n[[Category:Journal Register publications|*]]\n";

    var profiling = function(func) {
        var startTime = new Date().getTime();
        var result = func();
        var duration = new Date().getTime() - startTime;
        console.log(duration);
        return result;
    }

    xit('compare-arrays', function(done) {
        console.log('compare-arrays');

        var arr1 = s1.substring(0, Math.min(s1.length, s2.length)).split('');
        var arr2 = s2.substring(0, Math.min(s1.length, s2.length)).split('');
        assert.equal(arr1.length, arr2.length);

        var result = profiling(() => {
            var cnt = 0;
            for (let i = 0; i < 1000; i++) {
                for (let i = 0; i < s2.length; i++) {
                    if (arr1[i] == arr2[i]) {
                        cnt++;
                    }
                }
            }

            return cnt;
        });

        console.log(result);

        done();
    });

    xit('compare-arrays-as-strings', function(done) {
        console.log('compare-arrays');

        var arr1 = s1.substring(0, Math.min(s1.length, s2.length)).split('');
        var arr2 = s2.substring(0, Math.min(s1.length, s2.length)).split('');
        assert.equal(arr1.length, arr2.length);

        var result = profiling(() => {
            var cnt = 0;
            for (let i = 0; i < 1000; i++) {
                var arr1str = arr1.join('');
                var arr2str = arr2.join('');
                if (arr1str == arr2str) {
                    cnt++;
                }
            }

            return cnt;
        });

        console.log(result);

        done();
    });

    //too slow
    xit('array-diff', function(done) {
        console.log('array-diff');

        var result = profiling(() => {
            var seq1 = s1.split('');
            var seq2 = s2.split('');
            var diff = arrayDiff({unique: true, compress: true});
            var result = diff(seq1, seq2);
            return result;
        });

        console.log(result.length + ", " + JSON.stringify(result).length);

        done();
    });

    //too slow
    xit('universal-diff', function(done) {
        console.log('universal-diff');

        var result = profiling(() => {
            var result = universalDiff.compareStr(s1, s2);
            return result;
        });

        console.log(result.diff.length + ", " + JSON.stringify(result).length);

        done();
    });

    it('google-diff 1/4', function(done) {
        console.log('countDifferences', countDifferences0, countDifferences1, countDifferences2);

        console.log('google-diff 1/4');

        var _s0 = s0.substring(0, s0.length / 4);
        var _s1 = s1.substring(0, s1.length / 4);
        var _s2 = s2.substring(0, s2.length / 4);

        var result = profiling(() => {
            var result;
            for (let i = 0; i < 10; i++) {
                var dmp = new googleDiff();
                dmp.Diff_Timeout = 10.0;
                result = dmp.diff_main(_s1, _s2);
                dmp.diff_cleanupEfficiency(result);
            }
            return result;
        });

        console.log(result.length + ", " + JSON.stringify(result).length);

        done();
    });

    it('google-diff 1/2', function(done) {
        console.log('countDifferences', countDifferences0, countDifferences1, countDifferences2);

        console.log('google-diff 1/2');

        var _s0 = s0.substring(0, s0.length / 2);
        var _s1 = s1.substring(0, s1.length / 2);
        var _s2 = s2.substring(0, s2.length / 2);

        var result = profiling(() => {
            var result;
            for (let i = 0; i < 10; i++) {
                var dmp = new googleDiff();
                dmp.Diff_Timeout = 10.0;
                result = dmp.diff_main(_s1, _s2);
                dmp.diff_cleanupEfficiency(result);
            }
            return result;
        });

        console.log(result.length + ", " + JSON.stringify(result).length);

        done();
    });

    it('google-diff', function(done) {
        console.log('google-diff');

        //googleDiff.Match_Threshold = 0.1 ;

        // var s0 = "GoogleGoogleGoogle\nconsolestarttime\nGoogleGoogleGoogle";
        // var s1 = "GoogleGoogleGoogle\nprofiling\nGoogleGoogleGoogle";
        // var s2 = "GoogleGoogleGoogle\nresult\nGoogleGoogleGoogle";

        var result = profiling(() => {
            var result;
            for (let i = 0; i < 10; i++) {
                var dmp = new googleDiff();
                dmp.Diff_Timeout = 10.0;
                result = dmp.diff_main(s1, s2);
                //dmp.diff_cleanupEfficiency(result);
            }
            return result;
        });

        console.log(result.length + ", " + JSON.stringify(result, null, 4));

        done();
    });

    it('google-diff2', function(done) {
        console.log('google-diff2');

        //googleDiff.Match_Threshold = 0.1 ;

        // var s0 = "GoogleGoogleGoogle\nconsolestarttime\nGoogleGoogleGoogle";
        // var s1 = "GoogleGoogleGoogle\nprofiling\nGoogleGoogleGoogle";
        // var s2 = "GoogleGoogleGoogle\nresult\nGoogleGoogleGoogle";

        var result = profiling(() => {
            var result;
            for (let i = 0; i < 10; i++) {
                var dmp = new googleDiff2();
                dmp.Diff_Timeout = 10.0;
                result = dmp.diff_main(s1, s2);
                dmp.diff_cleanupEfficiency(result);
            }
            return result;
        });

        console.log(result.length + ", " + JSON.stringify(result).length);

        done();
    });

    //too bad
    xit('3-way-diff', function(done) {
        console.log('3-way-diff');

        var s0 = "Google";
        var s1 = "Google";
        var s2 = "Gopgle";

        var seq0 = s0.split('');
        var seq1 = s1.split('');
        var seq2 = s2.split('');

        var result = profiling(() => {
            var result = _3WayDiff({ s: seq0 }, { s: seq1 }, { s: seq2 }, null, {s: {falsy: true}});
            return result;
        });

        console.log(result.length + ", " + JSON.stringify(result).length);

        done();
    });

    it('diff3 1/4', function(done) {
        console.log('diff3');

        // var s0 = "Google";
        // var s1 = "Gppgle";
        // var s2 = "Gooqge";

        var _s0 = s0.substring(0, s0.length / 4);
        var _s1 = s1.substring(0, s1.length / 4);
        var _s2 = s2.substring(0, s2.length / 4);

        var seq0 = _s0.split('');
        var seq1 = _s1.split('');
        var seq2 = _s2.split('');

        var result = profiling(() => {
            var result;
            for (let i = 0; i < 10; i++) {
                result = diff3.diffIndices(seq1, seq2);
            }
            return result;
        });

        console.log(result.length + ", " + JSON.stringify(result));

        done();
    });

    it('diff3 1/2', function(done) {
        console.log('diff3');

        // var s0 = "Google";
        // var s1 = "Gppgle";
        // var s2 = "Gooqge";

        var _s0 = s0.substring(0, s0.length / 2);
        var _s1 = s1.substring(0, s1.length / 2);
        var _s2 = s2.substring(0, s2.length / 2);

        var seq0 = _s0.split('');
        var seq1 = _s1.split('');
        var seq2 = _s2.split('');

        var result = profiling(() => {
            var result;
            for (let i = 0; i < 10; i++) {
                result = diff3.diffIndices(seq1, seq2);
            }
            return result;
        });

        console.log(result.length + ", " + JSON.stringify(result));

        done();
    });

    it('diff3', function(done) {
        console.log('diff3');

        // var s0 = "Google";
        // var s1 = "Gppgle";
        // var s2 = "Gooqge";

        var seq0 = s0.split('');
        var seq1 = s1.split('');
        var seq2 = s2.split('');

        var result = profiling(() => {
            var result;
            for (let i = 0; i < 10; i++) {
                result = diff3.diffIndices(seq1, seq2);
            }
            return result;
        });

        console.log(result.length + ", " + JSON.stringify(result));

        done();
    });

    //too bad
    xit('three-way-merge', function(done) {
        console.log('three-way-merge');

        // var s0 = "Google";
        // var s1 = "Gppgle";
        // var s2 = "Gooqle";

        var result = profiling(() => {
            var result = threeWayDiff(s1, s0, s2, {
                splitFunction: s => s.split('')
            });
            return result;
        });

        console.log(result.results.length + ", " + JSON.stringify(result).length);

        done();
    });

    //too slow
    xit('synchrotron', function(done) {
        console.log('synchrotron');

        // var s0 = "Google";
        // var s1 = "Gppgle";
        // var s2 = "Gooqle";

        var seq0 = s0.split('');
        var seq1 = s1.split('');
        var seq2 = s2.split('');

        var result = profiling(() => {
            var result = synchrotron.diff3_merge(seq1, seq0, seq2);
            return result;
        });

        console.log(result.length + ", " + JSON.stringify(result).length);

        done();
    });
});