$( document ).ready( function () {

  function scroller (event) {
    var scroll_to = event.data.scroll_to
    $('html,body').animate({
      scrollTop: $(scroll_to).offset().top
    }, 1000);
  }

  var menu_links = $(".button-link");

  for (i = 0; i < menu_links.length; i++) {
    var scroll_from = $(menu_links[i])
    var scroll_to = "#" + $(scroll_from).data("id")
    $(scroll_from).on("click", {scroll_to: scroll_to}, scroller)
  };

  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

  ga('create', 'UA-90308284-1', 'auto');
  ga('send', 'pageview');
});

// Grab headervideo html from url and load it when everything else is loaded on the page
window.onload = function() {
  $.get("headerVideo", function (data) {
    $('.header-video').append(data);
  });

  var haiku_array = [
    {
    "author": "Matsuo Basho",
    "haikus": [
      "None is travelling\nHere along this way but I,\nThis autumn evening.",
      "The first day of the year:\nthoughts come - and there is loneliness;\nthe autumn dusk is here.",
      "An old pond\nA frog jumps in -\nSplash!",
      "Old dark sleepy pool... \nquick unexpected\nfrog\nGoes plop! Watersplash!",
      "Lightening -\nHeron's cry\nStabs the darkness",
      "Clouds come from time to time -\nand bring to men a chance to rest\nfrom looking at the moon.",
      "In the cicada's cry\nThere's no sign that can foretell\nHow soon it must die.",
      "Poverty's child -\nhe starts to grind the rice,\nand gazes at the moon.",
      "Won't you come and see\nloneliness? Just one leaf\nfrom the kiri tree.",
      "Temple bells die out.\nThe fragrant blossoms remain.\nA perfect evening!",
      "Ballet in the air ...\ntwin butterflies\nuntil, twice white\nThey meet, they mate",
      "Black cloudbank broken\nscatters in the\nnight ... Now see\nMoon-lighted mountains!",
      "Seek on high bare trails\nsky-reflecting\nviolets...\nMountain-top jewels",
      "For a lovely bowl\nlet us arrange these\nflowers...\nSince there is no rice",
      "Now that eyes of hawks\nin dusky night\nare darkened... \nChirping of the quails",
      "April's air stirs in\nwillow-leaves... \na butterfly\nFloats and balances",
      "In the sea-surf edge\nmingling with\nbright small shells ..\nBush-clover petals",
      "The river\nGathering may rains\nfrom cold streamlets\nfor the sea... \nMurmuring Mogami",
      "White cloud of mist\nabove white\ncherry-blossoms... \nDawn-shining mountains",
      "Twilight whippoorwill... \nwhistle on,\nsweet deepener\nOf dark loneliness",
      "Mountain-rose petals\nfalling, falling,\nfalling now... \nWaterfall music",
      "Ah me! I am one\nwho spends his little\nbreakfast\nMorning-glory gazing",
      "Seas are wild tonight... \nstretching over\nSado Island\nSilent clouds of stars",
      "Why so scrawny, cat?\nstarving for fat fish\nor mice... \nOr backyard love?",
      "Dewdrop, let me cleanse\nin your brief\nsweet waters... \nThese dark hands of life",
      "Glorious the moon... \ntherefore our thanks\ndark clouds\nCome to rest our necks",
      "Under cherry-trees\nsoup, the salad,\nfish and all... \nSeasoned with petals",
      "Too curious flower\nwatching us pass,\nmet death... \nOur hungry donkey",
      "Cloud of cherry-bloom... \ntolling twilight\nbell...  Temple\nUeno? Asakura?",
      "Must springtime fade?\nthen cry all birds... \nand fishes\nCold pale eyes pour tears",
      "Such utter silence!\neven the crickets'\nsinging... \nMuffled by hot rocks",
      "Swallow in the dusk... \nspare my little\nbuzzing friends\nAmong the flowers",
      "Reply:\nBright red pepper-pod... \nit needs but shiny\nwings and look... \nDarting dragon-fly!",
      "Wake! The sky is light!\nlet us to the road\nagain... \nCompanion butterfly!",
      "Silent the old town... \nthe scent of flowers\nfloating... \nAnd evening bell",
      "Camellia-petal\nfell in silent dawn... \nspilling\nA water-jewel",
      "In the twilight rain\nthese brilliant-hued\nhibiscus... \nA lovely sunset",
      "Lady butterfly\nperfumes her wings\nby floating\nOver the orchid",
      "Now the swinging bridge\nis quieted\nwith creepers... \nLike our tendrilled life",
      "The sea darkening... \noh voices of the\nwild ducks\nCrying, whirling, white",
      "Nine times arising\nto see the moon... \nwhose solemn pace\nMarks only midnight yet",
      "Here, where a thousand\ncaptains swore grand\nconquest...  Tall\nGrass their monument",
      "Now in sad autumn\nas I take my\ndarkening path... \nA solitary bird",
      "Will we meet again\nhere at your\nflowering grave... \nTwo white butterflies?",
      "Dry cheerful cricket\nchirping, keeps\nthe autumn gay... \nContemptuous of frost",
      "First white snow of fall\njust enough to bend\nthe leaves\nOf faded daffodils",
      "Carven gods long gone... \ndead leaves alone\nforegather\nOn the temple porch",
      "Cold first winter rain... \npoor monkey,\nyou too could use\nA little woven cape",
      "No oil to read by... \nI am off to bed\nbut ah!... \nMy moonlit pillow",
      "This snowy morning\nthat black crow\nI hate so much... \nBut he's beautiful!",
      "If there were fragrance\nthese heavy snow-\nflakes settling... \nLilies on the rocks",
      "See: surviving suns\nvisit the ancestral\ngrave... \nBearded, with bent canes",
      "Death-song:\nFever-felled half-way,\nmy dreams arose\nTo march again... \nInto a hollow land"
      ]
    },
    {
    "author": "Kobayashi Issa",
    "haikus": [
      "A sudden shower falls -\nand naked I am riding\non a naked horse.",
      "Summer shower -\nnaked horse\na naked rider.",
      "A frog and I,\neyeball to eyeball.\nMy empty face,\nbetrayed by lightening.",
      "Cool breeze,\ntangled\nin a grass-blade.",
      "Step by step\nup a summer mountain -\nsuddenly: the sea.",
      "Cries of wild geese,\nrumors spread about me.",
      "Stillness -\nclouds peak\nin the lake.",
      "Just by being,\nI'm here -\nin the snow-fall.",
      "Showering\nonto Mount Kiso,\nthe Milky Way.",
      "What a moon -\nif only my grumbling wife\nwere here.",
      "In this windy nest\nopen your hungry\nmouth in vain... \nIssa, stepchild bird",
      "On the death of his child:\nDew evaporates\nand all our world\nis dew...  So dear,\nSo fresh, so fleeting",
      "A gate made all of twigs\nWith woven grass\nFor hinges... \nFor a lock...  This snail",
      "Arise from sleep, old cat,\nand with great yawns\nand stretchings... \nAmble out for love",
      "Hi! My little hut\nis newly-thatched\nI see... \nBlue morning-glories",
      "Dim the grey cow comes\nmooing mooing\nand mooing\nOut of the morning mist",
      "What a peony... \ndemanding to be\nmeasured\nBy my little fan!",
      "A nursemaid scarecrow... \nfrightening the\nwind and sun\nFrom playing baby",
      "A saddening world:\nflowers whose sweet\nblooms must fall... \nAs we too, alas... ",
      "Hi! Kids mimicking\ncormorants...  You are\nmore like\nReal cormorants than\nThey!",
      "Over the mountain\nbright the full white\nmoon now smiles... \nOn the flower-thief",
      "Good friend grasshopper\nwill you play\nthe caretaker\nFor my little grave?",
      "Giddy grasshopper\ntake care...  Do not\nleap and crush\nThese pearls of dewdrop",
      "Now be a good boy\ntake good care of\nour house... \nCricket my child",
      "Good evening breeze!\ncrooked and\nmeandering\nYour homeward journey",
      "The turnip farmer rose\nand with a fresh-\npulled turnip... \nPointed to my road",
      "I am going out... \nbe good and play\ntogether\nMy cricket children",
      "If strangers threaten\nturn into fat\ngreen bullfrogs... \nPond-cooling melons",
      "Live in simple faith... \njust as this\ntrusting cherry\nFlowers, fades, and falls",
      "Oh do not swat them... \nunhappy flies\nforever\nWringing their thin hands",
      "In the city fields\ncontemplating\ncherry-trees... \nStrangers are like friends",
      "Yellow autumn moon... \nunimpressed\nthe scarecrow stands\nSimply looking bored",
      "Cruel autumn wind\ncutting to the\nvery bones... \nOf my poor scarecrow",
      "I must turn over... \nbeware of local\nearthquakes\nBedfellow cricket!",
      "Visiting the graves... \ntrotting on to show\nthe way... \nOld family dog",
      "Before boiled chestnuts\ncross-legged lad\nis squatting... \nCarved wooden Buddha",
      "Nice: wild persimmons... \nand notice how\nthe mother\nEats the bitter parts",
      "What a gorgeous one\nthat fat sleek huge\nold chestnut\nI could not get at... ",
      "Oh former renter\nI know it all, all... \ndown to\nThe very cold you felt",
      "Plume of pampas grass\ntrembling\nin every wind... \nHush, my lonely heart",
      "Considerate dogs... \nstepping off\ninto the snow\nAs I walk the path",
      "Buddha on the hill... \nfrom your holy\nnose indeed\nHangs an icicle",
      "The orphan speaks:\nthe year-end party... \nI am even envious\nOf scolded children"
      ]
    },
    {
    "author": "Yosa Buson",
    "haikus": [
      "Standing still at dusk\nlisten...  In far distances\nThe song of froglings!",
      "My two plum trees are\nso gracious...see, they flower\nOne now, one later",
      "The laden wagon runs\nbumbling and creaking\ndown the road... \nThree peonies tremble",
      "Lightning flash, crash... \nwaiting in the\nbamboo grove\nSee three dew-drops fall",
      "Afternoon shower... \nwalking and talking\nin the street:\nUmbrella and raincoat!",
      "Sadness at twilight... \nvillain! I have\nlet my hand\nCut that peony",
      "In dim dusk and scent\na witness\nnow half hidden... \nEvenfall orchid",
      "Voices of two bells\nthat speak from\ntwilight temples... \nAh! Cool dialogue",
      "Deep in dark forest\na woodcutter's\ndull axe talking... \nAnd a woodcutter",
      "Butterfly asleep\nfolded soft on\ntemple bell... \nThen bronze gong rang!",
      "See the morning breeze\nruffling his so\nsilky hair... \nCool caterpillar",
      "A camellia\ndropped down into\nstill waters\nOf a deep dark well",
      "In the holy dusk\nnightingales begin\ntheir psalm... \nGood! The dinner-gong!",
      "A short summer night... \nbut in this solemn\ndarkness\nOne peony bloomed",
      "Pebbles shining clear,\nand clear\nsix silent fishes... \nDeep autumn water",
      "A bright autumn moon... \nin the shadow of\neach grass\nAn insect chirping",
      "White chrysanthemum... \nbefore that\nperfect flower\nScissors hesitate",
      "At furue in rain\ngray water and\ngrey sand... \nPicture without lines",
      "The old fisherman\nunalterably\nintent... \nCold evening rain",
      "Rainy-month, dripping\non and on\nas I lie abed... \nAh, old man's memories!",
      "Slanting lines of rain... \non the dusty\nsamisen\nA mouse is trotting",
      "Old weary willows... \nI thought how long\nthe road would be\nWhen you went away"
      ]
    }
  ]

  function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  function seconds() {
    return new Date().getTime() / 1000
  }
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // set var in global scope
  var detected_selenium_and_cookie = false;
  $(window).bind('resize', async function() {
    if (detected_selenium_and_cookie) {
      return;
    }
    if (window.navigator.webdriver) {
      name = getCookie("name");
      if(name=="") {
        return
      }
      detected_selenium_and_cookie = true;

      // $('#SeleniumFun').get(0).scrollIntoView()
      var bouncing_selenium = '<div class="x"><img class="y bounce" src="static/images/selenium.png"></img></div>';
      $(".bouncing_selenium").append(bouncing_selenium);

      $('.replace_when_selenium').remove();

      var haikus_by_author = haiku_array[Math.floor(Math.random()*haiku_array.length)];
      var author = haikus_by_author.author;
      var random_haiku = haikus_by_author.haikus[Math.floor(Math.random()*haikus_by_author.haikus.length)];
      var formatted_haiku = random_haiku.replaceAll("\n", "<br>&emsp;");
      var html_to_append = `<p>Welcome, Selenium script runner <b>${name}</b>!<br><br> Here's a Haiku I chose for you:<i><br>&emsp;${formatted_haiku}<br></i>- ${author}</p>`;
      var attribution = "<p style='font-size: 60%;'>Haiku list from <a tabindex='-1' href='https://github.com/penumbra1/haiku/blob/master/db.json' target='_blank'>here</a></p>";
      $('.modal__content').append(html_to_append + attribution);
      $('.modal__container').css('height', '500px');
      MicroModal.show("seleniumFun");

      const fade_in_color_seconds = 5000;
      const color_steps = 200;
      const start_at = 50;

      for (var i = 0; i < color_steps; i++) {
        var step = start_at + (((100 - start_at) / color_steps) * i);
        $('body').css('backgroundColor',`hsl(119, ${step}%, 36%)`);
        await sleep(fade_in_color_seconds/color_steps);
      }
    }
  })
};
