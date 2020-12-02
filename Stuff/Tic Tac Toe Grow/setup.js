(() => {
   setProgress(17);
   fetch('https://raw.githubusercontent.com/icecream17/tic-tac-toe-grow/main/game.html').then(success, uhoh)

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
      
      text.splice(3, 0, '   <base href="https://raw.githubusercontent.com/icecream17/tic-tac-toe-grow/main/">');
      text = text.join('\n');
      
      setProgress(99);
      document.documentElement.innerHTML = text;
   }
   
   function setProgress(number) {
      document.getElementById("Progress").value = number;
   }

})()
