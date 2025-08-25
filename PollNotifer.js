// ==UserScript==
// @name         UT Instapoll Notifier
// @description  Plays a beep sound when new polls are available on UT Instapoll
// @version      1.0
// @author       vudung45, nik875
// @match        https://polls.la.utexas.edu/course/*
// @grant        none
// ==/UserScript==

/*
Instructions:
	1. Copy-paste this script as a custom script in Tampermonkey.
 	2. When a new poll is posted, a repeating beep will play for the duration of the poll.
    3. You MUST interact with the webpage (clicking something, etc) to enable audio.
		This is because of a browser security feature.
	4. Turn down volume, it can be quite loud.
 Tested to work on Firefox.
*/
function PollNotifier() {
    let a = null; // Don't create AudioContext immediately
    
    function beep(vol, freq, duration) {
        // Create AudioContext only when needed (after user gesture)
        if (!a) {
            try {
                a = new AudioContext();
                if (a.state === 'suspended') {
                    a.resume();
                }
            } catch (e) {
                console.log("Audio not available - click anywhere on the page first");
                return;
            }
        }
        
        let v = a.createOscillator();
        let u = a.createGain();
        v.connect(u);
        v.frequency.value = freq;
        v.type = "square";
        u.connect(a.destination);
        u.gain.value = vol * 0.01;
        v.start(a.currentTime);
        v.stop(a.currentTime + duration * 0.001);
    }
    
    let pollTableList = document.getElementsByClassName("table table-hover table-itemlist");
    if (pollTableList.length > 0) {
        let pollTable = pollTableList[0]; 
        let polls = pollTable.getElementsByTagName("tr");
        
        for (let i = 1; i < polls.length; ++i) {
            let columns = polls[i].getElementsByTagName("td");
            if (columns.length >= 3) {
                if (!columns[2].innerHTML.includes("Completed")) {
                    beep(1000, 100, 100);
                }
            }
        }
        console.log("Looking for incomplete polls...");
    }
    
    setTimeout(function() { PollNotifier(); }, 1000);
}

PollNotifier();
