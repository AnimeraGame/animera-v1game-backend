const english = require("../translation/english");
const french = require("../translation/french");
const vietnamese = require("../translation/vietnamese");
const german = require("../translation/german");
const turkish = require("../translation/turkish");
const arabic = require("../translation/arabic");
const portuguese = require("../translation/portuguese");
const italian = require("../translation/italian");
const russian = require("../translation/russian");
const serbian = require("../translation/serbian");
const japanese = require("../translation/japanese");
const chinese = require("../translation/chinese");
const indonesian = require("../translation/indonesian");
const bosnian = require("../translation/bosnian");
const norwegian = require("../translation/norwegian");
const swedish = require("../translation/swedish");
const dutch = require("../translation/dutch");
const hindi = require("../translation/hindi");
const thai = require("../translation/thai");
const hebreow = require("../translation/hebreow");
const korean = require("../translation/korean");
const greek = require("../translation/greek");
const polish = require("../translation/polish");
const ukrainian = require("../translation/ukrainian");
const finnish = require("../translation/finnish");
const hungarian = require("../translation/hungarian");
const englishUk = require("../translation/englishUk");
const spanish = require("../translation/spanish");
const spanishLatinAmerica = require("../translation/spanishLatinAmerica");
const tagalogPhilippines = require("../translation/tagalogPhilippines");

// const LANGUAGES = {
//     ENGLISH: 'en',
//     FRENCH: 'fr',
//     VIETNAMESE: 'vi',
//     GERMAN: 'de',
//     TURKISH: 'tr',
//     ARABIC: 'ar',
//     PORTUGUESE: 'pt',
//     ITALIAN: 'it',
//     RUSSIAN: 'ru',
//     SERBIAN: 'sr',
//     JAPANESE: 'ja',
//     CHINESE: 'zh-Hans',
//     INDONESIAN: 'in',
//     BOSNIAN: 'bs',
//     NORWEGIAN: 'nb-NO',
//     SWEDISH: 'sv',
//     DUTCH: 'nl',
//     HINDI: 'hi',
//     THAI: 'th',
//     HEBREOW: 'iw',
//     KOREAN: 'ko',
//     GREEK: 'el',
//     POLISH: 'pl',
//     UKARINIAN: 'uk',
//     FINNISH: 'fi',
//     HUNGARIAN: 'hu',
//     TAGALOG_PHILIPPINES: 'fil-PH'
// };

const LANGUAGES = {
    ENGLISH: 'en',
    FRENCH: 'fr',
    VIETNAMESE: 'vi',
    GERMAN: 'de',
    TURKISH: 'tr',
    ARABIC: 'ar',
    PORTUGUESE: 'pt',
    ITALIAN: 'it',
    RUSSIAN: 'ru',
    SERBIAN: 'sr',
    JAPANESE: 'ja',
    CHINESE: 'zh',
    INDONESIAN: 'id',
    BOSNIAN: 'bs',
    NORWEGIAN: 'nb-NO',
    SWEDISH: 'sv',
    DUTCH: 'nl',
    HINDI: 'hi',
    THAI: 'th',
    HEBREOW: 'he',
    KOREAN: 'ko',
    GREEK: 'el',
    POLISH: 'pl',
    UKARINIAN: 'uk',
    FINNISH: 'fi',
    HUNGARIAN: 'hu',
    ENGLISH_UK: 'en-GB',
    SPANISH: 'es',
    SPANISH_LATIN_AMERICA: 'es-419',
    TAGALOG_PHILIPPINES: 'fil-PH',
};

exports.getResponseMessage = getResponseMessage;

function getResponseMessage(code, language) {
    switch (language) {
        case LANGUAGES.ENGLISH:
            return english.responseMessages[code];
        case LANGUAGES.FRENCH:
            return french.responseMessages[code];
        case LANGUAGES.VIETNAMESE:
            return vietnamese.responseMessages[code];
        case LANGUAGES.GERMAN:
            return german.responseMessages[code];
        case LANGUAGES.TURKISH:
            return turkish.responseMessages[code];
        case LANGUAGES.ARABIC:
            return arabic.responseMessages[code];
        case LANGUAGES.PORTUGUESE:
            return portuguese.responseMessages[code];
        case LANGUAGES.ITALIAN:
            return italian.responseMessages[code];
        case LANGUAGES.RUSSIAN:
            return russian.responseMessages[code];
        case LANGUAGES.SERBIAN:
            return serbian.responseMessages[code];
        case LANGUAGES.JAPANESE:
            return japanese.responseMessages[code];
        case LANGUAGES.CHINESE:
            return chinese.responseMessages[code];
        case LANGUAGES.INDONESIAN:
            return indonesian.responseMessages[code];
        case LANGUAGES.BOSNIAN:
            return bosnian.responseMessages[code];
        case LANGUAGES.NORWEGIAN:
            return norwegian.responseMessages[code];
        case LANGUAGES.SWEDISH:
            return swedish.responseMessages[code];
        case LANGUAGES.DUTCH:
            return dutch.responseMessages[code];
        case LANGUAGES.HINDI:
            return hindi.responseMessages[code];
        case LANGUAGES.THAI:
            return thai.responseMessages[code];
        case LANGUAGES.HEBREOW:
            return hebreow.responseMessages[code];
        case LANGUAGES.KOREAN:
            return korean.responseMessages[code];
        case LANGUAGES.GREEK:
            return greek.responseMessages[code];
        case LANGUAGES.POLISH:
            return polish.responseMessages[code];
        case LANGUAGES.UKARINIAN:
            return ukrainian.responseMessages[code];
        case LANGUAGES.FINNISH:
            return finnish.responseMessages[code];
        case LANGUAGES.HUNGARIAN:
            return hungarian.responseMessages[code];
        case LANGUAGES.ENGLISH_UK:
            return englishUk.responseMessages[code];
        case LANGUAGES.SPANISH:
            return spanish.responseMessages[code];
        case LANGUAGES.SPANISH_LATIN_AMERICA:
            return spanishLatinAmerica.responseMessages[code];
        case LANGUAGES.TAGALOG_PHILIPPINES:
            return tagalogPhilippines.responseMessages[code];


        default :
            return english.responseMessages[code];
    }
}