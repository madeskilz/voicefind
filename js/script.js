if (!('webkitSpeechRecognition' in window)) {
    upgrade();
} else {
    var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
    var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList;
    var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent;
    var codeWords = [
      'find my device',
      'locate my device',
      'where is my device',
      'find my phone',
      'locate my phone',
      'where is my phone',
      'I lost my phone',
      'I lost my device',
      'where\'s my phone',
      'where\'s my device'
    ]
    var btnStpSrn = document.getElementById('stopSiren');
    var siren = document.getElementById('siren');
    var body = document.getElementsByClassName('bgbody')[0];
    var diagnosticPara = document.querySelector('.output');




    (function locate() {
        var grammar = '#JSGF V1.0; grammar codeWord; public <codeWord> = ' + codeWords.join(' | ') + ' ;'

        var recognition = new SpeechRecognition();
        var speechRecognitionList = new SpeechGrammarList();
        speechRecognitionList.addFromString(grammar, 1);
        recognition.grammars = speechRecognitionList;
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;


        recognition.start();
        console.log('mainStart')

        recognition.onresult = function (event) {
            // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
            // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
            // It has a getter so it can be accessed like an array
            // The first [0] returns the SpeechRecognitionResult at position 0.
            // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
            // These also have getters so they can be accessed like arrays.
            // The second [0] returns the SpeechRecognitionAlternative at position 0.
            // We then return the transcript property of the SpeechRecognitionAlternative object 
            var speechResult = event.results[0][0].transcript;
            diagnosticPara.textContent = 'Speech received: ' + speechResult + '.';
            for (i = 0; i < codeWords.length; i++) {
                if (speechResult == codeWords[i]) {
                    siren.play();
                    btnStpSrn.style.display = 'block';
                    diagnosticPara.textContent = 'Device Found!!!';
                    body.style.background = 'red';
                }
            }
            console.log('Confidence: ' + event.results[0][0].confidence);
        }

        recognition.onspeechend = function () {
            recognition.stop();
        }

        recognition.onnomatch = function (event) {
            diagnosticPara.textContent = 'No match. Try "find my device"';
            window.location.reload();
        }

        recognition.onerror = function (event) {
            diagnosticPara.textContent = 'Error occurred in finding your device: ' + event.error;
        (event.error != 'network')?window.location.reload():'';
        }

        recognition.onend = function () {
            recognition.start();
        }

    })();
    var stopPB = function () {
        window.location.reload();
    }
    function upgrade() {
        document.getElementsByClassName('bgbody')[0].style.background = 'red';
        document.querySelector('.output').textContent = 'Your Device does not support Voice Find.';
    }
}