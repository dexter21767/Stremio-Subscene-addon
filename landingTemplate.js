const STYLESHEET = `
* {
   box-sizing: border-box;
}

body,
html {
   margin: 0;
   padding: 0;
   width: 100%;
   height: 100%
}

html {
	background: fixed;
	background-size: auto 100%;
	background-size: cover;
	background-position: center center;
	background-repeat: repeat-y;
}

body {
   display: flex;
   background-color: transparent;
   font-family: 'Open Sans', Arial, sans-serif;
   color: white;
}

h1 {
   font-size: 4.5vh;
   font-weight: 700;
}

h2 {
   font-size: 2.2vh;
   font-weight: normal;
   font-style: italic;
   opacity: 0.8;
}

h3 {
   font-size: 2.2vh;
}

h1,
h2,
h3,
p,
label {
   margin: 0;
   text-shadow: 0 0 1vh rgba(0, 0, 0, 0.15);
}

p {
   font-size: 1.75vh;
}

ul {
   font-size: 1.75vh;
   margin: 0;
   margin-top: 1vh;
   padding-left: 3vh;
}

a {
   color: green
}

a.install-link {
   text-decoration: none
}

button {
   border: 0;
   outline: 0;
   color: white;
   background: #8A5AAB;
   padding: 1.2vh 3.5vh;
   margin: auto;
   text-align: center;
   font-family: 'Open Sans', Arial, sans-serif;
   font-size: 2.2vh;
   font-weight: 600;
   cursor: pointer;
   display: block;
   box-shadow: 0 0.5vh 1vh rgba(0, 0, 0, 0.2);
   transition: box-shadow 0.1s ease-in-out;
}

button:hover {
   box-shadow: none;
}

button:active {
   box-shadow: 0 0 0 0.5vh white inset;
}

#addon {
   width: 90vh;
   margin: auto;
   padding-left: 10%;
   padding-right: 10%;
   background: rgba(0, 0, 0, 0.60);
}

.logo {
   height: 14vh;
   width: 14vh;
   margin: auto;
   margin-bottom: 3vh;
}

.logo img {
   width: 100%;
}

.name, .version {
   display: inline-block;
   vertical-align: top;
}

.name {
   line-height: 5vh;
}

.version {
   position: absolute;
   line-height: 5vh;
   margin-left: 1vh;
   opacity: 0.8;
}

.contact {
   left: 0;
   bottom: 4vh;
   width: 100%;
   margin-top: 1vh;
   text-align: center;
}

.contact a {
   font-size: 1.4vh;
   font-style: italic;
}

.separator {
   margin-bottom: 4vh;
}

.label {
  font-size: 2.2vh;
  font-weight: 600;
  padding: 0;
  line-height: inherit;
}

.btn-group, .multiselect-container {
  width: 100%;
}

.btn {
  text-align: left;
}

.multiselect-container {
  border: 0;
  border-radius: 0;
}

.input, .btn {
  height: 3.8vh;
  width: 100%;
  margin: auto;
  margin-bottom: 10px;
  padding: 6px 12px;
  border: 0;
  border-radius: 0;
  outline: 0;
  color: #333;
  background-color: rgb(255, 255, 255);
  box-shadow: 0 0.5vh 1vh rgba(0, 0, 0, 0.2);
}

button.multiselect.dropdown-toggle.btn.btn-default {
   height: auto;
}

`;
function landingTemplate() {

   const popular_langs = {
      arabic: 'Arabic',
      bengali: 'Bengali',
      'brazillian-portuguese': 'Brazillian Portuguese',
      'chinese-bg-code': 'Chinese BG code',
      czech: 'Czech',
      danish: 'Danish',
      dutch: 'Dutch',
      english: 'English',
      farsi_persian: 'Farsi/Persian',
      finnish: 'Finnish',
      french: 'French',
      german: 'German',
      greek: 'Greek',
      hebrew: 'Hebrew',
      indonesian: 'Indonesian',
      italian: 'Italian',
      korean: 'Korean',
      malay: 'Malay',
      norwegian: 'Norwegian',
      polish: 'Polish',
      portuguese: 'Portuguese',
      romanian: 'Romanian',
      spanish: 'Spanish',
      swedish: 'Swedish',
      thai: 'Thai',
      turkish: 'Turkish',
      vietnamese: 'Vietnamese'
    }
       const other_langs = {
         albanian: 'Albanian',
         armenian: 'Armenian',
         azerbaijani: 'Azerbaijani',
         basque: 'Basque',
         belarusian: 'Belarusian',
         big_5_code: 'Big 5 code',
         bosnian: 'Bosnian',
         bulgarian: 'Bulgarian',
         'bulgarian-english': 'Bulgarian/ English',
         burmese: 'Burmese',
         'cambodian/khmer': 'Cambodian/Khmer',
         catalan: 'Catalan',
         croatian: 'Croatian',
         'dutch-english': 'Dutch/ English',
         'english-german': 'English/ German',
         esperanto: 'Esperanto',
         estonian: 'Estonian',
         georgian: 'Georgian',
         greenlandic: 'Greenlandic',
         hindi: 'Hindi',
         hungarian: 'Hungarian',
         'hungarian-english': 'Hungarian/ English',
         icelandic: 'Icelandic',
         japanese: 'Japanese',
         kannada: 'Kannada',
         kinyarwanda: 'Kinyarwanda',
         kurdish: 'Kurdish',
         latvian: 'Latvian',
         lithuanian: 'Lithuanian',
         macedonian: 'Macedonian',
         malayalam: 'Malayalam',
         manipuri: 'Manipuri',
         mongolian: 'Mongolian',
         nepali: 'Nepali',
         pashto: 'Pashto',
         punjabi: 'Punjabi',
         russian: 'Russian',
         serbian: 'Serbian',
         sinhala: 'Sinhala',
         slovak: 'Slovak',
         slovenian: 'Slovenian',
         somali: 'Somali',
         sundanese: 'Sundanese',
         swahili: 'Swahili',
         tagalog: 'Tagalog',
         tamil: 'Tamil',
         telugu: 'Telugu',
         ukrainian: 'Ukrainian',
         urdu: 'Urdu',
         yoruba: 'Yoruba'
       };
          const manifest = require("./manifest.json");

   const popularHTML =Object.keys(popular_langs).map(lang=>`<option value="${lang}">${popular_langs[lang]}</option>`).join('\n');
   const otherHTML =Object.keys(other_langs).map(lang=>`<option value="${lang}">${other_langs[lang]}</option>`).join('\n');
   
   const stylizedTypes = manifest.types
      .map(t => t[0].toUpperCase() + t.slice(1) + (t !== 'series' ? 's' : ''));

   return `
   <!DOCTYPE html>
   <html style="background-image: url(${manifest.background});">

   <head>
      <meta charset="utf-8">
      <title>${manifest.name} - Stremio Addon</title>
      <link rel="shortcut icon" href="${manifest.logo}" type="image/x-icon">
      <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700&display=swap" rel="stylesheet">
      <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js"></script>
      <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
      <link href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" >
      <script src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-multiselect/0.9.15/js/bootstrap-multiselect.min.js"></script>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap-multiselect/0.9.15/css/bootstrap-multiselect.css" rel="stylesheet"/>
      <style>${STYLESHEET}</style>
   </head>

	<body>
      <div id="addon">
         <div class="logo">
            <img src="${manifest.logo}">
         </div>
         <h1 class="name">${manifest.name}</h1>
         <h2 class="version">${manifest.version || '0.0.0'}</h2>
         <h2 class="description">${manifest.description || ''}</h2>

         <div class="separator"></div>
        
		<h3 class="gives">This addon has more :</h3>
         <ul>
            ${stylizedTypes.map(t => `<li>${t}</li>`).join('')}
         </ul>
		 
		 <div class="separator"></div>
		 
		  <h1>Langauges:</h1>
        <div class="separator"></div>
       <label class="label" for="popular">Popular languages:</label>
       <select id="popular" class="input" name="langs[]" multiple="multiple">
       ${popularHTML}
      </select>
           
         <div class="separator"></div>
         <label class="label" for="other">Other languages:</label>
         <select id="other" class="input" name="langs[]" multiple="multiple">
         ${otherHTML}
        </select>
             
           <div class="separator"></div>
        
         <a id="installLink" class="install-link" href="#">
            <button name="Install">INSTALL</button>
         </a>
         <div class="contact">
           <p>Or paste into Stremio search bar after clicking install</p>
        </div>
        
        <div class="separator"></div>
		<h3 class="contact">
		    To contact add-on creator:
		    <a href="mailto:${manifest.contactEmail}">${manifest.contactEmail}</a>
		</h3>
		<div class="separator"></div>
      </div>
	    <script type="text/javascript">
				$(document).ready(function() {
               $('#popular').multiselect({ 
                  nonSelectedText: 'No language selected',
                  onChange: () => generateInstallLink()
              });
              $('#other').multiselect({ 
               nonSelectedText: 'No language selected',
               onChange: () => generateInstallLink()
           });
			  generateInstallLink();
			  });
			  
			  function generateInstallLink() {
				var data = {};
            var langs =  ($('#popular').val()).concat($('#other').val()).join(',') || '';
           
            data['langs'] = langs;
				
				configurationValue = Object.keys(data).map(key => key + '=' + data[key]).join('|');
			console.log(configurationValue);
			const configuration = configurationValue && configurationValue.length ? '/' + configurationValue : '';
			const location = window.location.host + configuration + '/manifest.json'
              navigator.clipboard.writeText('https://' + location);
              installLink.href = 'stremio://' + location;
				}
      </script>
			  
		  
          
      </script>
	  
	</body>

	</html>`
}

module.exports = landingTemplate;