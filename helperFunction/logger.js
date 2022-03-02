const chalk = require('chalk');

let logger = {};
let colorCodes = {
    "FgBlack": "\x1b[30m\x1b[1m%s\x1b[0m",
    "FgRed": "\x1b[31m\x1b[1m%s\x1b[0m",
    "FgGreen": "\x1b[32m\x1b[1m%s\x1b[0m",
    "FgYellow": "\x1b[33m\x1b[1m%s\x1b[0m",
    "FgBlue": "\x1b[34m\x1b[1m%s\x1b[0m",
    "FgMagenta": "\x1b[35m\x1b[1m%s\x1b[0m",
    "FgCyan": "\x1b[36m\x1b[1m%s\x1b[0m",
    "FgWhite": "\x1b[37m\x1b[1m%s\x1b[0m"
};
logger.error = (error, header, text) => {
    try {
        if (!text) {
            text = header;
            header = "ERROR";
        }
        if (text) {
            console.error(chalk.red.inverse(header), text);
            console.log();
        }
        if(error.stack){
            console.log(error.stack);
        }
        console.log();
    } catch (error) {
        console.error(colorCodes.FgRed, header, text);
    }
};

logger.log = (header, text) => {
    try {
        if (!text) {
            text = header;
            header = "LOG";
        }

        console.log(chalk.green.inverse(header), JSON.stringify(text, null, 4).replace(/"/g, ""));
        console.log();
    } catch (error) {
        console.log(colorCodes.FgGreen, header, text);
    }
};

logger.query = (header, text) => {
    try {
        if (!text) {
            text = header;
            header = "QUERY";
        }

        console.log(colorCodes.FgMagenta, header, JSON.stringify(text, null, 4).replace(/"/g, ""));
        console.log();
    } catch (error) {
        console.log(colorCodes.FgMagenta, header, text);
    }
};

logger.data = (header, text) => {
    try {
        if (!text) {
            text = header;
            header = "DATA";
        }

        if (text) {
            console.log('\n');
            let response = JSON.stringify({text}).replace(/\\/g, "");
            console.log(colorCodes.FgCyan, header, response);
            console.log('\n');
        }
        console.log();
    } catch (error) {
        console.log(colorCodes.FgCyan, header, text);
    }
};

logger.response = (header, text) => {
    try {
        if (!text) {
            text = header;
            header = "RESPONSE";
        }

        if (text) {
            let response = JSON.stringify(text, null, 4).replace(/\\/g, "");
            console.log(colorCodes.FgBlue, header, response.substring(1, response.length - 1));
        }
        console.log();
    } catch (error) {
        console.log(colorCodes.FgBlue, header, text);
    }
};

logger.request = (header, text) => {
    try {
        if (!text) {
            text = header;
            header = "REQUEST";
        }

        if (text) {
            let response = JSON.stringify(text).replace(/\\/g, "")
            console.log(colorCodes.FgBlue, header, response);
        }
        console.log();
    } catch (error) {
        console.log(colorCodes.FgBlue, header, text);
    }
};

logger.debug = (header, text) => {
    try {
        if (app.get('env') == 'production') {
            return;
        }

        if (!text) {
            text = header;
            header = "DEBUG";
        }

        console.log(colorCodes.FgMagenta, header, JSON.stringify(text, null, 4));
        console.log();
    } catch (error) {
        console.log(colorCodes.FgMagenta, header, text);
    }
};

logger.info = (header, text) => {
    try {

        if (!text) {
            text = header;
            header = "INFO";
        }
        console.log(chalk.green.inverse(header), JSON.stringify(text, null, 4));
        console.log();
    } catch (error) {
        console.log(colorCodes.FgMagenta, header, text);
    }
};

module.exports = logger;