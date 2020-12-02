
(() => {
   setProgress(17);
   const USERNAME = "icecream17";
   const TOKEN = "73db0c8f9e06a16de7762627d2e1ae8497f37269";
   
   const src = {
      html: "https://raw.githubusercontent.com/icecream17/tic-tac-toe-grow/main/game.html",
      css: "https://api.github.com/repos/icecream17/tic-tac-toe-grow/contents/style.css",
      js: "https://api.github.com/repos/icecream17/tic-tac-toe-grow/contents/game.js",
   }
   setProgress(20);
   
   fetch(src.html).then(success, uhoh)

   async function success(response) {
      setProgress(42);
      console.log(response);
      setProgress(52);
      if (!response.ok) throw Error("Response !== 200 OK, got: " + response.status);
      setProgress(57);
      let text = await response.text();
      setProgress(85);
      return setDocumentTo(text);
   }

   function uhoh(rejectionReason) {
      throw rejectionReason;
   }

   // Warning:
   // line 3 = LESS-THAN SIGN + LATIN SMALL LETTER H + LATIN SMALL LETTER E + LATIN SMALL LETTER A + LATIN SMALL LETTER D + CARRIAGE RETURN
   function setDocumentTo(text) {
      setProgress(95);
      
      if (text.includes('\r\n')) text = text.split('\r\n').slice(1);
      else                       text = text.split('\n').slice(1);
      
      text.unshift('<!-- Generated HTML from https://github.com/icecream17/Tic Tac Toe Grow/ ---');
      text.unshift('---- Recommended to go there instead if you are interested in the code.  -->')
      text.splice(3, 0, '   <base href="https://raw.githubusercontent.com/icecream17/tic-tac-toe-grow/main/">');
      text[text.indexOf('   <script defer src="game.js"></script>')] = getJS();
      text[text.indexOf('   <link rel="stylesheet" href="style.css">')] = getCSS();
      
      text = text.join('\n');
      
      setProgress(99);
      document.documentElement.innerHTML = text;
   }
   
   function setProgress(number) {
      document.getElementById("Progress").value = number;
   }

   function getJS(seperator) {
      let JSReponse = GETgithubReponse(src.js);
      let JSContent = atob(CSSResponse.content);
      return `   <script defer>${JSContent}</script>`
   }
   
   function getCSS(seperator) {
      let CSSReponse = GETgithubReponse(src.css);
      let CSSContent = atob(CSSResponse.content);
      return `   <style>${CSSContent}</style>`
   }
   
   function GETgithubResponse(file) {
      let request = new XMLHttpRequest();
      request.open("GET", file, false, [USERNAME, TOKEN].join(':'))
      request.setRequestHeader("Accept", "application/vnd.github.v3+json")
      request.setRequestHeader("User-Agent", USERNAME)
      return JSON.parse(request.response)
   }
})()
