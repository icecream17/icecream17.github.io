# Hi
So here's my code for the schedule. Be sure to read the all caps comment.

To copy: Click on the code. Press ```Ctrl + A```. Press ```Ctrl + C```.

```javascript
function timeRange(time, time2) {
  return time + ' ' + time2; // Joins together two times with a space
}

function whichDay(day) {
  if (day.getDay() === 0 || day.getDay === 6) {return "FREE"} // If saturday or sunday, day is free

  day = [day.getMonth() + 1, day.getDate(), day.getFullYear()].join('/') // Formatted like this: MONTH/DAY/YEAR
  
  if (day === "10/14/2020") {return "TESTING"} // 10/14/2020 is a neutral, testing day
  if ([
    "9/7/2020", "10/5/2020", "11/3/2020", // Labor day, Fair day, Student/Staff Holiday
    "11/23/2020", "11/24/2020", "11/25/2020", "11/26/2020", "11/27/2020", // Thanksgiving break
    "12/21/2020", "12/22/2020", "12/23/2020", "12/24/2020", "12/25/2020", 
    "12/28/2020", "12/29/2020", "12/30/2020", "12/31/2020", "1/1/2021", // Winter break
    "1/4/2021", "1/18/2021", // Student/Staff Holiday, Martin Luther King Jr. Day
    "2/15/2021", "2/16/2021", "2/17/2021", "2/18/2021", "2/19/2021", // Spring break
    "4/2/2021", "5/28/2021", "5/31/2021" // Student/Staff Holiday, Student/Staff Holiday, Memorial Day
  ].includes(day)) {return "FREE"} // Holiday and breaks are free
  
  // Summer not included.
  
  // TAKEN FROM https://www.garlandisd.net/content/ab-block-schedule
  // MONTH (tab) DAYS (newline)
  const aDays = `8	10, 12, 14, 17, 19, 24, 26, 28, 31
9	2, 9, 11, 14, 16, 21, 23, 25, 28, 30
10	12, 16, 19, 21, 26, 28, 30
11	2, 4, 9, 11, 13, 16, 18, 30
12	2, 4, 7, 9, 14, 16, 18
1	6, 8, 11, 13, 20, 22, 25, 27
2	1, 3, 5, 8, 10, 15, 17, 19, 22, 24
3	1, 3, 5, 22, 24, 26, 29, 31
4	5, 7, 12, 14, 16, 19, 21, 26, 28, 30
5	3, 5, 10, 12, 14, 17, 19, 24, 26
6	2, 4, 7`.split('\n')

  let aDaysArray = [];
    
  for (let i = 0; i < aDays.length; i++) {
    const a = aDays[i]
    const b = a.split('\t');
    const month = b[0];
    const days = b[1].split(', ');
    for (let day of days) {
      if (month > 7) {
        aDaysArray.push([month, day, 2020].join('/'));
      } else {
        aDaysArray.push([month, day, 2021].join('/'));
      }
    }
  }
  
  return aDaysArray.includes(day) ? 'A' : 'B';
}

function TIMENOW() {
  const now = new Date();
  return (now.getHours() > 12 ? now.getHours() - 12 : now.getHours()) + ':' + (now.getMinutes() > 9 ? now.getMinutes() : '0' + now.getMinutes());
}

function WhichRange(day, time, timeRanges, blockA, blockB) {
  time *= 24;
  time = [Math.floor(time), time];
  time[1] -= time[0];
  time[1] = Math.round(time[1] * 60); // Avoids many very silly and ridiculous bugs
  
  timeRanges = timeRanges[0].map(range => range.split(' '))
  
  blockA = blockA[0] // blockA = first row (cuz there's no second row)
  blockB = blockB[0]
  
  const MAX_POSSIBLE_AM_TIME = 6; // CHANGE THIS TO WHATEVER TIME IS SO EARLY THAT IT CANT POSSIBLY BE "__ AM" WHEN A CLASS STARTS. PUT THE BIGGEST NUMBER THAT FITS
                                  // Really this is used so that "1 PM" isn't interpreted as "1 AM". Since there's no AM or PM mark.
                                  // So if school ends at 4:xx you should put 5, so that classes at 1:xx (less than 5) are "now" at (13:xx) or (1 PM)
  function checkPM ($time) {
    if ($time[0] < MAX_POSSIBLE_AM_TIME) {
        $time[0] += 12; // $time[0]: hours
    }
  }
  
  checkPM(time)
  
  for (let i = 0; i < timeRanges.length; i++) {
    let range = timeRanges[i];
    let start = range[0].split(':').map(hand => Number(hand));
    let end = range[1].split(':').map(hand => Number(hand));
    
    checkPM(start)
    checkPM(end)
    
    if (start[0] > time[0] || (start[0] === time[0] && start[1] > time[1])) {return 'none';}
    if (end[0] < time[0] || (end[0] === time[0] && end[1] < time[1])) {continue;}
    
    if (day === 'A') {
      return blockA[i]
    } else {
      return blockB[i]
    }
  }
}


```


Cell layout:
|   | A |       B       |              C             |              D              |           E                 |                               F                               | G | H |                I                |
|---|---|---------------|----------------------------|-----------------------------|-----------------------------|---------------------------------------------------------------|---|---|---------------------------------|
| 1 |   |               |                            |                             |                             |                                                               |   |   |                                 |
| 2 |   | Schedule      | =timeRange("8:40", "9:50") | =timeRange("9:55", "11:05") | =timeRange("12:25", "1:35") | =timeRange("1:40", "2:50")                                    |   |   | Recalculate:                    |
| 3 |   | A             | A1 class name here         | A2 class name here          | A3 class name here          | A4 class name here                                            |   |   | To recalculate, reload the page |
| 4 |   | B             | B1 class name here         | B2 class name here          | B3 class name here          | B4 class name here                                            |   |   |                                 |
| 5 |   |               |                            |                             |                             |                                                               |   |   |                                 |
| 6 |   | Today is      | =TODAY()                   | which is an                 | =whichDay(C7)               | day                                                           |   |   |                                 |
| 7 |   | Current time: | =TIMENOW()                 |                             | Current subject:            | =WhichRange(E7, TIMEVALUE(C8), C2:F2, C3:F3, C4:F4)           |   |   |                                 |
| 8 |   |               |                            |                             | In ten minutes:             | =WhichRange(E7, TIMEVALUE(C8) + (1/144), C2:F2, C3:F3, C4:F4) |   |   |                                 |
| 9 |   |               |                            |                             |                             |                                                               |   |   |                                 |
